import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import { ProductCatalog } from "@/components/ProductCatalog";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 0;

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) {
    return {
      title: "ক্যাটাগরি পাওয়া যায়নি | SM Door",
    };
  }

  return {
    title: `${category.nameBn} (${category.nameEn}) | SM Door`,
    description: category.descriptionBn,
  };
}

export default function CategoryDetailPage({ params }: CategoryPageProps) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) {
    notFound();
  }

  const allProducts = db.getProducts();
  const categoryProducts = allProducts.filter((p) => p.category === category.slug);
  const speciesList = db.getSpecies();
  const siteSettings = db.getSiteSettings();

  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2B1A12] pb-16 md:pb-0 overflow-x-hidden">
      <Header initialSettings={siteSettings} />

      {/* Category Hero Banner */}
      <section className="bg-white text-[#2B1A12] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#E8DED4]">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#7A6A5F] mb-4 font-[family-name:var(--font-hind-siliguri)]">
            <Link href="/" className="hover:text-[#C59B27] transition-colors">হোম</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#7A6A5F]/60" />
            <Link href="/categories" className="hover:text-[#C59B27] transition-colors">ক্যাটাগরি</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#7A6A5F]/60" />
            <span className="text-[#C59B27] font-semibold">{category.nameBn}</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-tiro-bangla)] text-[#2B1A12] mb-3">
              {category.nameBn}
            </h1>
            <p className="text-xs sm:text-sm text-[#7A6A5F] uppercase tracking-widest font-mono mb-4">
              {category.nameEn}
            </p>
            <p className="text-base sm:text-lg text-[#7A6A5F] leading-relaxed font-[family-name:var(--font-hind-siliguri)]">
              {category.descriptionBn}
            </p>
          </div>
        </div>
      </section>

      {/* Products list for this category */}
      <ProductCatalog
        initialProducts={categoryProducts.length > 0 ? categoryProducts : allProducts}
        speciesList={speciesList}
        whatsappNumber={whatsapp}
      />

      <Footer settings={siteSettings} />
      <BottomNav whatsappNumber={whatsapp} />
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
