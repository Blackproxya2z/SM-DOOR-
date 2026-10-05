'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroBanner } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Factory, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Calculator,
  Compass
} from 'lucide-react';

interface HeroSliderProps {
  banners: HeroBanner[];
}

export function HeroSlider({ banners }: HeroSliderProps) {
  const { language, t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);

  const activeBanners = banners && banners.length > 0 
    ? banners.filter(b => b.isActive) 
    : [];

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeBanners.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const banner = activeBanners[currentIdx] || activeBanners[0];
  const title = language === 'bn' ? banner.titleBn : banner.titleEn;
  const subtitle = language === 'bn' ? banner.subtitleBn : banner.subtitleEn;
  const tag = language === 'bn' ? banner.tagBn : banner.tagEn;
  const badge = language === 'bn' ? banner.badgeBn : banner.badgeEn;
  const ctaText = language === 'bn' ? banner.ctaTextBn : banner.ctaTextEn;
  const secondaryCtaText = language === 'bn' ? banner.secondaryCtaTextBn : banner.secondaryCtaTextEn;

  return (
    <div className="relative w-full overflow-hidden bg-[#FAF8F5] min-h-[580px] lg:min-h-[680px] flex flex-col justify-between">
      {/* High-Performance Hero Banner Image: Desktop 16:9 full-width, Mobile portrait/square crop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {banner.mobileBgImageUrl ? (
          <>
            {/* Mobile View: Portrait / Square Crop */}
            <div className="block sm:hidden relative w-full h-full">
              <Image
                src={banner.mobileBgImageUrl}
                alt={title || "SM Door Luxury Timber and Solid Doors"}
                fill
                priority={currentIdx === 0}
                sizes="100vw"
                quality={85}
                className="object-cover object-center transition-transform duration-1000 scale-105"
              />
            </div>
            {/* Desktop View: Full-width 16:9 aspect ratio */}
            <div className="hidden sm:block relative w-full h-full">
              <Image
                src={banner.bgImageUrl}
                alt={title || "SM Door Luxury Timber and Solid Doors"}
                fill
                priority={currentIdx === 0}
                sizes="100vw"
                quality={85}
                className="object-cover object-center transition-transform duration-1000 scale-105"
              />
            </div>
          </>
        ) : (
          <Image
            src={banner.bgImageUrl}
            alt={title || "SM Door Luxury Timber and Solid Doors"}
            fill
            priority={currentIdx === 0}
            sizes="100vw"
            quality={85}
            className="object-cover object-center transition-transform duration-1000 scale-105"
          />
        )}
      </div>
      {/* Soft Light Premium Gradients for Maximum Contrast with Dark Brown Typography */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/98 via-[#FAF8F5]/85 to-[#FAF8F5]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-[#FAF8F5]/30" />

      {/* Decorative Wood Ring Pattern */}
      <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full border border-[#C59B27]/15 pointer-events-none" />
      <div className="absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full border border-[#C59B27]/10 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C59B27]/10 text-[#C59B27] rounded-full text-xs sm:text-sm font-semibold border border-[#C59B27]/30 mb-6 backdrop-blur-sm shadow-sm animate-fade-in">
            <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
            <span>{badge || (language === 'bn' ? '২৫+ বছরের বিশ্বস্ত ঐতিহ্য' : '25+ Years of Trusted Heritage')}</span>
          </div>

          {/* Main Headline - Tiro Bangla */}
          <h1 className="font-[family-name:var(--font-tiro-bangla)] text-3xl sm:text-5xl lg:text-7xl font-bold text-[#2B1A12] leading-[1.2] sm:leading-tight mb-2">
            {language === 'bn' ? (
              <>
                কাঠের শিল্পে গড়া<br />
                আপনার স্বপ্নের ঘর
              </>
            ) : (
              <>
                Crafted in Solid Timber<br />
                Your Dream Living Space
              </>
            )}
          </h1>

          {/* Business Name - Tiro Bangla Gold */}
          <p className="font-[family-name:var(--font-tiro-bangla)] text-2xl sm:text-3xl text-[#C59B27] font-semibold mt-1">
            {language === 'bn' ? 'মেসার্স ফারহান এন্টারপ্রাইজ' : 'M/S Farhan Enterprise'}
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center gap-4 my-5 max-w-md">
            <div className="h-px flex-1 bg-[#C59B27]/30"></div>
            <span className="text-[#C59B27] text-base">❖</span>
            <div className="h-px flex-1 bg-[#C59B27]/30"></div>
          </div>

          {/* Subtitle - Hind Siliguri */}
          <p className="font-[family-name:var(--font-hind-siliguri)] text-base sm:text-lg text-[#7A6A5F] leading-relaxed mb-8 max-w-2xl font-normal">
            {language === 'bn' 
              ? 'যশোরের সেরা কাঠ, দরজা ও ফার্নিচার। ট্রিটমেন্ট কাঠে তৈরি টেকসই ও মজবুত সামগ্রী।' 
              : (subtitle || 'Premium seasoned wooden doors, timber logs and custom handcrafted furniture.')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href={banner.ctaLink || "#catalog"}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-[#2B1A12] hover:bg-[#C59B27] shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 text-center"
            >
              <Compass className="w-5 h-5 text-[#C59B27] group-hover:text-white flex-shrink-0" />
              <span>{ctaText || t.hero.ctaCatalog}</span>
              <ArrowRight className="w-4 h-4 ml-1 flex-shrink-0" />
            </Link>

            <Link
              href={banner.secondaryCtaLink || "#calculator"}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base border-2 border-[#C59B27] text-[#C59B27] hover:bg-[#C59B27] hover:text-white bg-white/70 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 text-center"
            >
              <Calculator className="w-5 h-5 flex-shrink-0" />
              <span>{secondaryCtaText || t.hero.ctaCalculator}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      {activeBanners.length > 1 && (
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIdx === idx ? 'w-8 bg-[#C59B27]' : 'w-2 bg-[#E8DED4] hover:bg-[#C59B27]/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentIdx((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1))}
              className="p-2 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#2B1A12] border border-[#E8DED4] shadow-sm transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentIdx((prev) => (prev + 1) % activeBanners.length)}
              className="p-2 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#2B1A12] border border-[#E8DED4] shadow-sm transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Trust & Feature Stats Bar */}
      <div className="relative z-10 w-full border-t border-[#E8DED4] bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-[#FAF8F5] border border-[#E8DED4] shadow-sm">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#C59B27]/10 border border-[#C59B27]/30 flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#C59B27]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-[#2B1A12] tracking-wide truncate">{t.hero.statsYears}</p>
                <p className="text-[10px] sm:text-xs text-[#7A6A5F] truncate">{language === 'bn' ? 'ঝিকরগাছা, যশোর' : 'Jashore Heritage'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-[#FAF8F5] border border-[#E8DED4] shadow-sm">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#C59B27]/10 border border-[#C59B27]/30 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#C59B27]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-[#2B1A12] tracking-wide truncate">{t.hero.statsSeasoned}</p>
                <p className="text-[10px] sm:text-xs text-[#7A6A5F] truncate">{language === 'bn' ? 'বাঁকা ও ঘুণ মুক্ত নিশ্চয়তা' : 'Anti-Warp & Borer Free'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-[#FAF8F5] border border-[#E8DED4] shadow-sm">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#C59B27]/10 border border-[#C59B27]/30 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#C59B27]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-[#2B1A12] tracking-wide truncate">{t.hero.statsClients}</p>
                <p className="text-[10px] sm:text-xs text-[#7A6A5F] truncate">{language === 'bn' ? 'সারা বাংলাদেশে বিশ্বস্ত' : 'Homes Nationwide'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-[#FAF8F5] border border-[#E8DED4] shadow-sm">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#C59B27]/10 border border-[#C59B27]/30 flex items-center justify-center flex-shrink-0">
                <Factory className="w-4 h-4 sm:w-5 sm:h-5 text-[#C59B27]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-[#2B1A12] tracking-wide truncate">{t.hero.statsSawmill}</p>
                <p className="text-[10px] sm:text-xs text-[#7A6A5F] truncate">{language === 'bn' ? '১০০% নিজস্ব উৎপাদন' : 'In-House Quality'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
