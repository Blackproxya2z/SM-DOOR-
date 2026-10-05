'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useQuote } from '@/context/QuoteContext';
import { SiteSettings } from '@/types';
import { firestore } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  TreePine, 
  Calculator, 
  Lock,
  ClipboardList,
  ChevronDown,
  PhoneCall,
  ArrowRight
} from 'lucide-react';

interface HeaderProps {
  initialSettings?: SiteSettings;
}

export function Header({ initialSettings }: HeaderProps) {
  const pathname = usePathname();
  const { language, setLanguage, t, toLocalDigits } = useLanguage();
  const { itemCount } = useQuote();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [settings, setSettings] = useState<SiteSettings | undefined>(initialSettings);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
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

  // Close mobile drawer and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const phone = settings?.phone1 || t.brand.phone;
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const whatsappNumber = settings?.whatsappNumber || t.brand.whatsapp;
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  // Navigation Links with Streamlined Mega/Dropdown Groups
  const doorsMenu = [
    { href: '/doors', labelBn: 'সকল ডিজাইন ক্যাটালগ', labelEn: 'All Designs Catalog', descBn: 'আমাদের সম্পূর্ণ কাঠের সামগ্রী কালেকশন', descEn: 'Complete wood and door catalog' },
    { href: '/doors?category=door', labelBn: 'সলিড কাঠের দরজা', labelEn: 'Solid Wooden Doors', descBn: 'সেগুন, মেহগনি ও গামারি ৩ডি খোদাই দরজা', descEn: 'Grand entrance luxury carved doors' },
    { href: '/doors?category=furniture', labelBn: 'ফার্নিচার কালেকশন', labelEn: 'Furniture Collection', descBn: 'আলমিরা, শোকেস ও ড্রেসিং টেবিল', descEn: 'Bespoke solid wood furniture' },
    { href: '/doors?category=dining-table', labelBn: 'ডাইনিং টেবিল ও চেয়ার', labelEn: 'Dining Table & Chairs', descBn: '৪, ৬ ও ৮ সিটের বিলাসবহুল ডাইনিং সেট', descEn: 'Luxury 4, 6 & 8-seater dining tables' },
    { href: '/doors?category=bed', labelBn: 'রাজকীয় খাট / বেড', labelEn: 'Royal Wooden Beds', descBn: 'কিং ও কুইন সাইজ সলিড সেগুন খাট', descEn: 'King & queen size solid timber beds' },
    { href: '/doors?category=tea-table', labelBn: 'টি টেবিল ও সেন্টার টেবিল', labelEn: 'Tea Table & Coffee Table', descBn: 'ড্রয়িং রুমের নান্দনিক সেন্টার টেবিল', descEn: 'Artisan center tea tables' },
    { href: '/doors?category=sofa', labelBn: 'সলিড কাঠের সোফা সেট', labelEn: 'Wooden Sofa Sets', descBn: '৩+১+১ ও এল-শেপ লাক্সারি সোফা', descEn: 'Luxury solid frame sofa sets' },
    { href: '/doors?category=wood', labelBn: 'লগ ও চেরা সাইজ কাঠ', labelEn: 'Logs & Sized Timber', descBn: 'গোল গুঁড়ি ও সঠিক মাপে চেরা তক্তা', descEn: 'Round logs and sawn planks' },
    { href: '/custom-order', labelBn: 'নিজের ডিজাইন দিয়ে অর্ডার', labelEn: 'Custom Design Order', descBn: 'আপনার ছবি দেখে বানিয়ে দেওয়া হয়', descEn: 'Crafted from your photo upload' },
  ];

  const woodMenu = [
    { href: '/wood', labelBn: 'কাঠের গাইড ও দরতালিকা', labelEn: 'Species Guide & Rates', descBn: 'প্রতি সিএফটি কাঠের বর্তমান বাজার দর', descEn: 'Live CFT rates and comparison' },
    { href: '/wood/ctg-teak', labelBn: 'চিটাগাং সেগুন (Chittagong Teak)', labelEn: 'Chittagong Teak', descBn: 'গ্রেড-১ কাঠের রাজা, ৫০+ বছর দীর্ঘস্থায়ী', descEn: 'Grade-1 luxury timber, 50+ yrs longevity' },
    { href: '/wood/seasoned-mahogany', labelBn: 'সিজনড মেহগনি (Seasoned Mahogany)', labelEn: 'Seasoned Mahogany', descBn: '১২% কিম্বন ড্রাইড, বোরার প্রতিরোধী', descEn: 'Kiln-dried & vacuum chemical treated' },
    { href: '/wood/gamari', labelBn: 'গামারি কাঠ (Gamari Wood)', labelEn: 'Gamari Wood', descBn: 'হালকা সোনালী টেক্সচার ও সূক্ষ্ম খোদাই উপযোগী', descEn: 'Silky golden tone for intricate carving' },
    { href: '/wood/sal', labelBn: 'শাল কাঠ (Sal Timber)', labelEn: 'Sal Timber', descBn: 'অত্যন্ত শক্ত ও ভারী, সেরা চৌকাঠ কাঠ', descEn: 'Ultra-dense structural Chowkath wood' },
  ];

  const calculatorMenu = [
    { href: '/calculator', labelBn: 'অল-ইন-ওয়ান টিম্বার ক্যালকুলেটর', labelEn: 'All Calculators Hub', descBn: 'চেরাই, গোল কাঠ ও চৌকাঠ হিসাব', descEn: 'Estimate timber volume and cost' },
    { href: '/calculator/cft', labelBn: 'চেরাই কাঠ সিএফটি ক্যালকুলেটর', labelEn: 'Sawn Timber CFT (L×W×T)', descBn: 'দৈর্ঘ্য, প্রস্থ ও পুরুত্ব দিয়ে হিসাব', descEn: 'Calculate board feet and price' },
    { href: '/calculator/log', labelBn: 'গোল কাঠ হপাস ক্যালকুলেটর', labelEn: 'Round Log Hoppus Formula', descBn: 'বেড় ও দৈর্ঘ্য দিয়ে গোল কাঠের সিএফটি', descEn: 'Quarter girth log volume formula' },
    { href: '/calculator/frame', labelBn: 'চৌকাঠ মেজারমেন্ট ও খরচ হিসাব', labelEn: 'Door Frame Cost Estimator', descBn: 'সিজন ও কাটিং চার্জ সহ মোট দর', descEn: 'Frame timber + processing cost' },
  ];

  const factoryMenu = [
    { 
      href: '/factory', 
      labelBn: 'স্টেট-অব-দ্য-আর্ট স’মিল কমপ্লেক্স', 
      labelEn: 'State-of-the-Art Sawmill Complex', 
      descBn: 'ভারী ব্যান্ড-স চেরাই, কিম্বন সিজনিং ও কারখানা ট্যুর', 
      descEn: 'Log slabbing, kiln drying & factory tour' 
    },
    { 
      href: '/about', 
      labelBn: 'আমাদের পরিচিতি (মেসার্স ফারহান এন্টারপ্রাইজ)', 
      labelEn: 'About Farhan Enterprise', 
      descBn: 'প্রোঃ মোঃ আব্দুছ ছালাম খাঁন • ২৫+ বছরের ঐতিহ্য', 
      descEn: '25+ years trusted legacy & proprietor' 
    },
    { 
      href: '/contact', 
      labelBn: 'শোরুম ও সরাসরি যোগাযোগ', 
      labelEn: 'Showrooms & Contact', 
      descBn: 'আকিজ কলেজিয়েট স্কুলের পশ্চিম পার্শ্বে, বাদে নাভারন, যশোর', 
      descEn: 'West side of Akij Collegiate School, Jhikargachha' 
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* ─── Ultra-Luxury Desktop Top Announcement Strip ─── */}
      <div 
        className={`hidden lg:block bg-[#2B1A12] text-white/90 text-[11px] px-4 sm:px-6 lg:px-8 border-b border-[#C59B27]/30 transition-all duration-300 font-[family-name:var(--font-hind-siliguri)] ${
          scrolled ? 'max-h-0 py-0 opacity-0 overflow-hidden border-none' : 'max-h-12 py-1.5 opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white/90">
              <span className="text-[#C59B27]">📍</span>
              <span>{language === 'bn' ? (settings?.addressBn || 'বাদে নাভারন, আকিজ কলেজিয়েট স্কুলের পশ্চিম পাশে, ঝিকরগাছা, যশোর') : (settings?.addressEn || 'Bade Navaran, West of Akij Collegiate School, Jhikargachha, Jashore')}</span>
            </span>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-1 text-[#C59B27]">
              <span>⏱️</span>
              <span>{language === 'bn' ? 'সকাল ৮:০০ - রাত ৯:০০ (সপ্তাহে ৭ দিন খোলা)' : '8:00 AM - 9:00 PM (Open 7 Days)'}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${cleanPhone}`} className="flex items-center gap-1.5 text-[#C59B27] hover:text-white transition-colors font-bold">
              <Phone className="w-3 h-3" />
              <span>{phone}</span>
            </a>
            <span className="text-white/30">•</span>
            <span className="text-amber-200/90 font-medium">
              {language === 'bn' ? 'প্রোঃ মোঃ আব্দুছ ছালাম খাঁন' : 'Proprietor: Md. Abdus Salam Khan'}
            </span>
          </div>
        </div>
      </div>

      {/* Light Premium Navigation Bar */}
      <div 
        className={`w-full transition-all duration-300 bg-[#FAF8F5] border-b border-[#E8DED4] ${
          scrolled 
            ? 'shadow-[0_4px_20px_-4px_rgba(43,26,18,0.06)] py-3' 
            : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo: Modern Architectural Brand Mark */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-shrink">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#C59B27] to-[#2B1A12] p-[1.5px] shadow-sm transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
                <div className="w-full h-full bg-[#2B1A12] rounded-[10px] flex items-center justify-center">
                  <TreePine className="w-5 h-5 sm:w-6 sm:h-6 text-[#C59B27] group-hover:text-amber-300 transition-colors" />
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="text-sm sm:text-lg lg:text-xl font-bold font-serif tracking-tight text-[#2B1A12] group-hover:text-[#C59B27] transition-colors truncate">
                    {language === 'bn' ? (settings?.siteNameBn || 'মেসার্স ফারহান এন্টারপ্রাইজ') : (settings?.siteNameEn || 'M/S Farhan Enterprise')}
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 bg-[#F4ECE1] text-[#7A6A5F] border border-[#E8DED4] rounded flex-shrink-0">
                    যশোর
                  </span>
                </div>
                <span className="text-[11px] text-[#7A6A5F] font-medium tracking-wide hidden sm:block truncate">
                  {language === 'bn' ? (settings?.taglineBn || 'কাঠ, দরজা ও ফার্নিচারের বিশ্বস্ত ঠিকানা') : (settings?.taglineEn || 'Trusted Wood, Door & Furniture Solutions')}
                </span>
              </div>
            </Link>

            {/* Desktop Streamlined Navigation Links with Dropdowns */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {/* 1. Home */}
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  pathname === '/'
                    ? 'text-[#C59B27] bg-[#F4ECE1]'
                    : 'text-[#2B1A12] hover:text-[#C59B27] hover:bg-[#F4ECE1]/60'
                }`}
              >
                {language === 'bn' ? 'হোম' : 'Home'}
              </Link>

              {/* 2. Doors & Catalog (with Dropdown) */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('doors')}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/doors"
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    pathname.startsWith('/doors') || pathname.startsWith('/categories')
                      ? 'text-[#C59B27] bg-[#F4ECE1]'
                      : 'text-[#2B1A12] hover:text-[#C59B27] hover:bg-[#F4ECE1]/60'
                  }`}
                >
                  <span>{language === 'bn' ? 'দরজার ক্যাটালগ' : 'Doors & Catalog'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'doors' ? 'rotate-180 text-[#C59B27]' : 'text-[#7A6A5F]'}`} />
                </Link>

                {activeDropdown === 'doors' && (
                  <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="bg-white rounded-2xl shadow-xl border border-[#E8DED4] p-2 overflow-hidden">
                      <div className="px-3 py-2 border-b border-[#E8DED4]/60 mb-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#C59B27]">
                          {language === 'bn' ? 'দরজার কালেকশন' : 'Door Collections'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        {doorsMenu.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-3 py-2 rounded-xl hover:bg-[#FAF8F5] transition-colors group"
                          >
                            <p className="text-sm font-semibold text-[#2B1A12] group-hover:text-[#C59B27] flex items-center justify-between">
                              {language === 'bn' ? item.labelBn : item.labelEn}
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#C59B27]" />
                            </p>
                            <p className="text-[12px] text-[#7A6A5F] mt-0.5 line-clamp-1">
                              {language === 'bn' ? item.descBn : item.descEn}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Wood Species (with Dropdown) */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('wood')}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/wood"
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    pathname.startsWith('/wood')
                      ? 'text-[#C59B27] bg-[#F4ECE1]'
                      : 'text-[#2B1A12] hover:text-[#C59B27] hover:bg-[#F4ECE1]/60'
                  }`}
                >
                  <span>{language === 'bn' ? 'কাঠের প্রজাতি' : 'Wood Species'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'wood' ? 'rotate-180 text-[#C59B27]' : 'text-[#7A6A5F]'}`} />
                </Link>

                {activeDropdown === 'wood' && (
                  <div className="absolute top-full left-0 w-84 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="bg-white rounded-2xl shadow-xl border border-[#E8DED4] p-2 overflow-hidden">
                      <div className="px-3 py-2 border-b border-[#E8DED4]/60 mb-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#C59B27]">
                          {language === 'bn' ? 'কাঠের গাইড ও দর' : 'Timber Species & Rates'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        {woodMenu.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-3 py-2 rounded-xl hover:bg-[#FAF8F5] transition-colors group"
                          >
                            <p className="text-sm font-semibold text-[#2B1A12] group-hover:text-[#C59B27] flex items-center justify-between">
                              {language === 'bn' ? item.labelBn : item.labelEn}
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#C59B27]" />
                            </p>
                            <p className="text-[12px] text-[#7A6A5F] mt-0.5 line-clamp-1">
                              {language === 'bn' ? item.descBn : item.descEn}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Calculator (with Dropdown) */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('calc')}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/calculator"
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    pathname.startsWith('/calculator')
                      ? 'text-[#C59B27] bg-[#F4ECE1]'
                      : 'text-[#2B1A12] hover:text-[#C59B27] hover:bg-[#F4ECE1]/60'
                  }`}
                >
                  <Calculator className="w-4 h-4 text-[#C59B27]" />
                  <span>{language === 'bn' ? 'ক্যালকুলেটর' : 'Calculator'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'calc' ? 'rotate-180 text-[#C59B27]' : 'text-[#7A6A5F]'}`} />
                </Link>

                {activeDropdown === 'calc' && (
                  <div className="absolute top-full left-0 w-84 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="bg-white rounded-2xl shadow-xl border border-[#E8DED4] p-2 overflow-hidden">
                      <div className="px-3 py-2 border-b border-[#E8DED4]/60 mb-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#C59B27]">
                          {language === 'bn' ? 'টিম্বার মেজারমেন্ট টুলস' : 'Timber Estimation Tools'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        {calculatorMenu.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-3 py-2 rounded-xl hover:bg-[#FAF8F5] transition-colors group"
                          >
                            <p className="text-sm font-semibold text-[#2B1A12] group-hover:text-[#C59B27] flex items-center justify-between">
                              {language === 'bn' ? item.labelBn : item.labelEn}
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#C59B27]" />
                            </p>
                            <p className="text-[12px] text-[#7A6A5F] mt-0.5 line-clamp-1">
                              {language === 'bn' ? item.descBn : item.descEn}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Custom Order */}
              <Link
                href="/custom-order"
                className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === '/custom-order'
                    ? 'text-[#C59B27] bg-[#F4ECE1]'
                    : 'text-[#2B1A12] hover:text-[#C59B27] hover:bg-[#F4ECE1]/60'
                }`}
              >
                <span>{language === 'bn' ? 'কাস্টম ডিজাইন' : 'Custom Order'}</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-[#C59B27] text-white rounded-full shadow-sm">
                  {language === 'bn' ? 'অর্ডার' : 'Bespoke'}
                </span>
              </Link>

              {/* 6. Factory & About (with Dropdown) */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('about')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    pathname === '/factory' || pathname === '/about' || pathname === '/contact'
                      ? 'text-[#C59B27] bg-[#F4ECE1]'
                      : 'text-[#2B1A12] hover:text-[#C59B27] hover:bg-[#F4ECE1]/60'
                  }`}
                >
                  <span>{language === 'bn' ? 'কারখানা ও পরিচিতি' : 'Factory & About'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180 text-[#C59B27]' : 'text-[#7A6A5F]'}`} />
                </button>

                {activeDropdown === 'about' && (
                  <div className="absolute top-full right-0 w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="bg-white rounded-2xl shadow-xl border border-[#E8DED4] p-2 overflow-hidden">
                      <div className="px-3 py-2 border-b border-[#E8DED4]/60 mb-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#C59B27]">
                          {language === 'bn' ? 'মেসার্স ফারহান এন্টারপ্রাইজ' : 'Farhan Enterprise Complex'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        {factoryMenu.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-3 py-2 rounded-xl hover:bg-[#FAF8F5] transition-colors group"
                          >
                            <p className="text-sm font-semibold text-[#2B1A12] group-hover:text-[#C59B27] flex items-center justify-between">
                              {language === 'bn' ? item.labelBn : item.labelEn}
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#C59B27]" />
                            </p>
                            <p className="text-[12px] text-[#7A6A5F] mt-0.5 line-clamp-1">
                              {language === 'bn' ? item.descBn : item.descEn}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Header Right Action Elements (Light Premium Cluster) */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              
              {/* Quote Cart / List Badge */}
              <Link
                href="/quote"
                className="relative p-2.5 rounded-xl bg-white hover:bg-[#F4ECE1] text-[#2B1A12] hover:text-[#C59B27] border border-[#E8DED4] transition-all flex items-center justify-center group shadow-sm"
                aria-label="View quotation list"
                title={language === 'bn' ? 'কোটেশন কার্ট' : 'View Quote Cart'}
              >
                <ClipboardList className="w-5 h-5 text-[#2B1A12] group-hover:text-[#C59B27] transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#C59B27] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {toLocalDigits(itemCount)}
                  </span>
                )}
              </Link>

              {/* Minimalist Language Switcher Pill */}
              <div className="flex items-center bg-[#F4ECE1] border border-[#E8DED4] rounded-full p-0.5">
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-full transition-all ${
                    language === 'bn'
                      ? 'bg-white text-[#2B1A12] shadow-sm'
                      : 'text-[#7A6A5F] hover:text-[#2B1A12]'
                  }`}
                  aria-label="Switch to Bangla"
                >
                  বাং
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-full transition-all ${
                    language === 'en'
                      ? 'bg-white text-[#2B1A12] shadow-sm'
                      : 'text-[#7A6A5F] hover:text-[#2B1A12]'
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
              </div>

              {/* Direct WhatsApp Call / Order Button (Light Premium Style) */}
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  language === 'bn' 
                    ? 'আসসালামু আলাইকুম, আমি এস এম ডোর ও কাঠ সম্পর্কে জানতে চাই।' 
                    : 'Hello, I want to inquire about SM Door products.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-sm hover:shadow transition-all duration-200 border border-emerald-600 group"
              >
                <MessageCircle className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
              </a>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-[#F4ECE1] hover:bg-[#E8DED4] text-[#2B1A12] border border-[#E8DED4] transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mobile Slide-out Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E8DED4] shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-3 pb-6 space-y-2 max-h-[85vh] overflow-y-auto">
            {/* Home */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-semibold text-[#2B1A12] hover:bg-[#F4ECE1] hover:text-[#C59B27]"
            >
              {language === 'bn' ? 'হোম' : 'Home'}
            </Link>

            {/* Doors & Catalog Group */}
            <div className="pt-2 pb-1 border-t border-[#E8DED4]">
              <p className="px-4 text-xs font-bold uppercase tracking-wider text-[#C59B27] mb-1">
                {language === 'bn' ? 'দরজার ক্যাটালগ' : 'Doors & Catalog'}
              </p>
              {doorsMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-xl text-sm font-medium text-[#2B1A12] hover:bg-[#F4ECE1] hover:text-[#C59B27]"
                >
                  {language === 'bn' ? item.labelBn : item.labelEn}
                </Link>
              ))}
            </div>

            {/* Wood Species */}
            <div className="pt-2 pb-1 border-t border-[#E8DED4]">
              <p className="px-4 text-xs font-bold uppercase tracking-wider text-[#C59B27] mb-1">
                {language === 'bn' ? 'কাঠের প্রজাতি ও রেট' : 'Wood Species & Rates'}
              </p>
              {woodMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-xl text-sm font-medium text-[#2B1A12] hover:bg-[#F4ECE1] hover:text-[#C59B27]"
                >
                  {language === 'bn' ? item.labelBn : item.labelEn}
                </Link>
              ))}
            </div>

            {/* Calculator */}
            <div className="pt-2 pb-1 border-t border-[#E8DED4]">
              <p className="px-4 text-xs font-bold uppercase tracking-wider text-[#C59B27] mb-1">
                {language === 'bn' ? 'টিম্বার ক্যালকুলেটর' : 'Timber Calculators'}
              </p>
              {calculatorMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-xl text-sm font-medium text-[#2B1A12] hover:bg-[#F4ECE1] hover:text-[#C59B27]"
                >
                  {language === 'bn' ? item.labelBn : item.labelEn}
                </Link>
              ))}
            </div>

            {/* Custom Order */}
            <Link
              href="/custom-order"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-semibold text-[#2B1A12] hover:bg-[#F4ECE1] hover:text-[#C59B27] border-t border-[#E8DED4]"
            >
              <span>{language === 'bn' ? 'কাস্টম ডিজাইন অর্ডার' : 'Custom Design Order'}</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-[#C59B27] text-white rounded-full">
                {language === 'bn' ? 'অর্ডার' : 'Bespoke'}
              </span>
            </Link>

            {/* Factory & About */}
            <div className="pt-2 pb-1 border-t border-[#E8DED4]">
              <p className="px-4 text-xs font-bold uppercase tracking-wider text-[#C59B27] mb-1">
                {language === 'bn' ? 'কারখানা ও যোগাযোগ' : 'Factory & Contact'}
              </p>
              {factoryMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-xl text-sm font-medium text-[#2B1A12] hover:bg-[#F4ECE1] hover:text-[#C59B27]"
                >
                  {language === 'bn' ? item.labelBn : item.labelEn}
                </Link>
              ))}
            </div>

            {/* Mobile Quote Link */}
            <Link
              href="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-semibold bg-white text-[#2B1A12] border border-[#E8DED4] shadow-sm hover:border-[#C59B27]"
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#C59B27]" />
                <span>{language === 'bn' ? 'আপনার কোটেশন তালিকা' : 'Your Quote List'}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#C59B27] text-white text-xs font-bold">
                {toLocalDigits(itemCount)}
              </span>
            </Link>

            {/* Action buttons */}
            <div className="pt-4 border-t border-[#E8DED4] flex flex-col gap-2.5">
              <a
                href={`tel:${phone}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#2B1A12] text-white font-semibold text-sm hover:bg-[#3D261B] transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-[#C59B27]" />
                <span>{language === 'bn' ? 'সরাসরি কল করুন:' : 'Call:'} {phone}</span>
              </a>
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#10B981] text-white font-semibold text-sm hover:bg-[#059669] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট করুন' : 'Chat on WhatsApp'}</span>
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 text-xs text-[#7A6A5F] hover:text-[#C59B27] py-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t.nav.admin}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
