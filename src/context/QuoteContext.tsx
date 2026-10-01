'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { QuoteItem, Language } from '@/types';
import { formatBDT, toBanglaDigits } from '@/lib/calculator';

interface QuoteContextType {
  items: QuoteItem[];
  addItem: (item: Omit<QuoteItem, 'id' | 'createdAt'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearQuote: () => void;
  itemCount: number;
  totalEstimatedCost: number;
  generateWhatsAppUrl: (lang: Language, whatsappNumber: string) => string;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'sm_door_quote_items_v1';

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // localStorage unavailable or restricted
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
      } catch {}
    }
  }, [items, mounted]);

  const addItem = (newItem: Omit<QuoteItem, 'id' | 'createdAt'>) => {
    const id = `quote-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullItem: QuoteItem = {
      ...newItem,
      id,
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [fullItem, ...prev]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const clearQuote = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const totalEstimatedCost = items.reduce((sum, item) => {
    if (item.price && item.price > 0) {
      return sum + item.price * (item.quantity || 1);
    }
    return sum;
  }, 0);

  const generateWhatsAppUrl = (lang: Language, whatsappNumber: string) => {
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
    let text = '';

    if (lang === 'bn') {
      text += `আসসালামু আলাইকুম এস এম ডোর,\nআমি ওয়েবসাইট থেকে নিম্নলিখিত পণ্যগুলোর কোটেশন ও অর্ডার সম্পর্কে জানতে চাই:\n\n`;
      items.forEach((item, idx) => {
        text += `${toBanglaDigits(idx + 1)}. ${item.titleBn}\n`;
        if (item.woodSpeciesBn) text += `   কাঠ: ${item.woodSpeciesBn}\n`;
        if (item.measurementsBn) text += `   সাইজ/মাপ: ${item.measurementsBn}\n`;
        text += `   পরিমাণ: ${toBanglaDigits(item.quantity)} পিস\n`;
        if (item.price && item.price > 0) {
          text += `   আনুমানিক দর: ${formatBDT(item.price * item.quantity, 'bn')}\n`;
        }
        text += `\n`;
      });
      if (totalEstimatedCost > 0) {
        text += `মোট সম্ভাব্য দর: ${formatBDT(totalEstimatedCost, 'bn')}\n\n`;
      }
      text += `দয়া করে প্রাপ্যতা ও নিশ্চিত দর জানাবেন। ধন্যবাদ।`;
    } else {
      text += `Hello SM Door,\nI would like to inquire about the following items for a quotation & order:\n\n`;
      items.forEach((item, idx) => {
        text += `${idx + 1}. ${item.titleEn}\n`;
        if (item.woodSpeciesEn) text += `   Wood: ${item.woodSpeciesEn}\n`;
        if (item.measurementsEn) text += `   Measurements: ${item.measurementsEn}\n`;
        text += `   Quantity: ${item.quantity} pcs\n`;
        if (item.price && item.price > 0) {
          text += `   Est. Cost: ${formatBDT(item.price * item.quantity, 'en')}\n`;
        }
        text += `\n`;
      });
      if (totalEstimatedCost > 0) {
        text += `Total Estimated Cost: ${formatBDT(totalEstimatedCost, 'en')}\n\n`;
      }
      text += `Please confirm availability and final quotation. Thank you.`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <QuoteContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearQuote,
        itemCount,
        totalEstimatedCost,
        generateWhatsAppUrl,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
}
