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
    <main className="min-h-screen flex flex-col bg-wood-50/40 dark:bg-wood-950">
      <Header initialSettings={siteSettings} />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-wood-950 via-wood-900 to-wood-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-wood-800 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-4 backdrop-blur-sm">
            <TreePine className="w-3.5 h-3.5" />
            <span>আমাদের ঐতিহ্য ও পরিচিতি</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight mb-4 leading-tight">
            মেসার্স ফারহান এন্টারপ্রাইজ
            <span className="block text-gold-400 text-xl sm:text-3xl mt-2 font-sans font-bold">
              খাঁটি কাঠ, আধুনিক স’মিল ও দরজার বিশ্বস্ত কারখানা
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-wood-300 leading-relaxed font-light">
            যশোরের ঝিকরগাছায় (বাদে নাভারন) নিজস্ব স’মিল ও সিজনিং প্ল্যান্টের মাধ্যমে সততা ও আভিজাত্যের সাথে ২৫ বছরেরও বেশি সময় ধরে আসল কাঠের নির্ভরযোগ্য সেবা।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <a
              href="#sawmill"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-wood-950 font-bold text-xs sm:text-sm shadow-gold transition-all"
            >
              <Factory className="w-4 h-4" />
              <span>কারখানা ও স’মিল কমপ্লেক্স ট্যুর</span>
            </a>
            <Link
              href="/factory"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-wood-900/80 hover:bg-wood-850 text-white font-semibold text-xs sm:text-sm border border-wood-700 transition-all"
            >
              <Factory className="w-4 h-4 text-gold-400" />
              <span>ফ্যাক্টরি ও প্ল্যান্ট পেজ</span>
            </Link>
            <Link
              href="/doors"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-wood-900/80 hover:bg-wood-850 text-white font-semibold text-xs sm:text-sm border border-wood-700 transition-all"
            >
              <span>পণ্য ক্যাটালগ দেখুন</span>
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
            <span className="text-xs font-bold text-gold-600 dark:text-gold-400 uppercase tracking-widest block mb-2">
              প্রতিষ্ঠানের পরিচিতি ও মূল দর্শন
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-wood-950 dark:text-white font-serif mb-4 leading-snug">
              কাঠের বিশুদ্ধতা ও আধুনিক কারিগরির নিখুঁত মেলবন্ধন
            </h2>
            
            <div className="space-y-4 text-xs sm:text-sm text-wood-700 dark:text-wood-300 leading-relaxed">
              <p>
                <strong>মেসার্স ফারহান এন্টারপ্রাইজ</strong> যশোরের ঝিকরগাছা অঞ্চলে কাঠ ও কাঠের তৈরি সামগ্রীর এক শীর্ষস্থানীয় ও অত্যন্ত বিশ্বস্ত প্রতিষ্ঠান। আমাদের প্রধান লক্ষ্য—কোনো প্রকার কৃত্রিম ফিলার বা নকল কাঠ ছাড়াই গ্রাহকের হাতে শতভাগ খাঁটি ও পরিপক্ক কাঠ পৌঁছে দেওয়া।
              </p>
              <p>
                বাজারে কাঁচা ও ভেজাল কাঠের ছড়াছড়ির বিপরীতে, আমরা সরাসরি পার্বত্য চট্টগ্রাম ও স্থানীয় বিশ্বস্ত বাগান থেকে বাছাইকৃত <strong>চিটাগাং সেগুন, সিজনড মেহগনি, গামারি ও শাল কাঠ</strong> নিজস্ব স’মিলে চেরাই করি। পরবর্তীতে বৈজ্ঞানিক ফার্নেস কিম্বন সিজনিং এবং ভ্যাকুয়াম কেমিক্যাল ট্রিটমেন্টের মাধ্যমে কাঠের আর্দ্রতা ১২%–১৪% এ সুনির্দিষ্ট করে কাঠের চিরন্তন স্থায়িত্ব নিশ্চিত করা হয়।
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-wood-200 dark:border-wood-800">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm">
                <span className="text-2xl sm:text-3xl font-extrabold text-gold-600 dark:text-gold-400 font-serif block">
                  ২৫+ বছর
                </span>
                <span className="text-[11px] text-wood-500 dark:text-wood-400">ব্যবসায়িক সুনাম ও ঐতিহ্য</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm">
                <span className="text-2xl sm:text-3xl font-extrabold text-gold-600 dark:text-gold-400 font-serif block">
                  ১০০% খাঁটি
                </span>
                <span className="text-[11px] text-wood-500 dark:text-wood-400">ট্রিটমেন্ট ও সিজনড কাঠ</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm col-span-2 sm:col-span-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-gold-600 dark:text-gold-400 font-serif block">
                  ১২,০০০+
                </span>
                <span className="text-[11px] text-wood-500 dark:text-wood-400">সন্তুষ্ট গৃহমালিক ও ক্লায়েন্ট</span>
              </div>
            </div>

            {/* Official Registration & Proprietor Strip */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-gold-500/10 via-amber-500/10 to-transparent border border-gold-500/25">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-wood-950 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>প্রোঃ মোঃ আব্দুছ ছালাম খাঁন</span>
                  </h4>
                  <p className="text-xs text-wood-600 dark:text-wood-300 mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span>আকিজ কলেজিয়েট স্কুলের পশ্চিম পার্শ্বে, বাদে নাভারন, ঝিকরগাছা, যশোর।</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:+8801710820987"
                    className="px-3.5 py-1.5 rounded-xl bg-wood-900 text-gold-400 hover:bg-wood-800 text-xs font-semibold border border-wood-700 transition-colors"
                  >
                    ০১৭১০-৮২০৯৮৭
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Real Photo Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-wood-200 dark:border-wood-800 aspect-[4/3] bg-wood-900 group">
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
              <div className="absolute inset-0 bg-gradient-to-t from-wood-950 via-wood-950/20 to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-wood-950/90 backdrop-blur-md rounded-2xl border border-wood-800">
                <span className="text-xs font-bold text-white block">
                  মেসার্স ফারহান এন্টারপ্রাইজ
                </span>
                <span className="text-[11px] text-wood-400 block mt-0.5">
                  ঝিকরগাছা, যশোর কারখানার প্রবেশদ্বারে স্থাপিত মূল সাইনবোর্ড
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Pillars of Farhan Enterprise */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-gold-600 uppercase tracking-widest block mb-1">
            গ্রাহক সন্তুষ্টি
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-wood-950 dark:text-white font-serif mb-3">
            কেন মেসার্স ফারহান এন্টারপ্রাইজ নির্বাচন করবেন?
          </h2>
          <p className="text-xs sm:text-sm text-wood-500 dark:text-wood-400">
            আমাদের ৪টি মূল অঙ্গীকার যা প্রতিটি গ্রাহককে দেয় শতভাগ মানসিক প্রশান্তি
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          <div className="p-6 rounded-3xl bg-white dark:bg-wood-900/90 border border-wood-200 dark:border-wood-800 shadow-sm text-center hover:border-gold-500/50 transition-colors">
            <Award className="w-8 h-8 text-gold-500 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-wood-950 dark:text-white mb-2">১০০% আসল কাঠ</h3>
            <p className="text-xs text-wood-600 dark:text-wood-400 leading-relaxed">
              সেগুন, মেহগনি বা গামারি—কোনো প্রকার ভেজাল বা কৃত্রিম বোর্ড ছাড়া শতভাগ খাঁটি সলিড কাঠ।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-wood-900/90 border border-wood-200 dark:border-wood-800 shadow-sm text-center hover:border-gold-500/50 transition-colors">
            <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-wood-950 dark:text-white mb-2">২৫ বছরের সুরক্ষা</h3>
            <p className="text-xs text-wood-600 dark:text-wood-400 leading-relaxed">
              ঘুণপোকা, উইপোকা বা কাঠের অস্বাভাবিক বাঁকা হওয়া প্রতিরোধে অফিসিয়াল কেমিক্যাল ইমার্সন সুরক্ষা।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-wood-900/90 border border-wood-200 dark:border-wood-800 shadow-sm text-center hover:border-gold-500/50 transition-colors">
            <Factory className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-wood-950 dark:text-white mb-2">নিজস্ব স’মিল সুবিধা</h3>
            <p className="text-xs text-wood-600 dark:text-wood-400 leading-relaxed">
              কোনো মধ্যস্বত্বভোগী ছাড়া সরাসরি কারখানা রেটে সঠিক মাপের চেরা তক্তা ও গোল কাঠের গুঁড়ি।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-wood-900/90 border border-wood-200 dark:border-wood-800 shadow-sm text-center hover:border-gold-500/50 transition-colors">
            <HeartHandshake className="w-8 h-8 text-cyan-500 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-wood-950 dark:text-white mb-2">কাস্টম ডিজাইন অর্ডার</h3>
            <p className="text-xs text-wood-600 dark:text-wood-400 leading-relaxed">
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
