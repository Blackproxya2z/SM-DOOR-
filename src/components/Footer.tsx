'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/types';
import { firestore } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '@/context/LanguageContext';
import { 
  TreePine, 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  Lock, 
  CreditCard,
  UserCheck
} from 'lucide-react';

interface FooterProps {
  settings?: SiteSettings;
}

export function Footer({ settings: initialSettings }: FooterProps) {
  const { language, t } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings | undefined>(initialSettings);

  React.useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    } else {
      // Only fetch if initialSettings was not passed from SSR
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings) {
            setSettings(data.settings);
          }
        })
        .catch(() => {});
    }

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setSettings(e.detail);
      }
    };
    window.addEventListener('sm_settings_updated', handleUpdate);

    return () => {
      window.removeEventListener('sm_settings_updated', handleUpdate);
    };
  }, [initialSettings]);

  const businessName = language === 'bn'
    ? (settings?.siteNameBn || t.brand.name)
    : (settings?.siteNameEn || t.brand.name);

  const proprietorName = language === 'bn'
    ? (settings?.proprietorBn || t.brand.proprietor)
    : (settings?.proprietorEn || t.brand.proprietor);

  const address = language === 'bn' 
    ? (settings?.addressBn || t.brand.address) 
    : (settings?.addressEn || t.brand.address);

  const phone1 = settings?.phone1 || t.brand.phone;
  const phone2 = settings?.phone2 || t.brand.phoneSecondary;
  const whatsappNumber = settings?.whatsappNumber || t.brand.whatsapp;
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer id="contact" className="bg-[#FAF8F5] text-[#2B1A12] border-t border-[#E8DED4] pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-[#2B1A12] p-0.5 shadow-md flex items-center justify-center">
                <TreePine className="w-6 h-6 text-[#C59B27]" />
              </div>
              <div className="flex flex-col">
                <span className="font-[family-name:var(--font-tiro-bangla)] text-xl font-bold tracking-tight text-[#2B1A12] group-hover:text-[#C59B27] transition-colors">
                  {businessName}
                </span>
                <span className="text-xs text-[#C59B27] font-semibold tracking-wide font-[family-name:var(--font-hind-siliguri)]">
                  {language === 'bn' ? `প্রোপাইটর: ${proprietorName}` : `Proprietor: ${proprietorName}`}
                </span>
                <span className="text-xs text-[#7A6A5F] tracking-wide mt-0.5 font-[family-name:var(--font-hind-siliguri)]">
                  {language === 'bn' ? (settings?.taglineBn || t.brand.tagline) : (settings?.taglineEn || t.brand.tagline)}
                </span>
              </div>
            </Link>

            <p className="font-[family-name:var(--font-hind-siliguri)] text-xs sm:text-sm text-[#7A6A5F] leading-relaxed mb-6">
              {t.footer.aboutText}
            </p>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold shadow-md transition-all font-[family-name:var(--font-hind-siliguri)]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে যোগাযোগ' : 'WhatsApp Contact'}</span>
              </a>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F4ECE1] text-[#2B1A12] border border-[#E8DED4] text-xs font-semibold shadow-sm transition-colors font-[family-name:var(--font-hind-siliguri)]"
              >
                <Lock className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>{t.nav.admin}</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-[family-name:var(--font-tiro-bangla)] text-sm font-bold uppercase tracking-wider text-[#2B1A12] mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-[family-name:var(--font-hind-siliguri)]">
              <li>
                <Link href="/doors" className="text-[#7A6A5F] hover:text-[#C59B27] transition-colors">
                  {language === 'bn' ? 'ডিজাইন ক্যাটালগ' : 'Design Catalog'}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-[#7A6A5F] hover:text-[#C59B27] transition-colors">
                  {language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="text-[#C59B27] hover:underline font-semibold transition-colors">
                  {language === 'bn' ? 'কাস্টম ডিজাইন অর্ডার' : 'Custom Design Order'}
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-[#7A6A5F] hover:text-[#C59B27] transition-colors">
                  {language === 'bn' ? 'সিএফটি ক্যালকুলেটর' : 'CFT Calculator'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#7A6A5F] hover:text-[#C59B27] transition-colors">
                  {language === 'bn' ? 'আমাদের পরিচিতি' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href="/factory" className="text-[#7A6A5F] hover:text-[#C59B27] transition-colors">
                  {language === 'bn' ? 'স’মিল ও কারখানা ট্যুর' : 'Sawmill & Factory Tour'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#7A6A5F] hover:text-[#C59B27] transition-colors">
                  {language === 'bn' ? 'যোগাযোগ' : 'Contact'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Addresses */}
          <div className="lg:col-span-4">
            <h4 className="font-[family-name:var(--font-tiro-bangla)] text-sm font-bold uppercase tracking-wider text-[#2B1A12] mb-4">
              {t.footer.contactInfo}
            </h4>
            <div className="space-y-3.5 text-xs sm:text-sm text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)]">
              <div className="flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-[#C59B27] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2B1A12] block">
                    {language === 'bn' ? 'প্রোপাইটর:' : 'Proprietor:'}
                  </strong>
                  <span>{proprietorName}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C59B27] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2B1A12] block">
                    {language === 'bn' ? 'ঠিকানা:' : 'Address:'}
                  </strong>
                  <span>{address}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C59B27] flex-shrink-0" />
                <div>
                  <a href={`tel:${phone1}`} className="text-[#2B1A12] hover:text-[#C59B27] transition-colors font-mono">{phone1}</a>
                  {phone2 && (
                    <>
                      <span className="mx-1">/</span>
                      <a href={`tel:${phone2}`} className="text-[#2B1A12] hover:text-[#C59B27] transition-colors font-mono">{phone2}</a>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C59B27] flex-shrink-0" />
                <span>
                  {language === 'bn' ? 'শনিবার - বৃহস্পতিবার: সকাল ৮:০০ - রাত ৯:০০ (শুক্রবার খোলা)' : 'Saturday - Thursday: 8:00 AM - 9:00 PM (Friday Open)'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="lg:col-span-2">
            <h4 className="font-[family-name:var(--font-tiro-bangla)] text-sm font-bold uppercase tracking-wider text-[#2B1A12] mb-4">
              {language === 'bn' ? 'পেমেন্ট সুবিধা' : 'Payment Methods'}
            </h4>
            <div className="space-y-2.5 text-xs text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)]">
              {settings?.nagadNumber && (
                <div className="p-3 rounded-xl bg-white border border-[#E8DED4] shadow-sm">
                  <div className="flex items-center gap-1.5 font-bold text-orange-600 text-xs mb-1">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Nagad (নগদ)</span>
                  </div>
                  <span className="font-mono text-xs text-[#2B1A12] font-semibold">
                    {settings.nagadNumber}
                  </span>
                </div>
              )}
              <div className="p-3 rounded-xl bg-white border border-[#E8DED4] shadow-sm">
                <div className="flex items-center gap-1.5 font-bold text-emerald-600 text-xs mb-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ক্যাশ / শোরুম পেমেন্ট' : 'Cash / Showroom'}</span>
                </div>
                <span className="text-xs text-[#7A6A5F]">
                  {language === 'bn' ? 'সরাসরি বা ডেলিভারিতে ক্যাশ' : 'Cash on delivery available'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal links */}
        <div className="pt-8 border-t border-[#E8DED4] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <p>© {new Date().getFullYear()} {t.footer.rights}</p>
            <div className="flex items-center gap-4 text-xs text-[#7A6A5F]">
              <Link href="/privacy-policy" className="hover:text-[#C59B27] transition-colors">
                {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-[#C59B27] transition-colors">
                {language === 'bn' ? 'শর্তাবলী' : 'Terms & Conditions'}
              </Link>
              <span>•</span>
              <Link href="/admin" className="hover:text-[#C59B27] transition-colors">
                {language === 'bn' ? 'অ্যাডমিন' : 'Admin'}
              </Link>
            </div>
          </div>

          <div className="text-xs text-[#7A6A5F]">
            <span>{language === 'bn' ? 'বাদে নাভারন, ঝিকরগাছা, যশোর, বাংলাদেশ' : 'Bade Nabaran, Jhikargachha, Jashore, Bangladesh'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
