'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useQuote } from '@/context/QuoteContext';
import { Home, Compass, Calculator, Upload, ClipboardList, MessageCircle } from 'lucide-react';

interface BottomNavProps {
  whatsappNumber?: string;
}

export function BottomNav({ whatsappNumber = "+8801710820987" }: BottomNavProps) {
  const pathname = usePathname();
  const { language, t, toLocalDigits } = useLanguage();
  const { itemCount } = useQuote();
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-lg border-t border-stone-800/80 px-2 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.5)]">
      <div className="grid grid-cols-5 items-center justify-around">
        {/* Home */}
        <Link 
          href="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            pathname === '/' ? 'text-amber-400 font-semibold' : 'text-stone-300 hover:text-amber-400'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.bottomNav.home}</span>
        </Link>

        {/* Doors Catalog */}
        <Link 
          href="/doors"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            pathname.startsWith('/doors') ? 'text-amber-400 font-semibold' : 'text-stone-300 hover:text-amber-400'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{language === 'bn' ? 'ক্যাটালগ' : 'Catalog'}</span>
        </Link>

        {/* CFT Calculator (Center Action) */}
        <Link 
          href="/calculator"
          className="flex flex-col items-center justify-center -mt-5 group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 p-0.5 shadow-lg flex items-center justify-center group-active:scale-95 transition-transform">
            <div className={`w-full h-full rounded-full flex items-center justify-center transition-colors ${
              pathname.startsWith('/calculator') ? 'bg-amber-500' : 'bg-stone-950'
            }`}>
              <Calculator className={`w-6 h-6 ${
                pathname.startsWith('/calculator') ? 'text-stone-950 font-bold' : 'text-amber-400 group-hover:text-amber-300'
              }`} />
            </div>
          </div>
          <span className="text-[10px] font-semibold text-amber-400 mt-0.5 leading-tight">{t.bottomNav.calculator}</span>
        </Link>

        {/* Custom Order / Quote */}
        <Link 
          href="/custom-order"
          className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
            pathname === '/custom-order' ? 'text-amber-400 font-semibold' : 'text-stone-300 hover:text-amber-400'
          }`}
        >
          <Upload className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{language === 'bn' ? 'কাস্টম অর্ডার' : 'Custom'}</span>
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
          className="flex flex-col items-center justify-center py-1 text-emerald-400 hover:text-emerald-300 active:text-emerald-300 transition-colors"
        >
          <MessageCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.bottomNav.whatsapp}</span>
        </a>
      </div>
    </div>
  );
}
