import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import { SawmillShowcase } from "@/components/SawmillShowcase";
import { DEFAULT_BLUR_DATA_URL } from "@/lib/image-utils";
import type { Metadata } from "next";
import { 
  TreePine, 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Factory,
  MessageCircle,
  Sparkles
} from "lucide-react";

export const metadata: Metadata = {
  title: "আমাদের পরিচিতি ও কারখানা ঐতিহ্য | মেসার্স ফারহান এন্টারপ্রাইজ / SM Door",
  description: "২৫ বছরেরও বেশি সময় ধরে যশোরের ঐতিহ্যবাহী মেসার্স ফারহান এন্টারপ্রাইজ বিশ্বস্ততার সাথে আসল কাঠের দরজা, সাইজ কাঠ ও ফার্নিচার সরবরাহ করে আসছে। বাদে নাভারন, ঝিকরগাছা, যশোর।",
};

export const revalidate = 0;

export default function AboutPage() {
  const siteSettings = db.getSiteSettings();
  const sawmillServices = db.getSawmillServices();
  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2B1A12]">
      <Header initialSettings={siteSettings} />

      {/* Hero Banner */}
      <section className="bg-white text-[#2B1A12] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E8DED4] text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C59B27]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#C59B27]/10 text-[#C59B27] border border-[#C59B27]/25 mb-4 font-[family-name:var(--font-hind-siliguri)]">
            <TreePine className="w-3.5 h-3.5" />
            <span>আমাদের ঐতিহ্য ও পরিচিতি</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-[family-name:var(--font-tiro-bangla)] text-[#2B1A12] tracking-tight mb-4 leading-tight">
            মেসার্স ফারহান এন্টারপ্রাইজ
            <span className="block text-[#C59B27] text-xl sm:text-3xl mt-2 font-bold font-[family-name:var(--font-hind-siliguri)]">
              খাঁটি কাঠ, আধুনিক স’মিল ও দরজার বিশ্বস্ত কারখানা
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)] leading-relaxed">
            যশোরের ঝিকরগাছায় (বাদে নাভারন) নিজস্ব স’মিল ও সিজনিং প্ল্যান্টের মাধ্যমে সততা ও আভিজাত্যের সাথে ২৫ বছরেরও বেশি সময় ধরে আসল কাঠের নির্ভরযোগ্য সেবা।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <a
              href="#sawmill"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2B1A12] hover:bg-[#C59B27] text-white font-bold text-xs sm:text-sm shadow-md transition-all font-[family-name:var(--font-hind-siliguri)]"
            >
              <Factory className="w-4 h-4" />
              <span>কারখানা ও স’মিল কমপ্লেক্স ট্যুর</span>
            </a>
            <Link
              href="/factory"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F4ECE1] text-[#2B1A12] font-semibold text-xs sm:text-sm border border-[#E8DED4] shadow-sm transition-all font-[family-name:var(--font-hind-siliguri)]"
            >
              <Factory className="w-4 h-4 text-[#C59B27]" />
              <span>ফ্যাক্টরি ও প্ল্যান্ট পেজ</span>
            </Link>
            <Link
              href="/doors"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F4ECE1] text-[#2B1A12] font-semibold text-xs sm:text-sm border border-[#E8DED4] shadow-sm transition-all font-[family-name:var(--font-hind-siliguri)]"
            >
              <span className="font-[family-name:var(--font-hind-siliguri)]">পণ্য ক্যাটালগ দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Story & Authentic Signboard Profile */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left Text */}
          <div className="lg:col-span-7">
            <span className="text-xs font-bold text-[#C59B27] uppercase tracking-widest block mb-2 font-[family-name:var(--font-hind-siliguri)]">
              প্রতিষ্ঠানের পরিচিতি ও মূল দর্শন
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] mb-4 leading-snug">
              কাঠের বিশুদ্ধতা ও আধুনিক কারিগরির নিখুঁত মেলবন্ধন
            </h2>
            
            <div className="space-y-4 text-sm sm:text-base text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)] leading-relaxed">
              <p>
                <strong className="text-[#2B1A12]">মেসার্স ফারহান এন্টারপ্রাইজ</strong> যশোরের ঝিকরগাছা অঞ্চলে কাঠ ও কাঠের তৈরি সামগ্রীর এক শীর্ষস্থানীয় ও অত্যন্ত বিশ্বস্ত প্রতিষ্ঠান। আমাদের প্রধান লক্ষ্য—কোনো প্রকার কৃত্রিম ফিলার বা নকল কাঠ ছাড়াই গ্রাহকের হাতে শতভাগ খাঁটি ও পরিপক্ক কাঠ পৌঁছে দেওয়া।
              </p>
              <p>
                বাজারে কাঁচা ও ভেজাল কাঠের ছড়াছড়ির বিপরীতে, আমরা সরাসরি পার্বত্য চট্টগ্রাম ও স্থানীয় বিশ্বস্ত বাগান থেকে বাছাইকৃত <strong className="text-[#2B1A12]">চিটাগাং সেগুন, সিজনড মেহগনি, গামারি ও শাল কাঠ</strong> নিজস্ব স’মিলে চেরাই করি। পরবর্তীতে বৈজ্ঞানিক ফার্নেস কিম্বন সিজনিং এবং ভ্যাকুয়াম কেমিক্যাল ট্রিটমেন্টের মাধ্যমে কাঠের আর্দ্রতা ১২%–১৪% এ সুনির্দিষ্ট করে কাঠের চিরন্তন স্থায়িত্ব নিশ্চিত করা হয়।
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#E8DED4]">
              <div className="p-4 rounded-2xl bg-white border border-[#E8DED4] shadow-sm">
                <span className="text-2xl sm:text-3xl font-bold text-[#C59B27] font-[family-name:var(--font-tiro-bangla)] block">
                  ২৫+ বছর
                </span>
                <span className="text-xs text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)]">ব্যবসায়িক সুনাম ও ঐতিহ্য</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E8DED4] shadow-sm">
                <span className="text-2xl sm:text-3xl font-bold text-[#C59B27] font-[family-name:var(--font-tiro-bangla)] block">
                  ১০০% খাঁটি
                </span>
                <span className="text-xs text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)]">ট্রিটমেন্ট ও সিজনড কাঠ</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E8DED4] shadow-sm col-span-2 sm:col-span-1">
                <span className="text-2xl sm:text-3xl font-bold text-[#C59B27] font-[family-name:var(--font-tiro-bangla)] block">
                  ১২,০০০+
                </span>
                <span className="text-xs text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)]">সন্তুষ্ট গৃহমালিক ও ক্লায়েন্ট</span>
              </div>
            </div>

            {/* Official Registration & Proprietor Strip */}
            <div className="mt-6 p-5 rounded-2xl bg-white border border-[#E8DED4] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-[family-name:var(--font-hind-siliguri)]">
                <div>
                  <h4 className="text-sm font-bold text-[#2B1A12] flex items-center gap-1.5 font-[family-name:var(--font-tiro-bangla)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>প্রোঃ মোঃ আব্দুছ ছালাম খাঁন</span>
                  </h4>
                  <p className="text-xs text-[#7A6A5F] mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C59B27] flex-shrink-0 mt-0.5" />
                    <span>আকিজ কলেজিয়েট স্কুলের পশ্চিম পার্শ্বে, বাদে নাভারন, ঝিকরগাছা, যশোর।</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:+8801710820987"
                    className="px-4 py-2 rounded-xl bg-[#2B1A12] text-[#C59B27] hover:bg-[#C59B27] hover:text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    ০১৭১০-৮২০৯৮৭
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Real Photo Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E8DED4] aspect-[4/3] bg-[#FAF8F5] group">
              <Image
                src="/images/hero/hero-farhan-signboard.webp"
                alt="মেসার্স ফারহান এন্টারপ্রাইজ অফিস ও সাইনবোর্ড"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                quality={88}
                placeholder="blur"
                blurDataURL={DEFAULT_BLUR_DATA_URL}
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1A12]/80 via-[#2B1A12]/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8DED4] shadow-md">
                <span className="text-xs font-bold text-[#2B1A12] block font-[family-name:var(--font-tiro-bangla)]">
                  মেসার্স ফারহান এন্টারপ্রাইজ
                </span>
                <span className="text-[11px] text-[#7A6A5F] block mt-0.5 font-[family-name:var(--font-hind-siliguri)]">
                  ঝিকরগাছা, যশোর কারখানার প্রবেশদ্বারে স্থাপিত মূল সাইনবোর্ড
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Pillars of Farhan Enterprise */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#C59B27] uppercase tracking-widest block mb-1 font-[family-name:var(--font-hind-siliguri)]">
            গ্রাহক সন্তুষ্টি
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] mb-3">
            কেন মেসার্স ফারহান এন্টারপ্রাইজ নির্বাচন করবেন?
          </h2>
          <p className="text-sm text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)]">
            আমাদের ৪টি মূল অঙ্গীকার যা প্রতিটি গ্রাহককে দেয় শতভাগ মানসিক প্রশান্তি
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          <div className="p-6 rounded-3xl bg-white border border-[#E8DED4] shadow-md text-center hover:border-[#C59B27] transition-all hover:-translate-y-1">
            <Award className="w-8 h-8 text-[#C59B27] mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#2B1A12] mb-2 font-[family-name:var(--font-tiro-bangla)]">১০০% আসল কাঠ</h3>
            <p className="text-xs sm:text-sm text-[#7A6A5F] leading-relaxed font-[family-name:var(--font-hind-siliguri)]">
              সেগুন, মেহগনি বা গামারি—কোনো প্রকার ভেজাল বা কৃত্রিম বোর্ড ছাড়া শতভাগ খাঁটি সলিড কাঠ।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8DED4] shadow-md text-center hover:border-[#C59B27] transition-all hover:-translate-y-1">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#2B1A12] mb-2 font-[family-name:var(--font-tiro-bangla)]">২৫ বছরের সুরক্ষা</h3>
            <p className="text-xs sm:text-sm text-[#7A6A5F] leading-relaxed font-[family-name:var(--font-hind-siliguri)]">
              ঘুণপোকা, উইপোকা বা কাঠের অস্বাভাবিক বাঁকা হওয়া প্রতিরোধে অফিসিয়াল কেমিক্যাল ইমার্সন সুরক্ষা।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8DED4] shadow-md text-center hover:border-[#C59B27] transition-all hover:-translate-y-1">
            <Factory className="w-8 h-8 text-amber-600 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#2B1A12] mb-2 font-[family-name:var(--font-tiro-bangla)]">নিজস্ব স’মিল সুবিধা</h3>
            <p className="text-xs sm:text-sm text-[#7A6A5F] leading-relaxed font-[family-name:var(--font-hind-siliguri)]">
              কোনো মধ্যস্বত্বভোগী ছাড়া সরাসরি কারখানা রেটে সঠিক মাপের চেরা তক্তা ও গোল কাঠের গুঁড়ি।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8DED4] shadow-md text-center hover:border-[#C59B27] transition-all hover:-translate-y-1">
            <HeartHandshake className="w-8 h-8 text-sky-600 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#2B1A12] mb-2 font-[family-name:var(--font-tiro-bangla)]">কাস্টম ডিজাইন অর্ডার</h3>
            <p className="text-xs sm:text-sm text-[#7A6A5F] leading-relaxed font-[family-name:var(--font-hind-siliguri)]">
              গ্রাহকের নিজস্ব ড্রয়িং অনুসারে যেকোনো জটিল ৩ডি নকশা ও কাস্টম সাইজে নিখুঁতভাবে তৈরি।
            </p>
          </div>
        </div>
      </section>

      {/* Embedded State-of-the-Art Sawmill Complex & Real Workshop Gallery */}
      <SawmillShowcase services={sawmillServices} />

      <Footer settings={siteSettings} />
      <BottomNav whatsappNumber={whatsapp} />
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
