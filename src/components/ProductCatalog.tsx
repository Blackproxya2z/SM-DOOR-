'use client';

import React, { useState, useMemo } from 'react';
import { Product, WoodSpecies } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { buildWhatsAppLink } from '@/lib/calculator';
import { ProductModal } from './ProductModal';
import { 
  Search, 
  Filter, 
  Sparkles, 
  MessageCircle, 
  Eye, 
  Check, 
  Layers,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';

interface ProductCatalogProps {
  initialProducts: Product[];
  speciesList: WoodSpecies[];
  whatsappNumber?: string;
}

export function ProductCatalog({ initialProducts, speciesList, whatsappNumber = "+8801710820987" }: ProductCatalogProps) {
  const { language, t, formatPrice } = useLanguage();
  
  // State
  const [products] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Local card state for live wood variant switcher per card: productId -> selectedSpeciesId
  const [cardWoodSelection, setCardWoodSelection] = useState<Record<string, string>>({});

  const handleCardWoodChange = (productId: string, speciesId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardWoodSelection(prev => ({ ...prev, [productId]: speciesId }));
  };

  // 8 Defined Categories
  const categories = [
    { id: 'all', labelBn: 'সকল প্রোডাক্ট ও ডিজাইন', labelEn: 'All Products & Designs' },
    { id: 'wood', labelBn: 'কাঠ / লগ ও সাইজ কাঠ', labelEn: 'Wood / Logs & Sized Wood' },
    { id: 'door', labelBn: 'দরজা', labelEn: 'Door' },
    { id: 'furniture', labelBn: 'ফার্নিচার', labelEn: 'Furniture' },
    { id: 'dining-table', labelBn: 'ডাইনিং টেবিল', labelEn: 'Dining Table' },
    { id: 'bed', labelBn: 'বেড / খাট', labelEn: 'Bed' },
    { id: 'tea-table', labelBn: 'টি টেবিল', labelEn: 'Tea Table' },
    { id: 'sofa', labelBn: 'সোফা', labelEn: 'Sofa' },
    { id: 'custom-design', labelBn: 'কাস্টম ডিজাইন', labelEn: 'Custom Design' },
  ];

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
        // Default: featured first
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [products, selectedCategory, selectedSpecies, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSpecies('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section id="catalog" className="py-16 sm:py-24 bg-wood-50/50 dark:bg-wood-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-gold-700 dark:text-gold-400 text-xs font-bold uppercase tracking-wider mb-3 border border-gold-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'প্রিমিয়াম কাঠের ক্যাটালগ' : 'Luxury Timber Catalog'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-wood-950 dark:text-white tracking-tight mb-4">
            {language === 'bn' 
              ? 'নিখুঁত কারুকাজ ও খাঁটি কাঠের দরজার কালেকশন' 
              : 'Mastercrafted Solid Wooden Doors & Chowkaths'}
          </h2>
          <p className="text-sm sm:text-base text-wood-600 dark:text-wood-300">
            {language === 'bn'
              ? 'চিটাগাং সেগুন, মেহগনি ও গামারি কাঠে প্রস্তুতকৃত আমাদের প্রতিটি দরজার দাম কাঠভেদে সরাসরি তুলনা করুন।'
              : 'Compare live prices across authentic Chittagong Teak, Seasoned Mahogany, and Gamari for every door model.'}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white dark:bg-wood-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-wood-200 dark:border-wood-800 mb-10">
          {/* Top Row: Search and Sort */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-wood-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'দরজা বা কাঠের নাম দিয়ে খুঁজুন...' : 'Search by door design or wood type...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-wood-50/50 dark:bg-wood-950 text-sm text-wood-900 dark:text-white placeholder:text-wood-400 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="w-4 h-4 text-wood-400 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-wood-50/50 dark:bg-wood-950 text-sm text-wood-900 dark:text-white focus:outline-none focus:border-gold-500 transition-colors cursor-pointer"
              >
                <option value="featured">{t.filter.mostPopular}</option>
                <option value="price-asc">{t.filter.priceLowToHigh}</option>
                <option value="price-desc">{t.filter.priceHighToLow}</option>
                <option value="rating">Rating (Highest)</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-wood-950 dark:bg-gold-500 text-white dark:text-wood-950 shadow-md'
                      : 'bg-wood-100 dark:bg-wood-800 text-wood-700 dark:text-wood-300 hover:bg-wood-200 dark:hover:bg-wood-700'
                  }`}
                >
                  {language === 'bn' ? cat.labelBn : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Wood Species Pills */}
          <div className="pt-3 border-t border-wood-100 dark:border-wood-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-wood-500 dark:text-wood-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              {language === 'bn' ? 'কাঠের ধরন:' : 'Timber:'}
            </span>
            <button
              onClick={() => setSelectedSpecies('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedSpecies === 'all'
                  ? 'bg-gold-500 text-wood-950 font-bold'
                  : 'bg-wood-100 dark:bg-wood-800/80 text-wood-600 dark:text-wood-300 hover:bg-wood-200'
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
                      ? 'bg-gold-500 text-wood-950 font-bold'
                      : 'bg-wood-100 dark:bg-wood-800/80 text-wood-600 dark:text-wood-300 hover:bg-wood-200'
                  }`}
                >
                  {language === 'bn' ? sp.nameBn : sp.nameEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Reset */}
        <div className="flex items-center justify-between mb-6 text-xs text-wood-500 dark:text-wood-400">
          <span>
            {language === 'bn' 
              ? `${filteredProducts.length} ${t.filter.showingCount}` 
              : `${filteredProducts.length} ${t.filter.showingCount}`}
          </span>
          {(selectedCategory !== 'all' || selectedSpecies !== 'all' || searchQuery) && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-gold-600 dark:text-gold-400 font-semibold hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              {t.filter.resetFilters}
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-wood-900 rounded-2xl border border-wood-200 dark:border-wood-800 p-8 max-w-md mx-auto">
            <Layers className="w-12 h-12 text-wood-400 mx-auto mb-4" />
            <h3 className="text-base font-bold text-wood-900 dark:text-white mb-2">
              {t.filter.noProductsFound}
            </h3>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-wood-900 text-white rounded-lg text-xs font-semibold hover:bg-wood-800"
            >
              {t.filter.resetFilters}
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const chosenWoodId = cardWoodSelection[product.id] || product.defaultWoodSpeciesId || product.woodVariants[0]?.speciesId;
            const currentVariant = product.woodVariants.find(v => v.speciesId === chosenWoodId) || product.woodVariants[0];
            const livePrice = currentVariant ? currentVariant.price : product.defaultPrice;
            const liveWoodName = language === 'bn' 
              ? (currentVariant?.speciesNameBn || 'চিটাগাং সেগুন')
              : (currentVariant?.speciesNameEn || 'Chittagong Teak');

            const title = language === 'bn' ? product.titleBn : product.titleEn;
            const specs = product.specifications;

            // WhatsApp link for this product
            const waMsg = language === 'bn'
              ? `আসসালামু আলাইকুম, আমি এস এম ডোর-এর "${product.titleBn}" (কাঠ: ${liveWoodName}, মূল্য: ${formatPrice(livePrice)}) সম্পর্কে জানতে চাই।`
              : `Hello, I want to inquire about "${product.titleEn}" (Wood: ${liveWoodName}, Price: ${formatPrice(livePrice)}) from SM Door.`;
            const cardWaLink = buildWhatsAppLink(whatsappNumber, waMsg);

            return (
              <div
                key={product.id}
                className="wood-card overflow-hidden flex flex-col justify-between group hover:border-gold-500/80 transition-all duration-300"
              >
                {/* Product Image & Badges */}
                <div 
                  className="relative aspect-[4/3] w-full overflow-hidden bg-wood-100 cursor-pointer"
                  onClick={() => setActiveModalProduct(product)}
                >
                  <img
                    src={product.images[0]}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs text-white font-semibold flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gold-400" />
                      {t.product.viewDetails}
                    </span>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-wood-950/80 backdrop-blur-md text-gold-300 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      {language === 'bn' ? product.categoryLabelBn : product.categoryLabelEn}
                    </span>
                    {product.isBestSeller && (
                      <span className="bg-gradient-to-r from-amber-600 to-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        ★ Best Seller
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 bg-wood-950/80 backdrop-blur-md text-wood-100 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <span className="text-amber-400">★</span>
                    <span>{product.rating}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3 
                      onClick={() => setActiveModalProduct(product)}
                      className="text-base sm:text-lg font-bold text-wood-950 dark:text-white hover:text-gold-600 transition-colors line-clamp-1 mb-2 cursor-pointer"
                    >
                      {title}
                    </h3>

                    {/* Live Wood Variant Switcher Pill Buttons */}
                    <div className="mb-4">
                      <span className="text-[11px] font-semibold text-wood-500 dark:text-wood-400 block mb-1.5">
                        {t.product.woodChoice}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {product.woodVariants.map((v) => {
                          const isSelected = v.speciesId === chosenWoodId;
                          const name = language === 'bn' ? v.speciesNameBn : v.speciesNameEn;
                          return (
                            <button
                              key={v.speciesId}
                              onClick={(e) => handleCardWoodChange(product.id, v.speciesId, e)}
                              className={`text-[10px] px-2 py-1 rounded-md font-semibold transition-all border ${
                                isSelected
                                  ? 'bg-wood-950 text-gold-400 border-wood-950 dark:bg-gold-500 dark:text-wood-950 dark:border-gold-500 shadow-sm'
                                  : 'bg-wood-100/80 dark:bg-wood-850 text-wood-700 dark:text-wood-300 border-wood-200 dark:border-wood-750 hover:border-wood-400'
                              }`}
                            >
                              {name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Specs summary */}
                    <div className="text-[11px] text-wood-600 dark:text-wood-400 space-y-1 mb-4 pb-3 border-b border-wood-100 dark:border-wood-800">
                      <div className="flex justify-between">
                        <span>{language === 'bn' ? 'স্ট্যান্ডার্ড সাইজ:' : 'Standard Size:'}</span>
                        <span className="font-semibold text-wood-900 dark:text-wood-200">{specs.standardHeight} × {specs.standardWidth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'bn' ? 'সিজনিং আর্দ্রতা:' : 'Kiln Moisture:'}</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{specs.moistureContent}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="text-[10px] text-wood-500 uppercase tracking-wider block">
                          {liveWoodName}
                        </span>
                        <span className="text-xl sm:text-2xl font-extrabold text-wood-950 dark:text-gold-400">
                          {formatPrice(livePrice)}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        {currentVariant?.inStock ? t.product.inStock : t.product.madeToOrder}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setActiveModalProduct(product)}
                        className="py-2.5 px-3 rounded-xl border border-wood-300 dark:border-wood-700 text-xs font-semibold text-wood-800 dark:text-wood-200 hover:bg-wood-100 dark:hover:bg-wood-800 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t.product.viewDetails}</span>
                      </button>

                      <a
                        href={cardWaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'অর্ডার' : 'Order'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Modal */}
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
