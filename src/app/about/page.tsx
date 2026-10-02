import Link from "next/link";
import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import type { Metadata } from "next";
import { TreePine, Award, ShieldCheck, HeartHandshake, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "আমাদের পরিচিতি ও ঐতিহ্য | মেসার্স ফারহান এন্টারপ্রাইজ / SM Door",
  description: "২৫ বছরেরও বেশি সময় ধরে যশোরের ঐতিহ্যবাহী মেসার্স ফারহান এন্টারপ্রাইজ ও এস এম ডোর বিশ্বস্ততার সাথে আসল কাঠের দরজা, সাইজ কাঠ ও ফার্নিচার সরবরাহ করে আসছে।",
};

export const revalidate = 0;

export default function AboutPage() {
  const siteSettings = db.getSiteSettings();
  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  return (
    <main className="min-h-screen flex flex-col bg-wood-50/40 dark:bg-wood-950">
      <Header initialSettings={siteSettings} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-wood-950 via-wood-900 to-wood-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-wood-800 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-3">
            <TreePine className="w-3.5 h-3.5" />
            আমাদের ঐতিহ্য
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif mb-4">
            মেসার্স ফারহান এন্টারপ্রাইজ — খাঁটি কাঠের বিশ্বস্ত ঠিকানা
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-wood-300">
            যশোরের ঝিকরগাছায় (বাদে নাভারন) নিজস্ব স’মিল ও সিজনিং প্ল্যান্টের মাধ্যমে সততা ও আভিজাত্যের সাথে কাঠের সেবা প্রদান।
          </p>
        </div>
      </section>

      {/* Story & Values */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest block mb-2">
              আমাদের গল্প
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-wood-950 dark:text-white font-serif mb-4">
              কাঠের বিশুদ্ধতা ও আধুনিক কারিগরির নিখুঁত মেলবন্ধন
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-wood-700 dark:text-wood-300 leading-relaxed font-light">
              <p>
                গত ২৫ বছর ধরে <strong>এস এম ডোর (SM Door)</strong> বাংলাদেশের শীর্ষস্থানীয় বাড়ি নির্মাতা, ইন্টেরিয়র ডিজাইনার এবং সাধারণ গৃহমালিকদের আস্থা অর্জন করেছে। আমরা বিশ্বাস করি, একটি ঘরের দরজা কেবল প্রবেশের পথ নয়—তা গৃহের নিরাপত্তা, সৌন্দর্য এবং মালিকের আভিজাত্যের প্রতিফলন।
              </p>
              <p>
                বাজারে ভেজাল কাঠ এবং কাঁচা কাঠের প্রবণতার বিপরীতে, আমরা নিজস্ব ফার্নেস কিম্বন সিজনিং চেম্বারে প্রতিটি কাঠ ১২%-১৪% আর্দ্রতায় নিয়ে আসি। এর ফলে দরজায় ফাঁক তৈরি হওয়া, কাঠ বাঁকা হওয়া বা ঘুণপোকার আক্রমণের ঝুঁকি শতভাগ দূর হয়।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-wood-200 dark:border-wood-800">
              <div>
                <span className="text-3xl font-extrabold text-gold-600 dark:text-gold-400 font-serif block">
                  ২৫+ বছর
                </span>
                <span className="text-xs text-wood-500">চট্টগ্রামের প্রতিষ্ঠিত ব্যবসায়িক সুনাম</span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-gold-600 dark:text-gold-400 font-serif block">
                  ১২,০০০+
                </span>
                <span className="text-xs text-wood-500">সন্তুষ্ট গৃহমালিক ও প্রজেক্ট ক্লায়েন্ট</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-wood-200 dark:border-wood-800 aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000"
              alt="SM Door Wood Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-wood-950 dark:text-white font-serif mb-3">
            কেন এস এম ডোর নির্বাচন করবেন?
          </h2>
          <p className="text-xs sm:text-sm text-wood-500">
            আমাদের ৪টি মূল অঙ্গীকার যা প্রতিটি গ্রাহককে দেয় মানসিক প্রশান্তি
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm text-center">
            <Award className="w-8 h-8 text-gold-500 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-wood-950 dark:text-white mb-2">১০০% আসল কাঠ</h3>
            <p className="text-xs text-wood-600 dark:text-wood-400 leading-relaxed">
              সেগুন, মেহগনি বা গামারি—কোনো প্রকার ভেজাল বা কৃত্রিম বোর্ড ছাড়া খাঁটি সলিড কাঠ।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm text-center">
            <ShieldCheck className="w-8 h-8 text-gold-500 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-wood-950 dark:text-white mb-2">১০ বছর রিপ্লেসমেন্ট</h3>
            <p className="text-xs text-wood-600 dark:text-wood-400 leading-relaxed">
              ঘুণপোকা বা কাঠের অস্বাভাবিক বাঁকা হওয়া থেকে অফিসিয়াল লিখিত রিপ্লেসমেন্ট গ্যারান্টি।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm text-center">
            <TreePine className="w-8 h-8 text-gold-500 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-wood-950 dark:text-white mb-2">নিজস্ব স’মিল সুবিধা</h3>
            <p className="text-xs text-wood-600 dark:text-wood-400 leading-relaxed">
              কোনো মধ্যস্বত্বভোগী ছাড়া সরাসরি ফ্যাক্টরি রেটে সঠিক মাপের চেরা ও গোল কাঠ।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm text-center">
            <HeartHandshake className="w-8 h-8 text-gold-500 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-wood-950 dark:text-white mb-2">কাস্টম ডিজাইন সার্ভিস</h3>
            <p className="text-xs text-wood-600 dark:text-wood-400 leading-relaxed">
              যেকোনো জটিল ৩ডি নকশা ও কাস্টম সাইজ সরাসরি কম্পিউটারাইজড সিএনসিতে তৈরি।
            </p>
          </div>
        </div>
      </section>

      <Footer settings={siteSettings} />
      <BottomNav whatsappNumber={whatsapp} />
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
