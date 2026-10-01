'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut,
  Sparkles
} from 'lucide-react';

interface ProductZoomViewerProps {
  images: string[];
  title: string;
  badge?: string;
}

export function ProductZoomViewer({ images, title, badge }: ProductZoomViewerProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenZoom, setFullscreenZoom] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const activeImage = images[activeIdx] || images[0] || '/placeholder.png';

  // Desktop Hover-to-Zoom calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Fullscreen Navigation Keyboard controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        setFullscreenZoom(1);
        setPanPos({ x: 0, y: 0 });
      } else if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev + 1) % images.length);
        setFullscreenZoom(1);
        setPanPos({ x: 0, y: 0 });
      } else if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
        setFullscreenZoom(1);
        setPanPos({ x: 0, y: 0 });
      }
    },
    [isFullscreen, images.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent background scroll when fullscreen is active
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  // Touch handlers for mobile swipe & double-tap zoom
  const touchStartX = useRef<number | null>(null);
  const lastTap = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    const now = Date.now();
    if (now - lastTap.current < 300) {
      // Double tap detected
      if (isFullscreen) {
        setFullscreenZoom((prev) => (prev > 1 ? 1 : 2.5));
      } else {
        setIsFullscreen(true);
        setFullscreenZoom(2);
      }
    }
    lastTap.current = now;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Next image
        setActiveIdx((prev) => (prev + 1) % images.length);
      } else {
        // Prev image
        setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      {/* Main Image Container */}
      <div
        ref={imageContainerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFullscreen(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-wood-100 dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-md group cursor-zoom-in"
      >
        {/* Base Image */}
        <img
          src={activeImage}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? 'opacity-0 md:opacity-0' : 'opacity-100'
          }`}
        />

        {/* Desktop Follow-Cursor Zoom Lens (2.25x scale) */}
        {isHovered && (
          <div
            className="absolute inset-0 hidden md:block bg-no-repeat transition-transform pointer-events-none"
            style={{
              backgroundImage: `url(${activeImage})`,
              backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
              backgroundSize: '225%',
            }}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {badge && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-600 to-gold-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              {badge}
            </span>
          )}
        </div>

        {/* Hover / Tap Zoom Action Indicator */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-wood-950/80 backdrop-blur-md text-white text-xs font-medium border border-wood-700/60 shadow-lg group-hover:scale-105 transition-all">
          <Maximize2 className="w-3.5 h-3.5 text-gold-400" />
          <span className="hidden sm:inline">পূর্ণাঙ্গ ভিউ ও জুম</span>
          <span className="sm:hidden">জুম করুন</span>
        </div>

        {/* Mobile Navigation Arrows on Main Frame */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-wood-950/60 text-white hover:bg-wood-900 transition-opacity opacity-70 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx((prev) => (prev + 1) % images.length);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-wood-950/60 text-white hover:bg-wood-900 transition-opacity opacity-70 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-[3/4] w-16 sm:w-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                activeIdx === idx
                  ? 'border-gold-500 scale-105 shadow-md ring-2 ring-gold-400/30'
                  : 'border-wood-200 dark:border-wood-800 opacity-60 hover:opacity-100'
              }`}
              aria-label={`Select product image ${idx + 1}`}
            >
              <img src={img} alt={`${title} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal / Lightbox Gallery with Pinch & Zoom */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 sm:p-6 text-white border-b border-white/10 z-20">
            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate max-w-xs sm:max-w-md">{title}</span>
              <span className="text-xs text-wood-400">
                ছবি {activeIdx + 1} / {images.length} • ডাবল-ট্যাপ বা জুম কন্ট্রোল ব্যবহার করুন
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFullscreenZoom((z) => Math.min(3, z + 0.5))}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setFullscreenZoom(1);
                  setPanPos({ x: 0, y: 0 });
                }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Reset zoom"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setIsFullscreen(false);
                  setFullscreenZoom(1);
                  setPanPos({ x: 0, y: 0 });
                }}
                className="p-2 rounded-full bg-gold-500 hover:bg-gold-600 text-wood-950 font-bold transition-transform hover:scale-105"
                aria-label="Close fullscreen gallery"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Central Image Canvas */}
          <div
            className="relative flex-1 flex items-center justify-center overflow-hidden p-4 select-none cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={(e) => {
              if (fullscreenZoom > 1) {
                setIsDragging(true);
                setDragStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
              }
            }}
            onMouseMove={(e) => {
              if (isDragging && fullscreenZoom > 1) {
                setPanPos({
                  x: e.clientX - dragStart.x,
                  y: e.clientY - dragStart.y,
                });
              }
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <img
              src={activeImage}
              alt={title}
              className="max-h-[80vh] max-w-[90vw] object-contain transition-transform duration-200 shadow-2xl rounded-lg"
              style={{
                transform: `scale(${fullscreenZoom}) translate(${panPos.x / fullscreenZoom}px, ${
                  panPos.y / fullscreenZoom
                }px)`,
              }}
              draggable={false}
            />

            {/* Prev / Next buttons in Fullscreen */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => {
                    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
                    setFullscreenZoom(1);
                    setPanPos({ x: 0, y: 0 });
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => {
                    setActiveIdx((prev) => (prev + 1) % images.length);
                    setFullscreenZoom(1);
                    setPanPos({ x: 0, y: 0 });
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 p-4 bg-black/60 border-t border-white/10 overflow-x-auto z-20">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveIdx(idx);
                    setFullscreenZoom(1);
                    setPanPos({ x: 0, y: 0 });
                  }}
                  className={`w-14 h-16 rounded-md overflow-hidden border-2 transition-all ${
                    activeIdx === idx ? 'border-gold-400 scale-105' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <img src={img} alt={`Gallery thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
