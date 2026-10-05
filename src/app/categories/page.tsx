import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import type { Metadata } from "next";
import { ArrowRight, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "কাঠের পণ্য ও দরজার ক্যাটাগরি সমূহ | SM Door",
  description: "মেইন এন্ট্রান্স ডোর, বেডরুম ডোর, চৌকাঠ, চেরা কাঠ ও কাস্টম ডিজাইনের ক্যাটাগরি তালিকা।",
};

export const revalidate = 0;

export default function CategoriesPage() {
  const products = db.getProducts();
  const siteSettings = db.getSiteSettings();

  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  return (
    <main className="min-h-screen flex flex-col bg-wood-50/40 dark:bg-wood-950">
      <Header initialSettings={siteSettings} />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-wood-950 via-wood-900 to-wood-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-wood-800 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-3">
            <Layers className="w-3.5 h-3.5" />
            পণ্য বিভাগ
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif mb-4">
            এস এম ডোর ক্যাটাগরি কালেকশন
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-wood-300">
            আপনার বাড়ির প্রতিটি কক্ষের প্রয়োজন অনুযায়ী সাজানো বিশেষ কাঠের দরজা ও কাঠ সামগ্রী
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.slug).length;

            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group relative bg-white dark:bg-wood-900 rounded-3xl overflow-hidden border border-wood-200 dark:border-wood-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-wood-100 dark:bg-wood-950">
                  <Image
                    src={cat.image}
                    alt={cat.nameBn}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjUyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmMxYTBlIi8+PC9zdmc+"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-xs font-semibold px-2.5 py-1 rounded-full bg-gold-500 text-wood-950 shadow">
                    {count > 0 ? `${count} টি ডিজাইন` : 'কাস্টম কালেকশন'}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-wood-950 dark:text-white font-serif mb-2 group-hover:text-gold-600 transition-colors">
                      {cat.nameBn}
                    </h2>
                    <p className="text-xs text-wood-500 dark:text-wood-400 mb-3 font-mono">
                      {cat.nameEn}
                    </p>
                    <p className="text-sm text-wood-600 dark:text-wood-300 line-clamp-2 leading-relaxed">
                      {cat.descriptionBn}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-wood-100 dark:border-wood-800 flex items-center justify-between text-xs font-bold text-gold-600 dark:text-gold-400">
                    <span>দরজা ও পণ্য দেখুন</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
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
