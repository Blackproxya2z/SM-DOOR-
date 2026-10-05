import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import { ProductCatalog } from "@/components/ProductCatalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "সকল কাঠের দরজা ও পণ্য ক্যাটালগ | SM Door",
  description: "চিটাগাং সেগুন, সিজনড মেহগনি, গামারি ও শাল কাঠের সলিড মেইন এন্ট্রান্স ডোর, বেডরুম ডোর, চৌকাঠ ও চেরা কাঠের সম্পূর্ণ ক্যাটালগ ও লাইভ দর।",
};

export const revalidate = 0;

export default function DoorsPage() {
  const products = db.getProducts();
  const speciesList = db.getSpecies();
  const siteSettings = db.getSiteSettings();

  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2B1A12] pb-16 md:pb-0 overflow-x-hidden">
      <Header initialSettings={siteSettings} />

      {/* Page Banner */}
      <section className="bg-white text-[#2B1A12] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#E8DED4]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#C59B27]/10 text-[#C59B27] border border-[#C59B27]/25 mb-3 font-[family-name:var(--font-hind-siliguri)]">
            পণ্য ক্যাটালগ ও কাঠের অপশন
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-tiro-bangla)] text-[#2B1A12]">
            প্রিমিয়াম কাঠের দরজার পূর্ণাঙ্গ সম্ভার
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)] leading-relaxed">
            ১০০% ফার্নেস কিম্বন ড্রাইড ও কেমিক্যাল ট্রিটমেন্ট করা খাঁটি সলিড কাঠ। আপনার পছন্দের কাঠ নির্বাচন করে সরাসরি লাইভ দাম দেখুন ও অর্ডার করুন।
          </p>
        </div>
      </section>

      {/* Catalog Component */}
      <ProductCatalog
        initialProducts={products}
        speciesList={speciesList}
        whatsappNumber={whatsapp}
      />

      <Footer settings={siteSettings} />
      <BottomNav whatsappNumber={whatsapp} />
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
