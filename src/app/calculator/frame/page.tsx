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

  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2B1A12] pb-16 md:pb-0 overflow-x-hidden">
      <Header initialSettings={siteSettings} />

      <section className="bg-white text-[#2B1A12] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#E8DED4] text-center">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#C59B27]/10 text-[#C59B27] border border-[#C59B27]/25 mb-3 font-[family-name:var(--font-hind-siliguri)]">
            চৌকাঠ ও ফ্রেম এস্টিমেটর
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-tiro-bangla)] text-[#2B1A12] mb-3">
            দরজার চৌকাঠ (Chowkath) ক্যালকুলেটর
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)]">
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
