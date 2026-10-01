'use client';

import React, { useState, useRef } from 'react';
import { processImageForUpload } from '@/lib/image-processing';
import { 
  Camera, 
  Image as ImageIcon, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

export interface UploadedImageInfo {
  url: string;
  filename: string;
  width?: number;
  height?: number;
  section?: string;
}

interface PhoneImageUploadProps {
  onUploadSuccess: (info: UploadedImageInfo) => void;
  defaultSection?: string;
  multiple?: boolean;
  className?: string;
  currentImageUrl?: string;
}

export function PhoneImageUpload({
  onUploadSuccess,
  defaultSection = 'Product Image',
  multiple = false,
  className = '',
  currentImageUrl
}: PhoneImageUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [selectedSection, setSelectedSection] = useState(defaultSection);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [compressionStats, setCompressionStats] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const sections = [
    'Product Image',
    'Category Image',
    'Hero Banner',
    'Gallery',
    'Factory/Workshop',
    'Custom Design Showcase'
  ];

  const handleFileSelection = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setStatusMessage(null);
    setIsProcessing(true);

    try {
      const file = fileList[0];
      const originalSizeKb = Math.round(file.size / 1024);

      // Process and optimize (resize <= 2000px, WebP, EXIF stripping)
      const processed = await processImageForUpload(file, 2000, 0.85);
      const newSizeKb = Math.round(processed.sizeBytes / 1024);

      setPreview(processed.previewUrl);
      setCompressionStats(`${originalSizeKb} KB → ${newSizeKb} KB (${processed.format.toUpperCase()}, ${processed.width}×${processed.height}px)`);

      // Upload to server
      const formData = new FormData();
      formData.append('file', processed.file);
      formData.append('section', selectedSection);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success && data.url) {
        setStatusMessage({
          type: 'success',
          text: 'ছবি সফলভাবে অপ্টিমাইজ ও আপলোড হয়েছে! (Image successfully uploaded)'
        });
        onUploadSuccess({
          url: data.url,
          filename: data.filename || processed.file.name,
          width: processed.width,
          height: processed.height,
          section: selectedSection
        });
      } else {
        throw new Error(data.error || 'আপলোড ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'ছবি প্রসেসিং বা আপলোড করতে সমস্যা হয়েছে।'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setCompressionStats(null);
    setStatusMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className={`bg-stone-50 dark:bg-stone-900/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 ${className}`}>
      
      {/* Hidden Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFileSelection(e.target.files)}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileSelection(e.target.files)}
      />

      {/* Target Section Selection */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
          ছবি প্রদর্শনের সেকশন (Image Section):
        </label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="w-full text-xs font-medium bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-700 outline-none"
        >
          {sections.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>
      </div>

      {/* Preview Area */}
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-900 group">
          <img
            src={preview}
            alt="Upload Preview"
            className="w-full h-48 sm:h-56 object-contain mx-auto"
          />
          <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-white text-stone-900 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg hover:bg-stone-100"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              ছবি পরিবর্তন করুন
            </button>
            <button
              type="button"
              onClick={clearImage}
              className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {compressionStats && (
            <div className="absolute bottom-2 left-2 right-2 bg-stone-950/80 backdrop-blur-sm text-stone-200 text-[11px] py-1 px-2.5 rounded-lg flex items-center justify-between border border-stone-700/60">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Sparkles className="w-3 h-3" /> অটো-অপ্টিমাইজড
              </span>
              <span>{compressionStats}</span>
            </div>
          )}
        </div>
      ) : (
        /* Upload Action Buttons */
        <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-6 text-center hover:border-amber-600 transition-colors bg-white/60 dark:bg-stone-800/40">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>

          <p className="text-sm font-bold text-stone-900 dark:text-white mb-1">
            ফোন থেকে ছবি আপলোড করুন
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
            ক্যামেরা দিয়ে ছবি তুলুন অথবা গ্যালারি থেকে বেছে নিন। স্বয়ংক্রিয়ভাবে কম্প্রেস ও রিসাইজ হবে।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {/* Gallery Button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
              <span>গ্যালারি থেকে নির্বাচন (Upload Image)</span>
            </button>

            {/* Camera Button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => cameraInputRef.current?.click()}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 active:scale-95 text-stone-800 dark:text-stone-100 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>ছবি তুলুন (Take Photo)</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading state indicator */}
      {isProcessing && (
        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <Loader2 className="w-4 h-4 animate-spin text-amber-700 flex-shrink-0" />
          <span>ছবি সাইজ ও কোয়ালিটি অপ্টিমাইজ হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</span>
        </div>
      )}

      {/* Status Messages */}
      {statusMessage && (
        <div
          className={`mt-3 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}
