import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import { ProductDetailView } from "@/components/ProductDetailView";
import { getSiteUrl } from "@/lib/site";
import type { Metadata } from "next";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 0;

export async function generateStaticParams() {
  const products = db.getProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = db.getProductById(params.slug);
  if (!product) {
    return {
      title: "পণ্য পাওয়া যায়নি | SM Door",
    };
  }

  return {
    title: `${product.titleBn} (${product.titleEn}) | SM Door`,
    description: `${product.descriptionBn.slice(0, 160)}... মূল্য: ৳${product.defaultPrice.toLocaleString()}`,
    openGraph: {
      title: `${product.titleBn} | SM Door`,
      description: product.descriptionBn,
      images: [
        {
          url: product.images[0] || "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
          width: 800,
          height: 1000,
          alt: product.titleBn,
        },
      ],
    },
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = db.getProductById(params.slug);
  if (!product) {
    notFound();
  }

  const speciesList = db.getSpecies();
  const allProducts = db.getProducts();
  const siteSettings = db.getSiteSettings();

  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  // Product JSON-LD schema
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.titleBn,
    "alternateName": product.titleEn,
    "image": product.images,
    "description": product.descriptionBn,
    "brand": {
      "@type": "Brand",
      "name": "SM Door",
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BDT",
      "price": product.defaultPrice,
      "availability": product.stockStatus === "in_stock" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      "url": `${getSiteUrl()}/doors/${product.slug}`,
    },
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2B1A12] pb-16 md:pb-0 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Header initialSettings={siteSettings} />

      <ProductDetailView
        product={product}
        speciesList={speciesList}
        relatedProducts={relatedProducts}
        whatsappNumber={whatsapp}
      />

      <Footer settings={siteSettings} />
      <BottomNav whatsappNumber={whatsapp} />
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
