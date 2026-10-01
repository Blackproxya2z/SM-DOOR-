import Link from "next/link";
import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import { CftCalculator } from "@/components/CftCalculator";
import type { Metadata } from "next";
import { Calculator, Ruler, Layers, DoorOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "কাঠের সিএফটি ও চৌকাঠ ক্যালকুলেটর হাব | SM Door",
  description: "চেরা কাঠ, গোল কাঠের গুঁড়ি এবং দরজার চৌকাঠের লাইভ সিএফটি ও মূল্য প্রাক্কলন ক্যালকুলেটর।",
};

export const revalidate = 0;

export default function CalculatorHubPage() {
  const speciesList = db.getSpecies();
  const calculatorRates = db.getCalculatorRates();
  const siteSettings = db.getSiteSettings();

  const whatsapp = siteSettings.whatsappNumber || "+8801819345678";
  const phone = siteSettings.phone1 || "+8801819345678";

  return (
    <main className="min-h-screen flex flex-col bg-wood-50/40 dark:bg-wood-950">
      <Header initialSettings={siteSettings} />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-wood-950 via-wood-900 to-wood-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-wood-800 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            রিয়েল-টাইম হিসাব
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif mb-4">
            কাঠের সিএফটি (CFT) ও চৌকাঠ ক্যালকুলেটর
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-wood-300">
            চেরা কাঠ, গোল গুঁড়ি ও দরজার চৌকাঠের নিখুঁত মাপ ইনপুট দিয়ে তাৎক্ষণিক সঠিক সিএফটি ও বর্তমান বাজারদরে প্রাক্কলন করুন।
          </p>
        </div>
      </section>

      {/* Calculator Hub Cards */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/calculator/cft"
            className="p-6 rounded-3xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Ruler className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-wood-950 dark:text-white mb-2">
              চেরা কাঠ ক্যালকুলেটর
            </h3>
            <p className="text-xs text-wood-600 dark:text-wood-400 leading-relaxed mb-4">
              দৈর্ঘ্য (ফুট), প্রস্থ (ইঞ্চি) ও পুরুত্ব (ইঞ্চি) দিয়ে তক্তা ও সাইজ কাঠের সঠিক সিএফটি হিসাব।
            </p>
            <span className="text-xs font-bold text-gold-600 flex items-center gap-1">
              হিসাব খুলুন <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/calculator/log"
            className="p-6 rounded-3xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-wood-950 dark:text-white mb-2">
              গোল কাঠ / গুঁড়ি ক্যালকুলেটর
            </h3>
            <p className="text-xs text-wood-600 dark:text-wood-400 leading-relaxed mb-4">
              বাংলাদেশের স’মিল স্ট্যান্ডার্ড হোপের কোয়ার্টার-গার্থ সূত্রে গোল কাঠের নিখুঁত আয়তন হিসাব।
            </p>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              হিসাব খুলুন <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/calculator/frame"
            className="p-6 rounded-3xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <DoorOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-wood-950 dark:text-white mb-2">
              চৌকাঠ (Door Frame) ক্যালকুলেটর
            </h3>
            <p className="text-xs text-wood-600 dark:text-wood-400 leading-relaxed mb-4">
              দরজার ওপেনিং সাইজ, ক্রস-সেকশন ও শাল/সেগুন কাঠে মজুরিসহ পূর্ণাঙ্গ চৌকাঠের খরচ এস্টিমেটর।
            </p>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
              হিসাব খুলুন <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Embedded Live Calculator */}
      <CftCalculator
        initialSpecies={speciesList}
        initialRates={calculatorRates}
        whatsappNumber={whatsapp}
        defaultTab="sawn"
      />

      <Footer settings={siteSettings} />
      <BottomNav whatsappNumber={whatsapp} />
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
