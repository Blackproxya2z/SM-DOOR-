'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, WoodSpecies } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useQuote } from '@/context/QuoteContext';
import { ProductZoomViewer } from './ProductZoomViewer';
import { buildWhatsAppLink } from '@/lib/calculator';
import { 
  ShieldCheck, 
  MessageCircle, 
  ClipboardList, 
  Check, 
  Sparkles, 
  Clock, 
  Truck, 
  ArrowLeft,
  Star,
  Award,
  Share2,
  ChevronRight
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  speciesList: WoodSpecies[];
  relatedProducts: Product[];
  whatsappNumber: string;
}

export function ProductDetailView({ 
  product, 
  speciesList, 
  relatedProducts, 
  whatsappNumber 
}: ProductDetailViewProps) {
  const { language, t, formatPrice } = useLanguage();
  const { addItem } = useQuote();
  
  const [selectedWoodId, setSelectedWoodId] = useState<string>(
    product.defaultWoodSpeciesId || product.woodVariants[0]?.speciesId || 'ctg-teak'
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToQuoteNotice, setAddedToQuoteNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'seasoning' | 'warranty' | 'delivery'>('specs');

  const currentVariant = product.woodVariants.find(v => v.speciesId === selectedWoodId) || product.woodVariants[0];
  const currentPrice = currentVariant ? currentVariant.price : product.defaultPrice;
  const currentRegularPrice = currentVariant?.regularPrice || product.regularPrice;
  const selectedSpecies = speciesList.find(s => s.id === selectedWoodId);

  const title = language === 'bn' ? product.titleBn : product.titleEn;
  const description = language === 'bn' ? product.descriptionBn : product.descriptionEn;
  const currentWoodName = language === 'bn' 
    ? (currentVariant?.speciesNameBn || selectedSpecies?.nameBn || '')
    : (currentVariant?.speciesNameEn || selectedSpecies?.nameEn || '');
  const specs = product.specifications;

  const whatsappMsg = language === 'bn'
    ? `আসসালামু আলাইকুম এস এম ডোর,\nআমি "${product.titleBn}" অর্ডার বা বিস্তারিত জানতে আগ্রহী।\n\nকাঠের ধরন: ${currentWoodName}\nপরিমাণ: ${quantity} পিস\nমূল্য: ${formatPrice(currentPrice * quantity)}\nপণ্য লিঙ্ক: ${typeof window !== 'undefined' ? window.location.href : ''}\n\nদয়া করে ডেলিভারি ও অর্ডার প্রসেস জানাবেন।`
    : `Hello SM Door,\nI want to inquire about and order "${product.titleEn}".\n\nWood Species: ${currentWoodName}\nQuantity: ${quantity} pcs\nPrice: ${formatPrice(currentPrice * quantity)}\nProduct Link: ${typeof window !== 'undefined' ? window.location.href : ''}\n\nPlease let me know delivery and ordering details.`;

  const waLink = buildWhatsAppLink(whatsappNumber, whatsappMsg);

  const handleAddToQuote = () => {
    addItem({
      type: 'product',
      titleBn: product.titleBn,
      titleEn: product.titleEn,
      subtitleBn: `কাঠ: ${currentWoodName}`,
      subtitleEn: `Wood: ${currentWoodName}`,
      image: product.images[0],
      price: currentPrice,
      woodSpeciesBn: currentVariant?.speciesNameBn || selectedSpecies?.nameBn,
      woodSpeciesEn: currentVariant?.speciesNameEn || selectedSpecies?.nameEn,
      measurementsBn: `${specs.standardHeight} × ${specs.standardWidth}`,
      measurementsEn: `${specs.standardHeight} × ${specs.standardWidth}`,
      quantity,
      sourceUrl: `/doors/${product.slug}`,
    });
    setAddedToQuoteNotice(true);
    setTimeout(() => setAddedToQuoteNotice(false), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(language === 'bn' ? 'লিঙ্ক কপি করা হয়েছে!' : 'Link copied to clipboard!');
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-wood-500 mb-6">
        <Link href="/" className="hover:text-gold-600 transition-colors">
          {language === 'bn' ? 'হোম' : 'Home'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-wood-400" />
        <Link href="/doors" className="hover:text-gold-600 transition-colors">
          {language === 'bn' ? 'দরজার ক্যাটালগ' : 'Doors'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-wood-400" />
        <span className="text-wood-900 dark:text-wood-200 font-medium truncate max-w-xs">
          {title}
        </span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        {/* Left Column: Interactive Image Zoom Gallery (5 Cols) */}
        <div className="lg:col-span-5">
          <ProductZoomViewer
            images={product.images}
            title={title}
            badge={product.isBestSeller ? '★ Best Seller' : undefined}
          />
        </div>

        {/* Right Column: Details, Live Variant Price, and CTA (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-700 dark:text-gold-400 border border-gold-500/30">
                {language === 'bn' ? product.categoryLabelBn : product.categoryLabelEn}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                {currentVariant?.inStock ? t.product.inStock : t.product.madeToOrder}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
                <span className="text-wood-400 font-normal">({product.reviewsCount} {language === 'bn' ? 'রিভিউ' : 'reviews'})</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-wood-950 dark:text-white font-serif mb-4">
              {title}
            </h1>

            {/* Price Display */}
            <div className="p-4 rounded-2xl bg-wood-100/60 dark:bg-wood-900/60 border border-wood-200 dark:border-wood-800 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-wood-950 dark:text-gold-400 font-serif">
                  {formatPrice(currentPrice * quantity)}
                </span>
                {currentRegularPrice && (
                  <span className="text-base sm:text-lg text-wood-400 line-through">
                    {formatPrice(currentRegularPrice * quantity)}
                  </span>
                )}
                {quantity > 1 && (
                  <span className="text-xs text-wood-500">
                    ({formatPrice(currentPrice)} × {quantity})
                  </span>
                )}
              </div>
              <p className="text-xs text-wood-600 dark:text-wood-400 mt-1">
                {language === 'bn'
                  ? `নির্বাচিত কাঠ: ${currentWoodName} (সাইজ: ${specs.standardHeight} × ${specs.standardWidth})`
                  : `Selected wood: ${currentWoodName} (Size: ${specs.standardHeight} × ${specs.standardWidth})`}
              </p>
            </div>

            {/* Live Wood Species Switcher */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-wood-700 dark:text-wood-300">
                  {t.product.woodChoice}
                </label>
                <Link href="/wood" className="text-xs text-gold-600 dark:text-gold-400 hover:underline">
                  {language === 'bn' ? 'কাঠ পরিচিতি গাইড →' : 'Wood Guide →'}
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.woodVariants.map((variant) => {
                  const isSelected = variant.speciesId === selectedWoodId;
                  const name = language === 'bn' ? variant.speciesNameBn : variant.speciesNameEn;
                  const speciesMeta = speciesList.find(s => s.id === variant.speciesId);

                  return (
                    <button
                      key={variant.speciesId}
                      onClick={() => setSelectedWoodId(variant.speciesId)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-wood-950 text-white dark:bg-gold-500 dark:text-wood-950 border-wood-950 dark:border-gold-500 shadow-md ring-2 ring-gold-400/40'
                          : 'bg-white dark:bg-wood-900 text-wood-800 dark:text-wood-200 border-wood-200 dark:border-wood-800 hover:border-wood-400'
                      }`}
                    >
                      <span className="block font-bold text-xs truncate mb-0.5">{name}</span>
                      <span className={`block text-xs font-semibold ${isSelected ? 'text-gold-400 dark:text-wood-950' : 'text-wood-500 dark:text-wood-400'}`}>
                        {formatPrice(variant.price)}
                      </span>
                      {speciesMeta?.durabilityBn && (
                        <span className="block text-[10px] opacity-75 truncate mt-0.5">
                          {language === 'bn' ? speciesMeta.durabilityBn : speciesMeta.durabilityEn}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Quick Actions */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-wood-300 dark:border-wood-700 rounded-xl bg-white dark:bg-wood-900 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center font-bold text-base text-wood-700 dark:text-wood-300 hover:bg-wood-100 dark:hover:bg-wood-800 rounded-lg transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-wood-950 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center font-bold text-base text-wood-700 dark:text-wood-300 hover:bg-wood-100 dark:hover:bg-wood-800 rounded-lg transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Action Buttons: Add to Quote & WhatsApp */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToQuote}
                  className="py-3 px-4 rounded-xl border-2 border-gold-500 text-gold-600 dark:text-gold-400 hover:bg-gold-500/10 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>{language === 'bn' ? 'কোটেশন লিস্টে যোগ করুন' : 'Add to Quote'}</span>
                </button>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার' : 'Order on WhatsApp'}</span>
                </a>
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="p-3 rounded-xl border border-wood-200 dark:border-wood-800 hover:bg-wood-100 dark:hover:bg-wood-800 text-wood-600 dark:text-wood-400 transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Added Notice */}
            {addedToQuoteNotice && (
              <div className="p-3 mb-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  {language === 'bn' ? 'কোটেশন তালিকায় যুক্ত হয়েছে!' : 'Added to quote list!'}
                </span>
                <Link href="/quote" className="underline font-bold text-emerald-700 dark:text-emerald-300">
                  {language === 'bn' ? 'কোটেশন দেখুন →' : 'View Quote →'}
                </Link>
              </div>
            )}

            {/* Short Description */}
            <p className="text-sm text-wood-700 dark:text-wood-300 leading-relaxed mb-6 font-light">
              {description}
            </p>

            {/* Trust Points */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-4 border-y border-wood-200 dark:border-wood-800 text-xs text-wood-600 dark:text-wood-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>{specs.warrantyYears} {language === 'bn' ? 'বছর ওয়ারেন্টি' : 'Years Warranty'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>{specs.moistureContent}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>{language === 'bn' ? '৭-১০ দিনে প্রস্তুত' : '7-10 Days Delivery'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>{language === 'bn' ? 'সারাদেশে ডেলিভারি' : 'Nationwide Delivery'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specifications, Seasoning, Warranty, Delivery */}
      <div className="bg-white dark:bg-wood-900 rounded-3xl p-6 sm:p-8 border border-wood-200 dark:border-wood-800 shadow-sm mb-16">
        <div className="flex flex-wrap gap-2 border-b border-wood-200 dark:border-wood-800 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'specs'
                ? 'bg-wood-950 text-gold-400 dark:bg-gold-500 dark:text-wood-950 shadow-sm'
                : 'text-wood-600 dark:text-wood-400 hover:text-wood-900'
            }`}
          >
            {language === 'bn' ? 'টেকনিক্যাল স্পেসিফিকেশন' : 'Technical Specifications'}
          </button>
          <button
            onClick={() => setActiveTab('seasoning')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'seasoning'
                ? 'bg-wood-950 text-gold-400 dark:bg-gold-500 dark:text-wood-950 shadow-sm'
                : 'text-wood-600 dark:text-wood-400 hover:text-wood-900'
            }`}
          >
            {language === 'bn' ? 'সিজনিং ও ট্রিটমেন্ট' : 'Seasoning & Treatment'}
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'warranty'
                ? 'bg-wood-950 text-gold-400 dark:bg-gold-500 dark:text-wood-950 shadow-sm'
                : 'text-wood-600 dark:text-wood-400 hover:text-wood-900'
            }`}
          >
            {language === 'bn' ? 'ওয়ারেন্টি ও নিরাপত্তা' : 'Warranty & Guarantee'}
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'delivery'
                ? 'bg-wood-950 text-gold-400 dark:bg-gold-500 dark:text-wood-950 shadow-sm'
                : 'text-wood-600 dark:text-wood-400 hover:text-wood-900'
            }`}
          >
            {language === 'bn' ? 'ডেলিভারি ও ইন্সটলেশন' : 'Delivery & Fitting'}
          </button>
        </div>

        {/* Tab 1: Specifications */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-wood-100 dark:border-wood-800">
                <span className="text-wood-500">{language === 'bn' ? 'স্ট্যান্ডার্ড উচ্চতা:' : 'Standard Height:'}</span>
                <span className="font-semibold text-wood-900 dark:text-wood-100">{specs.standardHeight}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-wood-100 dark:border-wood-800">
                <span className="text-wood-500">{language === 'bn' ? 'স্ট্যান্ডার্ড চওড়া:' : 'Standard Width:'}</span>
                <span className="font-semibold text-wood-900 dark:text-wood-100">{specs.standardWidth}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-wood-100 dark:border-wood-800">
                <span className="text-wood-500">{language === 'bn' ? 'পুরুত্ব / থিকনেস:' : 'Thickness:'}</span>
                <span className="font-semibold text-wood-900 dark:text-wood-100">{specs.standardThickness}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-wood-100 dark:border-wood-800">
                <span className="text-wood-500">{language === 'bn' ? 'খোদাই ও কারুকাজ:' : 'Carving Type:'}</span>
                <span className="font-semibold text-wood-900 dark:text-wood-100">{specs.carvingDepth || '3D CNC Precision Carving'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-wood-100 dark:border-wood-800">
                <span className="text-wood-500">{language === 'bn' ? 'ব্যবহারের স্থান:' : 'Recommended Application:'}</span>
                <span className="font-semibold text-wood-900 dark:text-wood-100">
                  {language === 'bn' ? specs.suitableForBn : specs.suitableForEn}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-wood-100 dark:border-wood-800">
                <span className="text-wood-500">{language === 'bn' ? 'কাস্টম সাইজ সুবিধা:' : 'Custom Dimensions:'}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {language === 'bn' ? 'যেকোনো মাপে তৈরি সম্ভব' : 'Fully customizable to any size'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Seasoning */}
        {activeTab === 'seasoning' && (
          <div className="text-xs sm:text-sm text-wood-700 dark:text-wood-300 space-y-3">
            <p>
              <strong>{language === 'bn' ? 'সিজনিং পদ্ধতি:' : 'Seasoning Method:'}</strong> {language === 'bn' ? specs.seasoningMethodBn : specs.seasoningMethodEn}
            </p>
            <p>
              <strong>{language === 'bn' ? 'কেমিক্যাল ট্রিটমেন্ট:' : 'Chemical Treatment:'}</strong> {language === 'bn' ? specs.chemicalTreatmentBn : specs.chemicalTreatmentEn}
            </p>
            <p className="text-wood-500">
              {language === 'bn'
                ? 'এস এম ডোর নিজস্ব স্টিম ফার্নেস কিম্বন চেম্বারে কাঠকে ১২% - ১৪% আর্দ্রতায় নিয়ে আসে। ফলে সাধারণ আবহাওয়ায় কাঠ কখনো বাঁকা হয় না বা জোড়ায় ফাঁক তৈরি হয় না।'
                : 'Kiln dried under monitored vacuum chambers to guaranteed 12-14% moisture content preventing shrinkage and expansion.'}
            </p>
          </div>
        )}

        {/* Tab 3: Warranty */}
        {activeTab === 'warranty' && (
          <div className="text-xs sm:text-sm text-wood-700 dark:text-wood-300 space-y-3">
            <p className="font-bold text-wood-950 dark:text-white">
              ★ {specs.warrantyYears} {language === 'bn' ? 'বছরের অফিসিয়াল রিপ্লেসমেন্ট গ্যারান্টি' : 'Years Official Replacement Guarantee'}
            </p>
            <ul className="list-disc list-inside space-y-1 text-wood-600 dark:text-wood-400">
              <li>{language === 'bn' ? 'ঘুণপোকা ও উইপোকা আক্রমণ থেকে সম্পূর্ণ সুরক্ষা।' : 'Complete protection against borer and termite infestation.'}</li>
              <li>{language === 'bn' ? 'কাঠের অস্বাভাবিক বাঁকা হওয়া বা ফাটল ধরা থেকে ফ্রি সার্ভিস গ্যারান্টি।' : 'Free replacement guarantee against warping or structural wood splits.'}</li>
            </ul>
          </div>
        )}

        {/* Tab 4: Delivery */}
        {activeTab === 'delivery' && (
          <div className="text-xs sm:text-sm text-wood-700 dark:text-wood-300 space-y-3">
            <p>
              {language === 'bn'
                ? 'চট্টগ্রাম মেট্রোপলিটন এলাকায় সরাসরি নিজস্ব ট্রান্সপোর্টে এবং সারাদেশে যেকোনো জেলায় নিরাপদ কুরিয়ার / পিকআপ ভ্যানে ডেলিভারি দেওয়া হয়।'
                : 'Direct transport delivery within Chittagong Metro, and secured doorstep courier/pickup van dispatch across all 64 districts in Bangladesh.'}
            </p>
            <p className="text-wood-500">
              {language === 'bn' ? 'অর্ডার কনফার্মেশনের পর রেডি স্টক পণ্য ২-৩ দিনে এবং কাস্টম সাইজ ৭-১০ দিনে প্রস্তুত করা হয়।' : 'Ready stock items delivered in 2-3 days; custom dimension orders completed in 7-10 working days.'}
            </p>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-wood-950 dark:text-white font-serif">
                {language === 'bn' ? 'সংশ্লিষ্ট আরও কিছু দরজা' : 'Related Door Designs'}
              </h2>
              <p className="text-xs sm:text-sm text-wood-500">
                {language === 'bn' ? 'একই ক্যাটাগরির জনপ্রিয় অন্যান্য মডেল' : 'Other popular models in this collection'}
              </p>
            </div>
            <Link href="/doors" className="text-xs sm:text-sm font-bold text-gold-600 dark:text-gold-400 hover:underline">
              {language === 'bn' ? 'সকল দেখুন →' : 'View All →'}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel) => {
              const relTitle = language === 'bn' ? rel.titleBn : rel.titleEn;
              return (
                <Link
                  key={rel.id}
                  href={`/doors/${rel.slug}`}
                  className="group bg-white dark:bg-wood-900 rounded-2xl overflow-hidden border border-wood-200 dark:border-wood-800 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-wood-100 dark:bg-wood-850">
                    <Image
                      src={(rel.images && rel.images[0]) || rel.imageUrl || '/images/hero/hero-timber-logs.webp'}
                      alt={relTitle}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-wood-950 dark:text-white line-clamp-1 mb-1 group-hover:text-gold-600 transition-colors">
                      {relTitle}
                    </h3>
                    <span className="text-sm font-extrabold text-gold-600 dark:text-gold-400">
                      {formatPrice(rel.defaultPrice)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
