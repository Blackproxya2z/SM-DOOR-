'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../lib/translations';
import { formatBDT, toBanglaDigits, formatNumber } from '../lib/calculator';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations['bn'];
  formatPrice: (amount: number) => string;
  formatNum: (val: number, decimals?: number) => string;
  toLocalDigits: (val: number | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('bn');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sm_door_lang');
      if (saved === 'en' || saved === 'bn') {
        setLanguageState(saved);
      }
    } catch {
      // LocalStorage not available or restricted
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('sm_door_lang', lang);
    } catch {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  const t = translations[language] || translations.bn;

  const formatPrice = (amount: number) => formatBDT(amount, language);
  const formatNum = (val: number, decimals = 2) => formatNumber(val, language, decimals);
  const toLocalDigits = (val: number | string) => (language === 'bn' ? toBanglaDigits(val) : String(val));

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        formatPrice,
        formatNum,
        toLocalDigits,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
