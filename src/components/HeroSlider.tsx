'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroBanner } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Phone, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Award,
  ShieldCheck,
  Users,
  Factory
} from 'lucide-react';

interface HeroSliderProps {
  banners?: HeroBanner[];
  phone?: string;
  whatsappNumber?: string;
}

export function HeroSlider({ 
  banners = [], 
  phone = "+880 1710-820987", 
  whatsappNumber = "+8801710820987" 
}: HeroSliderProps) {
  const { language } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 400, y: 300 });

  // Default authentic images list
  const defaultImages = [
    {
      src: '/images/hero/hero-sawmill-yard.webp',
      alt: 'মেসার্স ফারহান এন্টারপ্রাইজ স’মিল ইয়ার্ড',
      badge: '🌳 ১০০% প্রাকৃতিক কাঠ',
    },
    {
      src: '/images/hero/hero-timber-logs.webp',
      alt: 'বাছাইকৃত সিজনড গোল কাঠ ও গুঁড়ি',
      badge: '🪵 প্রিমিয়াম রাউন্ড লগ',
    },
    {
      src: '/images/hero/hero-farhan-signboard.webp',
      alt: 'মেসার্স ফারহান এন্টারপ্রাইজ সাইনবোর্ড ও শোরুম',
      badge: '🏛️ ২৫+ বছরের ঐতিহ্য',
    },
  ];

  const activeBanners = banners && banners.length > 0 ? banners.filter(b => b.isActive) : [];
  const totalSlides = activeBanners.length > 0 ? activeBanners.length : defaultImages.length;

  // Auto slide interval (8 seconds)
  useEffect(() => {
    if (totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % totalSlides);
    }, 8000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  // Subtle Scroll Parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Subtle Mouse-follow Ambient Glow
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  const currentImageSrc = activeBanners.length > 0
    ? (activeBanners[currentIdx]?.bgImageUrl || defaultImages[0].src)
    : defaultImages[currentIdx]?.src;

  const currentBadgeText = defaultImages[currentIdx % defaultImages.length]?.badge;

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden bg-[#FAF8F5] pt-6 sm:pt-10 lg:pt-16 pb-12 sm:pb-16 lg:pb-24 border-b border-[#E8DED4]"
    >
      {/* ─── Ambient Glow & Decorative Parallax Elements ─── */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-40 transition-opacity duration-500 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(197, 155, 39, 0.12), transparent 80%)`,
        }}
      />

      {/* Floating Decorative Rings with Parallax */}
      <div 
        style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        className="absolute top-12 left-10 w-72 h-72 rounded-full border border-[#C59B27]/10 pointer-events-none animate-float hidden lg:block"
      />
      <div 
        style={{ transform: `translateY(${scrollY * 0.12}px)` }}
        className="absolute top-1/2 right-12 w-96 h-96 rounded-full border border-[#C59B27]/15 pointer-events-none animate-pulse-slow hidden lg:block"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* ─── LEFT COLUMN (50% on Desktop / 7 Cols) ─── */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* 1. Top Heritage Badge */}
            <div className="flex items-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C59B27]/15 via-[#C59B27]/10 to-transparent border border-[#C59B27]/25 rounded-full text-xs sm:text-sm font-semibold text-[#C59B27] animate-fade-in-down shadow-sm font-[family-name:var(--font-hind-siliguri)]">
                <span className="text-amber-500">✦</span>
                <span>{language === 'bn' ? '২৫+ বছরের বিশ্বস্ত ঐতিহ্য' : '25+ Years of Trusted Heritage'}</span>
              </span>
            </div>

            {/* 2. Main Headline - Tiro Bangla */}
            <h1 className="mt-5 font-[family-name:var(--font-tiro-bangla)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#2B1A12] leading-[1.12] sm:leading-[1.1] animate-fade-in-up delay-100">
              {language === 'bn' ? (
                <>
                  কাঠের শিল্পে গড়া
                  <span className="block mt-2">
                    আপনার <span className="bg-gradient-to-r from-[#C59B27] via-[#D8AE3A] to-[#B58E26] bg-clip-text text-transparent">স্বপ্নের ঘর</span>
                  </span>
                </>
              ) : (
                <>
                  Crafted in Solid Timber
                  <span className="block mt-2">
                    Your <span className="bg-gradient-to-r from-[#C59B27] via-[#D8AE3A] to-[#B58E26] bg-clip-text text-transparent">Dream Living Space</span>
                  </span>
                </>
              )}
            </h1>

            {/* 3. Decorative Divider with Rotating ❖ */}
            <div className="flex items-center gap-4 my-6 max-w-lg animate-fade-in delay-200">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C59B27]/30 to-transparent" />
              <span className="text-[#C59B27] text-xl animate-spin-slow inline-block select-none">❖</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C59B27]/30 to-transparent" />
            </div>

            {/* 4. Business Name - Tiro Bangla Gold */}
            <p className="font-[family-name:var(--font-tiro-bangla)] text-2xl sm:text-3xl text-[#C59B27] font-semibold animate-fade-in-up delay-300">
              {language === 'bn' ? 'মেসার্স ফারহান এন্টারপ্রাইজ' : 'M/S Farhan Enterprise'}
            </p>

            {/* 5. Subtitle - Hind Siliguri */}
            <p className="font-[family-name:var(--font-hind-siliguri)] text-base sm:text-lg text-[#7A6A5F] leading-relaxed mt-3 max-w-xl animate-fade-in-up delay-400 font-normal">
              {language === 'bn' ? (
                <>
                  যশোরের সেরা কাঠ, দরজা ও ফার্নিচার।<br className="hidden sm:inline" />
                  ট্রিটমেন্ট কাঠে তৈরি টেকসই ও মজবুত সামগ্রী।
                </>
              ) : (
                <>
                  Jashore&apos;s premier timber mill, solid doors and custom architectural furniture.<br className="hidden sm:inline" />
                  Built with kiln-seasoned hardwood for lifelong durability.
                </>
              )}
            </p>

            {/* 6. CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 mt-8 animate-fade-in-up delay-500 font-[family-name:var(--font-hind-siliguri)]">
              {/* Primary: Direct Call */}
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-[#2B1A12] hover:bg-[#C59B27] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 text-center"
              >
                <Phone className="w-5 h-5 text-[#C59B27]" />
                <span>{language === 'bn' ? '📞 সরাসরি কল করুন' : '📞 Call Directly'}</span>
              </a>

              {/* Secondary: WhatsApp Message */}
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  language === 'bn'
                    ? 'আসসালামু আলাইকুম, আমি সরাসরি মেসার্স ফারহান এন্টারপ্রাইজ-এর কাঠের দরজা ও স’মিল সম্পর্কে জানতে আগ্রহী।'
                    : 'Hello, I want to inquire about solid wooden doors and timber logs from M/S Farhan Enterprise.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm sm:text-base border-2 border-[#C59B27] text-[#C59B27] hover:bg-[#C59B27] hover:text-white bg-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 text-center"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{language === 'bn' ? '💬 WhatsApp মেসেজ' : '💬 WhatsApp Us'}</span>
              </a>
            </div>

            {/* 7. Trust Badges Pill Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-[#E8DED4] text-xs sm:text-sm font-semibold text-[#7A6A5F] animate-fade-in-up delay-600 font-[family-name:var(--font-hind-siliguri)]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C59B27] flex-shrink-0" />
                <span>{language === 'bn' ? 'ট্রিটমেন্ট কাঠ' : 'Kiln-Seasoned'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C59B27] flex-shrink-0" />
                <span>{language === 'bn' ? 'কাস্টম ডিজাইন' : 'Custom Carving'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C59B27] flex-shrink-0" />
                <span>{language === 'bn' ? 'হোম ডেলিভারি' : 'Nationwide Delivery'}</span>
              </span>
            </div>
          </div>

          {/* ─── RIGHT COLUMN (50% on Desktop / 5 Cols) ─── */}
          <div className="lg:col-span-5 relative w-full">
            <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-[#E8DED4] group bg-[#F4ECE1] animate-fade-in-right delay-200">
              
              {/* Authentic Photo with Smooth Scale on Hover */}
              <Image
                src={currentImageSrc}
                alt="মেসার্স ফারহান এন্টারপ্রাইজ স’মিল ইয়ার্ড"
                fill
                priority
                quality={90}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center transition-all duration-700 group-hover:scale-105"
              />

              {/* Gradient Scrim for Top & Bottom Elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1A12]/80 via-black/15 to-black/30 pointer-events-none" />

              {/* Top Right Floating Badge (Bouncing) */}
              <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-full shadow-xl border border-[#E8DED4] animate-bounce-slow text-xs sm:text-sm font-bold text-[#2B1A12] flex items-center gap-1.5 z-20 font-[family-name:var(--font-hind-siliguri)]">
                <span>{currentBadgeText}</span>
              </div>

              {/* Top Left Seasoned Badge */}
              <div className="absolute top-5 left-5 bg-[#2B1A12]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-[#C59B27]/40 text-[11px] sm:text-xs font-bold text-[#C59B27] flex items-center gap-1.5 z-20 font-[family-name:var(--font-hind-siliguri)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ফার্নেস কিম্বন সিজনিং' : 'Kiln Dried'}</span>
              </div>

              {/* Slider Dots Indicator (if multiple slides) */}
              {totalSlides > 1 && (
                <div className="absolute top-16 left-5 z-20 flex items-center gap-1.5">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentIdx === idx ? 'w-6 bg-[#C59B27]' : 'w-2 bg-white/60 hover:bg-white'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Next/Prev Small Controls */}
              {totalSlides > 1 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setCurrentIdx((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))}
                    className="p-2 rounded-full bg-white/90 hover:bg-white text-[#2B1A12] shadow-md transition-transform hover:scale-110 active:scale-95"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentIdx((prev) => (prev + 1) % totalSlides)}
                    className="p-2 rounded-full bg-white/90 hover:bg-white text-[#2B1A12] shadow-md transition-transform hover:scale-110 active:scale-95"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Bottom Floating Stats Card (Slide-up) */}
              <div className="absolute bottom-5 left-4 right-4 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-[#E8DED4] animate-slide-up delay-300 z-20 font-[family-name:var(--font-hind-siliguri)]">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#2B1A12] font-serif">২৫+</div>
                    <div className="text-[11px] sm:text-xs text-[#7A6A5F] mt-0.5 font-medium">
                      {language === 'bn' ? 'বছরের অভিজ্ঞতা' : 'Years Experience'}
                    </div>
                  </div>
                  <div className="border-x border-[#E8DED4]">
                    <div className="text-xl sm:text-2xl font-extrabold text-[#C59B27] font-serif">১২K+</div>
                    <div className="text-[11px] sm:text-xs text-[#7A6A5F] mt-0.5 font-medium">
                      {language === 'bn' ? 'সন্তুষ্ট ক্লায়েন্ট' : 'Happy Clients'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#2B1A12] font-serif">১০০%</div>
                    <div className="text-[11px] sm:text-xs text-[#7A6A5F] mt-0.5 font-medium">
                      {language === 'bn' ? 'আসল কাঠ' : 'Authentic Wood'}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ─── Bottom Trust & Features Strip ─── */}
      <div className="relative z-10 w-full mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-[#E8DED4] bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 font-[family-name:var(--font-hind-siliguri)]">
            
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8DED4] shadow-sm hover:border-[#C59B27] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#C59B27]/10 border border-[#C59B27]/30 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-[#C59B27]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-[#2B1A12] truncate">
                  {language === 'bn' ? '২৫+ বছরের গৌরব' : '25+ Years Legacy'}
                </p>
                <p className="text-[11px] sm:text-xs text-[#7A6A5F] truncate">
                  {language === 'bn' ? 'ঝিকরগাছা, যশোর' : 'Jhikargacha, Jashore'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8DED4] shadow-sm hover:border-[#C59B27] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#C59B27]/10 border border-[#C59B27]/30 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#C59B27]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-[#2B1A12] truncate">
                  {language === 'bn' ? 'ঘুণ ও বাঁকা মুক্ত' : 'Anti-Warp Guarantee'}
                </p>
                <p className="text-[11px] sm:text-xs text-[#7A6A5F] truncate">
                  {language === 'bn' ? 'সিজনিং চেম্বার প্রসেস' : 'Kiln Seasoned'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8DED4] shadow-sm hover:border-[#C59B27] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#C59B27]/10 border border-[#C59B27]/30 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-[#C59B27]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-[#2B1A12] truncate">
                  {language === 'bn' ? '১২,০০০+ সন্তুষ্ট ক্রেতা' : '12,000+ Happy Homes'}
                </p>
                <p className="text-[11px] sm:text-xs text-[#7A6A5F] truncate">
                  {language === 'bn' ? 'সারা দেশে সাপ্লাই' : 'Nationwide Trust'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8DED4] shadow-sm hover:border-[#C59B27] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#C59B27]/10 border border-[#C59B27]/30 flex items-center justify-center flex-shrink-0">
                <Factory className="w-5 h-5 text-[#C59B27]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-[#2B1A12] truncate">
                  {language === 'bn' ? 'নিজস্ব আধুনিক স’মিল' : 'In-House Sawmill'}
                </p>
                <p className="text-[11px] sm:text-xs text-[#7A6A5F] truncate">
                  {language === 'bn' ? 'সরাসরি কারখানার দর' : 'Direct Factory Rates'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
