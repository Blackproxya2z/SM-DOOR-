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

  const whatsapp = siteSettings.whatsappNumber || "+8801819345678";
  const phone = siteSettings.phone1 || "+8801819345678";

  return (
    <main className="min-h-screen flex flex-col bg-wood-50/40 dark:bg-wood-950">
      <Header initialSettings={siteSettings} />

      <section className="bg-gradient-to-b from-wood-950 via-wood-900 to-wood-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-wood-800 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-3">
            <Upload className="w-3.5 h-3.5" />
            কাস্টম অর্ডার সিস্টেম
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif mb-4">
            আপনার পছন্দের দরজার ডিজাইন আপলোড করুন
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-wood-300">
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
