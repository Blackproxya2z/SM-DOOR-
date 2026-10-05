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

export function CustomOrderWizard({ speciesList, whatsappNumber = "+8801710820987" }: CustomOrderWizardProps) {
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
    <section id="custom-order" className="py-16 sm:py-24 bg-[#FAF8F5] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C59B27]/10 text-[#C59B27] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C59B27]/25 font-[family-name:var(--font-hind-siliguri)]">
            <Upload className="w-3.5 h-3.5" />
            <span>{t.customOrder.badge}</span>
          </div>
          <h2 className="font-[family-name:var(--font-tiro-bangla)] text-3xl sm:text-5xl font-bold text-[#2B1A12] tracking-tight mb-4">
            {t.customOrder.title}
          </h2>
          <p className="font-[family-name:var(--font-hind-siliguri)] text-base sm:text-lg text-[#7A6A5F] leading-relaxed">
            {t.customOrder.subtitle}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#E8DED4]">
          {submittedInquiry ? (
            /* Success State */
            <div className="text-center py-8 animate-fade-in font-[family-name:var(--font-hind-siliguri)]">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-300">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-[family-name:var(--font-tiro-bangla)] text-2xl sm:text-3xl font-bold text-[#2B1A12] mb-2">
                {t.customOrder.successTitle}
              </h3>
              <p className="text-base text-[#7A6A5F] max-w-md mx-auto mb-6">
                {t.customOrder.successMessage}
              </p>
              <div className="inline-block bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8DED4] mb-8 text-left text-xs sm:text-sm text-[#2B1A12]">
                <p><strong>ইনকোয়ারি রেফারেন্স:</strong> #{submittedInquiry.id}</p>
                <p><strong>কাঠ:</strong> {woodName}</p>
                <p><strong>মাপ:</strong> {height}&quot; × {width}&quot; × {thickness}&quot; ({quantity} পিস)</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getSuccessWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t.customOrder.instantWhatsAppBtn}</span>
                </a>
                <button
                  onClick={() => {
                    setSubmittedInquiry(null);
                    setUploadedImageUrl('');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#E8DED4] text-[#2B1A12] font-semibold text-sm hover:bg-[#FAF8F5] transition-colors"
                >
                  {language === 'bn' ? 'আরেকটি ডিজাইন জমা দিন' : 'Submit Another Design'}
                </button>
              </div>
            </div>
          ) : (
            /* Submission Form */
            <form onSubmit={handleSubmit} className="space-y-8 font-[family-name:var(--font-hind-siliguri)]">
              {formError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Image Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2B1A12] mb-2">
                  ১. দরজার ছবি বা ডিজাইন আপলোড করুন
                </label>
                
                {uploadedImageUrl ? (
                  <div className="relative w-full sm:w-64 h-48 rounded-2xl overflow-hidden border-2 border-[#C59B27] bg-[#FAF8F5] shadow-md group">
                    <img src={uploadedImageUrl} alt="Uploaded Design" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setUploadedImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow hover:bg-red-700 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-[#2B1A12]/80 backdrop-blur-sm p-1.5 text-center text-[10px] text-white font-semibold">
                      ছবি সংযুক্ত হয়েছে
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#E8DED4] hover:border-[#C59B27] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer bg-[#FAF8F5] hover:bg-white transition-all group">
                    <div className="w-12 h-12 rounded-full bg-[#C59B27]/10 text-[#C59B27] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      {uploadingImage ? <Sparkles className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                    </div>
                    <span className="text-sm font-semibold text-[#2B1A12] text-center mb-1">
                      {uploadingImage ? 'ছবি আপলোড হচ্ছে...' : t.customOrder.dragDropText}
                    </span>
                    <span className="text-xs text-[#7A6A5F]">
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2B1A12] mb-2">
                    ২. পছন্দের কাঠ নির্বাচন করুন *
                  </label>
                  <select
                    value={woodSpeciesId}
                    onChange={(e) => setWoodSpeciesId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-semibold text-[#2B1A12] cursor-pointer outline-none transition-colors"
                  >
                    {speciesList.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {language === 'bn' ? sp.nameBn : sp.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2B1A12] mb-2">
                    পণ্যের ধরন
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-semibold text-[#2B1A12] cursor-pointer outline-none transition-colors"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2B1A12] mb-2">
                  ৩. {t.customOrder.dimensionsHeader}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-[#7A6A5F] mb-1">{t.customOrder.height}</label>
                    <input
                      type="number"
                      step="0.5"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#7A6A5F] mb-1">{t.customOrder.width}</label>
                    <input
                      type="number"
                      step="0.5"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#7A6A5F] mb-1">{t.customOrder.thickness}</label>
                    <input
                      type="number"
                      step="0.25"
                      value={thickness}
                      onChange={(e) => setThickness(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#7A6A5F] mb-1">পরিমাণ (পিস)</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Polish Preference */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2B1A12] mb-2">
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
                          ? 'border-[#C59B27] bg-[#C59B27]/10 text-[#2B1A12] font-bold ring-1 ring-[#C59B27]'
                          : 'border-[#E8DED4] bg-[#FAF8F5] text-[#7A6A5F] hover:border-[#C59B27]/60'
                      }`}
                    >
                      <input
                        type="radio"
                        name="polish"
                        checked={polishPreference === item.id}
                        onChange={() => setPolishPreference(item.id as any)}
                        className="text-[#C59B27] focus:ring-[#C59B27]"
                      />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 5. Customer Contact Details */}
              <div className="pt-4 border-t border-[#E8DED4]">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2B1A12] mb-3">
                  ৫. আপনার যোগাযোগের তথ্য
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-[#7A6A5F] mb-1">{t.customOrder.fullName}</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={language === 'bn' ? 'উদা: মোঃ আরিফুল ইসলাম' : 'e.g. John Doe'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#7A6A5F] mb-1">{t.customOrder.phoneNumber}</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="01819-XXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#7A6A5F] mb-1">{t.customOrder.district}</label>
                    <input
                      type="text"
                      required
                      value={customerDistrict}
                      onChange={(e) => setCustomerDistrict(e.target.value)}
                      placeholder={language === 'bn' ? 'চট্টগ্রাম, ঢাকা, সিলেট ইত্যাদি' : 'Chittagong, Dhaka, etc.'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#7A6A5F] mb-1">{t.customOrder.notes}</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'bn' ? 'দরজার বিশেষ খোদাই বা কব্জা/লকের সাইজ সংক্রান্ত যেকোনো নির্দেশনা...' : 'Carving notes, lock specifications, delivery notes...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm text-[#2B1A12] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl font-bold text-base text-white bg-[#2B1A12] hover:bg-[#C59B27] shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2"
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
