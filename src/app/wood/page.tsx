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

  const whatsapp = siteSettings.whatsappNumber || "+8801819345678";
  const phone = siteSettings.phone1 || "+8801819345678";

  return (
    <main className="min-h-screen flex flex-col bg-wood-50/40 dark:bg-wood-950">
      <Header initialSettings={siteSettings} />

      {/* Banner */}
      <section className="bg-gradient-to-b from-wood-950 via-wood-900 to-wood-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-wood-800 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-3">
            <TreePine className="w-3.5 h-3.5" />
            কাঠ পরিচিতি ও রেট
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif mb-4">
            কাঠের প্রজাতি ও গুণাগুণ নির্দেশিকা
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-wood-300">
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
                className="bg-white dark:bg-wood-900 rounded-3xl overflow-hidden border border-wood-200 dark:border-wood-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header Strip with Color Swatch Accent */}
                <div className="p-6 pb-4 border-b border-wood-100 dark:border-wood-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-gold-600 dark:text-gold-400 uppercase tracking-widest">
                      {species.scientificName || 'Solid Timber'}
                    </span>
                    {species.isPopular && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        ★ জনপ্রিয়
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-wood-950 dark:text-white font-serif mb-1">
                    {species.nameBn}
                  </h2>
                  <p className="text-xs text-wood-500 font-sans">
                    {species.nameEn}
                  </p>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-wood-700 dark:text-wood-300 leading-relaxed">
                    {species.descriptionBn}
                  </p>

                  <div className="space-y-2 py-3 border-y border-wood-100 dark:border-wood-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-wood-500">চেরা কাঠ রেট (CFT):</span>
                      <span className="font-extrabold text-gold-600 dark:text-gold-400 text-sm">
                        {formatBDT(species.currentRatePerCft, 'bn')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-wood-500">গোল গুঁড়ি রেট (CFT):</span>
                      <span className="font-semibold text-wood-800 dark:text-wood-200">
                        {formatBDT(species.roundLogRatePerCft, 'bn')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-wood-500">স্থায়িত্ব মাত্রা:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {species.durabilityBn}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-wood-500">উৎস অঞ্চল:</span>
                      <span className="font-medium text-wood-800 dark:text-wood-200 truncate max-w-[180px]">
                        {species.originBn}
                      </span>
                    </div>
                  </div>

                  {/* Best For Tags */}
                  <div>
                    <span className="text-[11px] font-semibold text-wood-500 block mb-1.5">
                      ব্যবহারের জন্য সেরা:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {species.bestForBn.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-wood-100 dark:bg-wood-800 text-wood-700 dark:text-wood-300"
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
                      className="py-2.5 px-3 rounded-xl border border-wood-300 dark:border-wood-700 hover:bg-wood-100 dark:hover:bg-wood-800 text-xs font-semibold text-wood-800 dark:text-wood-200 text-center transition-colors"
                    >
                      বিস্তারিত গাইড →
                    </Link>
                    <Link
                      href={`/calculator/cft`}
                      className="py-2.5 px-3 rounded-xl bg-wood-950 dark:bg-gold-500 text-gold-400 dark:text-wood-950 hover:opacity-90 text-xs font-bold text-center transition-opacity shadow"
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
