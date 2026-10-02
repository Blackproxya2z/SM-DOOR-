'use client';

import React, { useState, useEffect } from 'react';
import { WoodSpecies, CalculatorRates } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useQuote } from '@/context/QuoteContext';
import { 
  calculateSawnTimberCFT, 
  calculateWoodLogCFT, 
  calculateDoorFrame,
  buildWhatsAppLink
} from '@/lib/calculator';
import { 
  Calculator, 
  Layers, 
  RotateCcw, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  Info,
  DollarSign,
  ClipboardList,
  Check
} from 'lucide-react';

interface CftCalculatorProps {
  initialSpecies: WoodSpecies[];
  initialRates: CalculatorRates;
  whatsappNumber?: string;
  defaultTab?: 'sawn' | 'log' | 'frame';
}

export function CftCalculator({ 
  initialSpecies, 
  initialRates, 
  whatsappNumber = "+8801710820987",
  defaultTab = 'sawn'
}: CftCalculatorProps) {
  const { language, t, formatPrice, formatNum, toLocalDigits } = useLanguage();
  const { addItem } = useQuote();

  const [activeTab, setActiveTab] = useState<'sawn' | 'log' | 'frame'>(defaultTab);
  const [addedNotice, setAddedNotice] = useState(false);
  const [speciesList, setSpeciesList] = useState<WoodSpecies[]>(initialSpecies);
  const [rates, setRates] = useState<CalculatorRates>(initialRates);

  // Sawn Timber State
  const [sawnLengthFeet, setSawnLengthFeet] = useState<number>(7);
  const [sawnLengthInches, setSawnLengthInches] = useState<number>(0);
  const [sawnWidthInches, setSawnWidthInches] = useState<number>(10);
  const [sawnThicknessInches, setSawnThicknessInches] = useState<number>(1.5);
  const [sawnQuantity, setSawnQuantity] = useState<number>(1);
  const [sawnSpeciesId, setSawnSpeciesId] = useState<string>(initialSpecies[0]?.id || 'ctg-teak');
  const [customSawnRate, setCustomSawnRate] = useState<number | ''>('');

  // Round Log State
  const [logLengthFeet, setLogLengthFeet] = useState<number>(10);
  const [logLengthInches, setLogLengthInches] = useState<number>(0);
  const [logGirthInches, setLogGirthInches] = useState<number>(36);
  const [logQuantity, setLogQuantity] = useState<number>(1);
  const [logSpeciesId, setLogSpeciesId] = useState<string>(initialSpecies[0]?.id || 'ctg-teak');
  const [customLogRate, setCustomLogRate] = useState<number | ''>('');

  // Door Frame (চৌকাঠ) State
  const [frameHeightFeet, setFrameHeightFeet] = useState<number>(7);
  const [frameHeightInches, setFrameHeightInches] = useState<number>(0);
  const [frameWidthFeet, setFrameWidthFeet] = useState<number>(3.25); // 39 inches = 3.25 ft
  const [frameSectionW, setFrameSectionW] = useState<number>(5); // 5 inches
  const [frameSectionT, setFrameSectionT] = useState<number>(2.5); // 2.5 inches
  const [frameQuantity, setFrameQuantity] = useState<number>(1);
  const [frameSpeciesId, setFrameSpeciesId] = useState<string>('sal-wood');
  const [includeTreatment, setIncludeTreatment] = useState<boolean>(true);
  const [customFrameRate, setCustomFrameRate] = useState<number | ''>('');

  // Effective Rates
  const effectiveSawnRate = customSawnRate !== '' 
    ? Number(customSawnRate) 
    : (rates.woodSpeciesRates[sawnSpeciesId] || 1650);

  const effectiveLogRate = customLogRate !== '' 
    ? Number(customLogRate) 
    : (rates.roundLogRates[logSpeciesId] || 1200);

  const effectiveFrameRate = customFrameRate !== '' 
    ? Number(customFrameRate) 
    : (rates.woodSpeciesRates[frameSpeciesId] || 2200);

  // Calculations
  const sawnResult = calculateSawnTimberCFT({
    lengthFeet: sawnLengthFeet,
    lengthInches: sawnLengthInches,
    widthInches: sawnWidthInches,
    thicknessInches: sawnThicknessInches,
    quantity: sawnQuantity,
    ratePerCft: effectiveSawnRate,
  });

  const logResult = calculateWoodLogCFT({
    lengthFeet: logLengthFeet,
    lengthInches: logLengthInches,
    girthInches: logGirthInches,
    quantity: logQuantity,
    ratePerCft: effectiveLogRate,
  });

  const frameResult = calculateDoorFrame({
    doorHeightFeet: frameHeightFeet,
    doorHeightInches: frameHeightInches,
    doorWidthFeet: frameWidthFeet,
    sectionWidthInches: frameSectionW,
    sectionThicknessInches: frameSectionT,
    woodRatePerCft: effectiveFrameRate,
    laborRatePerPiece: rates.chowkathLaborRatePerPiece,
    seasoningRatePerCft: rates.seasoningRatePerCft,
    includeSeasoning: includeTreatment,
    quantity: frameQuantity,
    wastagePercent: rates.standardWastePercentage,
  });

  // Wood Species objects for display
  const sawnSpeciesObj = speciesList.find(s => s.id === sawnSpeciesId);
  const logSpeciesObj = speciesList.find(s => s.id === logSpeciesId);
  const frameSpeciesObj = speciesList.find(s => s.id === frameSpeciesId);

  // WhatsApp Quote Text Generator
  const getWhatsAppQuoteText = () => {
    if (activeTab === 'sawn') {
      const speciesName = language === 'bn' ? sawnSpeciesObj?.nameBn : sawnSpeciesObj?.nameEn;
      return language === 'bn'
        ? `*এস এম ডোর — চেরা কাঠ (Sawn Timber) সিএফটি কোটেশন*\n• কাঠ: ${speciesName}\n• সাইজ: ${sawnLengthFeet}'${sawnLengthInches ? ` ${sawnLengthInches}"` : ''} × ${sawnWidthInches}" × ${sawnThicknessInches}"\n• পরিমাণ: ${sawnQuantity} পিস\n• প্রতি পিস CFT: ${sawnResult.singleItemCft}\n• মোট CFT: ${sawnResult.totalCft}\n• রেট: ${formatPrice(effectiveSawnRate)} / CFT\n*মোট আনুমানিক মূল্য: ${formatPrice(sawnResult.totalPrice)}*\n\nআমি এই পরিমাপে অর্ডার/কনফার্ম করতে চাই।`
        : `*SM Door — Sawn Timber CFT Quotation*\n• Timber: ${speciesName}\n• Size: ${sawnLengthFeet}' × ${sawnWidthInches}" × ${sawnThicknessInches}"\n• Qty: ${sawnQuantity} pcs\n• Single CFT: ${sawnResult.singleItemCft}\n• Total CFT: ${sawnResult.totalCft}\n• Rate: ${formatPrice(effectiveSawnRate)} / CFT\n*Total Estimated Price: ${formatPrice(sawnResult.totalPrice)}*\n\nPlease confirm availability and delivery.`;
    } else if (activeTab === 'log') {
      const speciesName = language === 'bn' ? logSpeciesObj?.nameBn : logSpeciesObj?.nameEn;
      return language === 'bn'
        ? `*এস এম ডোর — গোল কাঠ (Wood Log) সিএফটি কোটেশন*\n• কাঠ: ${speciesName}\n• দৈর্ঘ্য: ${logLengthFeet}'${logLengthInches ? ` ${logLengthInches}"` : ''}, বেড়: ${logGirthInches}"\n• পরিমাণ: ${logQuantity} পিস\n• মোট CFT: ${logResult.totalCft} (Hoppus Rule)\n• রেট: ${formatPrice(effectiveLogRate)} / CFT\n*মোট মূল্য: ${formatPrice(logResult.totalPrice)}*`
        : `*SM Door — Round Log CFT Quotation*\n• Timber: ${speciesName}\n• Length: ${logLengthFeet}', Girth: ${logGirthInches}"\n• Qty: ${logQuantity}\n• Total CFT: ${logResult.totalCft}\n• Rate: ${formatPrice(effectiveLogRate)} / CFT\n*Total Price: ${formatPrice(logResult.totalPrice)}*`;
    } else {
      const speciesName = language === 'bn' ? frameSpeciesObj?.nameBn : frameSpeciesObj?.nameEn;
      return language === 'bn'
        ? `*এস এম ডোর — চৌকাঠ (Door Frame) কোটেশন*\n• কাঠ: ${speciesName}\n• দরজার মাপ: ${frameHeightFeet}' × ${frameWidthFeet}'\n• চৌকাঠের ক্রস-সেকশন: ${frameSectionW}" × ${frameSectionT}"\n• পরিমাণ: ${frameQuantity} সেট\n• প্রয়োজনীয় গ্রস কাঠ: ${frameResult.grossCftWithWastage} CFT\n• প্রতিটি চৌকাঠের খরচ: ${formatPrice(frameResult.costPerFrame)}\n*সর্বমোট প্রাক্কলন: ${formatPrice(frameResult.totalCost)}*\n(কাঠ, রাবিট কাটিং মজুরি ও সিজনিং সহ)`
        : `*SM Door — Door Frame (Chowkath) Quotation*\n• Timber: ${speciesName}\n• Opening: ${frameHeightFeet}' × ${frameWidthFeet}'\n• Frame Section: ${frameSectionW}" × ${frameSectionT}"\n• Qty: ${frameQuantity} sets\n• Total Timber: ${frameResult.grossCftWithWastage} CFT\n*Total Estimate: ${formatPrice(frameResult.totalCost)}*`;
    }
  };

  const whatsappLink = buildWhatsAppLink(whatsappNumber, getWhatsAppQuoteText());

  const handleAddToQuote = () => {
    if (activeTab === 'sawn') {
      addItem({
        type: 'calculator',
        titleBn: `চেরা কাঠ (${sawnSpeciesObj?.nameBn || 'কাঠ'})`,
        titleEn: `Sawn Timber (${sawnSpeciesObj?.nameEn || 'Timber'})`,
        subtitleBn: `${sawnResult.dimensionsSummaryBn} = ${sawnResult.totalCft} CFT`,
        subtitleEn: `${sawnResult.dimensionsSummaryEn} = ${sawnResult.totalCft} CFT`,
        price: sawnResult.totalPrice,
        woodSpeciesBn: sawnSpeciesObj?.nameBn,
        woodSpeciesEn: sawnSpeciesObj?.nameEn,
        measurementsBn: sawnResult.dimensionsSummaryBn,
        measurementsEn: sawnResult.dimensionsSummaryEn,
        quantity: sawnQuantity,
        sourceUrl: '/calculator/cft',
      });
    } else if (activeTab === 'log') {
      addItem({
        type: 'calculator',
        titleBn: `গোল কাঠ / গুঁড়ি (${logSpeciesObj?.nameBn || 'কাঠ'})`,
        titleEn: `Round Log (${logSpeciesObj?.nameEn || 'Log'})`,
        subtitleBn: `দৈর্ঘ্য: ${logLengthFeet} ফুট, বেড়: ${logGirthInches} ইঞ্চি = ${logResult.totalCft} CFT`,
        subtitleEn: `Length: ${logLengthFeet} ft, Girth: ${logGirthInches} in = ${logResult.totalCft} CFT`,
        price: logResult.totalPrice,
        woodSpeciesBn: logSpeciesObj?.nameBn,
        woodSpeciesEn: logSpeciesObj?.nameEn,
        quantity: logQuantity,
        sourceUrl: '/calculator/log',
      });
    } else {
      addItem({
        type: 'calculator',
        titleBn: `দরজার চৌকাঠ (${frameSpeciesObj?.nameBn || 'শাল কাঠ'})`,
        titleEn: `Door Frame (${frameSpeciesObj?.nameEn || 'Sal Wood'})`,
        subtitleBn: `উচ্চতা: ${frameHeightFeet} ফুট, চওড়া: ${frameWidthFeet} ফুট (সেকশন: ${frameSectionW}" × ${frameSectionT}")`,
        subtitleEn: `H: ${frameHeightFeet} ft, W: ${frameWidthFeet} ft (Section: ${frameSectionW}" × ${frameSectionT}")`,
        price: frameResult.totalCost,
        woodSpeciesBn: frameSpeciesObj?.nameBn,
        woodSpeciesEn: frameSpeciesObj?.nameEn,
        quantity: frameQuantity,
        sourceUrl: '/calculator/frame',
      });
    }
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <section id="calculator" className="py-16 sm:py-24 bg-white dark:bg-wood-950 relative overflow-hidden">
      {/* Background Subtle Woodgrain Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-wood-700/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-gold-700 dark:text-gold-400 text-xs font-bold uppercase tracking-wider mb-3 border border-gold-500/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.calculator.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-wood-950 dark:text-white tracking-tight mb-4">
            {t.calculator.title}
          </h2>
          <p className="text-sm sm:text-base text-wood-600 dark:text-wood-300">
            {t.calculator.subtitle}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-6 sm:mb-8 w-full">
          <div className="grid grid-cols-3 sm:inline-flex w-full sm:w-auto p-1 sm:p-1.5 bg-wood-100 dark:bg-wood-900 rounded-2xl border border-wood-200 dark:border-wood-800 shadow-inner">
            <button
              onClick={() => setActiveTab('sawn')}
              className={`px-2 sm:px-6 py-2.5 rounded-xl text-[11px] sm:text-sm font-bold text-center transition-all ${
                activeTab === 'sawn'
                  ? 'bg-wood-950 text-gold-400 dark:bg-gold-500 dark:text-wood-950 shadow-md'
                  : 'text-wood-700 dark:text-wood-300 hover:text-wood-950'
              }`}
            >
              {t.calculator.tabSawn}
            </button>
            <button
              onClick={() => setActiveTab('log')}
              className={`px-2 sm:px-6 py-2.5 rounded-xl text-[11px] sm:text-sm font-bold text-center transition-all ${
                activeTab === 'log'
                  ? 'bg-wood-950 text-gold-400 dark:bg-gold-500 dark:text-wood-950 shadow-md'
                  : 'text-wood-700 dark:text-wood-300 hover:text-wood-950'
              }`}
            >
              {t.calculator.tabLog}
            </button>
            <button
              onClick={() => setActiveTab('frame')}
              className={`px-2 sm:px-6 py-2.5 rounded-xl text-[11px] sm:text-sm font-bold text-center transition-all ${
                activeTab === 'frame'
                  ? 'bg-wood-950 text-gold-400 dark:bg-gold-500 dark:text-wood-950 shadow-md'
                  : 'text-wood-700 dark:text-wood-300 hover:text-wood-950'
              }`}
            >
              {t.calculator.tabFrame}
            </button>
          </div>
        </div>

        {/* Calculator Main Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-7 bg-wood-50/70 dark:bg-wood-900/60 rounded-3xl p-6 sm:p-8 border border-wood-200 dark:border-wood-800 shadow-sm">
            {/* TAB 1: Sawn Timber */}
            {activeTab === 'sawn' && (
              <div className="space-y-6">
                {/* Wood Species Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-wood-800 dark:text-wood-200 mb-2">
                    {t.calculator.selectWoodSpecies}
                  </label>
                  <select
                    value={sawnSpeciesId}
                    onChange={(e) => {
                      setSawnSpeciesId(e.target.value);
                      setCustomSawnRate('');
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-medium text-wood-900 dark:text-white cursor-pointer shadow-sm"
                  >
                    {speciesList.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {language === 'bn' ? sp.nameBn : sp.nameEn} — {formatPrice(rates.woodSpeciesRates[sp.id] || sp.currentRatePerCft)} / CFT
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dimensions Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Length Feet */}
                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      {t.calculator.lengthFeet}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={sawnLengthFeet}
                      onChange={(e) => setSawnLengthFeet(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>

                  {/* Length Inches */}
                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      {t.calculator.lengthInches}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={sawnLengthInches}
                      onChange={(e) => setSawnLengthInches(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>

                  {/* Width Inches */}
                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      {t.calculator.widthInches}
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      min="1"
                      value={sawnWidthInches}
                      onChange={(e) => setSawnWidthInches(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>

                  {/* Thickness Inches */}
                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      {t.calculator.thicknessInches}
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      min="0.5"
                      value={sawnThicknessInches}
                      onChange={(e) => setSawnThicknessInches(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Quantity and Custom Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      {t.calculator.quantity}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={sawnQuantity}
                      onChange={(e) => setSawnQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      {t.calculator.ratePerCft}
                    </label>
                    <input
                      type="number"
                      value={customSawnRate !== '' ? customSawnRate : effectiveSawnRate}
                      onChange={(e) => setCustomSawnRate(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-wood-500 dark:text-wood-400 bg-wood-100/60 dark:bg-wood-950/40 p-3 rounded-xl border border-wood-200/60 dark:border-wood-800">
                  <span>📐 <strong>{language === 'bn' ? 'চেরা কাঠের ফর্মুলা:' : 'Formula:'}</strong> (দৈর্ঘ্য ফুট × প্রস্থ ইঞ্চি × পুরুত্ব ইঞ্চি) ÷ ১৪৪ = সিএফটি (CFT)</span>
                </div>
              </div>
            )}

            {/* TAB 2: Round Wood Log */}
            {activeTab === 'log' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-wood-800 dark:text-wood-200 mb-2">
                    {t.calculator.selectWoodSpecies}
                  </label>
                  <select
                    value={logSpeciesId}
                    onChange={(e) => {
                      setLogSpeciesId(e.target.value);
                      setCustomLogRate('');
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-medium text-wood-900 dark:text-white cursor-pointer shadow-sm"
                  >
                    {speciesList.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {language === 'bn' ? sp.nameBn : sp.nameEn} — {formatPrice(rates.roundLogRates[sp.id] || sp.roundLogRatePerCft)} / CFT (Log)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      {t.calculator.lengthFeet}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      value={logLengthFeet}
                      onChange={(e) => setLogLengthFeet(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      {t.calculator.girthInches} (ফিতা মাপ)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="5"
                      value={logGirthInches}
                      onChange={(e) => setLogGirthInches(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      {t.calculator.quantity}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={logQuantity}
                      onChange={(e) => setLogQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                    {t.calculator.ratePerCft} (গোল কাঠ)
                  </label>
                  <input
                    type="number"
                    value={customLogRate !== '' ? customLogRate : effectiveLogRate}
                    onChange={(e) => setCustomLogRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                  />
                </div>

                <div className="text-[11px] text-wood-500 dark:text-wood-400 bg-wood-100/60 dark:bg-wood-950/40 p-3 rounded-xl border border-wood-200/60 dark:border-wood-800">
                  <span>📐 <strong>{language === 'bn' ? 'গোল কাঠের হোপের নিয়ম:' : 'Hoppus Rule:'}</strong> (বেড় ÷ ৪)² × দৈর্ঘ্য ফুট ÷ ১৪৪ = সিএফটি (CFT)</span>
                </div>
              </div>
            )}

            {/* TAB 3: Door Frame Estimator */}
            {activeTab === 'frame' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-wood-800 dark:text-wood-200 mb-2">
                    {t.calculator.selectWoodSpecies}
                  </label>
                  <select
                    value={frameSpeciesId}
                    onChange={(e) => {
                      setFrameSpeciesId(e.target.value);
                      setCustomFrameRate('');
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-medium text-wood-900 dark:text-white cursor-pointer shadow-sm"
                  >
                    {speciesList.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {language === 'bn' ? sp.nameBn : sp.nameEn} — {formatPrice(rates.woodSpeciesRates[sp.id] || sp.currentRatePerCft)} / CFT
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      {t.calculator.frameOpeningHeight}
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      value={frameHeightFeet}
                      onChange={(e) => setFrameHeightFeet(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      {t.calculator.frameOpeningWidth}
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      value={frameWidthFeet}
                      onChange={(e) => setFrameWidthFeet(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      {t.calculator.sectionWidth}
                    </label>
                    <select
                      value={frameSectionW}
                      onChange={(e) => setFrameSectionW(parseFloat(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white cursor-pointer"
                    >
                      <option value={4}>4 inch</option>
                      <option value={5}>5 inch (Standard)</option>
                      <option value={6}>6 inch (Heavy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      {t.calculator.sectionThickness}
                    </label>
                    <select
                      value={frameSectionT}
                      onChange={(e) => setFrameSectionT(parseFloat(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white cursor-pointer"
                    >
                      <option value={2.25}>2.25 inch</option>
                      <option value={2.5}>2.5 inch (Standard)</option>
                      <option value={3}>3.0 inch</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-semibold text-wood-700 dark:text-wood-300 mb-1">
                      {t.calculator.frameQuantity}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={frameQuantity}
                      onChange={(e) => setFrameQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2.5 rounded-xl border border-wood-200 dark:border-wood-750 bg-white dark:bg-wood-950 text-sm font-bold text-wood-900 dark:text-white"
                    />
                  </div>

                  <div className="pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeTreatment}
                        onChange={(e) => setIncludeTreatment(e.target.checked)}
                        className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500 border-wood-300"
                      />
                      <span className="text-xs font-semibold text-wood-800 dark:text-wood-200">
                        {t.calculator.includeTreatment}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-wood-950 to-wood-900 text-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-wood-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-wood-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {t.calculator.resultHeading}
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-gold-400/90 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                  {language === 'bn' ? 'সরাসরি প্রাক্কলন' : 'Live Estimate'}
                </span>
              </div>

              {/* Sawn Summary */}
              {activeTab === 'sawn' && (
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm text-wood-200">
                    <span>{t.calculator.cftPerPiece}</span>
                    <strong className="text-white text-base font-mono">{formatNum(sawnResult.singleItemCft, 3)} CFT</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm text-wood-200">
                    <span>{t.calculator.totalCft}</span>
                    <strong className="text-gold-400 text-lg font-mono">{formatNum(sawnResult.totalCft, 3)} CFT</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm text-wood-200">
                    <span>{t.calculator.ratePerCft}</span>
                    <span className="text-white font-mono">{formatPrice(effectiveSawnRate)}</span>
                  </div>

                  <div className="pt-4 border-t border-wood-800/80">
                    <span className="text-xs text-wood-300 block mb-1">{t.calculator.totalCost}</span>
                    <span className="text-3xl sm:text-4xl font-black text-gold-400">
                      {formatPrice(sawnResult.totalPrice)}
                    </span>
                  </div>
                </div>
              )}

              {/* Log Summary */}
              {activeTab === 'log' && (
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm text-wood-200">
                    <span>{t.calculator.cftPerPiece}</span>
                    <strong className="text-white text-base font-mono">{formatNum(logResult.singleItemCft, 3)} CFT</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm text-wood-200">
                    <span>{t.calculator.totalCft}</span>
                    <strong className="text-gold-400 text-lg font-mono">{formatNum(logResult.totalCft, 3)} CFT</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm text-wood-200">
                    <span>{t.calculator.ratePerCft}</span>
                    <span className="text-white font-mono">{formatPrice(effectiveLogRate)}</span>
                  </div>

                  <div className="pt-4 border-t border-wood-800/80">
                    <span className="text-xs text-wood-300 block mb-1">{t.calculator.totalCost}</span>
                    <span className="text-3xl sm:text-4xl font-black text-gold-400">
                      {formatPrice(logResult.totalPrice)}
                    </span>
                  </div>
                </div>
              )}

              {/* Frame Summary */}
              {activeTab === 'frame' && (
                <div className="space-y-3 mb-8 text-xs sm:text-sm">
                  <div className="flex justify-between items-center text-wood-200">
                    <span>{t.calculator.frameTotalLinearFeet}</span>
                    <strong className="text-white font-mono">{formatNum(frameResult.totalLinearFeet, 1)} ft</strong>
                  </div>
                  <div className="flex justify-between items-center text-wood-200">
                    <span>মোট কাঠ প্রয়োজন (১২% ঘাটতি সহ):</span>
                    <strong className="text-gold-400 font-mono">{formatNum(frameResult.grossCftWithWastage, 3)} CFT</strong>
                  </div>
                  <div className="flex justify-between items-center text-wood-300 text-xs">
                    <span>{t.calculator.timberCost}</span>
                    <span>{formatPrice(frameResult.timberCost)}</span>
                  </div>
                  <div className="flex justify-between items-center text-wood-300 text-xs">
                    <span>{t.calculator.laborCost}</span>
                    <span>{formatPrice(frameResult.laborCost)}</span>
                  </div>
                  {includeTreatment && (
                    <div className="flex justify-between items-center text-wood-300 text-xs">
                      <span>{t.calculator.treatmentCost}</span>
                      <span>{formatPrice(frameResult.seasoningCost)}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-wood-800/80">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-wood-300">{t.calculator.frameCostPerPiece}</span>
                      <span className="text-base font-bold text-white">{formatPrice(frameResult.costPerFrame)}</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-gold-400">
                      {formatPrice(frameResult.totalCost)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Add to Quote and WhatsApp */}
            <div className="space-y-2.5">
              {addedNotice && (
                <div className="p-2.5 rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs flex items-center justify-between animate-fade-in">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Check className="w-3.5 h-3.5 text-gold-400" />
                    {language === 'bn' ? 'কোটেশন লিস্টে যোগ করা হয়েছে!' : 'Added to quote list!'}
                  </span>
                  <a href="/quote" className="underline font-bold text-gold-400">
                    {language === 'bn' ? 'লিস্ট দেখুন →' : 'View →'}
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddToQuote}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-gold-300 bg-wood-900 hover:bg-wood-850 border border-gold-500/40 shadow flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <ClipboardList className="w-4 h-4 text-gold-400" />
                <span>{language === 'bn' ? 'এই হিসাবটি কোটেশন তালিকায় রাখুন' : 'Save Estimate to Quote List'}</span>
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t.calculator.sendWhatsAppQuote}</span>
              </a>
              <p className="text-[11px] text-wood-400 text-center">
                {t.calculator.liveRateNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
