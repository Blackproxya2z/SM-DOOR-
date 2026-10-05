'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SawmillService, FactoryPhoto } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { DEFAULT_BLUR_DATA_URL } from '@/lib/image-utils';
import { 
  Factory, 
  ShieldCheck, 
  Flame, 
  Cpu, 
  CheckCircle2, 
  Maximize2, 
  X, 
  Sparkles,
  Layers,
  MapPin,
  Clock,
  Eye
} from 'lucide-react';

interface SawmillShowcaseProps {
  services: SawmillService[];
  factoryPhotos?: FactoryPhoto[];
}

const DEFAULT_FACTORY_PHOTOS: FactoryPhoto[] = [
  {
    id: 'fp-1',
    titleBn: 'উন্মুক্ত কাঠ সিজনিং ও চেরা কাঠের সুবিশাল স্টক ইয়ার্ড',
    titleEn: 'Open Air Timber Seasoning & Sawn Wood Inventory Yard',
    tagBn: 'স্টক ইয়ার্ড ও সিজনিং',
    tagEn: 'Stock Yard & Seasoning',
    descriptionBn: 'কারখানার খোলামেলা প্রাঙ্গণে প্রাকৃতিক বাতাস ও রোদে ড্রাইড করার জন্য সুশৃঙ্খলভাবে স্তুপীকৃত চেরা কাঠের তক্তা ও বাটাম। সামনে রয়েছে পরিণত গোল কাঠের বিশাল গুঁড়ি, যা থেকে নিয়মিত মিলে নিখুঁত মাপে সাইজ কাঠ চেরাই করা হয়।',
    descriptionEn: 'Massive stacks of sawn timber planks curing under sun and breeze, alongside mature round logs ready for slabbing.',
    specsBn: '১০০% প্রাকৃতিক এয়ার-ড্রাই ও সিজনিং সুবিধা',
    imageUrl: '/images/factory/factory-timber-yard.webp',
    order: 1
  },
  {
    id: 'fp-2',
    titleBn: 'হেভি-ডিউটি ভার্টিক্যাল ব্যান্ড সমিলে গোল কাঠের গুঁড়ি চেরাই',
    titleEn: 'Heavy-Duty Band Saw Slicing Raw Timber Logs',
    tagBn: 'ব্যান্ড সমিল কাটিং',
    tagEn: 'Bandsaw Milling',
    descriptionBn: 'অভিজ্ঞ স’মিল কারিগরদের সরাসরি তত্ত্বাবধানে বড় আকারের পরিণত গাছের গোল গুঁড়ি নিখুঁত সরলরেখায় চেরাই করা হচ্ছে। তীক্ষ্ণ ব্যান্ড ব্লেড কাঠের আঁশ না ভেঙে নিখুঁত সোজা তক্তা বের করে।',
    descriptionEn: 'Skilled sawmill craftsmen precisely slicing massive tree trunks into straight planks while preserving natural grain alignment.',
    specsBn: 'অভিজ্ঞ কারিগর দ্বারা নিখুঁত স্ট্রেইট কাটিং',
    imageUrl: '/images/factory/factory-log-bandsaw-cutting.webp',
    order: 2
  },
  {
    id: 'fp-3',
    titleBn: '১০০% খাঁটি হার্টউড (মজ্জা) থেকে নিখুঁত মাপে তক্তা তৈরি',
    titleEn: 'Precision Plank Sizing from Mature Heartwood',
    tagBn: 'খাঁটি হার্টউড সাইজিং',
    tagEn: 'Mature Heartwood Sizing',
    descriptionBn: 'সামনে রাখা তাজা চেরাই কাঠের গাঢ় লালচে-কমলা আভা প্রমাণ করে এটি গাছের সবচেয়ে শক্ত ও টেকসই ১০০% খাঁটি হার্টউড (মজ্জা) কাঠ। অভিজ্ঞ কারিগররা নির্দিষ্ট থিকনেসে নিখুঁতভাবে তক্তা সাইজ করছেন।',
    descriptionEn: 'Freshly cut timber displaying rich reddish-orange heartwood, meticulously sized for long-lasting warp-free doors.',
    specsBn: 'ঘুণপোকা ও উইপোকা মুক্ত ১০০% পাকা কাঠ',
    imageUrl: '/images/factory/factory-precision-plank-sizing.webp',
    order: 3
  },
  {
    id: 'fp-4',
    titleBn: 'অটোমেটিক উড সারফেস প্ল্যানার ও থিকনেসার প্রসেসিং',
    titleEn: 'Automated Wood Planing & Thicknessing Unit',
    tagBn: 'প্ল্যানিং ও সারফেস ফিনিশ',
    tagEn: 'Planing & Sizing',
    descriptionBn: 'শিল্পমানের হেভি-ডিউটি সারফেস প্ল্যানার মেশিনের সাহায্যে চেরা কাঠের অসমান খাঁজ ও ঢেউ ছেঁটে একদম মসৃণ ও সমতল করা হচ্ছে। সামনে সাজানো নিখুঁত সোনালী রঙের ফিনিশড তক্তার সারি।',
    descriptionEn: 'Heavy-duty industrial planers smoothing and leveling timber planks into mirror-flat architectural door elements.',
    specsBn: 'লেজার-লেভেল সমতল ফিনিশিং ও নিখুঁত থিকনেস',
    imageUrl: '/images/factory/factory-surface-planer.webp',
    order: 4
  },
  {
    id: 'fp-5',
    titleBn: 'ফারহান এন্টারপ্রাইজের অভ্যন্তরীণ কাটিং ও জয়েন্টারি কারখানা',
    titleEn: 'Interior Woodworking, Sizing & Joinery Complex',
    tagBn: 'কারখানার অভ্যন্তরীণ দৃশ্য',
    tagEn: 'Interior Workshop',
    descriptionBn: 'সুবিশাল ছাউনিযুক্ত কারখানার অভ্যন্তরীণ কাজের দৃশ্য। পর্যাপ্ত বৈদ্যুতিক আলো ও ভেন্টিলেশনে দক্ষ কারিগররা দরজা ও ফার্নিচারের কাঠামো অনুযায়ী গ্রেডিং ও বাছাইকৃত কাঠ সুশৃঙ্খল ব্লকে সাজিয়ে রাখছেন।',
    descriptionEn: 'Spacious high-roof woodworking workshop where seasoned wood is graded and prepared for master architectural joinery.',
    specsBn: 'নিরাপদ কর্মপরিবেশ ও আধুনিক কাটিং প্রযুক্তি',
    imageUrl: '/images/factory/factory-workshop-interior.webp',
    order: 5
  }
];

export function SawmillShowcase({ services, factoryPhotos }: SawmillShowcaseProps) {
  const { language, t } = useLanguage();
  const [activePhoto, setActivePhoto] = useState<FactoryPhoto | null>(null);

  const photos = factoryPhotos && factoryPhotos.length > 0 
    ? factoryPhotos 
    : DEFAULT_FACTORY_PHOTOS;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-6 h-6 text-amber-500" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-emerald-500" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-cyan-500" />;
      default: return <Factory className="w-6 h-6 text-gold-500" />;
    }
  };

  return (
    <section id="sawmill" className="py-16 sm:py-24 bg-wood-950 text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 text-gold-400 text-xs font-bold uppercase tracking-wider mb-3 border border-gold-500/30">
            <Factory className="w-3.5 h-3.5" />
            <span>{t.sawmill.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {t.sawmill.title}
          </h2>
          <p className="text-sm sm:text-base text-wood-300">
            {t.sawmill.subtitle}
          </p>
        </div>

        {/* 4 Process Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((item, idx) => {
            const title = language === 'bn' ? item.titleBn : item.titleEn;
            const desc = language === 'bn' ? item.descriptionBn : item.descriptionEn;
            const highlight = language === 'bn' ? item.highlightBn : item.highlightEn;

            return (
              <div
                key={item.id}
                className="bg-wood-900/80 rounded-2xl p-6 border border-wood-800 hover:border-gold-500/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-wood-950 flex items-center justify-center border border-wood-700/80 shadow-inner group-hover:scale-105 transition-transform">
                      {getIcon(item.icon)}
                    </div>
                    <span className="text-2xl font-black text-wood-700 group-hover:text-gold-500/30 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-wood-300 leading-relaxed mb-4">
                    {desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-wood-800 flex items-center gap-1.5 text-[11px] font-semibold text-gold-400">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Factory Overview Feature Banner with Real Photo */}
        <div className="relative rounded-3xl overflow-hidden border border-wood-800 bg-wood-900 shadow-2xl mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 p-8 sm:p-12">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-gold-400 mb-2">
                {t.sawmill.videoBadge}
              </span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-4">
                {t.sawmill.videoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-wood-300 leading-relaxed mb-6">
                {language === 'bn'
                  ? 'মেসার্স ফারহান এন্টারপ্রাইজের নিজস্ব সমিলে প্রতিটি গোল কাঠের গুঁড়ি অত্যন্ত যত্নের সাথে বাছাই করা হয়। আধুনিক ব্যান্ড-স কাটিং, সারফেস প্ল্যানিং এবং নিয়ন্ত্রিত সিজনিং চেম্বারে আর্দ্রতা ১২-১৪% এ নিশ্চিত করে তৈরি করা হয় আপনার সাধের বাড়ি ও অফিসের জন্য নিখুঁত কাঠের সামগ্রী।'
                  : 'At M/S Farhan Enterprise sawmill, every raw timber log is hand-graded. Following precision band slabbing, computerized drying locks moisture at 12-14%.'}
              </p>

              <div className="space-y-3 text-xs text-wood-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-gold-400 flex-shrink-0" />
                  <span>{language === 'bn' ? 'আকিজ কলেজিয়েট স্কুলের পশ্চিম পার্শ্বে, বাদে নাভারন, ঝিকরগাছা, যশোর' : 'West of Akij Collegiate School, Bade Nabaran, Jhikargachha, Jashore'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-gold-400 flex-shrink-0" />
                  <span>{language === 'bn' ? '১০০% খাঁটি পরিপক্ক কাঠের গ্যারান্টি (কোনো কৃত্রিম ভিনিয়ার বা প্লাইউড নয়)' : '100% genuine mature solid timber (zero synthetic veneer or plywood)'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-gold-400 flex-shrink-0" />
                  <span>{language === 'bn' ? 'সরাসরি সমিল ও কারখানা পরিদর্শন করার সুব্যবস্থা' : 'Open factory and sawmill inspection welcome on appointment'}</span>
                </div>
              </div>
            </div>

            {/* Right Image Feature with Real Timber Yard Photo */}
            <div 
              className="lg:col-span-6 relative aspect-video sm:aspect-[16/10] overflow-hidden bg-wood-950 cursor-pointer group"
              onClick={() => setActivePhoto(photos[0])}
            >
              <Image
                src="/images/factory/factory-timber-yard.webp"
                alt="ফারহান এন্টারপ্রাইজ সমিল ইয়ার্ড"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={DEFAULT_BLUR_DATA_URL}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wood-950/90 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 bg-wood-950/85 backdrop-blur-md p-3.5 rounded-xl border border-wood-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {language === 'bn' ? 'ফারহান এন্টারপ্রাইজ - সমিল ও সিজনিং ইয়ার্ড' : 'Farhan Enterprise - Sawmill & Seasoning Yard'}
                  </span>
                  <span className="text-[11px] text-wood-400">
                    {language === 'bn' ? 'সরাসরি কারখানার বাস্তব দৃশ্য' : 'Live factory photograph'}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-gold-400 bg-gold-500/15 px-2.5 py-1 rounded-md border border-gold-500/30 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{language === 'bn' ? 'বড় করে দেখুন' : 'Zoom'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DEDICATED REAL FACTORY & WORKSHOP GALLERY SECTION (5 PHOTOS)   */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-8 border-t border-wood-800/80">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold uppercase tracking-wider mb-3 border border-gold-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'সরাসরি বাস্তব চিত্র ও প্রসেসিং গ্যালারি' : 'Live Factory Tour & Real Process Gallery'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              {language === 'bn' 
                ? 'কারখানা ও সমিল প্রাঙ্গণ — বাস্তব ছবির বিস্তারিত বিবরণ' 
                : 'Behind the Scenes — Real Factory Equipment & Processing'}
            </h3>
            <p className="text-xs sm:text-sm text-wood-300 max-w-2xl mx-auto leading-relaxed">
              {language === 'bn'
                ? 'আমাদের কারখানার প্রতিটি ধাপের সরাসরি বাস্তব ছবি এবং কাজের পুঙ্খানুপুঙ্খ বিবরণ নিচে তুলে ধরা হলো। প্রতিটি ছবিতে ক্লিক করে ফুল-স্ক্রিনে বড় করে দেখতে পারেন।'
                : 'Explore real unedited photographs directly from our sawmill workshop floor detailing every step of timber preparation.'}
            </p>
          </div>

          {/* TOP ROW: 2 FEATURED LARGE CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
            {photos.slice(0, 2).map((photo) => (
              <div
                key={photo.id}
                className="group bg-wood-900/90 rounded-2xl overflow-hidden border border-wood-800 hover:border-gold-500/70 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                {/* Photo Header */}
                <div 
                  className="relative aspect-[16/10] w-full overflow-hidden bg-wood-950 cursor-pointer"
                  onClick={() => setActivePhoto(photo)}
                >
                  <Image
                    src={photo.imageUrl}
                    alt={photo.titleBn}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={DEFAULT_BLUR_DATA_URL}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wood-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                    <span className="text-xs text-white font-semibold flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                      <Maximize2 className="w-3.5 h-3.5 text-gold-400" />
                      <span>{language === 'bn' ? 'ফুল-স্ক্রিন ভিউ ও জুম' : 'Full Screen View'}</span>
                    </span>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-wood-950/90 backdrop-blur-md text-gold-400 text-xs font-bold px-3 py-1 rounded-full border border-gold-500/30 shadow">
                      {language === 'bn' ? photo.tagBn : photo.tagEn}
                    </span>
                  </div>
                </div>

                {/* Content & Detailed Observations */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white mb-2.5 group-hover:text-gold-400 transition-colors">
                      {language === 'bn' ? photo.titleBn : photo.titleEn}
                    </h4>

                    {/* Detailed Visual Inspection Description */}
                    <div className="bg-wood-950/60 rounded-xl p-3.5 border border-wood-800/80 mb-4">
                      <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider block mb-1">
                        {language === 'bn' ? 'ছবি থেকে বাস্তব দৃশ্য ও বিবরণ:' : 'Visual Details Observed in Photo:'}
                      </span>
                      <p className="text-xs text-wood-200 leading-relaxed font-light">
                        {language === 'bn' ? photo.descriptionBn : photo.descriptionEn}
                      </p>
                    </div>
                  </div>

                  {/* Footer Highlight */}
                  <div className="pt-3 border-t border-wood-800 flex items-center justify-between text-xs">
                    <span className="text-gold-300 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{photo.specsBn}</span>
                    </span>
                    <button
                      onClick={() => setActivePhoto(photo)}
                      className="text-wood-400 hover:text-white font-semibold transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-gold-400" />
                      <span>{language === 'bn' ? 'দেখুন' : 'View'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM ROW: 3 COMPACT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {photos.slice(2, 5).map((photo) => (
              <div
                key={photo.id}
                className="group bg-wood-900/90 rounded-2xl overflow-hidden border border-wood-800 hover:border-gold-500/70 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                {/* Photo Header */}
                <div 
                  className="relative aspect-[4/3] w-full overflow-hidden bg-wood-950 cursor-pointer"
                  onClick={() => setActivePhoto(photo)}
                >
                  <Image
                    src={photo.imageUrl}
                    alt={photo.titleBn}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={DEFAULT_BLUR_DATA_URL}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wood-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3.5">
                    <span className="text-[11px] text-white font-semibold flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                      <Maximize2 className="w-3 h-3 text-gold-400" />
                      <span>{language === 'bn' ? 'জুম করুন' : 'Zoom'}</span>
                    </span>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-wood-950/90 backdrop-blur-md text-gold-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-gold-500/30 shadow">
                      {language === 'bn' ? photo.tagBn : photo.tagEn}
                    </span>
                  </div>
                </div>

                {/* Content & Detailed Observations */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-2 group-hover:text-gold-400 transition-colors line-clamp-2">
                      {language === 'bn' ? photo.titleBn : photo.titleEn}
                    </h4>

                    {/* Detailed Visual Inspection Description */}
                    <div className="bg-wood-950/60 rounded-xl p-3 border border-wood-800/80 mb-3">
                      <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block mb-1">
                        {language === 'bn' ? 'ছবি থেকে দৃশ্য বিবরণ:' : 'Details:'}
                      </span>
                      <p className="text-[11px] text-wood-300 leading-relaxed font-light line-clamp-4">
                        {language === 'bn' ? photo.descriptionBn : photo.descriptionEn}
                      </p>
                    </div>
                  </div>

                  {/* Footer Highlight */}
                  <div className="pt-2.5 border-t border-wood-800 flex items-center justify-between text-[11px]">
                    <span className="text-gold-300 font-medium flex items-center gap-1 truncate pr-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{photo.specsBn}</span>
                    </span>
                    <button
                      onClick={() => setActivePhoto(photo)}
                      className="text-wood-400 hover:text-white font-semibold transition-colors flex items-center gap-1 flex-shrink-0"
                    >
                      <Eye className="w-3 h-3 text-gold-400" />
                      <span>{language === 'bn' ? 'ভিউ' : 'View'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between max-w-5xl mx-auto w-full pb-3 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 text-xs font-bold">
                {language === 'bn' ? activePhoto.tagBn : activePhoto.tagEn}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
                {language === 'bn' ? activePhoto.titleBn : activePhoto.titleEn}
              </h3>
            </div>
            <button
              onClick={() => setActivePhoto(null)}
              className="p-2 rounded-xl bg-wood-900 hover:bg-wood-800 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Large Image Frame */}
          <div 
            className="relative flex-1 max-w-5xl w-full mx-auto my-3 sm:my-4 flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-h-[70vh]">
              <Image
                src={activePhoto.imageUrl}
                alt={activePhoto.titleBn}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* Bottom Description Card */}
          <div 
            className="max-w-5xl mx-auto w-full bg-wood-900/90 rounded-2xl p-4 sm:p-5 border border-wood-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider block mb-1">
                  {language === 'bn' ? 'ছবি থেকে বিস্তারিত বিশ্লেষণ ও কাজের বিবরণ:' : 'Visual Analysis & Workshop Details:'}
                </span>
                <p className="text-xs sm:text-sm text-wood-200 leading-relaxed font-light">
                  {language === 'bn' ? activePhoto.descriptionBn : activePhoto.descriptionEn}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span>{activePhoto.specsBn}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
