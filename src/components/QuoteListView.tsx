'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useQuote } from '@/context/QuoteContext';
import { 
  ClipboardList, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

interface QuoteListViewProps {
  whatsappNumber: string;
}

export function QuoteListView({ whatsappNumber }: QuoteListViewProps) {
  const { language, t, formatPrice, toLocalDigits } = useLanguage();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearQuote, 
    totalEstimatedCost,
    generateWhatsAppUrl 
  } = useQuote();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerDistrict, setCustomerDistrict] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম ও ফোন নম্বর লিখুন।' : 'Please enter your name and phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerDistrict,
          notes: customerNote,
          items,
          estimatedCost: totalEstimatedCost,
          productType: 'quote-list',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedRefId(data.inquiry?.id || `SMDOOR-${Date.now().toString().slice(-6)}`);
        clearQuote();
      } else {
        setErrorMessage(data.error || 'Submission failed');
      }
    } catch {
      setErrorMessage(language === 'bn' ? 'সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে হোয়াটসঅ্যাপে জানান।' : 'Connection error. Please contact via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappAllUrl = generateWhatsAppUrl(language, whatsappNumber);

  if (submittedRefId) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#C59B27]/10 text-[#C59B27] border border-[#C59B27]/30 mb-2">
          রেফারেন্স আইডি: {submittedRefId}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] mb-3">
          {language === 'bn' ? 'কোটেশন রিকোয়েস্ট সফলভাবে জমা হয়েছে!' : 'Quote Request Submitted Successfully!'}
        </h2>
        <p className="text-sm sm:text-base text-[#7A6A5F] leading-relaxed mb-8 font-[family-name:var(--font-hind-siliguri)]">
          {language === 'bn'
            ? 'আমাদের প্রতিনিধি খুব দ্রুত আপনার সাথে ফোনে অথবা হোয়াটসঅ্যাপে যোগাযোগ করে চূড়ান্ত দর ও ডেলিভারি সময়সূচী নিশ্চিত করবেন।'
            : 'Our woodworking representative will contact you via Phone or WhatsApp shortly with final quotation details.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-[family-name:var(--font-hind-siliguri)]">
          <a
            href={whatsappAllUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{language === 'bn' ? 'হোয়াটসঅ্যাপেও কনফার্ম করুন' : 'Confirm on WhatsApp'}</span>
          </a>
          <Link
            href="/doors"
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl border border-[#E8DED4] text-[#2B1A12] font-semibold text-sm hover:bg-[#F4ECE1] transition-colors"
          >
            {language === 'bn' ? 'আরও দরজা দেখুন' : 'Browse More Doors'}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center font-[family-name:var(--font-hind-siliguri)]">
        <div className="w-16 h-16 rounded-full bg-[#FAF8F5] text-[#C59B27] flex items-center justify-center mx-auto mb-4 border border-[#E8DED4] shadow-sm">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] mb-2">
          {language === 'bn' ? 'আপনার কোটেশন তালিকা এখনো খালি' : 'Your Quote List is Empty'}
        </h2>
        <p className="text-sm text-[#7A6A5F] max-w-md mx-auto mb-8 font-[family-name:var(--font-hind-siliguri)]">
          {language === 'bn'
            ? 'আমাদের দরজার ক্যাটালগ ঘুরে দেখুন বা সিএফটি ক্যালকুলেটরে হিসাব করে পণ্য এই তালিকায় যুক্ত করুন।'
            : 'Browse our door catalog or calculate lumber CFT and add items to your quote list.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/doors"
            className="py-3 px-6 rounded-xl bg-[#2B1A12] hover:bg-[#C59B27] text-white font-bold text-sm shadow-md flex items-center gap-2 transition-colors font-[family-name:var(--font-hind-siliguri)]"
          >
            <span>{language === 'bn' ? 'দরজার ক্যাটালগ দেখুন' : 'Explore Doors'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/calculator"
            className="py-3 px-6 rounded-xl border border-[#E8DED4] bg-white text-[#2B1A12] font-semibold text-sm hover:bg-[#FAF8F5] shadow-sm transition-colors font-[family-name:var(--font-hind-siliguri)]"
          >
            {language === 'bn' ? 'সিএফটি ক্যালকুলেটর' : 'CFT Calculator'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-hind-siliguri)]">
      {/* Title & Clear All */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E8DED4]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)]">
            {language === 'bn' ? 'আপনার নির্বাচিত পণ্যের কোটেশন তালিকা' : 'Your Selected Quote Items'}
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6A5F] mt-1">
            {toLocalDigits(items.length)} {language === 'bn' ? 'টি আইটেম যুক্ত রয়েছে' : 'items added'}
          </p>
        </div>
        <button
          onClick={clearQuote}
          className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'সব মুছুন' : 'Clear All'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Items list (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((item) => {
            const title = language === 'bn' ? item.titleBn : item.titleEn;
            const subtitle = language === 'bn' ? item.subtitleBn : item.subtitleEn;

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DED4] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E8DED4] flex-shrink-0">
                      <Image src={item.image} alt={title} fill sizes="64px" className="object-cover" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)]">
                      {title}
                    </h3>
                    <p className="text-xs text-[#7A6A5F] mt-0.5">{subtitle}</p>
                    {item.price && item.price > 0 && (
                      <span className="inline-block mt-1 font-extrabold text-[#C59B27] text-sm">
                        {formatPrice(item.price * item.quantity)}
                        {item.quantity > 1 && (
                          <span className="text-xs text-[#7A6A5F] font-normal ml-1">
                            ({formatPrice(item.price)} × {item.quantity})
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E8DED4]">
                  <div className="flex items-center border border-[#E8DED4] rounded-xl bg-[#FAF8F5]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-[#7A6A5F] hover:text-[#2B1A12]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#2B1A12]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-[#7A6A5F] hover:text-[#2B1A12]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-[#7A6A5F] hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-4 flex justify-between items-center text-xs">
            <Link href="/doors" className="text-[#C59B27] hover:underline flex items-center gap-1 font-semibold">
              ← {language === 'bn' ? 'আরও পণ্য নির্বাচন করুন' : 'Add More Items'}
            </Link>
          </div>
        </div>

        {/* Right: Submission & Contact Form (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DED4] shadow-xl sticky top-24">
            <h2 className="text-lg font-bold text-[#2B1A12] font-[family-name:var(--font-tiro-bangla)] mb-4">
              {language === 'bn' ? 'কোটেশন সামারি ও ইনকোয়ারি' : 'Quotation Summary'}
            </h2>

            {totalEstimatedCost > 0 && (
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8DED4] mb-6">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs text-[#7A6A5F]">
                    {language === 'bn' ? 'সম্ভাব্য মোট প্রাক্কলন:' : 'Estimated Subtotal:'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#C59B27]">
                    {formatPrice(totalEstimatedCost)}
                  </span>
                </div>
                <p className="text-[11px] text-[#7A6A5F] mt-1">
                  {language === 'bn'
                    ? '★ ডেলিভারি চার্জ ও কাস্টমাইজেশন অনুযায়ী চূড়ান্ত দর ফোনে বা হোয়াটসঅ্যাপে জানানো হবে।'
                    : '★ Final delivery charge & polish options will be confirmed upon inquiry.'}
                </p>
              </div>
            )}

            {/* Direct WhatsApp Send All Button */}
            <a
              href={whatsappAllUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 mb-4"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে সকল আইটেম পাঠান' : 'Send All Items via WhatsApp'}</span>
            </a>

            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-[#E8DED4]" />
              <span className="flex-shrink mx-4 text-xs text-[#7A6A5F] uppercase tracking-widest font-mono">
                {language === 'bn' ? 'অথবা ওয়েবসাইটে জমা দিন' : 'OR SUBMIT INQUIRY'}
              </span>
              <div className="flex-grow border-t border-[#E8DED4]" />
            </div>

            {/* Quick Contact Form */}
            <form onSubmit={handleSubmitInquiry} className="space-y-3">
              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#2B1A12] mb-1">
                  {language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={language === 'bn' ? 'উদা: মোঃ আরিফুল ইসলাম' : 'e.g. John Doe'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-xs text-[#2B1A12] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1A12] mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="018XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-xs text-[#2B1A12] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1A12] mb-1">
                  {language === 'bn' ? 'ঠিকানা বা জেলা' : 'District or Area'}
                </label>
                <input
                  type="text"
                  value={customerDistrict}
                  onChange={(e) => setCustomerDistrict(e.target.value)}
                  placeholder={language === 'bn' ? 'উদা: কোতোয়ালি, চট্টগ্রাম' : 'e.g. Chittagong'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-xs text-[#2B1A12] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1A12] mb-1">
                  {language === 'bn' ? 'বিশেষ নির্দেশনা (ঐচ্ছিক)' : 'Special Notes (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder={language === 'bn' ? 'যেকোনো মাপ বা অনুরোধ লিখুন...' : 'Any measurements or requests...'}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-xs text-[#2B1A12] outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#2B1A12] hover:bg-[#C59B27] text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? (language === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...') : (language === 'bn' ? 'কোটেশন জমা দিন' : 'Submit Quotation')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
