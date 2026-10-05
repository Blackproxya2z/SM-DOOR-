import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import type { Metadata } from "next";
import { formatBDT } from "@/lib/calculator";
import { 
  TreePine, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  Award, 
  Calculator, 
  ArrowRight,
  Sparkles 
} from "lucide-react";

interface WoodDetailPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 0;

export async function generateStaticParams() {
  const species = db.getSpecies();
  return species.map((s) => ({
    slug: s.id,
  }));
}

export async function generateMetadata({ params }: WoodDetailPageProps): Promise<Metadata> {
  const species = db.getSpeciesById(params.slug);
  if (!species) {
    return {
      title: "কাঠের প্রজাতি পাওয়া যায়নি | SM Door",
    };
  }

  return {
    title: `${species.nameBn} - সম্পূর্ণ পরিচিতি ও বাজার রেট | SM Door`,
    description: `${species.nameBn} (${species.nameEn}): ${species.descriptionBn.slice(0, 150)}... প্রতি সিএফটি দর: ৳${species.currentRatePerCft}`,
  };
}

export default function WoodDetailPage({ params }: WoodDetailPageProps) {
  const species = db.getSpeciesById(params.slug);
  if (!species) {
    notFound();
  }

  const allProducts = db.getProducts();
  const productsWithThisWood = allProducts.filter(
    (p) => p.defaultWoodSpeciesId === species.id || p.woodVariants.some((v) => v.speciesId === species.id)
  );

  const siteSettings = db.getSiteSettings();
  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  return (
    <main className="min-h-screen flex flex-col bg-wood-50/40 dark:bg-wood-950">
      <Header initialSettings={siteSettings} />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-wood-950 via-wood-900 to-wood-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-wood-800">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-wood-400 mb-4">
            <Link href="/" className="hover:text-gold-400 transition-colors">হোম</Link>
            <ChevronRight className="w-3.5 h-3.5 text-wood-600" />
            <Link href="/wood" className="hover:text-gold-400 transition-colors">কাঠের প্রজাতি</Link>
            <ChevronRight className="w-3.5 h-3.5 text-wood-600" />
            <span className="text-gold-400 font-semibold">{species.nameBn}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-gold-400 uppercase tracking-widest">
                {species.scientificName}
              </span>
              {species.isPopular && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ★ জনপ্রিয় কালেকশন
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif mb-3">
              {species.nameBn}
            </h1>
            <p className="text-sm sm:text-base text-wood-300 leading-relaxed mb-6">
              {species.descriptionBn}
            </p>

            {/* Quick Rates Banner */}
            <div className="inline-flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-wood-900/80 border border-wood-800 backdrop-blur-sm">
              <div>
                <span className="text-xs text-wood-400 block">বর্তমান চেরা কাঠ রেট:</span>
                <span className="text-2xl font-extrabold text-gold-400 font-serif">
                  {formatBDT(species.currentRatePerCft, 'bn')} / CFT
                </span>
              </div>
              <div className="h-8 w-px bg-wood-800 hidden sm:block" />
              <div>
                <span className="text-xs text-wood-400 block">গোল গুঁড়ি কাঠের রেট:</span>
                <span className="text-xl font-bold text-wood-200">
                  {formatBDT(species.roundLogRatePerCft, 'bn')} / CFT
                </span>
              </div>
              <div className="h-8 w-px bg-wood-800 hidden sm:block" />
              <Link
                href={`/calculator/cft`}
                className="py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-wood-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
              >
                <Calculator className="w-4 h-4" />
                <span>সিএফটি হিসাব করুন</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Properties Showcase */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-3xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-gold-500 mb-3" />
            <h3 className="text-base font-bold text-wood-950 dark:text-white mb-1">
              স্থায়িত্ব ও প্রতিরোধ ক্ষমতা
            </h3>
            <p className="text-xs text-gold-600 dark:text-gold-400 font-bold mb-2">
              {species.durabilityBn}
            </p>
            <p className="text-xs text-wood-600 dark:text-wood-400 leading-relaxed">
              প্রাকৃতিক আর্দ্রতা ও কীটপ্রতিরোধী উপাদানে সমৃদ্ধ। সঠিক সিজনিং ও ট্রিটমেন্টে ৫০ বছর পর্যন্ত অটুট থাকে।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm">
            <Clock className="w-8 h-8 text-gold-500 mb-3" />
            <h3 className="text-base font-bold text-wood-950 dark:text-white mb-1">
              সিজনিং সময়কাল
            </h3>
            <p className="text-xs text-gold-600 dark:text-gold-400 font-bold mb-2">
              {species.seasoningTimeDays} দিন ফার্নেস কিম্বন প্রক্রিয়া
            </p>
            <p className="text-xs text-wood-600 dark:text-wood-400 leading-relaxed">
              ১২%-১৪% আর্দ্রতায় কাঠকে শুকানো হয়, যাতে তৈরি দরজায় কখনোই জোড়ায় ফাঁক না হয় বা কাঠ বাঁকা না হয়।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm">
            <Award className="w-8 h-8 text-gold-500 mb-3" />
            <h3 className="text-base font-bold text-wood-950 dark:text-white mb-1">
              উৎস ও গ্রেইন প্যাটার্ন
            </h3>
            <p className="text-xs text-gold-600 dark:text-gold-400 font-bold mb-2">
              {species.originBn}
            </p>
            <p className="text-xs text-wood-600 dark:text-wood-400 leading-relaxed">
              {species.grainPatternBn}। মসৃণ টেক্সচার ও প্রাকৃতিক রেখা দরজাকে করে অতুলনীয় দৃষ্টিনন্দন।
            </p>
          </div>
        </div>

        {/* Products Made with this Wood */}
        {productsWithThisWood.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-wood-950 dark:text-white font-serif">
                  {species.nameBn}-এ তৈরি দরজার কালেকশন
                </h2>
                <p className="text-xs sm:text-sm text-wood-500 mt-1">
                  এই খাঁটি কাঠে নির্মিত আমাদের জনপ্রিয় দরজা ও কাঠ সামগ্রী
                </p>
              </div>
              <Link href="/doors" className="text-xs sm:text-sm font-bold text-gold-600 dark:text-gold-400 hover:underline">
                সকল দরজা দেখুন →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsWithThisWood.map((prod) => {
                const variant = prod.woodVariants.find((v) => v.speciesId === species.id);
                const price = variant ? variant.price : prod.defaultPrice;

                return (
                  <Link
                    key={prod.id}
                    href={`/doors/${prod.slug}`}
                    className="group bg-white dark:bg-wood-900 rounded-3xl overflow-hidden border border-wood-200 dark:border-wood-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-wood-100 dark:bg-wood-850">
                      <Image
                        src={(prod.images && prod.images[0]) || prod.imageUrl || '/images/hero/hero-timber-logs.webp'}
                        alt={prod.titleBn}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-[11px] font-bold text-gold-600 uppercase tracking-wider block mb-1">
                        {prod.categoryLabelBn}
                      </span>
                      <h3 className="text-lg font-bold text-wood-950 dark:text-white font-serif line-clamp-1 mb-2 group-hover:text-gold-600 transition-colors">
                        {prod.titleBn}
                      </h3>
                      <div className="flex items-baseline justify-between pt-3 border-t border-wood-100 dark:border-wood-800">
                        <span className="text-lg font-extrabold text-wood-950 dark:text-gold-400">
                          {formatBDT(price, 'bn')}
                        </span>
                        <span className="text-xs text-wood-500 group-hover:text-gold-600 transition-colors font-semibold flex items-center gap-1">
                          বিস্তারিত দেখুন <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <Footer settings={siteSettings} />
      <BottomNav whatsappNumber={whatsapp} />
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
