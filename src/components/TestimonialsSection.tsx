'use client';

import React from 'react';
import { Review } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Users, Star, CheckCircle, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  reviews: Review[];
}

export function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
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

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => {
            const author = language === 'bn' ? rev.authorNameBn : rev.authorNameEn;
            const location = language === 'bn' ? rev.locationBn : rev.locationEn;
            const comment = language === 'bn' ? rev.commentBn : rev.commentEn;
            const project = language === 'bn' ? rev.projectTypeBn : rev.projectTypeEn;

            return (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative group border border-[#E8DED4] hover:border-[#C59B27] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <Quote className="w-8 h-8 text-[#C59B27]/30 mb-4" />
                  
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
                  <div>
                    <h4 className="font-[family-name:var(--font-tiro-bangla)] text-base font-bold text-[#2B1A12]">{author}</h4>
                    <p className="font-[family-name:var(--font-hind-siliguri)] text-xs text-[#7A6A5F]">{location}</p>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F4ECE1] text-[#7A6A5F] border border-[#E8DED4] font-[family-name:var(--font-hind-siliguri)]">
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
