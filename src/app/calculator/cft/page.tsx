import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import { CftCalculator } from "@/components/CftCalculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "চেরা কাঠ সিএফটি (CFT) ক্যালকুলেটর | SM Door",
  description: "তক্তা ও সাইজ কাঠের দৈর্ঘ্য, প্রস্থ ও পুরুত্ব দিয়ে নির্ভুল সিএফটি হিসাব ও সেগুন, মেহগনি বা গামারি কাঠের বর্তমান দাম জানুন। সূত্র: (দৈর্ঘ্য ফুট × প্রস্থ ইঞ্চি × পুরুত্ব ইঞ্চি) ÷ ১৪৪।",
};

export const revalidate = 0;

export default function SawnTimberCalculatorPage() {
  const speciesList = db.getSpecies();
  const calculatorRates = db.getCalculatorRates();
  const siteSettings = db.getSiteSettings();

  const whatsapp = siteSettings.whatsappNumber || "+8801819345678";
  const phone = siteSettings.phone1 || "+8801819345678";

  return (
    <main className="min-h-screen flex flex-col bg-wood-50/40 dark:bg-wood-950">
      <Header initialSettings={siteSettings} />

      <section className="bg-gradient-to-b from-wood-950 via-wood-900 to-wood-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-wood-800 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-3">
            তক্তা ও সাইজ কাঠ
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif mb-3">
            চেরা কাঠ সিএফটি (CFT) ক্যালকুলেটর
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-wood-300">
            সূত্র: (দৈর্ঘ্য ফুট × প্রস্থ ইঞ্চি × পুরুত্ব ইঞ্চি) ÷ ১৪৪ = সিএফটি (CFT)
          </p>
        </div>
      </section>

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
