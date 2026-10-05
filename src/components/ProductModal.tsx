'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, WoodSpecies } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useQuote } from '@/context/QuoteContext';
import { buildWhatsAppLink } from '@/lib/calculator';
import { 
  X, 
  ShieldCheck, 
  Check, 
  MessageCircle, 
  Layers, 
  Clock, 
  FileText, 
  Award,
  Sparkles,
  ClipboardList,
  ExternalLink
} from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  speciesList: WoodSpecies[];
  onClose: () => void;
  whatsappNumber?: string;
}

export function ProductModal({ product, speciesList, onClose, whatsappNumber = "+8801710820987" }: ProductModalProps) {
  const { language, t, formatPrice } = useLanguage();
  const { addItem } = useQuote();
  const [addedToQuote, setAddedToQuote] = useState(false);
  const [selectedWoodId, setSelectedWoodId] = useState<string>(
    product?.defaultWoodSpeciesId || product?.woodVariants[0]?.speciesId || 'ctg-teak'
  );
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!product) return null;

  // Find the selected variant pricing
  const currentVariant = product.woodVariants.find(v => v.speciesId === selectedWoodId) || product.woodVariants[0];
  const currentPrice = currentVariant ? currentVariant.price : product.defaultPrice;
  const currentRegularPrice = currentVariant?.regularPrice || product.regularPrice;

  // Selected species info
  const selectedSpecies = speciesList.find(s => s.id === selectedWoodId);

  const title = language === 'bn' ? product.titleBn : product.titleEn;
  const description = language === 'bn' ? product.descriptionBn : product.descriptionEn;
  const features = language === 'bn' ? product.featuresBn : product.featuresEn;
  const specs = product.specifications;

  const currentWoodName = language === 'bn' 
    ? (currentVariant?.speciesNameBn || selectedSpecies?.nameBn || '')
    : (currentVariant?.speciesNameEn || selectedSpecies?.nameEn || '');

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
      quantity: 1,
      sourceUrl: `/doors/${product.slug}`,
    });
    setAddedToQuote(true);
    setTimeout(() => setAddedToQuote(false), 3000);
  };

  // Pre-filled WhatsApp message
  const whatsappMsg = language === 'bn'
    ? `আসসালামু আলাইকুম, আমি এস এম ডোর-এর "${product.titleBn}" (কাঠ: ${currentWoodName}, মূল্য: ${formatPrice(currentPrice)}) সম্পর্কে বিস্তারিত জানতে ও অর্ডার দিতে আগ্রহী।`
    : `Hello, I am interested in inquiring and ordering "${product.titleEn}" (Wood: ${currentWoodName}, Price: ${formatPrice(currentPrice)}) from SM Door.`;

  const waLink = buildWhatsAppLink(whatsappNumber, whatsappMsg);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white text-[#2B1A12] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-[#E8DED4] my-0 sm:my-8 max-h-[92vh] sm:max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Pill */}
        <div className="sm:hidden w-12 h-1.5 bg-[#E8DED4] rounded-full mx-auto mt-2.5 mb-1" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 p-2 rounded-full bg-[#2B1A12]/80 hover:bg-[#2B1A12] text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto flex-1 font-[family-name:var(--font-hind-siliguri)]">
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-[#FAF8F5] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8DED4]">
            <div>
              {/* Main Image */}
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#F4ECE1] shadow-md mb-4 border border-[#E8DED4]">
                <Image
                  src={(product.images && product.images[activeImageIdx]) || (product.images && product.images[0]) || product.imageUrl || '/images/hero/hero-timber-logs.webp'}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-all duration-300"
                />
                {product.isBestSeller && (
                  <span className="absolute top-3 left-3 bg-[#C59B27] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider z-10 font-[family-name:var(--font-hind-siliguri)]">
                    ★ সেরা বিক্রয়
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeImageIdx === idx ? 'border-[#C59B27] scale-105' : 'border-[#E8DED4] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt="Thumbnail" fill sizes="64px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality Badges */}
            <div className="mt-6 pt-4 border-t border-[#E8DED4] grid grid-cols-2 gap-3 text-xs text-[#7A6A5F]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{specs?.warrantyYears} {language === 'bn' ? 'বছরের ওয়ারেন্টি' : 'Years Warranty'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C59B27] flex-shrink-0" />
                <span>{specs?.moistureContent}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Wood Selection */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C59B27] bg-[#C59B27]/10 px-2.5 py-1 rounded-full border border-[#C59B27]/25">
                  {language === 'bn' ? product.categoryLabelBn : product.categoryLabelEn}
                </span>
                <div className="flex items-center text-[#C59B27] text-xs font-bold gap-1">
                  <span>★ {product.rating}</span>
                  <span className="text-[#7A6A5F]">({product.reviewsCount})</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] leading-tight mb-3">
                {title}
              </h2>

              {/* Price Block */}
              <div className="p-4 rounded-xl bg-[#F4ECE1] border border-[#E8DED4] mb-6">
                <span className="text-xs text-[#7A6A5F] block mb-1">
                  {t.product.priceFor} <strong className="text-[#2B1A12]">{currentWoodName}</strong>
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#C59B27] font-serif">
                    {formatPrice(currentPrice)}
                  </span>
                  {currentRegularPrice && currentRegularPrice > currentPrice && (
                    <span className="text-sm line-through text-[#7A6A5F]">
                      {formatPrice(currentRegularPrice)}
                    </span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <Check className="w-3 h-3" />
                    {currentVariant?.inStock ? t.product.inStock : t.product.madeToOrder}
                  </span>
                </div>
              </div>

              {/* Wood Species Variant Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2B1A12] mb-2">
                  {t.product.woodChoice}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.woodVariants.map((variant) => {
                    const isSelected = variant.speciesId === selectedWoodId;
                    const vName = language === 'bn' ? variant.speciesNameBn : variant.speciesNameEn;
                    return (
                      <button
                        key={variant.speciesId}
                        onClick={() => setSelectedWoodId(variant.speciesId)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#C59B27] bg-[#C59B27]/10 text-[#2B1A12] shadow-sm ring-1 ring-[#C59B27]'
                            : 'border-[#E8DED4] hover:border-[#C59B27] text-[#7A6A5F] bg-white'
                        }`}
                      >
                        <span className="text-xs font-bold leading-snug">{vName}</span>
                        <span className="text-xs font-semibold text-[#C59B27] mt-1">
                          {formatPrice(variant.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-[#7A6A5F] mt-2">
                  {t.product.selectWoodToSeePrice}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-[#7A6A5F] leading-relaxed mb-5">
                {description}
              </p>

              {/* Technical Specifications Table */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B1A12] mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#C59B27]" />
                  {t.product.specifications}
                </h4>
                <div className="text-xs border border-[#E8DED4] rounded-lg overflow-hidden divide-y divide-[#E8DED4]">
                  <div className="grid grid-cols-2 p-2 bg-[#FAF8F5]">
                    <span className="text-[#7A6A5F] font-medium">{t.product.height} & {t.product.width}</span>
                    <span className="text-[#2B1A12] font-semibold">{specs.standardHeight} × {specs.standardWidth}</span>
                  </div>
                  <div className="grid grid-cols-2 p-2 bg-white">
                    <span className="text-[#7A6A5F] font-medium">{t.product.thickness}</span>
                    <span className="text-[#2B1A12] font-semibold">{specs.standardThickness}</span>
                  </div>
                  <div className="grid grid-cols-2 p-2 bg-[#FAF8F5]">
                    <span className="text-[#7A6A5F] font-medium">{t.product.moisture}</span>
                    <span className="text-[#2B1A12] font-semibold">{specs.moistureContent}</span>
                  </div>
                  <div className="grid grid-cols-2 p-2 bg-white">
                    <span className="text-[#7A6A5F] font-medium">{t.product.seasoning}</span>
                    <span className="text-[#2B1A12] font-semibold">
                      {language === 'bn' ? specs.seasoningMethodBn : specs.seasoningMethodEn}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 p-2 bg-[#FAF8F5]">
                    <span className="text-[#7A6A5F] font-medium">{t.product.warranty}</span>
                    <span className="text-[#2B1A12] font-semibold">
                      {specs.warrantyYears} {language === 'bn' ? 'বছর' : 'Years'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#E8DED4] flex flex-col gap-2.5">
              {addedToQuote && (
                <div className="p-2 rounded-xl bg-[#C59B27]/15 text-[#C59B27] text-xs text-center font-bold flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'কোটেশন লিস্টে যোগ করা হয়েছে!' : 'Added to quote list!'}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAddToQuote}
                  className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-[#2B1A12] bg-[#F4ECE1] hover:bg-[#E8DED4] border border-[#E8DED4] flex items-center justify-center gap-1.5 transition-all"
                >
                  <ClipboardList className="w-4 h-4 text-[#C59B27]" />
                  <span>{language === 'bn' ? 'কোটেশনে রাখুন' : 'Add to Quote'}</span>
                </button>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.product.orderViaWhatsApp}</span>
                </a>
              </div>

              <Link
                href={`/doors/${product.slug}`}
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-[#E8DED4] hover:bg-[#F4ECE1] text-xs font-semibold text-[#2B1A12] flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>{language === 'bn' ? 'পূর্ণাঙ্গ পেজ ও ছবি জুম ভিউ দেখুন →' : 'View Full Page & Image Zoom →'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
