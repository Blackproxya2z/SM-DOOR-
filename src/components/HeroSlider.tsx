'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
    <div className="relative w-full overflow-hidden bg-wood-950 min-h-[580px] lg:min-h-[680px] flex flex-col justify-between">
      {/* Background Image with Parallax-like Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{ backgroundImage: `url('${banner.bgImageUrl}')` }}
      />
      {/* Multi-layered Wood & Dark Gradients for Maximum Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-wood-950 via-wood-950/85 to-wood-950/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-wood-950 via-transparent to-wood-950/40" />

      {/* Decorative Wood Ring Pattern */}
      <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full border border-gold-500/10 pointer-events-none" />
      <div className="absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full border border-gold-500/5 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-300 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm shadow-sm animate-fade-in">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>{badge || t.hero.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.2] sm:leading-[1.15] mb-4 sm:mb-6">
            <span className="block text-wood-100">{t.hero.titleMain}</span>
            <span className="block gold-gradient-text drop-shadow-sm mt-1">
              {title}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-xl text-wood-200/90 leading-relaxed mb-6 sm:mb-8 max-w-2xl font-light">
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href={banner.ctaLink || "#catalog"}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-wood-950 bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 hover:from-gold-300 hover:to-amber-400 shadow-gold transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              <Compass className="w-5 h-5 text-wood-950 flex-shrink-0" />
              <span>{ctaText || t.hero.ctaCatalog}</span>
              <ArrowRight className="w-4 h-4 ml-1 flex-shrink-0" />
            </Link>

            <Link
              href={banner.secondaryCtaLink || "#calculator"}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-wood-100 bg-wood-900/80 hover:bg-wood-850 border border-wood-700 hover:border-gold-500/50 backdrop-blur-md transition-all duration-200 transform hover:-translate-y-0.5 text-center"
            >
              <Calculator className="w-5 h-5 text-gold-400 flex-shrink-0" />
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
                  currentIdx === idx ? 'w-8 bg-gold-400' : 'w-2 bg-wood-700 hover:bg-wood-500'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentIdx((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1))}
              className="p-2 rounded-lg bg-wood-900/60 hover:bg-wood-800 text-wood-200 hover:text-white border border-wood-700/60 transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentIdx((prev) => (prev + 1) % activeBanners.length)}
              className="p-2 rounded-lg bg-wood-900/60 hover:bg-wood-800 text-wood-200 hover:text-white border border-wood-700/60 transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Trust & Feature Stats Bar */}
      <div className="relative z-10 w-full border-t border-wood-800/80 bg-wood-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-0 rounded-xl bg-wood-900/30 sm:bg-transparent">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">{t.hero.statsYears}</p>
                <p className="text-[10px] sm:text-xs text-wood-400 truncate">{language === 'bn' ? 'ঝিকরগাছা, যশোর' : 'Jashore Heritage'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-0 rounded-xl bg-wood-900/30 sm:bg-transparent">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">{t.hero.statsSeasoned}</p>
                <p className="text-[10px] sm:text-xs text-wood-400 truncate">{language === 'bn' ? 'বাঁকা ও ঘুণ মুক্ত নিশ্চয়তা' : 'Anti-Warp & Borer Free'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-0 rounded-xl bg-wood-900/30 sm:bg-transparent">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">{t.hero.statsClients}</p>
                <p className="text-[10px] sm:text-xs text-wood-400 truncate">{language === 'bn' ? 'সারা বাংলাদেশে বিশ্বস্ত' : 'Homes Nationwide'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-0 rounded-xl bg-wood-900/30 sm:bg-transparent">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                <Factory className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">{t.hero.statsSawmill}</p>
                <p className="text-[10px] sm:text-xs text-wood-400 truncate">{language === 'bn' ? '১০০% নিজস্ব উৎপাদন' : 'In-House Quality'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
