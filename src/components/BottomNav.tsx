'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useQuote } from '@/context/QuoteContext';
import { Home, Compass, Calculator, Upload, ClipboardList, MessageCircle } from 'lucide-react';

interface BottomNavProps {
  whatsappNumber?: string;
}

export function BottomNav({ whatsappNumber: initialWhatsapp = "+8801710820987" }: BottomNavProps) {
  const pathname = usePathname();
  const { language, t, toLocalDigits } = useLanguage();
  const { itemCount } = useQuote();
  const [waNum, setWaNum] = useState(initialWhatsapp);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sm_door_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.whatsappNumber) setWaNum(parsed.whatsappNumber);
      }
    } catch {}

    const handleUpdate = (e: any) => {
      if (e.detail && e.detail.whatsappNumber) {
        setWaNum(e.detail.whatsappNumber);
      }
    };
    window.addEventListener('sm_settings_updated', handleUpdate);
    return () => window.removeEventListener('sm_settings_updated', handleUpdate);
  }, []);

  const cleanPhone = waNum.replace(/[^0-9]/g, '');

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E8DED4] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(43,26,18,0.08)] font-[family-name:var(--font-hind-siliguri)]">
      <div className="grid grid-cols-5 items-center justify-around">
        {/* Home */}
        <Link 
          href="/"
          className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
            pathname === '/' ? 'text-[#C59B27] font-bold' : 'text-[#7A6A5F] hover:text-[#2B1A12]'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.bottomNav.home}</span>
          {pathname === '/' && <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27] mt-0.5" />}
        </Link>

        {/* Doors Catalog */}
        <Link 
          href="/doors"
          className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
            pathname.startsWith('/doors') ? 'text-[#C59B27] font-bold' : 'text-[#7A6A5F] hover:text-[#2B1A12]'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{language === 'bn' ? 'ক্যাটালগ' : 'Catalog'}</span>
          {pathname.startsWith('/doors') && <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27] mt-0.5" />}
        </Link>

        {/* CFT Calculator (Center Action) */}
        <Link 
          href="/calculator"
          className="flex flex-col items-center justify-center -mt-5 group active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#2B1A12] to-[#452b1e] p-0.5 shadow-lg flex items-center justify-center">
            <div className={`w-full h-full rounded-full flex items-center justify-center transition-colors ${
              pathname.startsWith('/calculator') ? 'bg-[#C59B27]' : 'bg-[#2B1A12]'
            }`}>
              <Calculator className={`w-5 h-5 ${
                pathname.startsWith('/calculator') ? 'text-white' : 'text-[#C59B27]'
              }`} />
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#2B1A12] mt-0.5 leading-tight">{t.bottomNav.calculator}</span>
        </Link>

        {/* Custom Order / Quote */}
        <Link 
          href="/custom-order"
          className={`relative flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
            pathname === '/custom-order' ? 'text-[#C59B27] font-bold' : 'text-[#7A6A5F] hover:text-[#2B1A12]'
          }`}
        >
          <Upload className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{language === 'bn' ? 'কাস্টম অর্ডার' : 'Custom'}</span>
          {pathname === '/custom-order' && <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27] mt-0.5" />}
        </Link>

        {/* WhatsApp Direct */}
        <a 
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            language === 'bn' 
              ? 'আসসালামু আলাইকুম, মেসার্স ফারহান এন্টারপ্রাইজ থেকে কাঠ, দরজা বা ফার্নিচার সম্পর্কে জানতে চাই।' 
              : 'Hello, I want to inquire with M/S Farhan Enterprise on WhatsApp.'
          )}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 text-[#10B981] hover:text-[#059669] active:scale-95 transition-all"
        >
          <MessageCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.bottomNav.whatsapp}</span>
        </a>
      </div>
    </div>
  );
}
