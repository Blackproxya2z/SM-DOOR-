'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { buildWhatsAppLink } from '@/lib/calculator';
import { DEFAULT_BLUR_DATA_URL } from '@/lib/image-utils';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  MessageCircle,
  Sparkles,
  Share2,
  Download
} from 'lucide-react';

interface ProductLightboxProps {
  isOpen: boolean;
  product: Product | null;
  initialImageIdx?: number;
  onClose: () => void;
  whatsappNumber?: string;
}

export function ProductLightbox({
  isOpen,
  product,
  initialImageIdx = 0,
  onClose,
  whatsappNumber = "+8801710820987"
}: ProductLightboxProps) {
  const { language, formatPrice } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(initialImageIdx);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Mobile swipe refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const lastTap = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      setActiveIdx(initialImageIdx);
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialImageIdx]);

  const images = product?.images && product.images.length > 0 
    ? product.images 
    : [product?.imagePath || '/images/hero/banner-1.webp'];

  const totalImages = images.length;
  const currentImage = images[activeIdx] || images[0];

  const handleNext = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % totalImages);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [totalImages]);

  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + totalImages) % totalImages);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [totalImages]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Touch handlers for mobile swipe & double-tap
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;

      const now = Date.now();
      if (now - lastTap.current < 300) {
        // Double tap toggle zoom
        setZoomLevel((prev) => (prev > 1 ? 1 : 2));
        setPanPosition({ x: 0, y: 0 });
      }
      lastTap.current = now;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // If not zoomed, evaluate swipe
    if (zoomLevel === 1) {
      // Horizontal swipe
      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
      // Swipe down to dismiss
      else if (diffY < -90 && Math.abs(diffY) > Math.abs(diffX)) {
        onClose();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Mouse pan when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen || !product) return null;

  const title = language === 'bn' ? product.titleBn : product.titleEn;
  const priceFormatted = formatPrice(product.defaultPrice);

  const whatsappMsg = language === 'bn'
    ? `আসসালামু আলাইকুম, আমি এস এম ডোর-এর "${product.titleBn}" (ডিজাইন: ${product.designNumber}, মূল্য: ${priceFormatted}) সম্পর্কে জানতে ও অর্ডার দিতে চাই।`
    : `Hello, I would like to inquire about "${product.titleEn}" (Design: ${product.designNumber}, Price: ${priceFormatted}) from SM Door.`;
  const waUrl = buildWhatsAppLink(whatsappNumber, whatsappMsg);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md select-none animate-fade-in"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Header Bar */}
      <div 
        className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 text-xs font-bold tracking-wider">
            {product.designNumber}
          </span>
          <div className="hidden sm:block">
            <h3 className="text-sm font-semibold text-white truncate max-w-md">
              {title}
            </h3>
          </div>
          {totalImages > 1 && (
            <span className="text-xs text-wood-300 bg-wood-900/80 px-2.5 py-1 rounded-full border border-wood-700">
              {activeIdx + 1} / {totalImages}
            </span>
          )}
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom In/Out */}
          <div className="hidden sm:flex items-center gap-1 bg-wood-900/80 rounded-xl p-1 border border-wood-700/80">
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-1.5 rounded-lg text-wood-200 hover:text-white hover:bg-wood-800 disabled:opacity-40 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-gold-400 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-1.5 rounded-lg text-wood-200 hover:text-white hover:bg-wood-800 disabled:opacity-40 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-wood-900/90 hover:bg-wood-800 text-wood-200 hover:text-white border border-wood-700 transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Display Area */}
      <div 
        className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div 
          className="relative max-w-5xl max-h-[75vh] sm:max-h-[80vh] w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`
          }}
        >
          <Image
            src={currentImage}
            alt={product.altText || title}
            fill
            sizes="100vw"
            quality={90}
            priority
            placeholder="blur"
            blurDataURL={DEFAULT_BLUR_DATA_URL}
            className="object-contain pointer-events-none select-none drop-shadow-2xl"
          />
        </div>

        {/* Previous Image Chevron */}
        {totalImages > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 z-20"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Image Chevron */}
        {totalImages > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 z-20"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[11px] text-wood-300 pointer-events-none">
          {language === 'bn' ? 'স্লাইড করতে সোয়াইপ করুন • নিচে টেনে বন্ধ করুন' : 'Swipe to browse • Drag down to close'}
        </div>
      </div>

      {/* Bottom Information & Thumbnails Bar */}
      <div 
        className="relative z-20 bg-gradient-to-t from-black via-black/90 to-transparent px-4 sm:px-6 pt-3 pb-5 flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thumbnails row if multiple images */}
        {totalImages > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveIdx(idx);
                  setZoomLevel(1);
                  setPanPosition({ x: 0, y: 0 });
                }}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeIdx === idx
                    ? 'border-gold-400 scale-105 shadow-gold'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Product Details & Action Buttons */}
        <div className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
              {title}
            </h4>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
              <span className="text-xs text-wood-300">
                {language === 'bn' ? 'শুরু মাত্র' : 'Starting from'}:
              </span>
              <span className="text-base sm:text-lg font-black text-gold-400">
                {priceFormatted}
              </span>
              {product.qualityGrade && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-300 border border-gold-500/30">
                  {product.qualityGrade}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-lg shadow-emerald-950/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার করুন' : 'WhatsApp Inquiry'}</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-medium text-sm bg-wood-900/80 hover:bg-wood-800 text-wood-200 border border-wood-700 transition-colors"
            >
              {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
