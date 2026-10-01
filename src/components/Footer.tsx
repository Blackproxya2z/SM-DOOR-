'use client';

import React from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/types';
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

export function Footer({ settings }: FooterProps) {
  const { language, t } = useLanguage();

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
    <footer id="contact" className="bg-stone-950 text-stone-200 border-t border-stone-800 pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-md">
                <div className="w-full h-full bg-stone-950 rounded-[7px] flex items-center justify-center">
                  <TreePine className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  {businessName}
                </span>
                <span className="text-xs text-amber-400 font-semibold tracking-wide">
                  {language === 'bn' ? `প্রোপাইটর: ${proprietorName}` : `Proprietor: ${proprietorName}`}
                </span>
                <span className="text-[11px] text-stone-400 tracking-wide mt-0.5">
                  {language === 'bn' ? (settings?.taglineBn || t.brand.tagline) : (settings?.taglineEn || t.brand.tagline)}
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6 font-light">
              {t.footer.aboutText}
            </p>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে যোগাযোগ' : 'WhatsApp Contact'}</span>
              </a>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 border border-stone-800 text-xs font-semibold transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t.nav.admin}</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/doors" className="hover:text-amber-400 transition-colors">
                  {language === 'bn' ? 'ডিজাইন ক্যাটালগ' : 'Design Catalog'}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-amber-400 transition-colors">
                  {language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="hover:text-amber-400 transition-colors text-amber-400 font-semibold">
                  {language === 'bn' ? 'কাস্টম ডিজাইন অর্ডার' : 'Custom Design Order'}
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-amber-400 transition-colors">
                  {language === 'bn' ? 'সিএফটি ক্যালকুলেটর' : 'CFT Calculator'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  {language === 'bn' ? 'আমাদের পরিচিতি' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  {language === 'bn' ? 'যোগাযোগ' : 'Contact'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Addresses */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {t.footer.contactInfo}
            </h4>
            <div className="space-y-3.5 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">
                    {language === 'bn' ? 'প্রোপাইটর:' : 'Proprietor:'}
                  </strong>
                  <span>{proprietorName}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">
                    {language === 'bn' ? 'ঠিকানা:' : 'Address:'}
                  </strong>
                  <span>{address}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <a href={`tel:${phone1}`} className="hover:text-white transition-colors font-mono">{phone1}</a>
                  {phone2 && (
                    <>
                      <span className="mx-1">/</span>
                      <a href={`tel:${phone2}`} className="hover:text-white transition-colors font-mono">{phone2}</a>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  {language === 'bn' ? 'শনিবার - বৃহস্পতিবার: সকাল ৮:০০ - রাত ৯:০০ (শুক্রবার খোলা)' : 'Saturday - Thursday: 8:00 AM - 9:00 PM (Friday Open)'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {language === 'bn' ? 'পেমেন্ট সুবিধা' : 'Payment Methods'}
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                <div className="flex items-center gap-1.5 font-bold text-pink-400 text-xs mb-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>bKash (বিকাশ)</span>
                </div>
                <span className="font-mono text-[11px] text-stone-200">
                  {settings?.bkashNumber || '01710-820987'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                <div className="flex items-center gap-1.5 font-bold text-orange-400 text-xs mb-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Nagad (নগদ)</span>
                </div>
                <span className="font-mono text-[11px] text-stone-200">
                  {settings?.nagadNumber || '01942-237399'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal links */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <p>© {new Date().getFullYear()} {t.footer.rights}</p>
            <div className="flex items-center gap-4 text-[11px] text-stone-400">
              <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors">
                {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-amber-400 transition-colors">
                {language === 'bn' ? 'শর্তাবলী' : 'Terms & Conditions'}
              </Link>
              <span>•</span>
              <Link href="/admin" className="hover:text-amber-400 transition-colors">
                {language === 'bn' ? 'অ্যাডমিন' : 'Admin'}
              </Link>
            </div>
          </div>

          <div className="text-[11px] text-stone-500">
            <span>বাঘাড়পাড়া, যশোর, বাংলাদেশ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
