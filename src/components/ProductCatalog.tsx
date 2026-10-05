'use client';

import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Product, WoodSpecies } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { buildWhatsAppLink } from '@/lib/calculator';
import { DEFAULT_BLUR_DATA_URL } from '@/lib/image-utils';
import { ProductModal } from './ProductModal';
import { ProductLightbox } from './ProductLightbox';
import { 
  Search, 
  Filter, 
  Sparkles, 
  MessageCircle, 
  Eye, 
  Layers,
  ArrowUpDown,
  RotateCcw,
  Maximize2,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface ProductCatalogProps {
  initialProducts: Product[];
  speciesList: WoodSpecies[];
  whatsappNumber?: string;
}

export function ProductCatalog({ 
  initialProducts, 
  speciesList, 
  whatsappNumber = "+8801710820987" 
}: ProductCatalogProps) {
  const { language, t, formatPrice } = useLanguage();
  
  // State
  const [products] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  
  // Modals state
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);
  const [lightboxImageIdx, setLightboxImageIdx] = useState(0);

  // Local card state for live wood variant switcher per card
  const [cardWoodSelection, setCardWoodSelection] = useState<Record<string, string>>({});

  const handleCardWoodChange = (productId: string, speciesId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardWoodSelection(prev => ({ ...prev, [productId]: speciesId }));
  };

  // 8 Defined Categories with descriptions
  const categories = useMemo(() => [
    { 
      id: 'door', 
      labelBn: 'দরজা', 
      labelEn: 'Solid Wooden Doors',
      descBn: 'চিটাগাং সেগুন, সিজনড মেহগনি ও গামারির আধুনিক ও ক্লাসিক মেইন এন্ট্রান্স এবং বেডরুম ডোর।',
      descEn: 'Handcrafted main entrance and interior doors built with mature seasoned timber.'
    },
    { 
      id: 'wood', 
      labelBn: 'কাঠ ও চৌকাঠ', 
      labelEn: 'Timber Logs & Sawn Wood',
      descBn: '১০০% ফার্নেস কিম্বন ড্রাইড ও কেমিক্যাল ট্রিটমেন্ট করা খাঁটি সলিড কাঠ ও ভারী দরজার চৌকাঠ।',
      descEn: 'Kiln-seasoned sawn timber, planks, and heavy door frames.'
    },
    { 
      id: 'bed', 
      labelBn: 'বেড / খাট', 
      labelEn: 'Luxury Beds',
      descBn: 'রাজকীয় কারুকাজে তৈরি সলিড সেগুন ও মেহগনির কিং ও কুইন সাইজ মজবুত খাট।',
      descEn: 'Royal master-carved king and queen size solid wood beds.'
    },
    { 
      id: 'dining-table', 
      labelBn: 'ডাইনিং টেবিল', 
      labelEn: 'Dining Tables & Chairs',
      descBn: '৬ ও ৮ সিটার লাক্সারি সেগুন কাঠের ডাইনিং টেবিল ও কুশন চেয়ার সেট।',
      descEn: '6 & 8-seater luxury dining tables crafted with premium hardwood.'
    },
    { 
      id: 'sofa', 
      labelBn: 'সোফা সেট', 
      labelEn: 'Wooden Sofas',
      descBn: 'ড্রয়িং রুমের আভিজাত্য বাড়াতে ৩+১+১ ভিক্টোরিয়ান ও এল-শেপ কাঠের সোফা।',
      descEn: 'Victorian 3+1+1 and L-shaped solid wooden sofas.'
    },
    { 
      id: 'tea-table', 
      labelBn: 'টি টেবিল', 
      labelEn: 'Coffee & Tea Tables',
      descBn: 'হ্যান্ড-কার্ভড সলিড উডেন সেন্টার টেবিল ও নেস্টেড কফি টেবিল সেট।',
      descEn: 'Hand-carved solid wood center tables and nested coffee tables.'
    },
    { 
      id: 'furniture', 
      labelBn: 'ফার্নিচার', 
      labelEn: 'Home Furniture',
      descBn: 'ড্রেসিং টেবিল, আলমিরা, ওয়ার্ডরোব, লাক্সারি বুকশেলফ ও শোকেস কালেকশন।',
      descEn: 'Dressing tables, wardrobes, showcases, and custom cabinets.'
    },
    { 
      id: 'custom-design', 
      labelBn: 'কাস্টম ডিজাইন', 
      labelEn: 'Custom Architectural Works',
      descBn: 'আপনার নিজস্ব ড্রয়িং বা ডিজাইনে ১০০% নিখুঁত পরিমাপে তৈরি এক্সক্লুসিভ কাঠের সামগ্রী।',
      descEn: 'Custom woodwork made exactly to your architectural sketches.'
    },
  ], []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Species filter
        if (selectedSpecies !== 'all') {
          const hasSpecies = p.defaultWoodSpeciesId === selectedSpecies || 
            p.woodVariants.some(v => v.speciesId === selectedSpecies);
          if (!hasSpecies) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNumber = p.designNumber?.toLowerCase().includes(q) || false;
          const matchTitle = p.titleBn.toLowerCase().includes(q) || p.titleEn.toLowerCase().includes(q);
          const matchDesc = p.descriptionBn.toLowerCase().includes(q) || p.descriptionEn.toLowerCase().includes(q);
          if (!matchNumber && !matchTitle && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.defaultPrice - b.defaultPrice;
        if (sortBy === 'price-desc') return b.defaultPrice - a.defaultPrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [products, selectedCategory, selectedSpecies, searchQuery, sortBy]);

  // Quick jump to category section
  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') return;
    
    // Smooth scroll to category section
    setTimeout(() => {
      const el = document.getElementById(`cat-section-${catId}`);
      if (el) {
        const offset = 140; // account for sticky header and sticky bar
        const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 50);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSpecies('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const openLightbox = (product: Product, imgIdx = 0, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxProduct(product);
    setLightboxImageIdx(imgIdx);
  };

  // Render a single product card
  const renderProductCard = (product: Product) => {
    const chosenWoodId = cardWoodSelection[product.id] || product.defaultWoodSpeciesId || product.woodVariants[0]?.speciesId;
    const currentVariant = product.woodVariants.find(v => v.speciesId === chosenWoodId) || product.woodVariants[0];
    const livePrice = currentVariant ? currentVariant.price : product.defaultPrice;
    const liveWoodName = language === 'bn' 
      ? (currentVariant?.speciesNameBn || 'চিটাগাং সেগুন')
      : (currentVariant?.speciesNameEn || 'Chittagong Teak');

    const title = language === 'bn' ? product.titleBn : product.titleEn;
    const specs = product.specifications;
    const imageSrc = product.imagePath || product.images?.[0] || '/images/hero/banner-1.webp';

    const waMsg = language === 'bn'
      ? `আসসালামু আলাইকুম, আমি এস এম ডোর-এর "${product.titleBn}" (ডিজাইন: ${product.designNumber}, কাঠ: ${liveWoodName}, মূল্য: ${formatPrice(livePrice)}) সম্পর্কে জানতে চাই।`
      : `Hello, I want to inquire about "${product.titleEn}" (Design: ${product.designNumber}, Wood: ${liveWoodName}, Price: ${formatPrice(livePrice)}) from SM Door.`;
    const cardWaLink = buildWhatsAppLink(whatsappNumber, waMsg);

    return (
      <div
        key={product.id}
        className="group relative flex flex-col justify-between bg-white rounded-2xl overflow-hidden border border-[#E8DED4] shadow-md hover:shadow-xl hover:border-[#C59B27] hover:-translate-y-1 transition-all duration-300"
      >
        {/* Product Image: Fixed 4:3 Aspect Ratio with Next.js Image & Blur Shimmer */}
        <div 
          className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF8F5] cursor-pointer"
          onClick={() => openLightbox(product, 0)}
        >
          <Image
            src={imageSrc}
            alt={product.altText || title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL={DEFAULT_BLUR_DATA_URL}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />

          {/* Hover Overlay with Lightbox Indicator */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3.5 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 text-xs text-white font-semibold bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
              <Eye className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>{language === 'bn' ? 'ফুল-স্ক্রিন ভিউ' : 'Lightbox View'}</span>
            </span>
            <Maximize2 className="w-4 h-4 text-white" />
          </div>

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
            <span className="bg-[#2B1A12]/90 backdrop-blur-md text-[#C59B27] text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow border border-[#C59B27]/30">
              {product.designNumber}
            </span>
            {product.isBestSeller && (
              <span className="bg-gradient-to-r from-[#C59B27] to-[#B07818] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                ★ Best Seller
              </span>
            )}
          </div>

          <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md text-[#2B1A12] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow border border-[#E8DED4]">
            <span className="text-amber-500">★</span>
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Title */}
            <h3 
              onClick={() => setActiveModalProduct(product)}
              className="font-[family-name:var(--font-tiro-bangla)] text-sm sm:text-base font-semibold text-[#2B1A12] hover:text-[#C59B27] transition-colors line-clamp-1 mb-2 cursor-pointer"
              title={title}
            >
              {title}
            </h3>

            {/* Live Wood Variant Switcher */}
            <div className="mb-3">
              <span className="text-[10px] font-semibold text-[#7A6A5F] block mb-1">
                {t.product.woodChoice}:
              </span>
              <div className="flex flex-wrap gap-1">
                {product.woodVariants.slice(0, 3).map((v) => {
                  const isSelected = v.speciesId === chosenWoodId;
                  const name = language === 'bn' ? v.speciesNameBn : v.speciesNameEn;
                  return (
                    <button
                      key={v.speciesId}
                      onClick={(e) => handleCardWoodChange(product.id, v.speciesId, e)}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all border ${
                        isSelected
                          ? 'bg-[#2B1A12] text-white border-[#2B1A12] shadow-sm'
                          : 'bg-[#F4ECE1] text-[#7A6A5F] border-[#E8DED4] hover:border-[#C59B27]'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Compact Specs */}
            <div className="text-[11px] text-[#7A6A5F] space-y-0.5 mb-3 pb-2.5 border-b border-[#E8DED4]">
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'সাইজ:' : 'Size:'}</span>
                <span className="font-semibold text-[#2B1A12] truncate ml-1">{specs.standardHeight} × {specs.standardWidth}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'আর্দ্রতা:' : 'Kiln Moisture:'}</span>
                <span className="font-semibold text-emerald-700">{specs.moistureContent}</span>
              </div>
            </div>
          </div>

          {/* Pricing & Actions */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-[10px] text-[#7A6A5F] uppercase tracking-wider block">
                  {liveWoodName}
                </span>
                <span className="text-base sm:text-xl font-bold text-[#C59B27]">
                  {formatPrice(livePrice)}
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {currentVariant?.inStock ? t.product.inStock : t.product.madeToOrder}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <button
                onClick={() => setActiveModalProduct(product)}
                className="py-2 px-2 rounded-xl border border-[#E8DED4] text-xs font-semibold text-[#2B1A12] hover:bg-[#FAF8F5] hover:border-[#C59B27] transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                <Eye className="w-3.5 h-3.5 text-[#7A6A5F]" />
                <span className="truncate">{language === 'bn' ? 'বিস্তারিত' : 'Specs'}</span>
              </button>

              <a
                href={cardWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-1 active:scale-95 hover:scale-105"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'অর্ডার' : 'Order'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="catalog" className="py-12 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C59B27]/10 text-[#C59B27] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C59B27]/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'প্রিমিয়াম উড গ্যালারি ও ক্যাটালগ' : 'Luxury Timber Product Gallery'}</span>
          </div>
          <h2 className="font-[family-name:var(--font-tiro-bangla)] text-2xl sm:text-4xl font-bold text-[#2B1A12] tracking-tight mb-4">
            {language === 'bn' 
              ? 'ক্যাটাগরি-ভিত্তিক প্রোডাক্ট গ্যালারি' 
              : 'Category-Wise Solid Timber Collection'}
          </h2>
          <p className="font-[family-name:var(--font-hind-siliguri)] text-sm sm:text-base text-[#7A6A5F]">
            {language === 'bn'
              ? 'চিটাগাং সেগুন, মেহগনি ও গামারি কাঠে প্রস্তুতকৃত আমাদের প্রতিটি দরজার হাই-রেজুলেশন ছবি ও লাইভ দাম দেখুন।'
              : 'Browse high-resolution photographs and live timber rates across all our custom handcrafted categories.'}
          </p>
        </div>

        {/* Search & Species Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#E8DED4] mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6A5F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'মডেল, ডিজাইন নম্বর বা কাঠের নাম দিয়ে খুঁজুন...' : 'Search by design number, model, or timber...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] text-sm text-[#2B1A12] placeholder:text-[#7A6A5F] focus:outline-none focus:border-[#C59B27] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="w-4 h-4 text-[#7A6A5F] flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] text-sm text-[#2B1A12] focus:outline-none focus:border-[#C59B27] transition-colors cursor-pointer"
              >
                <option value="featured">{t.filter.mostPopular}</option>
                <option value="price-asc">{t.filter.priceLowToHigh}</option>
                <option value="price-desc">{t.filter.priceHighToLow}</option>
                <option value="rating">রেটিং (সর্বোচ্চ)</option>
              </select>
            </div>
          </div>

          {/* Timber Species Filter Pills */}
          <div className="mt-3 pt-3 border-t border-[#E8DED4] flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-[#7A6A5F] mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              {language === 'bn' ? 'কাঠের প্রজাতি:' : 'Species:'}
            </span>
            <button
              onClick={() => setSelectedSpecies('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedSpecies === 'all'
                  ? 'bg-[#C59B27] text-white font-bold shadow-sm'
                  : 'bg-[#F4ECE1] text-[#7A6A5F] hover:bg-[#E8DED4]'
              }`}
            >
              {t.filter.allSpecies}
            </button>
            {speciesList.map((sp) => {
              const isSelected = selectedSpecies === sp.id;
              return (
                <button
                  key={sp.id}
                  onClick={() => setSelectedSpecies(sp.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#C59B27] text-white font-bold shadow-sm'
                      : 'bg-[#F4ECE1] text-[#7A6A5F] hover:bg-[#E8DED4]'
                  }`}
                >
                  {language === 'bn' ? sp.nameBn : sp.nameEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky Category Quick Jump & Filter Bar */}
        <div className="sticky top-[64px] sm:top-[72px] z-30 -mx-4 sm:mx-0 px-4 sm:px-0 mb-8 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-none sm:rounded-2xl p-2.5 sm:p-3 shadow-md border-y sm:border border-[#E8DED4] overflow-x-auto scrollbar-none flex items-center gap-2">
            {/* All Products Tab */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-[#2B1A12] text-white shadow-md'
                  : 'bg-[#F4ECE1] text-[#7A6A5F] hover:bg-[#E8DED4]'
              }`}
            >
              <span>{language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'all' 
                  ? 'bg-[#C59B27] text-white font-extrabold' 
                  : 'bg-[#E8DED4] text-[#2B1A12]'
              }`}>
                {products.length}
              </span>
            </button>

            {/* Individual Category Tabs */}
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const catCount = products.filter(p => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#2B1A12] text-white shadow-md'
                      : 'bg-[#F4ECE1] text-[#7A6A5F] hover:bg-[#E8DED4]'
                  }`}
                >
                  <span>{language === 'bn' ? cat.labelBn : cat.labelEn}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive 
                      ? 'bg-[#C59B27] text-white font-extrabold' 
                      : 'bg-[#E8DED4] text-[#2B1A12]'
                  }`}>
                    {catCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty Search/Filter State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DED4] p-8 max-w-md mx-auto shadow-sm">
            <Layers className="w-12 h-12 text-[#7A6A5F] mx-auto mb-4" />
            <h3 className="text-base font-bold text-[#2B1A12] mb-2">
              {t.filter.noProductsFound}
            </h3>
            <p className="text-xs text-[#7A6A5F] mb-4">
              আপনার ফিল্টারের সাথে কোনো পণ্য মেলেনি। ফিল্টার রিসেট করে পুনরায় চেষ্টা করুন।
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#2B1A12] hover:bg-[#C59B27] text-white rounded-xl text-xs font-bold transition-colors"
            >
              {t.filter.resetFilters}
            </button>
          </div>
        )}

        {/* VIEW MODE 1: Category-Wise Separate Sections (when "all" is selected and no search) */}
        {selectedCategory === 'all' && !searchQuery.trim() && selectedSpecies === 'all' ? (
          <div className="space-y-16">
            {categories.map((cat) => {
              const catProducts = products.filter(p => p.category === cat.id);
              if (catProducts.length === 0) return null;

              return (
                <div 
                  key={cat.id} 
                  id={`cat-section-${cat.id}`} 
                  className="scroll-mt-40"
                >
                  {/* Category Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-[#E8DED4]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-6 rounded-full bg-[#C59B27] block" />
                        <h3 className="font-[family-name:var(--font-tiro-bangla)] text-xl sm:text-2xl font-bold text-[#2B1A12]">
                          {language === 'bn' ? cat.labelBn : cat.labelEn}
                        </h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F4ECE1] text-[#7A6A5F] border border-[#E8DED4] font-bold">
                          {catProducts.length} {language === 'bn' ? 'টি ডিজাইন' : 'items'}
                        </span>
                      </div>
                      <p className="font-[family-name:var(--font-hind-siliguri)] text-xs sm:text-sm text-[#7A6A5F] max-w-2xl pl-4">
                        {language === 'bn' ? cat.descBn : cat.descEn}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCategoryClick(cat.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#C59B27] hover:underline pl-4 sm:pl-0"
                    >
                      <span>{language === 'bn' ? 'শুধু এই ক্যাটাগরি দেখুন' : 'View only category'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Responsive Grid: Mobile 2-col, Tablet 3-col, Desktop 4-col */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
                    {catProducts.map((product) => renderProductCard(product))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* VIEW MODE 2: Filtered Grid (Mobile 2-col, Tablet 3-col, Desktop 4-col) */
          <div>
            <div className="flex items-center justify-between mb-6 text-xs text-[#7A6A5F]">
              <span className="font-semibold">
                {language === 'bn' 
                  ? `মোট ${filteredProducts.length} টি পণ্য প্রদর্শিত হচ্ছে` 
                  : `Showing ${filteredProducts.length} products`}
              </span>
              {(selectedCategory !== 'all' || selectedSpecies !== 'all' || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-[#C59B27] font-bold hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  {t.filter.resetFilters}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {filteredProducts.map((product) => renderProductCard(product))}
            </div>
          </div>
        )}

      </div>

      {/* Full-Screen Swipeable Lightbox Modal */}
      <ProductLightbox
        isOpen={!!lightboxProduct}
        product={lightboxProduct}
        initialImageIdx={lightboxImageIdx}
        onClose={() => setLightboxProduct(null)}
        whatsappNumber={whatsappNumber}
      />

      {/* Product Details & Wood Variant Modal */}
      {activeModalProduct && (
        <ProductModal
          product={activeModalProduct}
          speciesList={speciesList}
          whatsappNumber={whatsappNumber}
          onClose={() => setActiveModalProduct(null)}
        />
      )}
    </section>
  );
}
