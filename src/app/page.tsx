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

import { ScrollRevealSection } from "@/components/ScrollRevealSection";

export const revalidate = 0; // Always fresh data from db

export default function Home() {
  const products = db.getProducts();
  const speciesList = db.getSpecies();
  const calculatorRates = db.getCalculatorRates();
  const heroBanners = db.getHeroBanners();
  const reviews = db.getReviews();
  const siteSettings = db.getSiteSettings();
  const sawmillServices = db.getSawmillServices();

  const whatsapp = siteSettings.whatsappNumber || "+8801710820987";
  const phone = siteSettings.phone1 || "+880 1710-820987";

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2B1A12] pb-16 md:pb-0 overflow-x-hidden">
      {/* 1. Top Navbar */}
      <Header initialSettings={siteSettings} />

      {/* 2. Hero Split-Screen Showcase with Animations */}
      <HeroSlider 
        banners={heroBanners} 
        phone={phone} 
        whatsappNumber={whatsapp} 
      />

      {/* 3. Interactive Product Catalog with Scroll Reveal */}
      <ScrollRevealSection delay={100}>
        <ProductCatalog 
          initialProducts={products} 
          speciesList={speciesList} 
          whatsappNumber={whatsapp} 
        />
      </ScrollRevealSection>

      {/* 4. Real-time CFT & Cost Calculator with Scroll Reveal */}
      <ScrollRevealSection delay={100}>
        <CftCalculator 
          initialSpecies={speciesList} 
          initialRates={calculatorRates} 
          whatsappNumber={whatsapp} 
        />
      </ScrollRevealSection>

      {/* 5. Custom Design Upload & Quotation Form with Scroll Reveal */}
      <ScrollRevealSection delay={100}>
        <CustomOrderWizard 
          speciesList={speciesList} 
          whatsappNumber={whatsapp} 
        />
      </ScrollRevealSection>

      {/* 6. Sawmill Services & Factory Tour with Scroll Reveal */}
      <ScrollRevealSection delay={100}>
        <SawmillShowcase services={sawmillServices} />
      </ScrollRevealSection>

      {/* 7. Client Reviews & Testimonials with Scroll Reveal */}
      <ScrollRevealSection delay={100}>
        <TestimonialsSection reviews={reviews} />
      </ScrollRevealSection>

      {/* 8. Footer */}
      <Footer settings={siteSettings} />

      {/* 9. Mobile Bottom Navigation */}
      <BottomNav whatsappNumber={whatsapp} />

      {/* 10. Floating Actions (WhatsApp & Call) */}
      <FloatingActions whatsappNumber={whatsapp} phone={phone} />
    </main>
  );
}
