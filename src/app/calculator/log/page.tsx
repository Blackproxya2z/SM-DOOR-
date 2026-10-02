import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import { CftCalculator } from "@/components/CftCalculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "গোল কাঠ / গুঁড়ি সিএফটি (CFT) ক্যালকুলেটর | SM Door",
  description: "বাংলাদেশের স’মিল স্ট্যান্ডার্ড হোপের নিয়ম (Quarter Girth Formula) অনুযায়ী গোল কাঠের নিখুঁত সিএফটি ও বাজারদর হিসাব।",
};

export const revalidate = 0;

export default function RoundLogCalculatorPage() {
  const speciesList = db.getSpecies();
  const calculatorRates = db.getCalculatorRates();
  const siteSettings = db.getSiteSettings();

  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  return (
    <main className="min-h-screen flex flex-col bg-wood-50/40 dark:bg-wood-950">
      <Header initialSettings={siteSettings} />

      <section className="bg-gradient-to-b from-wood-950 via-wood-900 to-wood-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-wood-800 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3">
            গোল কাঠের গুঁড়ি (Log Timber)
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif mb-3">
            গোল কাঠ সিএফটি (CFT) ক্যালকুলেটর
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-wood-300">
            হোপের নিয়ম (Hoppus Rule): (বেড় ইঞ্চি ÷ ৪)² × দৈর্ঘ্য ফুট ÷ ১৪৪ = সিএফটি (CFT)
          </p>
        </div>
      </section>

      <CftCalculator
        initialSpecies={speciesList}
        initialRates={calculatorRates}
        whatsappNumber={whatsapp}
        defaultTab="log"
      />

      <Footer settings={siteSettings} />
      <BottomNav whatsappNumber={whatsapp} />
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
