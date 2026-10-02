'use client';

import React, { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import { SiteSettings } from '@/types';
import { firestore } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  UserCheck
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sm_door_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch {}

    // 2. Fresh fetch for multi-device sync
    fetch('/api/settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});

    // 3. Multi-device real-time listener via Firebase Firestore
    let unsubscribeFirestore: (() => void) | null = null;
    try {
      if (firestore) {
        unsubscribeFirestore = onSnapshot(
          doc(firestore, 'sm_settings', 'site'),
          (docSnap) => {
            if (docSnap.exists()) {
              const cloudSettings = docSnap.data() as SiteSettings;
              setSettings(cloudSettings);
            }
          },
          () => {}
        );
      }
    } catch {}

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setSettings(e.detail);
      }
    };
    window.addEventListener('sm_settings_updated', handleUpdate);

    return () => {
      window.removeEventListener('sm_settings_updated', handleUpdate);
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  const phone1 = settings?.phone1 || "+880 1710-820987";
  const phone2 = settings?.phone2 || "+880 1942-237399";
  const whatsappNumber = settings?.whatsappNumber || "+8801710820987";
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');
  const proprietorName = settings?.proprietorBn || "আব্দুস সালাম খাঁন";
  const addressText = settings?.addressBn || "বাদে নাভারন, আকিজ কলেজিয়েট স্কুলের পশ্চিম পাশে , ঝিকরগাছা ,যশোর";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError('অনুগ্রহ করে নাম, ফোন নম্বর ও আপনার বার্তা লিখুন।');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          notes: `[Contact Form Message]: ${message} (Email: ${email})`,
          productType: 'contact',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit');
      }
    } catch {
      setError('সংযোগ বিচ্ছিন্ন হয়েছে। অনুগ্রহ করে হোয়াটসঅ্যাপে জানান।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-wood-50/40 dark:bg-wood-950 pb-16 md:pb-0 overflow-x-hidden">
      <Header initialSettings={settings || undefined} />

      {/* Banner */}
      <section className="bg-gradient-to-b from-wood-950 via-wood-900 to-wood-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-wood-800 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-3">
            <Phone className="w-3.5 h-3.5" />
            যোগাযোগ
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif mb-4">
            এস এম ডোর কন্টাক্ট ও সাপোর্ট
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-wood-300">
            কাঠের দরজা, সাইজ কাঠ বা কাস্টম ফার্নিচার বিষয়ে যেকোনো জিজ্ঞাসা ও কোটেশনের জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-wood-950 dark:text-white font-serif border-b border-wood-100 dark:border-wood-800 pb-3">
                সরাসরি যোগাযোগের ঠিকানা
              </h2>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <UserCheck className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-wood-900 dark:text-white block">প্রোপাইটর:</strong>
                  <span className="text-wood-700 dark:text-wood-300 font-medium">{proprietorName}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <MapPin className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-wood-900 dark:text-white block">স’মিল, কারখানা ও শোরুম:</strong>
                  <span className="text-wood-600 dark:text-wood-400">{addressText}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <Phone className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-wood-900 dark:text-white block">ফোন কল:</strong>
                  <div className="space-y-1 mt-1 text-gold-600 dark:text-gold-400 font-semibold">
                    <a href={`tel:${phone1}`} className="block hover:underline">{phone1}</a>
                    <a href={`tel:${phone2}`} className="block hover:underline">{phone2}</a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <Clock className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-wood-900 dark:text-white block">খোলা থাকার সময়:</strong>
                  <span className="text-wood-600 dark:text-wood-400">সকাল ৮:০০ - রাত ৯:০০ (সপ্তাহের ৭ দিনই খোলা)</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি সরাসরি কাঠের দরজা বা স’মিল সম্পর্কে জানতে আগ্রহী।')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white dark:bg-wood-900 border border-wood-200 dark:border-wood-800 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-wood-950 dark:text-white font-serif mb-2">
                মেসেজ পাঠান বা কলব্যাক চান
              </h2>
              <p className="text-xs sm:text-sm text-wood-500 mb-6">
                আপনার বার্তা ও যোগাযোগ নম্বর লিখে সাবমিট করুন। আমরা দ্রুত আপনার সাথে কথা বলব।
              </p>

              {submitted ? (
                <div className="p-8 text-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200 mb-2">
                    আপনার বার্তা গৃহীত হয়েছে!
                  </h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mb-6">
                    এস এম ডোর-এর প্রতিনিধি শীঘ্রই আপনার নম্বরে যোগাযোগ করবেন।
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setPhone('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="text-xs font-bold text-emerald-700 underline"
                  >
                    আরেকটি বার্তা পাঠান
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                        আপনার নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="আপনার পূর্ণ নাম"
                        className="w-full px-4 py-3 rounded-xl border border-wood-200 dark:border-wood-700 bg-wood-50/50 dark:bg-wood-950 text-xs text-wood-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                        মোবাইল নম্বর *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="018XXXXXXXX"
                        className="w-full px-4 py-3 rounded-xl border border-wood-200 dark:border-wood-700 bg-wood-50/50 dark:bg-wood-950 text-xs text-wood-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      ইমেইল ঠিকানা (ঐচ্ছিক)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-wood-200 dark:border-wood-700 bg-wood-50/50 dark:bg-wood-950 text-xs text-wood-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      আপনার জিজ্ঞাসা বা বার্তা *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="আপনার প্রয়োজনীয় দরজার সাইজ, কাঠের পছন্দ বা প্রজেক্টের বিবরণ লিখুন..."
                      className="w-full px-4 py-3 rounded-xl border border-wood-200 dark:border-wood-700 bg-wood-50/50 dark:bg-wood-950 text-xs text-wood-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-wood-950 dark:bg-gold-500 text-gold-400 dark:text-wood-950 font-bold text-xs sm:text-sm hover:opacity-95 shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings || undefined} />
      <BottomNav whatsappNumber={whatsappNumber} />
      <FloatingActions whatsappNumber={whatsappNumber} phone={phone1} />
    </main>
  );
}
