'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SawmillService } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { DEFAULT_BLUR_DATA_URL } from '@/lib/image-utils';
import { 
  Factory, 
  ShieldCheck, 
  Flame, 
  Cpu, 
  CheckCircle2, 
  Eye, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SawmillShowcaseProps {
  services: SawmillService[];
}

interface FactoryPhotoItem {
  id: string;
  image: string;
  stepBn: string;
  stepEn: string;
  titleBn: string;
  titleEn: string;
  detailsBn: string;
  detailsEn: string;
  highlights: string[];
}

const factoryPhotos: FactoryPhotoItem[] = [
  {
    id: 'photo-1',
    image: '/images/factory/factory-sawmill-yard.webp',
    stepBn: 'ধাপ ০১ • কাঁচামাল কাঠ সংগ্রহ ও স্টোরেজ',
    stepEn: 'Step 01 • Raw Timber Inflow & Storage',
    titleBn: 'সমিল ইয়ার্ড ও সারিবদ্ধ সাইজ কাঠের বিশাল স্তূপ',
    titleEn: 'Sawmill Log Yard & Seasoned Timber Stacks',
    detailsBn: 'ছবিতে দৃশ্যমান: বিশাল আকারের গোল গাছের লগ ও সমিল শেডের সামনে রোদে ও মুক্ত বাতাসে প্রাকৃতিকভাবে প্রি-সিজনিংয়ের জন্য সাজিয়ে রাখা হাজার হাজার ফুট খাঁটি মেহগনি ও সেগুন তক্তা। কোনো কাঁচা কাঠ ব্যবহার না করে সঠিক প্রাকৃতিক আর্দ্রতায় পৌঁছানো পর্যন্ত এভাবেই পরিপাটি করে রাখা হয়।',
    detailsEn: 'Observed in photo: Massive hardwood logs and thousands of cubic feet of mature mahogany and teak planks stacked under open sunshine for natural pre-seasoning before entering kiln kilns.',
    highlights: ['খোলা বাতাসে প্রি-সিজনিং', 'বিশাল রাউন্ড লগ স্টক', 'প্রাকৃতিক কাঠের গ্রেডিং']
  },
  {
    id: 'photo-2',
    image: '/images/factory/factory-mature-log-slicing.webp',
    stepBn: 'ধাপ ০২ • ১০০% পাকা কাঠ বাছাই ও নাম্বারিং',
    stepEn: 'Step 02 • Mature Timber Selection',
    titleBn: 'গাঢ় লালচে পরিপক্ক গাছের লগ নির্বাচন ও চেরাই',
    titleEn: 'Mature Hardwood Slicing & Chalk Inspection',
    detailsBn: 'ছবিতে দৃশ্যমান: তাজা চেরা গাছের ক্রস-সেকশনে স্পষ্ট গাঢ় লালচে প্রাকৃতিক কালার টোন ও ঘন বার্ষিক গ্রোথ রিংস (Growth Rings)। প্রতিটি লগের গায়ে সাদা চকে নিখুঁত মাপ ও গ্রেড কোড লেখা রয়েছে, যা প্রমাণ করে কম বয়সী নয় বরং শতভাগ পরিপক্ক কাঠই এখানে প্রসেস করা হচ্ছে।',
    detailsEn: 'Observed in photo: Deep reddish grain pattern and concentric growth rings proving 100% mature age. White chalk sizing marks ensure exact grading standard.',
    highlights: ['স্পষ্ট গ্রোথ রিংস ও লালচে আভা', 'চকের সঠিক মাপ ও নাম্বারিং', 'উইপোকা প্রতিরোধী পরিপক্ক কাঠ']
  },
  {
    id: 'photo-3',
    image: '/images/factory/factory-bandsaw-cutting.webp',
    stepBn: 'ধাপ ০৩ • হাই-প্রিসিশন চেরাই অপারেশন',
    stepEn: 'Step 03 • Precision Band Saw Slicing',
    titleBn: 'হেভি ব্যান্ড স মেশিনে নির্দিষ্ট থিকনেসে তক্তা তৈরি',
    titleEn: 'Heavy Band Saw Mechanical Slabbing',
    detailsBn: 'ছবিতে দৃশ্যমান: অভিজ্ঞ স’মিল মাস্টাররা সরাসরি ব্যান্ড স মেশিনের স্টিল বেডের ওপর ভারী গাছের গুঁড়ি পুশ করে নিখুঁত সমান্তরালে ১.৫ ইঞ্চি চৌকাঠ ও দরজার জন্য নির্দিষ্ট পুরুত্বে স্লাইস করছেন। নির্ভুল কাটিংয়ের ফলে কাঠে কোনো অসমান ঢেউ বা কার্ভ থাকে না।',
    detailsEn: 'Observed in photo: Two senior sawmill operators operating heavy vertical band saws, feeding massive logs across precision tables for exact 1.5-inch door thickness.',
    highlights: ['১.৫ - ২.৫ ইঞ্চি নিখুঁত থিকনেস', 'জিরো কার্ভ কাটিং', 'অভিজ্ঞ সমিল কারিগর']
  },
  {
    id: 'photo-4',
    image: '/images/factory/factory-planer-craftsman.webp',
    stepBn: 'ধাপ ০৪ • সারফেস প্ল্যানিং ও মসৃণকরণ',
    stepEn: 'Step 04 • Thickness Planing & Calibration',
    titleBn: 'হেভি প্ল্যানারে কাঠ সমতল ও গ্লাস-স্মুথ ফিনিশিং',
    titleEn: 'Electric Surface Planer & Smoothing Unit',
    detailsBn: 'ছবিতে দৃশ্যমান: কাঠ চেরাইয়ের পর কাঠের রুক্ষ ও আঁকাবাঁকা তল সম্পূর্ণ সমতল করতে ইলেকট্রিক থিকনেস প্ল্যানার দিয়ে সাইজ করা হচ্ছে। মেঝেজুড়ে তাজা কাঠের সুগন্ধি ভুসি ও সামনে প্রস্তুত নিখুঁত মসৃণ তক্তার পরিপাটি স্তূপ।',
    detailsEn: 'Observed in photo: Modern thickness planner in action removing rough saw marks, leaving a flawless smooth foundation for door construction.',
    highlights: ['মাইক্রোমিটার প্রিসিশন লেভেলিং', 'রুক্ষতা মুক্ত মসৃণ তল', 'তাজা কাঠের খাঁটি অ্যারোমা']
  },
  {
    id: 'photo-5',
    image: '/images/factory/factory-workshop-assembly.webp',
    stepBn: 'ধাপ ০৫ • সুপরিসর কর্মশালায় দরজা ও ফার্নিচার অ্যাসেম্বলি',
    stepEn: 'Step 05 • Master Carpentry & Frame Assembly',
    titleBn: 'অভিজ্ঞ হস্তশিল্পীদের কর্মশালায় ডোর ফ্রেম প্রস্তুতি',
    titleEn: 'Spacious Woodworking Workshop & Assembly Area',
    detailsBn: 'ছবিতে দৃশ্যমান: পর্যাপ্ত সিলিং ফ্যান ও উজ্জ্বল বাতিযুক্ত সুপরিসর কাঠের ওয়ার্কশপ। অভিজ্ঞ কারিগররা প্ল্যানিং করা কাঠ জোড়া লাগিয়ে মজবুত সলিড দরজার পাল্লা, চৌকাঠ ও ফার্নিচারের ক্লাসিক্যাল ফ্রেম তৈরিতে ব্যস্ত।',
    detailsEn: 'Observed in photo: Well-ventilated semi-industrial workshop where master carpenters assemble planed timber into heavy luxury doors and architectural furniture.',
    highlights: ['পর্যাপ্ত আলো-বাতাসযুক্ত ফ্যাক্টরি', 'মাস্টার কার্পেন্টারদের অ্যাসেম্বলি', 'দৃঢ় ও দীর্ঘস্থায়ী জয়েন্ট']
  }
];

export function SawmillShowcase({ services }: SawmillShowcaseProps) {
  const { language, t } = useLanguage();
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  useEffect(() => {
    if (activePhotoIdx === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePhotoIdx(null);
      if (e.key === 'ArrowLeft') {
        setActivePhotoIdx(prev => (prev !== null ? (prev - 1 + factoryPhotos.length) % factoryPhotos.length : null));
      }
      if (e.key === 'ArrowRight') {
        setActivePhotoIdx(prev => (prev !== null ? (prev + 1) % factoryPhotos.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIdx]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-6 h-6 text-amber-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-sky-600" />;
      default: return <Factory className="w-6 h-6 text-[#C59B27]" />;
    }
  };

  return (
    <section id="sawmill" className="py-16 sm:py-24 bg-[#FAF8F5] text-[#2B1A12] relative overflow-hidden">
      {/* Background warm radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C59B27]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C59B27]/10 text-[#C59B27] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C59B27]/25">
            <Factory className="w-3.5 h-3.5" />
            <span className="font-[family-name:var(--font-hind-siliguri)]">{language === 'bn' ? 'স্টেট-অব-দ্য-আর্ট স’মিল কমপ্লেক্স • State-of-the-Art Complex' : 'State-of-the-Art Sawmill Complex'}</span>
          </div>
          <h2 className="font-[family-name:var(--font-tiro-bangla)] text-3xl sm:text-5xl font-bold text-[#2B1A12] tracking-tight mb-4">
            {language === 'bn' ? 'মেসার্স ফারহান এন্টারপ্রাইজ — নিজস্ব স’মিল ও প্রসেসিং কমপ্লেক্স' : t.sawmill.title}
          </h2>
          <p className="font-[family-name:var(--font-hind-siliguri)] text-base sm:text-lg text-[#7A6A5F] leading-relaxed">
            {language === 'bn' 
              ? 'গোল কাঠের গুঁড়ি চেরাই থেকে শুরু করে ফার্নেস কিম্বন সিজনিং, কেমিক্যাল ট্রিটমেন্ট এবং নিখুঁত দরজা ও ফার্নিচার তৈরির প্রতিটি ধাপ আমাদের নিজস্ব তত্ত্বাবধানে সম্পন্ন হয়।'
              : t.sawmill.subtitle}
          </p>

          {/* Quick Bridge to About Profile */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2B1A12] hover:bg-[#C59B27] text-white font-bold text-xs sm:text-sm shadow-md transition-all duration-300"
            >
              <span className="font-[family-name:var(--font-hind-siliguri)]">{language === 'bn' ? 'মেসার্স ফারহান এন্টারপ্রাইজ সম্পর্কে জানুন' : 'About Farhan Enterprise'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/factory"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#F4ECE1] text-[#2B1A12] font-semibold text-xs sm:text-sm border border-[#E8DED4] transition-all duration-300 shadow-sm"
            >
              <Factory className="w-4 h-4 text-[#C59B27]" />
              <span className="font-[family-name:var(--font-hind-siliguri)]">{language === 'bn' ? 'কারখানা ওভারভিউ' : 'Factory Overview'}</span>
            </Link>
          </div>
        </div>

        {/* Process Flow Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((item, idx) => {
            const title = language === 'bn' ? item.titleBn : item.titleEn;
            const desc = language === 'bn' ? item.descriptionBn : item.descriptionEn;
            const highlight = language === 'bn' ? item.highlightBn : item.highlightEn;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-[#E8DED4] hover:border-[#C59B27] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-md hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] flex items-center justify-center border border-[#E8DED4] shadow-sm group-hover:scale-105 transition-transform">
                      {getIcon(item.icon)}
                    </div>
                    <span className="text-2xl font-black text-[#E8DED4] group-hover:text-[#C59B27]/40 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-[family-name:var(--font-tiro-bangla)] text-lg font-bold text-[#2B1A12] mb-2 group-hover:text-[#C59B27] transition-colors">
                    {title}
                  </h3>
                  <p className="font-[family-name:var(--font-hind-siliguri)] text-sm text-[#7A6A5F] leading-relaxed mb-4">
                    {desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8DED4] flex items-center gap-1.5 text-xs font-semibold text-[#C59B27]">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-[family-name:var(--font-hind-siliguri)]">{highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Factory Feature Banner with Real Photo */}
        <div className="relative rounded-3xl overflow-hidden border border-[#E8DED4] bg-white shadow-xl mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 p-8 sm:p-12">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#C59B27] mb-2 font-[family-name:var(--font-hind-siliguri)]">
                {language === 'bn' ? 'সরাসরি কারখানার পরিচিতি' : t.sawmill.videoBadge}
              </span>
              <h3 className="font-[family-name:var(--font-tiro-bangla)] text-2xl sm:text-3xl font-bold text-[#2B1A12] mb-4">
                {language === 'bn' ? 'যশোরের বাদে নাভারনে আমাদের সুবিশাল সমিল প্রাঙ্গণ' : t.sawmill.videoTitle}
              </h3>
              <p className="font-[family-name:var(--font-hind-siliguri)] text-sm text-[#7A6A5F] leading-relaxed mb-6">
                {language === 'bn'
                  ? 'মেসার্স ফারহান এন্টারপ্রাইজ কোনো থার্ড পার্টি রি-সেলার নয়। ঝিকরগাছার আকিজ কলেজিয়েট স্কুলের পাশেই আমাদের নিজস্ব স’মিলে সরাসরি পার্বত্য চট্টগ্রাম থেকে সংগৃহীত চিটাগাং সেগুন, এবং যশোর-মেহেরপুর অঞ্চলের পরিপক্ক মেহগনি গাছের চেরাই ও প্রি-সিজনিং করা হয়।'
                  : 'Every raw timber log is meticulously hand-graded. Following precision band slabbing, computerized steam chambers lock cellular moisture at 12-14%.'}
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-[#2B1A12] mb-8 font-[family-name:var(--font-hind-siliguri)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#C59B27] flex-shrink-0" />
                  <span>{language === 'bn' ? '১০০% ফার্নেস কিম্বন ড্রাইড ও কেমিক্যাল ট্রিটমেন্ট কাঠ গ্যারান্টি' : '100% Kiln-seasoned & CCB treated timber'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#C59B27] flex-shrink-0" />
                  <span>{language === 'bn' ? 'কোনো কৃত্রিম ফিলার, প্লাইউড বা প্লাস্টিক ভিনিয়ার মিশ্রণ নেই' : 'Zero artificial fillers or synthetic veneers'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#C59B27] flex-shrink-0" />
                  <span>{language === 'bn' ? 'সরাসরি কারখানা ও স’মিল সশরীরে পরিদর্শন করার সাদর আমন্ত্রণ' : 'Open factory tours available upon appointment'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="tel:+8801710820987"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2B1A12] hover:bg-[#C59B27] text-white font-bold text-xs sm:text-sm transition-colors shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span className="font-[family-name:var(--font-hind-siliguri)]">{language === 'bn' ? 'কল করুন: ০১৭১০-৮২০৯৮৭' : 'Call: +880 1710-820987'}</span>
                </a>
                <a
                  href="https://wa.me/8801710820987"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-[family-name:var(--font-hind-siliguri)]">{language === 'bn' ? 'হোয়াটসঅ্যাপ মেসেজ' : 'WhatsApp Us'}</span>
                </a>
              </div>
            </div>

            {/* Right Image Feature with Actual Band Saw Slicing */}
            <div 
              className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[#FAF8F5] cursor-pointer group"
              onClick={() => setActivePhotoIdx(2)}
            >
              <Image
                src="/images/factory/factory-bandsaw-cutting.webp"
                alt="ফারহান এন্টারপ্রাইজ স’মিল কাটিং"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
                placeholder="blur"
                blurDataURL={DEFAULT_BLUR_DATA_URL}
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1A12]/80 via-[#2B1A12]/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#E8DED4] shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#2B1A12] block font-[family-name:var(--font-hind-siliguri)]">
                    {language === 'bn' ? 'সরাসরি কারখানায় ব্যান্ড স চেরাই দৃশ্য' : 'Live Sawmill Band Saw Slicing'}
                  </span>
                  <span className="text-[11px] text-[#7A6A5F]">
                    {language === 'bn' ? '১.৫ ইঞ্চি সুনির্দিষ্ট দরজার পাল্লা কাটিং' : 'Precision door frame slicing'}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#C59B27] bg-[#C59B27]/10 px-2.5 py-1 rounded-full border border-[#C59B27]/30">
                  <Eye className="w-3 h-3" />
                  <span>{language === 'bn' ? 'জুম ভিউ' : 'ZOOM'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Real Factory Photo Gallery & Detailed Breakdown */}
        <div className="pt-6 border-t border-[#E8DED4]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C59B27]/10 text-[#C59B27] text-xs font-bold uppercase tracking-wider mb-2 border border-[#C59B27]/25">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-[family-name:var(--font-hind-siliguri)]">{language === 'bn' ? 'বাস্তব কারখানার চিত্রশালা • Authentic Workshop Tour' : 'Live Factory Photo Showcase'}</span>
              </div>
              <h3 className="font-[family-name:var(--font-tiro-bangla)] text-2xl sm:text-3xl font-bold text-[#2B1A12] tracking-tight">
                {language === 'bn' ? 'আমাদের নিজস্ব সমিল ও ওয়ার্কশপের বাস্তব কাজের চিত্র' : 'Live Working Moments from Farhan Enterprise'}
              </h3>
              <p className="font-[family-name:var(--font-hind-siliguri)] text-sm text-[#7A6A5F] mt-1 max-w-2xl">
                {language === 'bn' 
                  ? 'নিচে আমাদের কারখানার প্রতিটি বাস্তব ছবি থেকে দেখে কাঠ প্রসেসিং, চেরাই ও কারিগরদের কাজের বিস্তারিত বিবরণ দেখুন।' 
                  : 'Real photography walkthrough documenting our logs, slicing machines, and craftsmanship.'}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{language === 'bn' ? 'ছবিতে ক্লিক করে ফুল-স্ক্রিনে জুম করে দেখুন' : 'Click photo for fullscreen high-res zoom'}</span>
            </div>
          </div>

          {/* 5-Photo Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {factoryPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E8DED4] hover:border-[#C59B27] transition-all duration-300 flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 shadow-md"
              >
                <div>
                  {/* Photo Frame */}
                  <div 
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF8F5] cursor-pointer"
                    onClick={() => setActivePhotoIdx(idx)}
                  >
                    <Image
                      src={photo.image}
                      alt={language === 'bn' ? photo.titleBn : photo.titleEn}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={DEFAULT_BLUR_DATA_URL}
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Hover Zoom Indicator */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <span className="p-3 rounded-full bg-white/90 text-[#C59B27] border border-[#E8DED4] shadow-xl">
                        <Maximize2 className="w-5 h-5" />
                      </span>
                    </div>

                    {/* Step Tag */}
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-[#2B1A12] border border-[#E8DED4] text-[11px] font-bold shadow-sm font-[family-name:var(--font-hind-siliguri)]">
                        {language === 'bn' ? photo.stepBn : photo.stepEn}
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Deep Details from Photo */}
                  <div className="p-5 sm:p-6">
                    <h4 
                      onClick={() => setActivePhotoIdx(idx)}
                      className="font-[family-name:var(--font-tiro-bangla)] text-base sm:text-lg font-bold text-[#2B1A12] hover:text-[#C59B27] transition-colors mb-2.5 cursor-pointer leading-snug"
                    >
                      {language === 'bn' ? photo.titleBn : photo.titleEn}
                    </h4>
                    
                    <p className="font-[family-name:var(--font-hind-siliguri)] text-xs sm:text-sm text-[#7A6A5F] leading-relaxed mb-4 text-justify">
                      {language === 'bn' ? photo.detailsBn : photo.detailsEn}
                    </p>
                  </div>
                </div>

                {/* Highlight Pills */}
                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#E8DED4]">
                  <div className="flex flex-wrap gap-1.5">
                    {photo.highlights.map((hl, hIdx) => (
                      <span 
                        key={hIdx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F4ECE1] text-[#7A6A5F] border border-[#E8DED4] font-[family-name:var(--font-hind-siliguri)]"
                      >
                        ✓ {hl}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Location & Workshop Address Strip */}
          <div className="mt-12 bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DED4] shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-[#C59B27]/10 border border-[#C59B27]/25 flex items-center justify-center flex-shrink-0 text-[#C59B27]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-[family-name:var(--font-tiro-bangla)] text-base font-bold text-[#2B1A12]">
                  {language === 'bn' ? 'মেসার্স ফারহান এন্টারপ্রাইজ কারখানা লোকেশন' : 'Farhan Enterprise Factory Location'}
                </h4>
                <p className="font-[family-name:var(--font-hind-siliguri)] text-xs sm:text-sm text-[#7A6A5F] mt-0.5">
                  {language === 'bn'
                    ? 'আকিজ কলেজিয়েট স্কুলের পশ্চিম পার্শ্বে, বাদে নাভারন, ঝিকরগাছা, যশোর। সরাসরি কারখানা ভিজিট করে কাঠ পছন্দ করার সুবিধা।'
                    : 'West side of Akij Collegiate School, Bade Nabaran, Jhikargachha, Jashore. Open for client timber inspections.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0 w-full md:w-auto">
              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2B1A12] hover:bg-[#C59B27] text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                <span className="font-[family-name:var(--font-hind-siliguri)]">{language === 'bn' ? 'ফারহান এন্টারপ্রাইজ সম্পর্কে জানুন' : 'About Farhan Enterprise'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="https://wa.me/8801710820987?text=Hello%20Farhan%20Enterprise,%20I%20want%20to%20visit%20the%20sawmill%20factory"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm shadow transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-[family-name:var(--font-hind-siliguri)]">{language === 'bn' ? 'ভিজিট করতে মেসেজ দিন' : 'Plan a Visit'}</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Fullscreen Photo Lightbox Modal for Factory Images */}
      {activePhotoIdx !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fade-in select-none"
          onClick={() => setActivePhotoIdx(null)}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 text-xs font-bold">
                {factoryPhotos[activePhotoIdx].stepBn}
              </span>
              <span className="text-xs text-wood-300">
                {activePhotoIdx + 1} / {factoryPhotos.length}
              </span>
            </div>

            <button
              onClick={() => setActivePhotoIdx(null)}
              className="p-2.5 rounded-xl bg-wood-900/90 hover:bg-wood-800 text-white border border-wood-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Photo in Lightbox */}
          <div 
            className="relative flex-1 max-w-5xl max-h-[70vh] sm:max-h-[75vh] mx-auto w-full flex items-center justify-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={factoryPhotos[activePhotoIdx].image}
              alt={factoryPhotos[activePhotoIdx].titleBn}
              fill
              sizes="100vw"
              quality={92}
              priority
              className="object-contain drop-shadow-2xl"
            />

            {/* Navigation Chevrons */}
            <button
              onClick={() => setActivePhotoIdx((prev) => (prev! - 1 + factoryPhotos.length) % factoryPhotos.length)}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActivePhotoIdx((prev) => (prev! + 1) % factoryPhotos.length)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Description */}
          <div 
            className="max-w-3xl mx-auto w-full text-center z-10 bg-wood-950/80 backdrop-blur-md p-4 rounded-2xl border border-wood-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-base sm:text-lg font-bold text-white mb-1.5">
              {factoryPhotos[activePhotoIdx].titleBn}
            </h4>
            <p className="text-xs sm:text-sm text-wood-300 leading-relaxed max-w-2xl mx-auto">
              {factoryPhotos[activePhotoIdx].detailsBn}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
