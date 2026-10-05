import Link from "next/link";
import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import type { Metadata } from "next";
import { TreePine, ArrowRight, Shield, Award, Sparkles } from "lucide-react";
import { formatBDT } from "@/lib/calculator";

export const metadata: Metadata = {
  title: "কাঠের প্রজাতি ও বর্তমান বাজারদর গাইড | SM Door",
  description: "চিটাগাং সেগুন, সিজনড মেহগনি, গামারি ও শাল কাঠের স্থায়িত্ব, বৈশিষ্ট্য ও প্রতি সিএফটি লাইভ রেট তালিকা।",
};

export const revalidate = 0;

export default function WoodSpeciesPage() {
  const speciesList = db.getSpecies();
  const siteSettings = db.getSiteSettings();

  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2B1A12] pb-16 md:pb-0 overflow-x-hidden">
      <Header initialSettings={siteSettings} />

      {/* Banner */}
      <section className="bg-white text-[#2B1A12] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#E8DED4] text-center">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#C59B27]/10 text-[#C59B27] border border-[#C59B27]/25 mb-3 font-[family-name:var(--font-hind-siliguri)]">
            <TreePine className="w-3.5 h-3.5" />
            কাঠ পরিচিতি ও রেট
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-tiro-bangla)] text-[#2B1A12] mb-4">
            কাঠের প্রজাতি ও গুণাগুণ নির্দেশিকা
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)] leading-relaxed">
            দরজা ও ফার্নিচার বানানোর আগে আসল কাঠের চরিত্র, টেকসই মাত্রা ও বর্তমান বাজারদর জেনে নিন
          </p>
        </div>
      </section>

      {/* Species Cards Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speciesList.map((species) => {
            return (
              <div
                key={species.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#E8DED4] shadow-sm hover:shadow-xl hover:border-[#C59B27] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header Strip with Color Swatch Accent */}
                <div className="p-6 pb-4 border-b border-[#E8DED4]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-[#C59B27] uppercase tracking-widest font-semibold">
                      {species.scientificName || 'Solid Timber'}
                    </span>
                    {species.isPopular && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#C59B27]/15 text-[#C59B27] border border-[#C59B27]/30 font-[family-name:var(--font-hind-siliguri)]">
                        ★ জনপ্রিয়
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] mb-1">
                    {species.nameBn}
                  </h2>
                  <p className="text-xs text-[#7A6A5F] font-sans">
                    {species.nameEn}
                  </p>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4 font-[family-name:var(--font-hind-siliguri)]">
                  <p className="text-xs sm:text-sm text-[#7A6A5F] leading-relaxed">
                    {species.descriptionBn}
                  </p>

                  <div className="space-y-2 py-3 border-y border-[#E8DED4] text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#7A6A5F]">চেরা কাঠ রেট (CFT):</span>
                      <span className="font-extrabold text-[#C59B27] text-sm">
                        {formatBDT(species.currentRatePerCft, 'bn')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A6A5F]">গোল গুঁড়ি রেট (CFT):</span>
                      <span className="font-semibold text-[#2B1A12]">
                        {formatBDT(species.roundLogRatePerCft, 'bn')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A6A5F]">স্থায়িত্ব মাত্রা:</span>
                      <span className="font-semibold text-emerald-600">
                        {species.durabilityBn}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A6A5F]">উৎস অঞ্চল:</span>
                      <span className="font-medium text-[#2B1A12] truncate max-w-[180px]">
                        {species.originBn}
                      </span>
                    </div>
                  </div>

                  {/* Best For Tags */}
                  <div>
                    <span className="text-[11px] font-semibold text-[#7A6A5F] block mb-1.5">
                      ব্যবহারের জন্য সেরা:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {species.bestForBn.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#F4ECE1] text-[#7A6A5F] border border-[#E8DED4]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      href={`/wood/${species.id}`}
                      className="py-2.5 px-3 rounded-xl border border-[#E8DED4] hover:bg-[#F4ECE1] text-xs font-semibold text-[#2B1A12] text-center transition-colors"
                    >
                      বিস্তারিত গাইড →
                    </Link>
                    <Link
                      href={`/calculator/cft`}
                      className="py-2.5 px-3 rounded-xl bg-[#2B1A12] text-white hover:bg-[#C59B27] text-xs font-bold text-center transition-colors shadow"
                    >
                      সিএফটি হিসাব
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer settings={siteSettings} />
      <BottomNav whatsappNumber={whatsapp} />
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
