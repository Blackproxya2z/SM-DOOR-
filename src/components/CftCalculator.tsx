'use client';

import React, { useState, useEffect } from 'react';
import { useStringNumberInput } from '@/hooks/useStringNumberInput';
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

  // Sawn Timber State using useStringNumberInput hook
  const sawnLengthFeetInput = useStringNumberInput("7", { placeholder: "7" });
  const sawnLengthInchesInput = useStringNumberInput("0", { placeholder: "0", max: 11 });
  const sawnWidthInchesInput = useStringNumberInput("10", { placeholder: "10" });
  const sawnThicknessInchesInput = useStringNumberInput("1.5", { placeholder: "1.5" });
  const sawnQuantityInput = useStringNumberInput("1", { allowDecimal: false, placeholder: "1", min: 1 });
  const [sawnSpeciesId, setSawnSpeciesId] = useState<string>(initialSpecies[0]?.id || 'ctg-teak');
  const customSawnRateInput = useStringNumberInput("", { placeholder: "Default" });

  // Round Log State using useStringNumberInput hook
  const logLengthFeetInput = useStringNumberInput("10", { placeholder: "10" });
  const logLengthInchesInput = useStringNumberInput("0", { placeholder: "0", max: 11 });
  const logGirthInchesInput = useStringNumberInput("36", { placeholder: "36" });
  const logQuantityInput = useStringNumberInput("1", { allowDecimal: false, placeholder: "1", min: 1 });
  const [logSpeciesId, setLogSpeciesId] = useState<string>(initialSpecies[0]?.id || 'ctg-teak');
  const customLogRateInput = useStringNumberInput("", { placeholder: "Default" });

  // Door Frame (চৌকাঠ) State using useStringNumberInput hook
  const frameHeightFeetInput = useStringNumberInput("7", { placeholder: "7" });
  const frameHeightInchesInput = useStringNumberInput("0", { placeholder: "0", max: 11 });
  const frameWidthFeetInput = useStringNumberInput("3.25", { placeholder: "3.25" });
  const [frameSectionW, setFrameSectionW] = useState<number>(5); // 5 inches
  const [frameSectionT, setFrameSectionT] = useState<number>(2.5); // 2.5 inches
  const frameQuantityInput = useStringNumberInput("1", { allowDecimal: false, placeholder: "1", min: 1 });
  const [frameSpeciesId, setFrameSpeciesId] = useState<string>('sal-wood');
  const [includeTreatment, setIncludeTreatment] = useState<boolean>(true);
  const customFrameRateInput = useStringNumberInput("", { placeholder: "Default" });

  // Effective Rates
  const effectiveSawnRate = customSawnRateInput.value.trim() !== '' 
    ? customSawnRateInput.numericValue 
    : (rates.woodSpeciesRates[sawnSpeciesId] || 1650);

  const effectiveLogRate = customLogRateInput.value.trim() !== '' 
    ? customLogRateInput.numericValue 
    : (rates.roundLogRates[logSpeciesId] || 1200);

  const effectiveFrameRate = customFrameRateInput.value.trim() !== '' 
    ? customFrameRateInput.numericValue 
    : (rates.woodSpeciesRates[frameSpeciesId] || 2200);

  // Calculations
  const sawnResult = calculateSawnTimberCFT({
    lengthFeet: sawnLengthFeetInput.numericValue,
    lengthInches: sawnLengthInchesInput.numericValue,
    widthInches: sawnWidthInchesInput.numericValue,
    thicknessInches: sawnThicknessInchesInput.numericValue,
    quantity: sawnQuantityInput.numericValue || 1,
    ratePerCft: effectiveSawnRate,
  });

  const logResult = calculateWoodLogCFT({
    lengthFeet: logLengthFeetInput.numericValue,
    lengthInches: logLengthInchesInput.numericValue,
    girthInches: logGirthInchesInput.numericValue,
    quantity: logQuantityInput.numericValue || 1,
    ratePerCft: effectiveLogRate,
  });

  const frameResult = calculateDoorFrame({
    doorHeightFeet: frameHeightFeetInput.numericValue,
    doorHeightInches: frameHeightInchesInput.numericValue,
    doorWidthFeet: frameWidthFeetInput.numericValue,
    sectionWidthInches: frameSectionW,
    sectionThicknessInches: frameSectionT,
    woodRatePerCft: effectiveFrameRate,
    laborRatePerPiece: rates.chowkathLaborRatePerPiece,
    seasoningRatePerCft: rates.seasoningRatePerCft,
    includeSeasoning: includeTreatment,
    quantity: frameQuantityInput.numericValue || 1,
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
      const lenFt = sawnLengthFeetInput.value || '0';
      const lenIn = sawnLengthInchesInput.value;
      const wIn = sawnWidthInchesInput.value || '0';
      const tIn = sawnThicknessInchesInput.value || '0';
      const qty = sawnQuantityInput.value || '1';

      return language === 'bn'
        ? `*এস এম ডোর — চেরা কাঠ (Sawn Timber) সিএফটি কোটেশন*\n• কাঠ: ${speciesName}\n• সাইজ: ${lenFt}'${lenIn ? ` ${lenIn}"` : ''} × ${wIn}" × ${tIn}"\n• পরিমাণ: ${qty} পিস\n• প্রতি পিস CFT: ${sawnResult.singleItemCft}\n• মোট CFT: ${sawnResult.totalCft}\n• রেট: ${formatPrice(effectiveSawnRate)} / CFT\n*মোট আনুমানিক মূল্য: ${formatPrice(sawnResult.totalPrice)}*\n\nআমি এই পরিমাপে অর্ডার/কনফার্ম করতে চাই।`
        : `*SM Door — Sawn Timber CFT Quotation*\n• Timber: ${speciesName}\n• Size: ${lenFt}' × ${wIn}" × ${tIn}"\n• Qty: ${qty} pcs\n• Single CFT: ${sawnResult.singleItemCft}\n• Total CFT: ${sawnResult.totalCft}\n• Rate: ${formatPrice(effectiveSawnRate)} / CFT\n*Total Estimated Price: ${formatPrice(sawnResult.totalPrice)}*\n\nPlease confirm availability and delivery.`;
    } else if (activeTab === 'log') {
      const speciesName = language === 'bn' ? logSpeciesObj?.nameBn : logSpeciesObj?.nameEn;
      const lenFt = logLengthFeetInput.value || '0';
      const lenIn = logLengthInchesInput.value;
      const girthIn = logGirthInchesInput.value || '0';
      const qty = logQuantityInput.value || '1';

      return language === 'bn'
        ? `*এস এম ডোর — গোল কাঠ (Wood Log) সিএফটি কোটেশন*\n• কাঠ: ${speciesName}\n• দৈর্ঘ্য: ${lenFt}'${lenIn ? ` ${lenIn}"` : ''}, বেড়: ${girthIn}"\n• পরিমাণ: ${qty} পিস\n• মোট CFT: ${logResult.totalCft} (Hoppus Rule)\n• রেট: ${formatPrice(effectiveLogRate)} / CFT\n*মোট মূল্য: ${formatPrice(logResult.totalPrice)}*`
        : `*SM Door — Round Log CFT Quotation*\n• Timber: ${speciesName}\n• Length: ${lenFt}', Girth: ${girthIn}"\n• Qty: ${qty}\n• Total CFT: ${logResult.totalCft}\n• Rate: ${formatPrice(effectiveLogRate)} / CFT\n*Total Price: ${formatPrice(logResult.totalPrice)}*`;
    } else {
      const speciesName = language === 'bn' ? frameSpeciesObj?.nameBn : frameSpeciesObj?.nameEn;
      const hFt = frameHeightFeetInput.value || '0';
      const wFt = frameWidthFeetInput.value || '0';
      const qty = frameQuantityInput.value || '1';

      return language === 'bn'
        ? `*এস এম ডোর — চৌকাঠ (Door Frame) কোটেশন*\n• কাঠ: ${speciesName}\n• দরজার মাপ: ${hFt}' × ${wFt}'\n• চৌকাঠের ক্রস-সেকশন: ${frameSectionW}" × ${frameSectionT}"\n• পরিমাণ: ${qty} সেট\n• প্রয়োজনীয় গ্রস কাঠ: ${frameResult.grossCftWithWastage} CFT\n• প্রতিটি চৌকাঠের খরচ: ${formatPrice(frameResult.costPerFrame)}\n*সর্বমোট প্রাক্কলন: ${formatPrice(frameResult.totalCost)}*\n(কাঠ, রাবিট কাটিং মজুরি ও সিজনিং সহ)`
        : `*SM Door — Door Frame (Chowkath) Quotation*\n• Timber: ${speciesName}\n• Opening: ${hFt}' × ${wFt}'\n• Frame Section: ${frameSectionW}" × ${frameSectionT}"\n• Qty: ${qty} sets\n• Total Timber: ${frameResult.grossCftWithWastage} CFT\n*Total Estimate: ${formatPrice(frameResult.totalCost)}*`;
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
        quantity: sawnQuantityInput.numericValue || 1,
        sourceUrl: '/calculator/cft',
      });
    } else if (activeTab === 'log') {
      const lenFt = logLengthFeetInput.value || '0';
      const girthIn = logGirthInchesInput.value || '0';
      addItem({
        type: 'calculator',
        titleBn: `গোল কাঠ / গুঁড়ি (${logSpeciesObj?.nameBn || 'কাঠ'})`,
        titleEn: `Round Log (${logSpeciesObj?.nameEn || 'Log'})`,
        subtitleBn: `দৈর্ঘ্য: ${lenFt} ফুট, বেড়: ${girthIn} ইঞ্চি = ${logResult.totalCft} CFT`,
        subtitleEn: `Length: ${lenFt} ft, Girth: ${girthIn} in = ${logResult.totalCft} CFT`,
        price: logResult.totalPrice,
        woodSpeciesBn: logSpeciesObj?.nameBn,
        woodSpeciesEn: logSpeciesObj?.nameEn,
        quantity: logQuantityInput.numericValue || 1,
        sourceUrl: '/calculator/log',
      });
    } else {
      const hFt = frameHeightFeetInput.value || '0';
      const wFt = frameWidthFeetInput.value || '0';
      addItem({
        type: 'calculator',
        titleBn: `দরজার চৌকাঠ (${frameSpeciesObj?.nameBn || 'শাল কাঠ'})`,
        titleEn: `Door Frame (${frameSpeciesObj?.nameEn || 'Sal Wood'})`,
        subtitleBn: `উচ্চতা: ${hFt} ফুট, চওড়া: ${wFt} ফুট (সেকশন: ${frameSectionW}" × ${frameSectionT}")`,
        subtitleEn: `H: ${hFt} ft, W: ${wFt} ft (Section: ${frameSectionW}" × ${frameSectionT}")`,
        price: frameResult.totalCost,
        woodSpeciesBn: frameSpeciesObj?.nameBn,
        woodSpeciesEn: frameSpeciesObj?.nameEn,
        quantity: frameQuantityInput.numericValue || 1,
        sourceUrl: '/calculator/frame',
      });
    }
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <section id="calculator" className="py-16 sm:py-24 bg-[#FAF8F5] relative overflow-hidden">
      {/* Background Subtle Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C59B27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2B1A12]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C59B27]/10 text-[#C59B27] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C59B27]/25 font-[family-name:var(--font-hind-siliguri)]">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.calculator.badge}</span>
          </div>
          <h2 className="font-[family-name:var(--font-tiro-bangla)] text-3xl sm:text-5xl font-bold text-[#2B1A12] tracking-tight mb-4">
            {t.calculator.title}
          </h2>
          <p className="font-[family-name:var(--font-hind-siliguri)] text-base sm:text-lg text-[#7A6A5F] leading-relaxed">
            {t.calculator.subtitle}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-6 sm:mb-8 w-full">
          <div className="grid grid-cols-3 sm:inline-flex w-full sm:w-auto p-1.5 bg-white rounded-2xl border border-[#E8DED4] shadow-sm">
            <button
              onClick={() => setActiveTab('sawn')}
              className={`px-3 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-center transition-all font-[family-name:var(--font-hind-siliguri)] ${
                activeTab === 'sawn'
                  ? 'bg-[#2B1A12] text-white shadow-md'
                  : 'text-[#7A6A5F] hover:text-[#2B1A12]'
              }`}
            >
              {t.calculator.tabSawn}
            </button>
            <button
              onClick={() => setActiveTab('log')}
              className={`px-3 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-center transition-all font-[family-name:var(--font-hind-siliguri)] ${
                activeTab === 'log'
                  ? 'bg-[#2B1A12] text-white shadow-md'
                  : 'text-[#7A6A5F] hover:text-[#2B1A12]'
              }`}
            >
              {t.calculator.tabLog}
            </button>
            <button
              onClick={() => setActiveTab('frame')}
              className={`px-3 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-center transition-all font-[family-name:var(--font-hind-siliguri)] ${
                activeTab === 'frame'
                  ? 'bg-[#2B1A12] text-white shadow-md'
                  : 'text-[#7A6A5F] hover:text-[#2B1A12]'
              }`}
            >
              {t.calculator.tabFrame}
            </button>
          </div>
        </div>

        {/* Calculator Main Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED4] shadow-md">
            {/* TAB 1: Sawn Timber */}
            {activeTab === 'sawn' && (
              <div className="space-y-6">
                {/* Wood Species Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2B1A12] mb-2 font-[family-name:var(--font-hind-siliguri)]">
                    {t.calculator.selectWoodSpecies}
                  </label>
                  <select
                    value={sawnSpeciesId}
                    onChange={(e) => {
                      setSawnSpeciesId(e.target.value);
                      customSawnRateInput.setValue('');
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-medium text-[#2B1A12] cursor-pointer shadow-sm outline-none transition-colors"
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
                    <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                      {t.calculator.lengthFeet}
                    </label>
                    <input
                      {...sawnLengthFeetInput.inputProps}
                      placeholder="7"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>

                  {/* Length Inches */}
                  <div>
                    <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                      {t.calculator.lengthInches}
                    </label>
                    <input
                      {...sawnLengthInchesInput.inputProps}
                      placeholder="0"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>

                  {/* Width Inches */}
                  <div>
                    <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                      {t.calculator.widthInches}
                    </label>
                    <input
                      {...sawnWidthInchesInput.inputProps}
                      placeholder="10"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>

                  {/* Thickness Inches */}
                  <div>
                    <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                      {t.calculator.thicknessInches}
                    </label>
                    <input
                      {...sawnThicknessInchesInput.inputProps}
                      placeholder="1.5"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Quantity and Custom Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                      {t.calculator.quantity}
                    </label>
                    <input
                      {...sawnQuantityInput.inputProps}
                      placeholder="1"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                      {t.calculator.ratePerCft}
                    </label>
                    <input
                      {...customSawnRateInput.inputProps}
                      placeholder={String(effectiveSawnRate)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="text-xs text-[#7A6A5F] bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8DED4] font-[family-name:var(--font-hind-siliguri)]">
                  <span>📐 <strong>{language === 'bn' ? 'চেরা কাঠের ফর্মুলা:' : 'Formula:'}</strong> (দৈর্ঘ্য ফুট × প্রস্থ ইঞ্চি × পুরুত্ব ইঞ্চি) ÷ ১৪৪ = সিএফটি (CFT)</span>
                </div>
              </div>
            )}

            {/* TAB 2: Round Wood Log */}
            {activeTab === 'log' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2B1A12] mb-2 font-[family-name:var(--font-hind-siliguri)]">
                    {t.calculator.selectWoodSpecies}
                  </label>
                  <select
                    value={logSpeciesId}
                    onChange={(e) => {
                      setLogSpeciesId(e.target.value);
                      customLogRateInput.setValue('');
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-medium text-[#2B1A12] cursor-pointer shadow-sm outline-none transition-colors"
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
                    <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                      {t.calculator.lengthFeet}
                    </label>
                    <input
                      {...logLengthFeetInput.inputProps}
                      placeholder="10"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                      {t.calculator.girthInches} (ফিতা মাপ)
                    </label>
                    <input
                      {...logGirthInchesInput.inputProps}
                      placeholder="36"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                      {t.calculator.quantity}
                    </label>
                    <input
                      {...logQuantityInput.inputProps}
                      placeholder="1"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                    {t.calculator.ratePerCft} (গোল কাঠ)
                  </label>
                  <input
                    {...customLogRateInput.inputProps}
                    placeholder={String(effectiveLogRate)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                  />
                </div>

                <div className="text-xs text-[#7A6A5F] bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8DED4] font-[family-name:var(--font-hind-siliguri)]">
                  <span>📐 <strong>{language === 'bn' ? 'গোল কাঠের হোপের নিয়ম:' : 'Hoppus Rule:'}</strong> (বেড় ÷ ৪)² × দৈর্ঘ্য ফুট ÷ ১৪৪ = সিএফটি (CFT)</span>
                </div>
              </div>
            )}

            {/* TAB 3: Door Frame Estimator */}
            {activeTab === 'frame' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2B1A12] mb-2 font-[family-name:var(--font-hind-siliguri)]">
                    {t.calculator.selectWoodSpecies}
                  </label>
                  <select
                    value={frameSpeciesId}
                    onChange={(e) => {
                      setFrameSpeciesId(e.target.value);
                      customFrameRateInput.setValue('');
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-medium text-[#2B1A12] cursor-pointer shadow-sm outline-none transition-colors"
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
                    <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                      {t.calculator.frameOpeningHeight}
                    </label>
                    <input
                      {...frameHeightFeetInput.inputProps}
                      placeholder="7"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                      {t.calculator.frameOpeningWidth}
                    </label>
                    <input
                      {...frameWidthFeetInput.inputProps}
                      placeholder="3.25"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                      {t.calculator.sectionWidth}
                    </label>
                    <select
                      value={frameSectionW}
                      onChange={(e) => setFrameSectionW(parseFloat(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] cursor-pointer outline-none transition-colors"
                    >
                      <option value={4}>4 inch</option>
                      <option value={5}>5 inch (Standard)</option>
                      <option value={6}>6 inch (Heavy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                      {t.calculator.sectionThickness}
                    </label>
                    <select
                      value={frameSectionT}
                      onChange={(e) => setFrameSectionT(parseFloat(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] cursor-pointer outline-none transition-colors"
                    >
                      <option value={2.25}>2.25 inch</option>
                      <option value={2.5}>2.5 inch (Standard)</option>
                      <option value={3}>3.0 inch</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-semibold text-[#7A6A5F] mb-1 font-[family-name:var(--font-hind-siliguri)]">
                      {t.calculator.frameQuantity}
                    </label>
                    <input
                      {...frameQuantityInput.inputProps}
                      placeholder="1"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8DED4] bg-[#FAF8F5] focus:bg-white focus:border-[#C59B27] text-sm font-bold text-[#2B1A12] outline-none transition-colors"
                    />
                  </div>

                  <div className="pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeTreatment}
                        onChange={(e) => setIncludeTreatment(e.target.checked)}
                        className="w-4 h-4 rounded text-[#C59B27] focus:ring-[#C59B27] border-[#E8DED4]"
                      />
                      <span className="text-xs font-semibold text-[#2B1A12] font-[family-name:var(--font-hind-siliguri)]">
                        {t.calculator.includeTreatment}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 bg-white text-[#2B1A12] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E8DED4] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8DED4]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C59B27]" />
                  <h3 className="font-[family-name:var(--font-tiro-bangla)] text-lg font-bold text-[#2B1A12] tracking-wide">
                    {t.calculator.resultHeading}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[#C59B27] bg-[#C59B27]/10 px-2.5 py-1 rounded-full border border-[#C59B27]/30 font-[family-name:var(--font-hind-siliguri)]">
                  {language === 'bn' ? 'সরাসরি প্রাক্কলন' : 'Live Estimate'}
                </span>
              </div>

              {/* Sawn Summary */}
              {activeTab === 'sawn' && (
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm text-[#7A6A5F]">
                    <span className="font-[family-name:var(--font-hind-siliguri)]">{t.calculator.cftPerPiece}</span>
                    <strong className="text-[#2B1A12] text-base font-mono">{formatNum(sawnResult.singleItemCft, 3)} CFT</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm text-[#7A6A5F]">
                    <span className="font-[family-name:var(--font-hind-siliguri)]">{t.calculator.totalCft}</span>
                    <strong className="text-[#C59B27] text-lg font-mono font-bold">{formatNum(sawnResult.totalCft, 3)} CFT</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm text-[#7A6A5F]">
                    <span className="font-[family-name:var(--font-hind-siliguri)]">{t.calculator.ratePerCft}</span>
                    <span className="text-[#2B1A12] font-mono">{formatPrice(effectiveSawnRate)}</span>
                  </div>

                  <div className="pt-4 border-t border-[#E8DED4]">
                    <span className="text-xs text-[#7A6A5F] block mb-1 font-[family-name:var(--font-hind-siliguri)]">{t.calculator.totalCost}</span>
                    <span className="text-3xl sm:text-4xl font-black text-[#C59B27]">
                      {formatPrice(sawnResult.totalPrice)}
                    </span>
                  </div>
                </div>
              )}

              {/* Log Summary */}
              {activeTab === 'log' && (
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm text-[#7A6A5F]">
                    <span className="font-[family-name:var(--font-hind-siliguri)]">{t.calculator.cftPerPiece}</span>
                    <strong className="text-[#2B1A12] text-base font-mono">{formatNum(logResult.singleItemCft, 3)} CFT</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm text-[#7A6A5F]">
                    <span className="font-[family-name:var(--font-hind-siliguri)]">{t.calculator.totalCft}</span>
                    <strong className="text-[#C59B27] text-lg font-mono font-bold">{formatNum(logResult.totalCft, 3)} CFT</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm text-[#7A6A5F]">
                    <span className="font-[family-name:var(--font-hind-siliguri)]">{t.calculator.ratePerCft}</span>
                    <span className="text-[#2B1A12] font-mono">{formatPrice(effectiveLogRate)}</span>
                  </div>

                  <div className="pt-4 border-t border-[#E8DED4]">
                    <span className="text-xs text-[#7A6A5F] block mb-1 font-[family-name:var(--font-hind-siliguri)]">{t.calculator.totalCost}</span>
                    <span className="text-3xl sm:text-4xl font-black text-[#C59B27]">
                      {formatPrice(logResult.totalPrice)}
                    </span>
                  </div>
                </div>
              )}

              {/* Frame Summary */}
              {activeTab === 'frame' && (
                <div className="space-y-3 mb-8 text-xs sm:text-sm">
                  <div className="flex justify-between items-center text-[#7A6A5F]">
                    <span className="font-[family-name:var(--font-hind-siliguri)]">{t.calculator.frameTotalLinearFeet}</span>
                    <strong className="text-[#2B1A12] font-mono">{formatNum(frameResult.totalLinearFeet, 1)} ft</strong>
                  </div>
                  <div className="flex justify-between items-center text-[#7A6A5F]">
                    <span className="font-[family-name:var(--font-hind-siliguri)]">মোট কাঠ প্রয়োজন (১২% ঘাটতি সহ):</span>
                    <strong className="text-[#C59B27] font-mono font-bold">{formatNum(frameResult.grossCftWithWastage, 3)} CFT</strong>
                  </div>
                  <div className="flex justify-between items-center text-[#7A6A5F] text-xs">
                    <span className="font-[family-name:var(--font-hind-siliguri)]">{t.calculator.timberCost}</span>
                    <span>{formatPrice(frameResult.timberCost)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#7A6A5F] text-xs">
                    <span className="font-[family-name:var(--font-hind-siliguri)]">{t.calculator.laborCost}</span>
                    <span>{formatPrice(frameResult.laborCost)}</span>
                  </div>
                  {includeTreatment && (
                    <div className="flex justify-between items-center text-[#7A6A5F] text-xs">
                      <span className="font-[family-name:var(--font-hind-siliguri)]">{t.calculator.treatmentCost}</span>
                      <span>{formatPrice(frameResult.seasoningCost)}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#E8DED4]">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-[#7A6A5F] font-[family-name:var(--font-hind-siliguri)]">{t.calculator.frameCostPerPiece}</span>
                      <span className="text-base font-bold text-[#2B1A12]">{formatPrice(frameResult.costPerFrame)}</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-[#C59B27]">
                      {formatPrice(frameResult.totalCost)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Add to Quote and WhatsApp */}
            <div className="space-y-3">
              {addedNotice && (
                <div className="p-3 rounded-xl bg-[#C59B27]/15 border border-[#C59B27]/30 text-[#2B1A12] text-xs flex items-center justify-between animate-fade-in">
                  <span className="flex items-center gap-1.5 font-semibold font-[family-name:var(--font-hind-siliguri)]">
                    <Check className="w-4 h-4 text-[#C59B27]" />
                    {language === 'bn' ? 'কোটেশন লিস্টে যোগ করা হয়েছে!' : 'Added to quote list!'}
                  </span>
                  <a href="/quote" className="underline font-bold text-[#C59B27] font-[family-name:var(--font-hind-siliguri)]">
                    {language === 'bn' ? 'লিস্ট দেখুন →' : 'View →'}
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddToQuote}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-[#2B1A12] bg-[#FAF8F5] hover:bg-[#F4ECE1] border border-[#E8DED4] shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <ClipboardList className="w-4 h-4 text-[#C59B27]" />
                <span className="font-[family-name:var(--font-hind-siliguri)]">{language === 'bn' ? 'এই হিসাবটি কোটেশন তালিকায় রাখুন' : 'Save Estimate to Quote List'}</span>
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#10B981] hover:bg-[#059669] shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-[family-name:var(--font-hind-siliguri)]">{t.calculator.sendWhatsAppQuote}</span>
              </a>
              <p className="text-[11px] text-[#7A6A5F] text-center font-[family-name:var(--font-hind-siliguri)]">
                {t.calculator.liveRateNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
