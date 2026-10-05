'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FloatingActionsProps {
  whatsappNumber?: string;
  phone?: string;
}

export function FloatingActions({ 
  whatsappNumber: initialWhatsapp = "+8801710820987", 
  phone: initialPhone = "+8801710820987" 
}: FloatingActionsProps) {
  const { language } = useLanguage();
  const [waNum, setWaNum] = useState(initialWhatsapp);
  const [phoneNum, setPhoneNum] = useState(initialPhone);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sm_door_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.whatsappNumber) setWaNum(parsed.whatsappNumber);
        if (parsed.phone1) setPhoneNum(parsed.phone1);
      }
    } catch {}

    const handleUpdate = (e: any) => {
      if (e.detail) {
        if (e.detail.whatsappNumber) setWaNum(e.detail.whatsappNumber);
        if (e.detail.phone1) setPhoneNum(e.detail.phone1);
      }
    };
    window.addEventListener('sm_settings_updated', handleUpdate);
    return () => window.removeEventListener('sm_settings_updated', handleUpdate);
  }, []);

  const cleanWhatsApp = waNum.replace(/[^0-9]/g, '');

  const waText = language === 'bn'
    ? 'আসসালামু আলাইকুম, মেসার্স ফারহান এন্টারপ্রাইজ থেকে কাঠ, দরজা বা ফার্নিচার সম্পর্কে জানতে চাই।'
    : 'Hello, I want to inquire with M/S Farhan Enterprise directly.';

  return (
    <div className="hidden md:flex fixed md:right-6 md:bottom-6 z-40 flex-col gap-3 font-[family-name:var(--font-hind-siliguri)]">
      {/* Call Button */}
      <a
        href={`tel:${phoneNum}`}
        className="w-12 h-12 rounded-full bg-[#2B1A12] border border-[#E8DED4] text-[#C59B27] hover:text-white hover:bg-[#C59B27] shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
        aria-label="Direct Phone Call"
      >
        <Phone className="w-5 h-5" />
        <span className="absolute right-14 bg-[#2B1A12] text-white text-xs font-bold py-1.5 px-3 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-[#E8DED4]">
          {phoneNum}
        </span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(waText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#10B981] hover:bg-[#059669] text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-14 bg-[#2B1A12] text-white text-xs font-bold py-1.5 px-3 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-[#E8DED4]">
          {language === 'bn' ? 'সরাসরি হোয়াটসঅ্যাপে কথা বলুন' : 'Chat on WhatsApp'}
        </span>
      </a>
    </div>
  );
}
