import { db } from "@/lib/db";
import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCatalog } from "@/components/ProductCatalog";
import { CftCalculator } from "@/components/CftCalculator";
import { CustomOrderWizard } from "@/components/CustomOrderWizard";
import { SawmillShowcase } from "@/components/SawmillShowcase";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";

export const revalidate = 0; // Always fresh data from db

export default function Home() {
  const products = db.getProducts();
  const speciesList = db.getSpecies();
  const calculatorRates = db.getCalculatorRates();
  const heroBanners = db.getHeroBanners();
  const reviews = db.getReviews();
  const siteSettings = db.getSiteSettings();
  const sawmillServices = db.getSawmillServices();
  const factoryPhotos = db.getFactoryPhotos();

  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  return (
    <main className="min-h-screen flex flex-col bg-wood-50/30 dark:bg-wood-950 pb-16 md:pb-0 overflow-x-hidden">
      {/* 1. Top Navbar */}
      <Header initialSettings={siteSettings} />

      {/* 2. Hero Carousel & Trust Metrics */}
      <HeroSlider banners={heroBanners} />

      {/* 3. Interactive Product Catalog */}
      <ProductCatalog 
        initialProducts={products} 
        speciesList={speciesList} 
        whatsappNumber={whatsapp} 
      />

      {/* 4. Real-time CFT & Cost Calculator */}
      <CftCalculator 
        initialSpecies={speciesList} 
        initialRates={calculatorRates} 
        whatsappNumber={whatsapp} 
      />

      {/* 5. Custom Design Upload & Quotation Form */}
      <CustomOrderWizard 
        speciesList={speciesList} 
        whatsappNumber={whatsapp} 
      />

      {/* 6. Sawmill Services & Factory Tour */}
      <SawmillShowcase services={sawmillServices} factoryPhotos={factoryPhotos} />

      {/* 7. Client Reviews & Testimonials */}
      <TestimonialsSection reviews={reviews} />

      {/* 8. Footer */}
      <Footer settings={siteSettings} />

      {/* 9. Mobile Bottom Navigation */}
      <BottomNav whatsappNumber={whatsapp} />

      {/* 10. Floating Actions (WhatsApp & Call) */}
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
