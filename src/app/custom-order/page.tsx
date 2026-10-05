import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import { CustomOrderWizard } from "@/components/CustomOrderWizard";
import type { Metadata } from "next";
import { Upload } from "lucide-react";

export const metadata: Metadata = {
  title: "কাস্টম ডিজাইন আপলোড ও অর্ডার কোটেশন | SM Door",
  description: "আপনার পছন্দের যেকোনো দরজার ছবি বা আর্কিটেকচারাল ব্লুপ্রিন্ট আপলোড করে মাপ ও কাঠের ধরন অনুযায়ী দ্রুত কোটেশন ও পরামর্শ গ্রহণ করুন।",
};

export const revalidate = 0;

export default function CustomOrderPage() {
  const speciesList = db.getSpecies();
  const siteSettings = db.getSiteSettings();

  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2B1A12] pb-16 md:pb-0 overflow-x-hidden">
      <Header initialSettings={siteSettings} />

      <section className="bg-white text-[#2B1A12] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#E8DED4] text-center">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#C59B27]/10 text-[#C59B27] border border-[#C59B27]/25 mb-3 font-[family-name:var(--font-hind-siliguri)]">
            <Upload className="w-3.5 h-3.5" />
            কাস্টম অর্ডার সিস্টেম
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-tiro-bangla)] text-[#2B1A12] mb-4">
            আপনার পছন্দের দরজার ডিজাইন আপলোড করুন
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)] leading-relaxed">
            ইন্টারনেট বা ক্যাটালগের যেকোনো ছবি আপলোড করে কাঠের প্রজাতি ও সাইজ নির্বাচন করলে আমাদের ইঞ্জিনিয়াররা আপনাকে ফ্রি কোটেশন ও পরামর্শ প্রদান করবেন।
          </p>
        </div>
      </section>

      <CustomOrderWizard
        speciesList={speciesList}
        whatsappNumber={whatsapp}
      />

      <Footer settings={siteSettings} />
      <BottomNav whatsappNumber={whatsapp} />
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
