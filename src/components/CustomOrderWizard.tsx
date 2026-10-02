'use client';

import React, { useState } from 'react';
import { WoodSpecies } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { buildWhatsAppLink } from '@/lib/calculator';
import { 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles, 
  AlertCircle,
  FileCheck,
  X
} from 'lucide-react';

interface CustomOrderWizardProps {
  speciesList: WoodSpecies[];
  whatsappNumber?: string;
}

export function CustomOrderWizard({ speciesList, whatsappNumber = "+8801819345678" }: CustomOrderWizardProps) {
  const { language, t } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerWhatsApp, setCustomerWhatsApp] = useState('');
  const [customerDistrict, setCustomerDistrict] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [productType, setProductType] = useState<'door' | 'frame' | 'timber' | 'furniture'>('door');
  const [woodSpeciesId, setWoodSpeciesId] = useState(speciesList[0]?.id || 'ctg-teak');
  const [height, setHeight] = useState('81');
  const [width, setWidth] = useState('39');
  const [thickness, setThickness] = useState('1.5');
  const [quantity, setQuantity] = useState(1);
  const [polishPreference, setPolishPreference] = useState<'raw' | 'lacquer' | 'pu_polish' | 'burnish'>('lacquer');
  const [notes, setNotes] = useState('');

  // Image Upload state
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');

  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<any>(null);
  const [formError, setFormError] = useState('');

  const selectedSpecies = speciesList.find(s => s.id === woodSpeciesId);
  const woodName = language === 'bn' ? selectedSpecies?.nameBn : selectedSpecies?.nameEn;

  // File change handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');
    if (file.size > 5 * 1024 * 1024) {
      setImageError(language === 'bn' ? 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।' : 'File size cannot exceed 5MB.');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setUploadedImageUrl(data.url);
      } else {
        setImageError(data.error || 'Failed to upload image');
      }
    } catch {
      setImageError('Network error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম ও মোবাইল নম্বর পূরণ করুন।' : 'Please enter your name and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName,
        customerPhone,
        customerWhatsApp: customerWhatsApp || customerPhone,
        customerDistrict,
        deliveryAddress,
        productType,
        woodSpeciesId,
        woodSpeciesName: woodName || 'Custom Wood',
        dimensions: {
          height: parseFloat(height) || 81,
          width: parseFloat(width) || 39,
          thickness: parseFloat(thickness) || 1.5,
          unit: 'inch'
        },
        quantity,
        polishPreference,
        notes,
        designImageUrl: uploadedImageUrl
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.inquiry) {
        setSubmittedInquiry(data.inquiry);
      } else {
        setFormError(data.error || 'Failed to submit quote request.');
      }
    } catch {
      setFormError('Network connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSuccessWhatsAppLink = () => {
    if (!submittedInquiry) return '';
    const text = language === 'bn'
      ? `*এস এম ডোর — কাস্টম ডিজাইন কোটেশন সাবমিশন*\n• ইনকোয়ারি আইডি: #${submittedInquiry.id}\n• গ্রাহকের নাম: ${customerName}\n• ফোন: ${customerPhone}\n• জেলা: ${customerDistrict}\n• কাঠ: ${woodName}\n• মাপ: ${height}" × ${width}" × ${thickness}" (পরিমাণ: ${quantity} পিস)\n• পলিশ: ${polishPreference}\n\nআমি এই কাস্টম অর্ডারের বিস্তারিত আলোচনা করতে চাই।`
      : `*SM Door — Custom Design Quotation*\n• Inquiry ID: #${submittedInquiry.id}\n• Name: ${customerName}\n• Phone: ${customerPhone}\n• District: ${customerDistrict}\n• Timber: ${woodName}\n• Size: ${height}" × ${width}" × ${thickness}" (Qty: ${quantity})\n• Polish: ${polishPreference}\n\nLet's discuss my custom order.`;

    return buildWhatsAppLink(whatsappNumber, text);
  };

  return (
    <section id="custom-order" className="py-16 sm:py-24 bg-wood-50/60 dark:bg-wood-950/60 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-gold-700 dark:text-gold-400 text-xs font-bold uppercase tracking-wider mb-3 border border-gold-500/20">
            <Upload className="w-3.5 h-3.5" />
            <span>{t.customOrder.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-wood-950 dark:text-white tracking-tight mb-4">
            {t.customOrder.title}
          </h2>
          <p className="text-sm sm:text-base text-wood-600 dark:text-wood-300">
            {t.customOrder.subtitle}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-wood-900 rounded-3xl p-6 sm:p-10 shadow-luxury border border-wood-200 dark:border-wood-800">
          {submittedInquiry ? (
            /* Success State */
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-300">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-wood-950 dark:text-white mb-2">
                {t.customOrder.successTitle}
              </h3>
              <p className="text-sm text-wood-600 dark:text-wood-300 max-w-md mx-auto mb-6">
                {t.customOrder.successMessage}
              </p>
              <div className="inline-block bg-wood-50 dark:bg-wood-950 p-4 rounded-xl border border-wood-200 dark:border-wood-800 mb-8 text-left text-xs text-wood-700 dark:text-wood-300">
                <p><strong>ইনকোয়ারি রেফারেন্স:</strong> #{submittedInquiry.id}</p>
                <p><strong>কাঠ:</strong> {woodName}</p>
                <p><strong>মাপ:</strong> {height}&quot; × {width}&quot; × {thickness}&quot; ({quantity} পিস)</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getSuccessWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t.customOrder.instantWhatsAppBtn}</span>
                </a>
                <button
                  onClick={() => {
                    setSubmittedInquiry(null);
                    setUploadedImageUrl('');
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-wood-300 dark:border-wood-700 text-wood-700 dark:text-wood-300 font-semibold text-sm hover:bg-wood-100 dark:hover:bg-wood-800 transition-colors"
                >
                  {language === 'bn' ? 'আরেকটি ডিজাইন জমা দিন' : 'Submit Another Design'}
                </button>
              </div>
            </div>
          ) : (
            /* Submission Form */
            <form onSubmit={handleSubmit} className="space-y-8">
              {formError && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Image Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-wood-800 dark:text-wood-200 mb-2">
                  ১. দরজার ছবি বা ডিজাইন আপলোড করুন
                </label>
                
                {uploadedImageUrl ? (
                  <div className="relative w-full sm:w-64 h-48 rounded-2xl overflow-hidden border-2 border-gold-500 bg-wood-100 shadow-md group">
                    <img src={uploadedImageUrl} alt="Uploaded Design" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setUploadedImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow hover:bg-red-700 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-wood-950/80 p-1.5 text-center text-[10px] text-gold-400 font-semibold">
                      ছবি সংযুক্ত হয়েছে
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-wood-300 dark:border-wood-700 hover:border-gold-500 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer bg-wood-50/40 dark:bg-wood-950/40 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      {uploadingImage ? <Sparkles className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                    </div>
                    <span className="text-sm font-semibold text-wood-900 dark:text-white text-center mb-1">
                      {uploadingImage ? 'ছবি আপলোড হচ্ছে...' : t.customOrder.dragDropText}
                    </span>
                    <span className="text-xs text-wood-500 dark:text-wood-400">
                      {t.customOrder.supportedFiles}
                    </span>
                    <input
                      type="file"
                      accept="image/*,image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                )}
                {imageError && (
                  <p className="text-xs text-red-500 mt-2">{imageError}</p>
                )}
              </div>

              {/* 2. Wood Species & Product Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-wood-800 dark:text-wood-200 mb-2">
                    ২. পছন্দের কাঠ নির্বাচন করুন *
                  </label>
                  <select
                    value={woodSpeciesId}
                    onChange={(e) => setWoodSpeciesId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-wood-200 dark:border-wood-750 bg-wood-50/50 dark:bg-wood-950 text-sm font-semibold text-wood-900 dark:text-white cursor-pointer"
                  >
                    {speciesList.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {language === 'bn' ? sp.nameBn : sp.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-wood-800 dark:text-wood-200 mb-2">
                    পণ্যের ধরন
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-wood-200 dark:border-wood-750 bg-wood-50/50 dark:bg-wood-950 text-sm font-semibold text-wood-900 dark:text-white cursor-pointer"
                  >
                    <option value="door">সলিড কাঠের দরজা (Wooden Door)</option>
                    <option value="frame">দরজার চৌকাঠ (Door Frame)</option>
                    <option value="timber">স’মিল চেরা কাঠ (Sawn Timber)</option>
                    <option value="furniture">কাস্টম ফার্নিচার (Custom Furniture)</option>
                  </select>
                </div>
              </div>

              {/* 3. Dimensions & Quantity */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-wood-800 dark:text-wood-200 mb-2">
                  ৩. {t.customOrder.dimensionsHeader}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-wood-600 dark:text-wood-400 mb-1">{t.customOrder.height}</label>
                    <input
                      type="number"
                      step="0.5"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-wood-200 dark:border-wood-750 bg-wood-50/50 dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-wood-600 dark:text-wood-400 mb-1">{t.customOrder.width}</label>
                    <input
                      type="number"
                      step="0.5"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-wood-200 dark:border-wood-750 bg-wood-50/50 dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-wood-600 dark:text-wood-400 mb-1">{t.customOrder.thickness}</label>
                    <input
                      type="number"
                      step="0.25"
                      value={thickness}
                      onChange={(e) => setThickness(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-wood-200 dark:border-wood-750 bg-wood-50/50 dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-wood-600 dark:text-wood-400 mb-1">পরিমাণ (পিস)</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl border border-wood-200 dark:border-wood-750 bg-wood-50/50 dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Polish Preference */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-wood-800 dark:text-wood-200 mb-2">
                  ৪. {t.customOrder.polishChoice}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {[
                    { id: 'raw', label: t.customOrder.polishOptions.raw },
                    { id: 'lacquer', label: t.customOrder.polishOptions.lacquer },
                    { id: 'pu_polish', label: t.customOrder.polishOptions.pu_polish },
                    { id: 'burnish', label: t.customOrder.polishOptions.burnish },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                        polishPreference === item.id
                          ? 'border-gold-500 bg-gold-50/50 dark:bg-gold-950/40 text-wood-950 dark:text-white ring-1 ring-gold-500'
                          : 'border-wood-200 dark:border-wood-800 text-wood-700 dark:text-wood-300 hover:border-wood-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="polish"
                        checked={polishPreference === item.id}
                        onChange={() => setPolishPreference(item.id as any)}
                        className="text-gold-600 focus:ring-gold-500"
                      />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 5. Customer Contact Details */}
              <div className="pt-4 border-t border-wood-100 dark:border-wood-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-wood-800 dark:text-wood-200 mb-3">
                  ৫. আপনার যোগাযোগের তথ্য
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-wood-700 dark:text-wood-300 mb-1">{t.customOrder.fullName}</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={language === 'bn' ? 'উদা: মোঃ আরিফুল ইসলাম' : 'e.g. John Doe'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-wood-50/50 dark:bg-wood-950 text-sm text-wood-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-wood-700 dark:text-wood-300 mb-1">{t.customOrder.phoneNumber}</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="01819-XXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-wood-50/50 dark:bg-wood-950 text-sm text-wood-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-wood-700 dark:text-wood-300 mb-1">{t.customOrder.district}</label>
                    <input
                      type="text"
                      required
                      value={customerDistrict}
                      onChange={(e) => setCustomerDistrict(e.target.value)}
                      placeholder={language === 'bn' ? 'চট্টগ্রাম, ঢাকা, সিলেট ইত্যাদি' : 'Chittagong, Dhaka, etc.'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-wood-50/50 dark:bg-wood-950 text-sm text-wood-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-wood-700 dark:text-wood-300 mb-1">{t.customOrder.notes}</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'bn' ? 'দরজার বিশেষ খোদাই বা কব্জা/লকের সাইজ সংক্রান্ত যেকোনো নির্দেশনা...' : 'Carving notes, lock specifications, delivery notes...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-wood-50/50 dark:bg-wood-950 text-sm text-wood-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl font-bold text-base text-wood-950 bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 hover:from-gold-300 hover:to-amber-400 shadow-gold transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>{t.customOrder.submitting}</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-5 h-5" />
                    <span>{t.customOrder.submitBtn}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
