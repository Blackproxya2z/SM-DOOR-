'use client';

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FloatingActionsProps {
  whatsappNumber?: string;
  phone?: string;
}

export function FloatingActions({ 
  whatsappNumber = "+8801710820987", 
  phone = "+8801710820987" 
}: FloatingActionsProps) {
  const { language } = useLanguage();
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  const waText = language === 'bn'
    ? 'আসসালামু আলাইকুম, মেসার্স ফারহান এন্টারপ্রাইজ থেকে কাঠ, দরজা বা ফার্নিচার সম্পর্কে জানতে চাই।'
    : 'Hello, I want to inquire with M/S Farhan Enterprise directly.';

  return (
    <div className="hidden md:flex fixed md:right-6 md:bottom-6 z-40 flex-col gap-3">
      {/* Call Button */}
      <a
        href={`tel:${phone}`}
        className="w-12 h-12 rounded-full bg-wood-900 border border-wood-700 text-gold-400 hover:text-white hover:bg-wood-850 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
        aria-label="Direct Phone Call"
      >
        <Phone className="w-5 h-5" />
        <span className="absolute right-14 bg-wood-950 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-wood-800">
          {phone}
        </span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(waText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-pulse-subtle group relative"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-14 bg-emerald-950 text-emerald-200 text-[11px] font-bold py-1 px-2.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-emerald-800">
          {language === 'bn' ? 'সরাসরি হোয়াটসঅ্যাপে কথা বলুন' : 'Chat on WhatsApp'}
        </span>
      </a>
    </div>
  );
}
