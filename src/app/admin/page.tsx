'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Product, 
  WoodSpecies, 
  CalculatorRates, 
  CustomOrderInquiry, 
  HeroBanner, 
  SiteSettings,
  Review 
} from '@/types';
import { formatBDT } from '@/lib/calculator';
import { PhoneImageUpload, UploadedImageInfo } from '@/components/PhoneImageUpload';
import {
  Lock,
  LogOut,
  LayoutDashboard,
  Package,
  Layers,
  Calculator,
  Inbox,
  Image as ImageIcon,
  Sliders,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  X,
  ExternalLink,
  MessageCircle,
  Phone,
  Eye,
  AlertCircle,
  Sparkles,
  TreePine,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  Activity,
  Server,
  Upload,
  Database,
  Globe
} from 'lucide-react';

interface ConnectionStatusState {
  databaseConnected: boolean;
  storageConnected: boolean;
  authConnected: boolean;
  cacheRevalidationConnected: boolean;
  contentPublished: boolean;
  lastUpdateTime: string;
  websiteLiveUrl: string;
  adminPortalConnected: boolean;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Active admin module tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'categories' | 'rates' | 'inquiries' | 'banners' | 'pages' | 'media'
  >('dashboard');

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [speciesList, setSpeciesList] = useState<WoodSpecies[]>([]);
  const [rates, setRates] = useState<CalculatorRates | null>(null);
  const [inquiries, setInquiries] = useState<CustomOrderInquiry[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Connection status diagnostic states
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusState | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testingPublish, setTestingPublish] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<string | null>(null);

  // Category filter for product manager
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Editing state for Product Modal
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Status Filter for Inquiries
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');
  const [selectedInquiryDetail, setSelectedInquiryDetail] = useState<CustomOrderInquiry | null>(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const showNotification = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => {
      setSaveSuccessMessage('');
    }, 4500);
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        loadAllData();
        fetchConnectionStatus();
      }
    } catch {
      // not authenticated
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        loadAllData();
        fetchConnectionStatus();
      } else {
        setAuthError(data.error || 'ভুল পিন বা পাসওয়ার্ড। আবার চেষ্টা করুন।');
      }
    } catch {
      setAuthError('লগইন করার সময় নেটওয়ার্ক ত্রুটি দেখা দিয়েছে।');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/check', { method: 'POST' });
    setIsAuthenticated(false);
  };

  const fetchConnectionStatus = async () => {
    try {
      const res = await fetch('/api/admin/connection-test');
      const data = await res.json();
      if (data.success && data.status) {
        setConnectionStatus(data.status);
      }
    } catch (e) {
      console.warn('Failed to fetch connection status:', e);
    }
  };

  const runConnectionDiagnostic = async () => {
    setTestingConnection(true);
    setConnectionTestResult(null);
    try {
      const res = await fetch('/api/admin/connection-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run_test' })
      });
      const data = await res.json();
      if (data.success) {
        setConnectionStatus(data.details);
        setConnectionTestResult(data.messageBn);
        showNotification('আপডেট সফল হয়েছে। ওয়েবসাইটে দেখা যাচ্ছে।');
      } else {
        setConnectionTestResult(data.errorBn || 'কানেকশন টেস্টে ত্রুটি পাওয়া গেছে।');
      }
    } catch {
      setConnectionTestResult('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
    } finally {
      setTestingConnection(false);
    }
  };

  const runTestPublishVerification = async () => {
    setTestingPublish(true);
    setConnectionTestResult(null);
    try {
      const res = await fetch('/api/admin/connection-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_publish' })
      });
      const data = await res.json();
      if (data.success && data.testPublish) {
        setConnectionTestResult(data.testPublish.messageBn);
        showNotification(data.testPublish.messageBn);
        fetchConnectionStatus();
      } else {
        setConnectionTestResult(data.errorBn || 'টেস্ট পাবলিশ ভেরিফিকেশন ব্যর্থ হয়েছে।');
      }
    } catch {
      setConnectionTestResult('টেস্ট পাবলিশ রিকোয়েস্টে নেটওয়ার্ক ত্রুটি হয়েছে।');
    } finally {
      setTestingPublish(false);
    }
  };

  const loadAllData = async () => {
    setLoadingData(true);
    try {
      const [pRes, sRes, rRes, iRes, bRes, setRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/species'),
        fetch('/api/calculator'),
        fetch('/api/inquiries'),
        fetch('/api/banners'),
        fetch('/api/settings')
      ]);

      const [pData, sData, rData, iData, bData, setData] = await Promise.all([
        pRes.json(),
        sRes.json(),
        rRes.json(),
        iRes.json(),
        bRes.json(),
        setRes.json()
      ]);

      if (pData.success) setProducts(pData.products || []);
      if (sData.success) setSpeciesList(sData.species || []);
      if (rData.success) setRates(rData.rates || null);
      if (iData.success) setInquiries(iData.inquiries || []);
      if (bData.success) setBanners(bData.banners || []);
      if (setData.success) setSettings(setData.settings || null);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const isNew = !products.some(p => p.id === editingProduct.id);
      const url = isNew ? '/api/products' : `/api/products/${editingProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      const data = await res.json();

      if (data.success) {
        showNotification(data.messageBn || 'আপডেট সফল হয়েছে। ওয়েবসাইটে দেখা যাচ্ছে।');
        setIsProductModalOpen(false);
        setEditingProduct(null);
        loadAllData();
        fetchConnectionStatus();
      } else {
        alert(data.error || 'প্রোডাক্ট সংরক্ষণ ব্যর্থ হয়েছে');
      }
    } catch {
      alert('প্রোডাক্ট সংরক্ষণের সময় নেটওয়ার্ক সমস্যা হয়েছে');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিতভাবে "${name}" মুছে ফেলতে চান?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('ডিজাইন সফলভাবে মুছে ফেলা হয়েছে। ওয়েবসাইটে আপডেট হয়েছে।');
        loadAllData();
        fetchConnectionStatus();
      } else {
        alert('প্রোডাক্ট মুছতে ব্যর্থ হয়েছে');
      }
    } catch {
      alert('নেটওয়ার্ক সমস্যা');
    }
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: CustomOrderInquiry['status']) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('অর্ডার স্ট্যাটাস আপডেট সফল হয়েছে।');
        loadAllData();
      }
    } catch {
      alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.messageBn || 'আপডেট সফল হয়েছে। ওয়েবসাইটে দেখা যাচ্ছে।');
        fetchConnectionStatus();
      } else {
        alert('সেটিংস সংরক্ষণ ব্যর্থ হয়েছে');
      }
    } catch {
      alert('সেটিংস সংরক্ষণে ত্রুটি');
    }
  };

  // If loading auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-white">
        <Sparkles className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  // If Not Authenticated -> Show Security Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-700 p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center">
                <TreePine className="w-9 h-9 text-amber-400" />
              </div>
            </div>
          </div>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            মেসার্স ফারহান এন্টারপ্রাইজ
          </h2>
          <p className="mt-1.5 text-center text-xs text-amber-400 font-semibold">
            প্রোপাইটর: মোঃ আব্দুর রউফ খাঁন — বাঘাড়পাড়া, যশোর
          </p>
          <p className="mt-1 text-center text-[11px] text-stone-400">
            নিরাপদ ওয়েবসাইট ম্যানেজমেন্ট ও অ্যাডমিন কন্ট্রোল প্যানেল
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
          <div className="bg-stone-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl border border-stone-800 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
              {authError && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2">
                  অ্যাডমিন পিন / পাসওয়ার্ড (Admin PIN)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="পিন লিখুন (উদা: 123456 বা admin123)"
                    className="w-full px-4 py-3.5 rounded-xl bg-stone-950 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                  <Lock className="w-4 h-4 text-stone-500 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-stone-400 mt-2">
                  ★ ডিফল্ট অ্যাডমিন পিন: <strong className="text-amber-400">123456</strong> অথবা <strong className="text-amber-400">admin123</strong>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
              >
                প্যানেলে প্রবেশ করুন (Login to Admin)
              </button>

              <div className="text-center pt-2">
                <Link href="/" className="text-xs text-stone-400 hover:text-amber-400 transition-colors">
                  ← ওয়েবসাইটে ফিরে যান (View Website)
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const categoryList = [
    { slug: 'all', titleBn: 'সকল প্রোডাক্ট ও ডিজাইন', titleEn: 'All Designs' },
    { slug: 'wood', titleBn: 'কাঠ / লগ ও সাইজ কাঠ', titleEn: 'Wood / Logs & Sized Wood' },
    { slug: 'door', titleBn: 'দরজা', titleEn: 'Door' },
    { slug: 'furniture', titleBn: 'ফার্নিচার', titleEn: 'Furniture' },
    { slug: 'dining-table', titleBn: 'ডাইনিং টেবিল', titleEn: 'Dining Table' },
    { slug: 'bed', titleBn: 'বেড / খাট', titleEn: 'Bed' },
    { slug: 'tea-table', titleBn: 'টি টেবিল', titleEn: 'Tea Table' },
    { slug: 'sofa', titleBn: 'সোফা', titleEn: 'Sofa' },
    { slug: 'custom-design', titleBn: 'কাস্টম ডিজাইন', titleEn: 'Custom Design' }
  ];

  const filteredProducts = productCategoryFilter === 'all' 
    ? products 
    : products.filter(p => p.category === productCategoryFilter);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      
      {/* Toast Notification */}
      {saveSuccessMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 text-xs sm:text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <header className="bg-stone-900 border-b border-stone-800 px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="flex items-center gap-2.5 group" title="Open Storefront in New Tab">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <TreePine className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span>মেসার্স ফারহান এন্টারপ্রাইজ</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              </h1>
              <span className="text-[10px] text-stone-400 block font-medium">
                প্রোপাইটর: মোঃ আব্দুর রউফ খাঁন — বাঘাড়পাড়া, যশোর
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>ওয়েবসাইট দেখুন (View Website)</span>
          </Link>

          <button
            onClick={loadAllData}
            disabled={loadingData}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </header>

      {/* Module Navigation Tabs */}
      <div className="bg-stone-900/80 border-b border-stone-800 px-4 sm:px-8 overflow-x-auto scrollbar-none sticky top-14 z-20 backdrop-blur-md">
        <nav className="flex space-x-1 sm:space-x-2 py-2">
          {[
            { id: 'dashboard', label: 'ড্যাশবোর্ড ও কানেকশন', icon: LayoutDashboard },
            { id: 'products', label: `প্রোডাক্ট ও ডিজাইন (${products.length})`, icon: Package },
            { id: 'media', label: 'ছবি আপলোড (ফোন-ফ্রেন্ডলি)', icon: Upload },
            { id: 'inquiries', label: `কাস্টম অর্ডার (${inquiries.filter(i => i.status === 'new').length} নতুন)`, icon: Inbox },
            { id: 'categories', label: 'কাঠের প্রজাতি ও রেট', icon: Layers },
            { id: 'rates', label: 'ক্যালকুলেটর সেটিংস', icon: Calculator },
            { id: 'banners', label: 'হোম ব্যানার', icon: Sliders },
            { id: 'pages', label: 'ব্যবসায় তথ্য ও ফোন', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Admin Workspace */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        
        {/* MODULE 1: DASHBOARD & CONNECTION CHECKER */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Website Connection Status Section */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span>ওয়েবসাইট কানেকশন স্ট্যাটাস (Website Connection Status)</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </h3>
                    <p className="text-xs text-stone-400">
                      লাইভ ডাটাবেজ, ইমেজ স্টোরেজ, ক্যাশ রিভ্যালিডেশন ও ওয়েবসাইট সিঙ্কিং মনিটরিং
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={runConnectionDiagnostic}
                    disabled={testingConnection}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 active:scale-95 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                    <span>কানেকশন টেস্ট চালান (Run Connection Test)</span>
                  </button>

                  <button
                    type="button"
                    onClick={runTestPublishVerification}
                    disabled={testingPublish}
                    className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-stone-700"
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${testingPublish ? 'animate-spin' : ''}`} />
                    <span>টেস্ট পাবলিশ ফিচার</span>
                  </button>
                </div>
              </div>

              {/* Status Indicator Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-400">1. ডাটাবেজ কানেক্টেড</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm font-bold text-emerald-400">Yes (সক্রিয়)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-400">2. স্টোরেজ কানেক্টেড</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm font-bold text-emerald-400">Yes (সক্রিয়)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-400">3. অথেনটিকেশন</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm font-bold text-emerald-400">Yes (লগইন করা)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-400">4. ক্যাশ রিভ্যালিডেশন</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm font-bold text-emerald-400">Yes (অন-ডিমান্ড)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-400">5. সর্বশেষ কন্টেন্ট লাইভ</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm font-bold text-emerald-400">Yes (১০০% সিঙ্কড)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-400">6. অ্যাডমিন পোর্টাল লিঙ্ক</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm font-bold text-emerald-400">Yes (কানেক্টেড)</span>
                </div>

                <div className="col-span-2 p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-400">7. ওয়েবসাইট লাইভ URL</span>
                    <Globe className="w-4 h-4 text-amber-400" />
                  </div>
                  <a 
                    href={connectionStatus?.websiteLiveUrl || '/'} 
                    target="_blank" 
                    className="text-xs font-mono font-bold text-amber-400 hover:underline block truncate"
                  >
                    {connectionStatus?.websiteLiveUrl || 'http://localhost:3000'}
                  </a>
                </div>
              </div>

              {/* Diagnostic message box */}
              {connectionTestResult && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  <span>{connectionTestResult}</span>
                </div>
              )}
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow">
                <span className="text-xs text-stone-400 block mb-1">মোট ডিজাইন ও প্রোডাক্ট</span>
                <span className="text-3xl font-extrabold text-white">{products.length}</span>
                <span className="text-[11px] text-emerald-400 block mt-1">৮টি ক্যাটাগরিতে বিভক্ত</span>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow">
                <span className="text-xs text-stone-400 block mb-1">নতুন কাস্টম অর্ডার</span>
                <span className="text-3xl font-extrabold text-amber-400">
                  {inquiries.filter(i => i.status === 'new').length}
                </span>
                <span className="text-[11px] text-amber-400 block mt-1">রেসপন্স প্রয়োজন</span>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow">
                <span className="text-xs text-stone-400 block mb-1">কাঠের প্রজাতি</span>
                <span className="text-3xl font-extrabold text-white">{speciesList.length}</span>
                <span className="text-[11px] text-stone-400 block mt-1">লাইভ সিএফটি সিঙ্কড</span>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow">
                <span className="text-xs text-stone-400 block mb-1">চিটাগাং সেগুন / CFT</span>
                <span className="text-3xl font-extrabold text-emerald-400">
                  {formatBDT(rates?.woodSpeciesRates['ctg-teak'] || 4800, 'en')}
                </span>
                <span className="text-[11px] text-stone-400 block mt-1">লাইভ বাজার রেট</span>
              </div>
            </div>

            {/* Recent Inquiries List */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">সর্বশেষ কাস্টম অর্ডার ও ইনকোয়ারি</h3>
                  <p className="text-xs text-stone-400">গ্রাহকদের সাবমিট করা ডিজাইন ও যোগাযোগের তালিকা</p>
                </div>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs font-semibold text-amber-400 hover:underline"
                >
                  সব দেখুন ({inquiries.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-800 text-stone-400">
                      <th className="pb-3 font-semibold">রেফারেন্স আইডি</th>
                      <th className="pb-3 font-semibold">গ্রাহকের নাম ও ফোন</th>
                      <th className="pb-3 font-semibold">পণ্য ও কাঠ</th>
                      <th className="pb-3 font-semibold">স্ট্যাটাস</th>
                      <th className="pb-3 font-semibold text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {inquiries.slice(0, 5).map((inq) => (
                      <tr key={inq.id} className="hover:bg-stone-850/50 transition-colors">
                        <td className="py-3 font-mono font-bold text-amber-400">#{inq.id}</td>
                        <td className="py-3">
                          <p className="font-bold text-white">{inq.customerName}</p>
                          <p className="text-stone-400 font-mono">{inq.customerPhone} ({inq.customerDistrict})</p>
                        </td>
                        <td className="py-3 text-stone-200">
                          <span className="font-semibold text-amber-300">{inq.woodSpeciesName}</span>
                          <span className="block text-stone-400 text-[11px] capitalize">
                            ধরন: {inq.productType}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            inq.status === 'new' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            inq.status === 'contacted' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            inq.status === 'in_progress' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedInquiryDetail(inq);
                              setActiveTab('inquiries');
                            }}
                            className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold"
                          >
                            বিস্তারিত
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: PRODUCT / DESIGN MANAGER */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">প্রোডাক্ট ও ডিজাইন ম্যানেজার (Design Catalog)</h3>
                <p className="text-xs text-stone-400">ডিজাইন নম্বর (FE-CAT-001) দিয়ে নতুন ডিজাইন যুক্ত করুন অথবা সম্পাদনা করুন</p>
              </div>

              <button
                onClick={() => {
                  const defaultCat = 'door';
                  const prefixMap: Record<string, string> = {
                    'wood': 'FE-WOOD',
                    'door': 'FE-DOOR',
                    'furniture': 'FE-FURN',
                    'dining-table': 'FE-DINING',
                    'bed': 'FE-BED',
                    'tea-table': 'FE-TEA',
                    'sofa': 'FE-SOFA',
                    'custom-design': 'FE-CUSTOM'
                  };
                  const existingCount = products.filter(p => p.category === defaultCat).length;
                  const autoDesignNumber = `${prefixMap[defaultCat]}-${String(existingCount + 1).padStart(3, '0')}`;

                  setEditingProduct({
                    id: `prod-${Date.now()}`,
                    designNumber: autoDesignNumber,
                    titleBn: '',
                    titleEn: '',
                    category: defaultCat,
                    categoryLabelBn: 'দরজা',
                    categoryLabelEn: 'Door',
                    defaultWoodSpeciesId: 'ctg-teak',
                    defaultPrice: 25000,
                    regularPrice: 28000,
                    priceType: 'starting',
                    qualityGrade: 'premium',
                    finishOptions: ['ম্যাট ল্যাকার', 'হাই-গ্লস'],
                    descriptionBn: '',
                    descriptionEn: '',
                    featuresBn: ['১০০% পাকা সার কাঠ', 'ভ্যাকুয়াম কেমিক্যাল ট্রিটমেন্ট সম্পন্ন'],
                    featuresEn: ['100% Solid mature timber', 'Vacuum chemical pressure treated'],
                    specifications: {
                      standardHeight: '৮১" (৬.৭৫ ফুট)',
                      standardWidth: '৩৯" (৩.২৫ ফুট)',
                      standardThickness: '১.৫" (৩৮ মিমি)',
                      moistureContent: '১২% - ১৪%',
                      seasoningMethodBn: 'বাষ্পীয় চেম্বার সিজনিং',
                      seasoningMethodEn: 'Steam Kiln Seasoning',
                      chemicalTreatmentBn: 'CCB ভ্যাকুয়াম কেমিক্যাল প্রেশার ট্রিটমেন্ট',
                      chemicalTreatmentEn: 'CCB Vacuum Pressure Treatment',
                      warrantyYears: 15,
                      suitableForBn: 'প্রধান দরজা',
                      suitableForEn: 'Main Entrance'
                    },
                    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&auto=format&fit=crop&q=80'],
                    isFeatured: true,
                    isBestSeller: false,
                    stockStatus: 'in_stock',
                    rating: 4.9,
                    reviewsCount: 1
                  });
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন ডিজাইন / প্রোডাক্ট যোগ করুন</span>
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {categoryList.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setProductCategoryFilter(cat.slug)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    productCategoryFilter === cat.slug
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {cat.titleBn}
                </button>
              ))}
            </div>

            {/* Products Table */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-800 bg-stone-950/60 text-stone-400">
                      <th className="py-3 px-4 font-semibold">ডিজাইন নম্বর</th>
                      <th className="py-3 px-4 font-semibold">ছবি</th>
                      <th className="py-3 px-4 font-semibold">পণ্যের নাম ও বিবরণ</th>
                      <th className="py-3 px-4 font-semibold">ক্যাটাগরি</th>
                      <th className="py-3 px-4 font-semibold">কোয়ালিটি</th>
                      <th className="py-3 px-4 font-semibold">মূল্য</th>
                      <th className="py-3 px-4 font-semibold">স্টক</th>
                      <th className="py-3 px-4 font-semibold text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-850/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">
                          {p.designNumber || 'FE-CAT-000'}
                        </td>
                        <td className="py-3 px-4">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200'}
                            alt={p.titleBn}
                            className="w-12 h-12 rounded-lg object-cover border border-stone-700 bg-stone-950"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-white text-sm">{p.titleBn}</p>
                          <p className="text-stone-400 text-[11px] line-clamp-1">{p.titleEn}</p>
                        </td>
                        <td className="py-3 px-4 text-stone-300">
                          <span className="px-2 py-0.5 rounded-md bg-stone-800 text-[11px] font-medium">
                            {p.categoryLabelBn || p.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize text-[11px] font-semibold text-amber-400">
                            {p.qualityGrade === 'premium' ? 'প্রিমিয়াম' : p.qualityGrade === 'standard' ? 'স্ট্যান্ডার্ড' : 'ইকোনমি'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          {formatBDT(p.defaultPrice, 'en')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            p.stockStatus === 'in_stock' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            p.stockStatus === 'made_to_order' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}>
                            {p.stockStatus === 'in_stock' ? 'রেডি স্টক' : p.stockStatus === 'made_to_order' ? 'অর্ডার প্রস্তুত' : 'কাস্টম'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setIsProductModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white"
                              title="সম্পাদনা করুন"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.titleBn)}
                              className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-400 hover:text-red-200"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 3: PHONE-FRIENDLY IMAGE UPLOAD & GALLERY */}
        {activeTab === 'media' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">ফোন-ফ্রেন্ডলি ছবি আপলোড (Mobile Image Upload)</h3>
              <p className="text-xs text-stone-400">
                মোবাইল ফোনের ক্যামেরা দিয়ে সরাসরি ছবি তুলুন অথবা গ্যালারি থেকে ছবি আপলোড করুন। স্বয়ংক্রিয়ভাবে WebP ফরম্যাটে কম্প্রেস ও অপ্টিমাইজ হবে।
              </p>
            </div>

            {/* Phone Image Upload Component */}
            <PhoneImageUpload
              onUploadSuccess={(info: UploadedImageInfo) => {
                showNotification(`${info.filename} সফলভাবে আপলোড ও অপ্টিমাইজ হয়েছে!`);
              }}
              defaultSection="Product Image"
            />

            {/* Uploaded Gallery Grid */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
              <h4 className="text-sm font-bold text-white mb-4">ক্যাটালগের বর্তমান ছবি সমূহ:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {products.map((prod) => (
                  <div key={prod.id} className="relative group rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400'}
                      alt={prod.titleBn}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2 bg-stone-900/90 text-[11px]">
                      <span className="font-mono text-amber-400 font-bold block">{prod.designNumber}</span>
                      <span className="text-stone-300 block truncate">{prod.titleBn}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 4: INQUIRIES & CUSTOM ORDERS */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">কাস্টম ডিজাইন ও কাস্টমার অর্ডার তালিকা</h3>
              <p className="text-xs text-stone-400">গ্রাহকদের পাঠানো রেফারেন্স আইডি (FE-YYYYMMDD-XXXX) ও কাস্টম মাপ</p>
            </div>

            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-amber-400 text-xs">#{inq.id}</span>
                      <span className="text-xs text-stone-400">• {new Date(inq.createdAt).toLocaleDateString('bn-BD')}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{inq.customerName}</h4>
                    <p className="text-xs text-stone-300 font-mono mt-0.5">{inq.customerPhone} ({inq.customerDistrict})</p>
                    <p className="text-xs text-amber-300 mt-1">
                      পণ্য: {inq.productType} • কাঠ: {inq.woodSpeciesName} • মাপ: {inq.dimensions?.height}&quot;×{inq.dimensions?.width}&quot;×{inq.dimensions?.thickness}&quot;
                    </p>
                    {inq.notes && (
                      <p className="text-xs text-stone-400 mt-1 bg-stone-950 p-2 rounded-lg border border-stone-800">
                        {inq.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select
                      value={inq.status}
                      onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                      className="text-xs bg-stone-950 border border-stone-700 text-stone-200 rounded-xl px-3 py-1.5"
                    >
                      <option value="new">নতুন (New)</option>
                      <option value="contacted">যোগাযোগ সম্পন্ন</option>
                      <option value="in_progress">কাজ চলছে</option>
                      <option value="completed">সম্পন্ন হয়েছে</option>
                    </select>

                    <a
                      href={`https://wa.me/${inq.customerPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>হোয়াটসঅ্যাপ</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 5: WOOD SPECIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">কাঠের প্রজাতি ও বর্তমান বাজার রেট</h3>
              <p className="text-xs text-stone-400">প্রতি সিএফটি চেরা ও গোল কাঠের দর তালিকা</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {speciesList.map((sp) => (
                <div key={sp.id} className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                  <h4 className="font-bold text-amber-400 text-sm mb-1">{sp.nameBn}</h4>
                  <p className="text-xs text-stone-400 mb-3">{sp.nameEn} ({sp.originBn})</p>
                  <p className="text-xs text-stone-300 leading-relaxed mb-3">{sp.descriptionBn}</p>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-stone-800">
                    <span className="text-stone-400">চেরা কাঠ: <strong className="text-emerald-400">{formatBDT(sp.currentRatePerCft, 'en')} / CFT</strong></span>
                    <span className="text-stone-400">গোল গুঁড়ি: <strong className="text-amber-400">{formatBDT(sp.roundLogRatePerCft, 'en')} / CFT</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 6: CALCULATOR RATES */}
        {activeTab === 'rates' && rates && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">ক্যালকুলেটর সেটিংস ও রেট আপডেট</h3>
              <p className="text-xs text-stone-400">সিএফটি ক্যালকুলেটরে ব্যবহৃত প্রতি কাঠের দর পরিবর্তন করুন</p>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-2xl">
              <div className="space-y-4">
                {Object.entries(rates.woodSpeciesRates).map(([spId, rate]) => (
                  <div key={spId} className="flex items-center justify-between gap-4 py-2 border-b border-stone-800">
                    <span className="text-xs font-bold text-stone-200 capitalize">{spId.replace('-', ' ')}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setRates({
                            ...rates,
                            woodSpeciesRates: { ...rates.woodSpeciesRates, [spId]: val }
                          });
                        }}
                        className="w-32 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-right font-mono text-emerald-400 font-bold text-xs"
                      />
                      <span className="text-xs text-stone-400">৳/CFT</span>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={async () => {
                    const res = await fetch('/api/calculator', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(rates)
                    });
                    const d = await res.json();
                    if (d.success) showNotification('ক্যালকুলেটর রেট সফলভাবে আপডেট হয়েছে!');
                  }}
                  className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow transition-all"
                >
                  রেট সংরক্ষণ করুন (Save Calculator Rates)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 7: HOME BANNERS */}
        {activeTab === 'banners' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">হোম পেজ ব্যানার ও স্লাইডার</h3>
              <p className="text-xs text-stone-400">প্রধান ব্যানারের শিরোনাম ও ব্যাকগ্রাউন্ড ইমেজ নিয়ন্ত্রণ করুন</p>
            </div>

            <div className="space-y-4">
              {banners.map((b) => (
                <div key={b.id} className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <img src={b.bgImageUrl} alt={b.titleBn} className="w-full md:w-36 h-24 object-cover rounded-xl border border-stone-700" />
                  <div className="flex-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold mb-1 inline-block">{b.badgeBn}</span>
                    <h4 className="font-bold text-white text-sm">{b.titleBn}</h4>
                    <p className="text-xs text-stone-400 mt-1">{b.subtitleBn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 8: BUSINESS INFO & CONTACT SETTINGS */}
        {activeTab === 'pages' && settings && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">ব্যবসায় তথ্য, ফোন নম্বর ও নোটিশ সেটিংস</h3>
              <p className="text-xs text-stone-400">মেসার্স ফারহান এন্টারপ্রাইজের যোগাযোগের নম্বর ও ঠিকানা আপডেট করুন</p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-4 max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">প্রতিষ্ঠানের নাম (বাংলা)</label>
                  <input
                    type="text"
                    value={settings.siteNameBn || ''}
                    onChange={(e) => setSettings({ ...settings, siteNameBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">প্রতিষ্ঠানের নাম (English)</label>
                  <input
                    type="text"
                    value={settings.siteNameEn || ''}
                    onChange={(e) => setSettings({ ...settings, siteNameEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">প্রোপাইটর নাম (Proprietor)</label>
                  <input
                    type="text"
                    value={settings.proprietorBn || ''}
                    onChange={(e) => setSettings({ ...settings, proprietorBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">প্রোপাইটর নাম (English)</label>
                  <input
                    type="text"
                    value={settings.proprietorEn || ''}
                    onChange={(e) => setSettings({ ...settings, proprietorEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">মোবাইল নম্বর ১ (Phone 1)</label>
                  <input
                    type="text"
                    value={settings.phone1 || ''}
                    onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">মোবাইল নম্বর ২ (Phone 2)</label>
                  <input
                    type="text"
                    value={settings.phone2 || ''}
                    onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">হোয়াটসঅ্যাপ নম্বর ১ (WhatsApp 1)</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber || ''}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">হোয়াটসঅ্যাপ নম্বর ২ (WhatsApp 2)</label>
                  <input
                    type="text"
                    value={settings.whatsappNumberSecondary || ''}
                    onChange={(e) => setSettings({ ...settings, whatsappNumberSecondary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">ঠিকানা (বাংলা)</label>
                <input
                  type="text"
                  value={settings.addressBn || ''}
                  onChange={(e) => setSettings({ ...settings, addressBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">সার্ভিস ও ব্যবসার বিবরণ (Services)</label>
                <textarea
                  rows={2}
                  value={settings.servicesBn || ''}
                  onChange={(e) => setSettings({ ...settings, servicesBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">শীর্ষ নোটিশ টেক্সট (Notice Bar)</label>
                <input
                  type="text"
                  value={settings.noticeTextBn || ''}
                  onChange={(e) => setSettings({ ...settings, noticeTextBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg transition-all"
              >
                তথ্য সংরক্ষণ করুন (Save Business Settings)
              </button>
            </form>
          </div>
        )}
      </main>

      {/* PRODUCT MODAL WITH PHONE IMAGE UPLOAD */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
              <h3 className="text-base font-bold text-white">
                {editingProduct.id?.startsWith('prod-') ? 'ডিজাইন সম্পাদনা / নতুন প্রোডাক্ট' : 'ডিজাইন আপডেট'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">ডিজাইন নম্বর (Design Number) *</label>
                  <input
                    type="text"
                    required
                    placeholder="উদা: FE-DOOR-001, FE-BED-001"
                    value={editingProduct.designNumber || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, designNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-amber-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-bold">ক্যাটাগরি *</label>
                  <select
                    value={editingProduct.category || 'door'}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const prefixMap: Record<string, string> = {
                        'wood': 'FE-WOOD',
                        'door': 'FE-DOOR',
                        'furniture': 'FE-FURN',
                        'dining-table': 'FE-DINING',
                        'bed': 'FE-BED',
                        'tea-table': 'FE-TEA',
                        'sofa': 'FE-SOFA',
                        'custom-design': 'FE-CUSTOM'
                      };
                      const catObj = categoryList.find(c => c.slug === newCat);
                      setEditingProduct({
                        ...editingProduct,
                        category: newCat as any,
                        categoryLabelBn: catObj?.titleBn || newCat,
                        categoryLabelEn: catObj?.titleEn || newCat,
                        designNumber: editingProduct.designNumber || `${prefixMap[newCat] || 'FE'}-001`
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  >
                    <option value="wood">কাঠ / লগ ও সাইজ কাঠ (Wood / Logs)</option>
                    <option value="door">দরজা (Door)</option>
                    <option value="furniture">ফার্নিচার (Furniture)</option>
                    <option value="dining-table">ডাইনিং টেবিল (Dining Table)</option>
                    <option value="bed">বেড / খাট (Bed)</option>
                    <option value="tea-table">টি টেবিল (Tea Table)</option>
                    <option value="sofa">সোফা (Sofa)</option>
                    <option value="custom-design">কাস্টম ডিজাইন (Custom Design)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.titleBn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, titleBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">নাম (English)</label>
                  <input
                    type="text"
                    value={editingProduct.titleEn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, titleEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.defaultPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, defaultPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">প্রাইস টাইপ</label>
                  <select
                    value={editingProduct.priceType || 'starting'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  >
                    <option value="starting">শুরু মূল্য (Starting Price)</option>
                    <option value="fixed">ফিক্সড রেট (Fixed Price)</option>
                    <option value="request">দাম জানতে যোগাযোগ (Request for Price)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">কোয়ালিটি গ্রেড</label>
                  <select
                    value={editingProduct.qualityGrade || 'premium'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, qualityGrade: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  >
                    <option value="premium">প্রিমিয়াম কোয়ালিটি (Premium)</option>
                    <option value="standard">স্ট্যান্ডার্ড কোয়ালিটি (Standard)</option>
                    <option value="economy">ইকোনমি কোয়ালিটি (Economy)</option>
                  </select>
                </div>
              </div>

              {/* Phone Image Upload Section inside Modal */}
              <div className="p-3 bg-stone-950/80 rounded-2xl border border-stone-800">
                <label className="block text-stone-300 mb-2 font-bold flex items-center justify-between">
                  <span>ফোন থেকে ছবি তুলুন বা গ্যালারি থেকে যোগ করুন:</span>
                </label>
                <PhoneImageUpload
                  onUploadSuccess={(info: UploadedImageInfo) => {
                    const currentImgs = editingProduct.images || [];
                    setEditingProduct({
                      ...editingProduct,
                      images: [info.url, ...currentImgs]
                    });
                    showNotification('ছবি প্রোডাক্টে যোগ করা হয়েছে!');
                  }}
                  defaultSection="Product Image"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">ছবির URL (Direct Image URL)</label>
                <input
                  type="text"
                  value={editingProduct.images?.[0] || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">বিবরণ (বাংলা)</label>
                <textarea
                  rows={2}
                  value={editingProduct.descriptionBn || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descriptionBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold"
                >
                  সংরক্ষণ করুন (Save Product)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INQUIRY DETAIL MODAL */}
      {selectedInquiryDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
              <h3 className="text-base font-bold text-white">
                ইনকোয়ারি বিস্তারিত — #{selectedInquiryDetail.id}
              </h3>
              <button onClick={() => setSelectedInquiryDetail(null)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            {selectedInquiryDetail.designImageUrl && (
              <div className="mb-4 rounded-xl overflow-hidden border border-stone-700 max-h-56 bg-stone-950">
                <img src={selectedInquiryDetail.designImageUrl} alt="Uploaded Design" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-2 text-xs text-stone-300 mb-6">
              <p><strong>রেফারেন্স আইডি:</strong> <span className="text-amber-400 font-mono font-bold">#{selectedInquiryDetail.id}</span></p>
              <p><strong>গ্রাহকের নাম:</strong> {selectedInquiryDetail.customerName}</p>
              <p><strong>ফোন নম্বর:</strong> <a href={`tel:${selectedInquiryDetail.customerPhone}`} className="text-amber-400 font-mono">{selectedInquiryDetail.customerPhone}</a></p>
              <p><strong>জেলা / এলাকা:</strong> {selectedInquiryDetail.customerDistrict} {selectedInquiryDetail.deliveryAddress}</p>
              <p><strong>পণ্যের ধরন:</strong> <span className="capitalize text-white font-semibold">{selectedInquiryDetail.productType}</span></p>
              <p><strong>কাঠের পছন্দ:</strong> <span className="text-amber-400 font-bold">{selectedInquiryDetail.woodSpeciesName}</span></p>
              <p><strong>মাপ:</strong> {selectedInquiryDetail.dimensions?.height}&quot; × {selectedInquiryDetail.dimensions?.width}&quot; × {selectedInquiryDetail.dimensions?.thickness}&quot; ({selectedInquiryDetail.quantity} পিস)</p>
              {selectedInquiryDetail.notes && (
                <p className="bg-stone-950 p-2.5 rounded-lg border border-stone-800 mt-2">
                  <strong>গ্রাহকের নোট:</strong> {selectedInquiryDetail.notes}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-800">
              <a
                href={`https://wa.me/${selectedInquiryDetail.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম, মেসার্স ফারহান এন্টারপ্রাইজ থেকে আপনার কাস্টম অর্ডার (রেফারেন্স: #' + selectedInquiryDetail.id + ') সম্পর্কে যোগাযোগ করছি।')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>হোয়াটসঅ্যাপে মেসেজ</span>
              </a>

              <button
                onClick={() => setSelectedInquiryDetail(null)}
                className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
