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
    <section className="py-16 sm:py-24 bg-white dark:bg-wood-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-gold-700 dark:text-gold-400 text-xs font-bold uppercase tracking-wider mb-3 border border-gold-500/20">
            <Users className="w-3.5 h-3.5" />
            <span>{t.reviews.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-wood-950 dark:text-white tracking-tight mb-4">
            {t.reviews.title}
          </h2>
          <p className="text-sm sm:text-base text-wood-600 dark:text-wood-300">
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
                className="wood-card p-6 sm:p-8 flex flex-col justify-between relative group hover:border-gold-500/80 transition-all"
              >
                <div>
                  <Quote className="w-8 h-8 text-gold-500/20 mb-4" />
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-wood-700 dark:text-wood-300 leading-relaxed italic mb-6">
                    &ldquo;{comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-wood-100 dark:border-wood-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-wood-950 dark:text-white">{author}</h4>
                    <p className="text-xs text-wood-500 dark:text-wood-400">{location}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-wood-100 dark:bg-wood-800 text-wood-700 dark:text-wood-300">
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
