import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import { QuoteListView } from "@/components/QuoteListView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "আপনার নির্বাচিত কোটেশন তালিকা | SM Door",
  description: "নির্বাচিত কাঠের দরজা, চেরা কাঠ ও চৌকাঠের কোটেশন লিস্ট। সরাসরি হোয়াটসঅ্যাপে বা ওয়েবসাইটে ইনকোয়ারি জমা দিন।",
};

export const revalidate = 0;

export default function QuotePage() {
  const siteSettings = db.getSiteSettings();
  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  return (
    <main className="min-h-screen flex flex-col bg-wood-50/40 dark:bg-wood-950 pb-16 md:pb-0 overflow-x-hidden">
      <Header initialSettings={siteSettings} />

      <section className="bg-gradient-to-b from-wood-950 via-wood-900 to-wood-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-wood-800 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-2">
            কোটেশন ড্রাফট ও ইনকোয়ারি
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif mb-2">
            আপনার কোটেশন তালিকা
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-wood-300">
            এক সাথে একাধিক পণ্যের মাপ ও কাঠের ধরন একত্রিত করে সরাসরি অফিশিয়াল কোটেশন গ্রহণ করুন।
          </p>
        </div>
      </section>

      <div className="flex-1">
        <QuoteListView whatsappNumber={whatsapp} />
      </div>

      <Footer settings={siteSettings} />
      <BottomNav whatsappNumber={whatsapp} />
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
