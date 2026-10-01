'use client';

import React from 'react';
import { SawmillService } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Factory, ShieldCheck, Flame, Cpu, CheckCircle2, Play } from 'lucide-react';

interface SawmillShowcaseProps {
  services: SawmillService[];
}

export function SawmillShowcase({ services }: SawmillShowcaseProps) {
  const { language, t } = useLanguage();

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none" />

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

        {/* Process Flow Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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

        {/* Visual Factory Feature Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-wood-800 bg-wood-900 shadow-2xl">
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
                  ? 'স’মিলের প্রতিটি গোল কাঠের গুঁড়ি অত্যন্ত যত্নের সাথে বাছাই করা হয়। কাটিংয়ের পরপরই আধুনিক চেম্বারে আর্দ্রতা ১২-১৪% এ নিশ্চিত করে তৈরি করা হয় আপনার সাধের বাড়ি ও অফিসের জন্য নিখুঁত কাঠের সামগ্রী।'
                  : 'Every raw timber log is meticulously hand-graded. Following precision band slabbing, computerized steam chambers lock cellular moisture at 12-14%.'}
              </p>

              <div className="space-y-2.5 text-xs text-wood-200">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>{language === 'bn' ? 'চট্টগ্রামের নিজস্ব স’মিল ও প্রসেসিং কমপ্লেক্স' : 'In-house Chittagong sawmill & processing complex'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>{language === 'bn' ? 'কোনো কৃত্রিম কেমিক্যাল বা প্লাস্টিক ভিনিয়ার মিশ্রণ নেই' : 'Zero artificial fillers or synthetic veneers'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>{language === 'bn' ? 'সরাসরি ফ্যাক্টরি পরিদর্শন করার সুব্যবস্থা' : 'Open factory tours available upon appointment'}</span>
                </div>
              </div>
            </div>

            {/* Right Image Feature */}
            <div className="lg:col-span-6 relative aspect-video sm:aspect-[16/10] overflow-hidden bg-wood-950">
              <img
                src="https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=1200&auto=format&fit=crop&q=80"
                alt="Sawmill Complex"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wood-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 bg-wood-950/80 backdrop-blur-md p-3 rounded-xl border border-wood-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-wood-200">
                  {language === 'bn' ? 'এস এম ডোর স’মিল প্রসেসিং ইয়ার্ড' : 'SM Door Sawmill Processing Yard'}
                </span>
                <span className="text-[10px] uppercase font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/30">
                  LIVE YARD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
