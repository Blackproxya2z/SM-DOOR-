'use client';

import React from 'react';
import { Review } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Users, Star, Quote, ShieldCheck, CheckCircle2, Award, ThumbsUp } from 'lucide-react';

interface TestimonialsSectionProps {
  reviews: Review[];
}

export function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C59B27]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C59B27]/10 text-[#C59B27] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C59B27]/25 font-[family-name:var(--font-hind-siliguri)]">
            <Users className="w-3.5 h-3.5" />
            <span>{t.reviews.badge}</span>
          </div>
          <h2 className="font-[family-name:var(--font-tiro-bangla)] text-3xl sm:text-5xl font-bold text-[#2B1A12] tracking-tight mb-4">
            {t.reviews.title}
          </h2>
          <p className="font-[family-name:var(--font-hind-siliguri)] text-base sm:text-lg text-[#7A6A5F] leading-relaxed">
            {t.reviews.subtitle}
          </p>
        </div>

        {/* ─── Social Proof Overall Trust Metric Bar ─── */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-12 border border-[#E8DED4] shadow-md max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-[#E8DED4]">
            <div className="pt-2 md:pt-0">
              <div className="flex items-center justify-center gap-1 text-[#C59B27] mb-1">
                <span className="text-2xl sm:text-3xl font-black font-mono">৪.৯</span>
                <span className="text-xs text-[#7A6A5F]">/ ৫</span>
                <div className="flex text-amber-500 ml-1">
                  {'★★★★★'.split('').map((s, i) => (
                    <span key={i} className="text-xs">{s}</span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-[#7A6A5F] font-semibold font-[family-name:var(--font-hind-siliguri)]">
                {language === 'bn' ? 'গড় গ্রাহক সন্তুষ্টি' : 'Average Rating'}
              </p>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-black text-[#2B1A12] font-mono mb-1">
                {language === 'bn' ? '১,২০০+' : '1,200+'}
              </div>
              <p className="text-[11px] sm:text-xs text-[#7A6A5F] font-semibold font-[family-name:var(--font-hind-siliguri)]">
                {language === 'bn' ? 'সফল প্রজেক্ট ডেলিভারি' : 'Completed Projects'}
              </p>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-black text-[#C59B27] font-mono mb-1">
                {language === 'bn' ? '১০০%' : '100%'}
              </div>
              <p className="text-[11px] sm:text-xs text-[#7A6A5F] font-semibold font-[family-name:var(--font-hind-siliguri)]">
                {language === 'bn' ? 'আসল কাঠ গ্যারান্টি' : 'Genuine Solid Wood'}
              </p>
            </div>

            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-black text-[#2B1A12] font-mono mb-1">
                {language === 'bn' ? '২৫+' : '25+'}
              </div>
              <p className="text-[11px] sm:text-xs text-[#7A6A5F] font-semibold font-[family-name:var(--font-hind-siliguri)]">
                {language === 'bn' ? 'বছরের বিশ্বস্ত সুনাম' : 'Years Experience'}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => {
            const author = language === 'bn' ? rev.authorNameBn : rev.authorNameEn;
            const location = language === 'bn' ? rev.locationBn : rev.locationEn;
            const comment = language === 'bn' ? rev.commentBn : rev.commentEn;
            const project = language === 'bn' ? rev.projectTypeBn : rev.projectTypeEn;
            const initial = author.trim().charAt(0);

            return (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative group border border-[#E8DED4] hover:border-[#C59B27] shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Quote className="w-8 h-8 text-[#C59B27]/25" />
                    
                    {/* Verified Customer Badge */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold font-[family-name:var(--font-hind-siliguri)]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{language === 'bn' ? 'ভেরিফাইড ক্রেতা' : 'Verified Buyer'}</span>
                    </span>
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-[#C59B27] mb-3">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C59B27]" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="font-[family-name:var(--font-hind-siliguri)] text-sm sm:text-base text-[#2B1A12] leading-relaxed italic mb-6">
                    &ldquo;{comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8DED4] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar Circle with Author Initial */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2B1A12] to-[#4A2F20] text-amber-300 flex items-center justify-center font-bold text-sm border-2 border-[#C59B27]/40 shadow-sm flex-shrink-0 font-[family-name:var(--font-tiro-bangla)]">
                      {initial}
                    </div>
                    <div>
                      <h4 className="font-[family-name:var(--font-tiro-bangla)] text-base font-bold text-[#2B1A12]">{author}</h4>
                      <p className="font-[family-name:var(--font-hind-siliguri)] text-xs text-[#7A6A5F]">{location}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F4ECE1] text-[#7A6A5F] border border-[#E8DED4] font-[family-name:var(--font-hind-siliguri)] max-w-[120px] truncate text-center">
                    {project}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
