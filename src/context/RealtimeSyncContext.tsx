'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { SiteSettings, CalculatorRates, Product } from '@/types';
import { firestore } from '@/lib/firebase';
import { doc, collection, onSnapshot } from 'firebase/firestore';

interface RealtimeSyncContextType {
  settings: SiteSettings | null;
  rates: CalculatorRates | null;
  products: Product[] | null;
  isRealtimeConnected: boolean;
  refreshAll: () => Promise<void>;
}

const RealtimeSyncContext = createContext<RealtimeSyncContextType | undefined>(undefined);

export function RealtimeSyncProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [rates, setRates] = useState<CalculatorRates | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(false);

  // Manual or on-mount fresh fetch fallback
  const refreshAll = useCallback(async () => {
    try {
      const [sRes, rRes, pRes] = await Promise.all([
        fetch('/api/settings', { cache: 'no-store' }).catch(() => null),
        fetch('/api/calculator', { cache: 'no-store' }).catch(() => null),
        fetch('/api/products', { cache: 'no-store' }).catch(() => null),
      ]);

      if (sRes?.ok) {
        const sData = await sRes.json();
        if (sData.success && sData.settings) setSettings(sData.settings);
      }
      if (rRes?.ok) {
        const rData = await rRes.json();
        if (rData.success && rData.rates) setRates(rData.rates);
      }
      if (pRes?.ok) {
        const pData = await pRes.json();
        if (pData.success && pData.products) setProducts(pData.products);
      }
    } catch (err) {
      console.warn('[RealtimeSync] Fetch refresh fallback note:', err);
    }
  }, []);

  useEffect(() => {
    // 1. Initial fresh dynamic fetch
    refreshAll();

    // 2. Multi-Device Real-Time Firestore listeners
    let unsubSettings: (() => void) | null = null;
    let unsubRates: (() => void) | null = null;
    let unsubProducts: (() => void) | null = null;

    try {
      if (firestore) {
        // Site Settings real-time stream
        unsubSettings = onSnapshot(
          doc(firestore, 'sm_settings', 'site'),
          (docSnap) => {
            if (docSnap.exists()) {
              setIsRealtimeConnected(true);
              setSettings(docSnap.data() as SiteSettings);
            }
          },
          () => setIsRealtimeConnected(false)
        );

        // Calculator Rates real-time stream
        unsubRates = onSnapshot(
          doc(firestore, 'sm_calculator_rates', 'rates'),
          (docSnap) => {
            if (docSnap.exists()) {
              setIsRealtimeConnected(true);
              setRates(docSnap.data() as CalculatorRates);
            }
          },
          () => {}
        );

        // Products catalog real-time stream
        unsubProducts = onSnapshot(
          collection(firestore, 'sm_products'),
          (snap) => {
            if (!snap.empty) {
              setIsRealtimeConnected(true);
              const list: Product[] = [];
              snap.forEach(d => list.push(d.data() as Product));
              setProducts(list);
            }
          },
          () => {}
        );
      }
    } catch (e) {
      console.warn('[RealtimeSync] Firestore stream initialization note:', e);
    }

    // 3. Local tab broadcast listeners
    const handleSettingsEvent = (e: any) => {
      if (e.detail) setSettings(e.detail);
    };
    const handleRatesEvent = (e: any) => {
      if (e.detail) setRates(e.detail);
    };

    window.addEventListener('sm_settings_updated', handleSettingsEvent);
    window.addEventListener('sm_rates_updated', handleRatesEvent);

    return () => {
      if (unsubSettings) unsubSettings();
      if (unsubRates) unsubRates();
      if (unsubProducts) unsubProducts();
      window.removeEventListener('sm_settings_updated', handleSettingsEvent);
      window.removeEventListener('sm_rates_updated', handleRatesEvent);
    };
  }, [refreshAll]);

  return (
    <RealtimeSyncContext.Provider
      value={{
        settings,
        rates,
        products,
        isRealtimeConnected,
        refreshAll
      }}
    >
      {children}
    </RealtimeSyncContext.Provider>
  );
}

export function useRealtimeSync() {
  const context = useContext(RealtimeSyncContext);
  if (!context) {
    throw new Error('useRealtimeSync must be used within a RealtimeSyncProvider');
  }
  return context;
}

export function useRealtimeSettings(initialSettings?: SiteSettings): SiteSettings | undefined {
  const context = useContext(RealtimeSyncContext);
  return context?.settings || initialSettings;
}

export function useRealtimeRates(initialRates?: CalculatorRates): CalculatorRates | undefined {
  const context = useContext(RealtimeSyncContext);
  return context?.rates || initialRates;
}

export function useRealtimeProducts(initialProducts?: Product[]): Product[] | undefined {
  const context = useContext(RealtimeSyncContext);
  return context?.products || initialProducts;
}
