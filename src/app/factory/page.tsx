import Link from "next/link";
import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import { SawmillShowcase } from "@/components/SawmillShowcase";
import type { Metadata } from "next";
import { 
  Factory, 
  ShieldCheck, 
  Flame, 
  Droplets, 
  Cpu, 
  ArrowRight, 
  MapPin, 
  Phone,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export const metadata: Metadata = {
  title: "স্টেট-অব-দ্য-আর্ট স’মিল কমপ্লেক্স ও প্রসেসিং প্ল্যান্ট | মেসার্স ফারহান এন্টারপ্রাইজ / SM Door",
  description: "ভারী ব্যান্ড-স লোগ কাটিং, ১২-১৪% কিম্বন ড্রাইং সিজনিং চেম্বার, কেমিক্যাল ট্রিটমেন্ট ও থ্রি-ডি সিএনসি খোদাই ফ্যাক্টরি ট্যুর। বাদে নাভারন, ঝিকরগাছা, যশোর।",
};

export const revalidate = 0;

export default function FactoryPage() {
  const sawmillServices = db.getSawmillServices();
  const siteSettings = db.getSiteSettings();

  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  return (
    <main className="min-h-screen flex flex-col bg-wood-50/40 dark:bg-wood-950">
      <Header initialSettings={siteSettings} />

      {/* Hero Banner: State-of-the-Art Sawmill Complex */}
      <section className="bg-gradient-to-b from-wood-950 via-wood-900 to-wood-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-wood-800 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-4 backdrop-blur-sm">
            <Factory className="w-3.5 h-3.5" />
            <span>স্টেট-অব-দ্য-আর্ট স’মিল কমপ্লেক্স</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight mb-4 leading-tight">
            মেসার্স ফারহান এন্টারপ্রাইজ
            <span className="block text-gold-400 text-xl sm:text-3xl mt-2 font-sans font-bold">
              স’মিল কমপ্লেক্স, সিজনিং প্ল্যান্ট ও কাটিং ওয়ার্কশপ
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-wood-300 leading-relaxed font-light">
            কাঠের কাঁচা গোল গুঁড়ি থেকে শুরু করে ভারী ব্যান্ড-স চেরাই, আধুনিক ফার্নেস কিম্বন সিজনিং এবং ডিজিটাল ৩ডি সিএনসি খোদাই — প্রতিটি ধাপ সম্পন্ন হয় যশোরের বাদে নাভারনে আমাদের নিজস্ব কমপ্লেক্সে।
          </p>

          {/* Quick Facility Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-8 pt-6 border-t border-wood-800">
            <div className="p-3 rounded-2xl bg-wood-900/80 border border-wood-800 text-center">
              <span className="text-base sm:text-lg font-bold text-gold-400 block font-serif">১০০% নিজস্ব</span>
              <span className="text-[11px] text-wood-300">হেভি ব্যান্ড-স সমিল</span>
            </div>
            <div className="p-3 rounded-2xl bg-wood-900/80 border border-wood-800 text-center">
              <span className="text-base sm:text-lg font-bold text-gold-400 block font-serif">১২% - ১৪%</span>
              <span className="text-[11px] text-wood-300">কিম্বন ড্রাই সিজনিং</span>
            </div>
            <div className="p-3 rounded-2xl bg-wood-900/80 border border-wood-800 text-center">
              <span className="text-base sm:text-lg font-bold text-gold-400 block font-serif">ভ্যাকুয়াম CCB</span>
              <span className="text-[11px] text-wood-300">উইপোকা প্রতিরোধী ট্রিটমেন্ট</span>
            </div>
            <div className="p-3 rounded-2xl bg-wood-900/80 border border-wood-800 text-center">
              <span className="text-base sm:text-lg font-bold text-gold-400 block font-serif">৩ডি সিএনসি</span>
              <span className="text-[11px] text-wood-300">কম্পিউটারাইজড খোদাই</span>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Bridge: Link to About Farhan Enterprise Profile */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-wood-900 via-wood-850 to-wood-900 rounded-3xl p-6 sm:p-8 border border-gold-500/25 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center flex-shrink-0 text-gold-400 shadow-inner">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gold-500/15 text-gold-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                <span>মূল প্রতিষ্ঠান ও ২৫+ বছরের ঐতিহ্য</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
                মেসার্স ফারহান এন্টারপ্রাইজ — আমাদের পরিচিতি ও মালিকানা
              </h3>
              <p className="text-xs sm:text-sm text-wood-300 mt-1 max-w-2xl">
                প্রোঃ মোঃ আব্দুছ ছালাম খাঁন • আকিজ কলেজিয়েট স্কুলের পশ্চিম পার্শ্বে, বাদে নাভারন, ঝিকরগাছা, যশোর। প্রতিষ্ঠান সম্পর্কে বিস্তারিত জানুন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
            <Link
              href="/about"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-wood-950 font-bold text-xs sm:text-sm transition-all shadow-gold"
            >
              <span>ফারহান এন্টারপ্রাইজ সম্পর্কে জানুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
