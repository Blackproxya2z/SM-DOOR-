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

  const whatsapp = siteSettings.whatsappNumber || "+8801819345678";
  const phone = siteSettings.phone1 || "+8801819345678";

  return (
    <main className="min-h-screen flex flex-col bg-wood-50/40 dark:bg-wood-950">
      <Header initialSettings={siteSettings} />

      {/* Category Hero Banner */}
      <section className="bg-gradient-to-b from-wood-950 via-wood-900 to-wood-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-wood-800">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-wood-400 mb-4">
            <Link href="/" className="hover:text-gold-400 transition-colors">হোম</Link>
            <ChevronRight className="w-3.5 h-3.5 text-wood-600" />
            <Link href="/categories" className="hover:text-gold-400 transition-colors">ক্যাটাগরি</Link>
            <ChevronRight className="w-3.5 h-3.5 text-wood-600" />
            <span className="text-gold-400 font-semibold">{category.nameBn}</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif mb-3">
              {category.nameBn}
            </h1>
            <p className="text-xs sm:text-sm text-wood-400 uppercase tracking-widest font-mono mb-4">
              {category.nameEn}
            </p>
            <p className="text-sm sm:text-base text-wood-300 leading-relaxed">
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
