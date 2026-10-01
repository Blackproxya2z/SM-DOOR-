import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import { CftCalculator } from "@/components/CftCalculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "দরজার চৌকাঠ (Door Frame / Chowkath) প্রাক্কলন ও খরচ হিসাব | SM Door",
  description: "শাল, সেগুন বা মেহগনি কাঠে দরজার চৌকাঠ তৈরিতে মোট কাঠ প্রয়োজন, কাটিং মজুরি ও ট্রিটমেন্ট সহ নিখুঁত বাজেট এস্টিমেটর।",
};

export const revalidate = 0;

export default function DoorFrameCalculatorPage() {
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
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3">
            চৌকাঠ ও ফ্রেম এস্টিমেটর
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif mb-3">
            দরজার চৌকাঠ (Chowkath) ক্যালকুলেটর
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-wood-300">
            দরজার ফ্রেমের উচ্চতা, চওড়া ও সেকশন সাইজ অনুযায়ী প্রয়োজনীয় গ্রস কাঠ, মজুরি ও সিজনিং সহ পূর্ণাঙ্গ বাজেট হিসাব
          </p>
        </div>
      </section>

      <CftCalculator
        initialSpecies={speciesList}
        initialRates={calculatorRates}
        whatsappNumber={whatsapp}
        defaultTab="frame"
      />

      <Footer settings={siteSettings} />
      <BottomNav whatsappNumber={whatsapp} />
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
