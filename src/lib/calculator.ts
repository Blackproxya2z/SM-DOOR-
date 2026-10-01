import { Language } from '../types';

export const BANGLA_NUMERALS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
  '.': '.',
  ',': ',',
};

export function toBanglaDigits(num: number | string): string {
  const str = String(num);
  return str
    .split('')
    .map((char) => BANGLA_NUMERALS[char] || char)
    .join('');
}

export function formatBDT(amount: number, lang: Language = 'bn'): string {
  const rounded = Math.round(amount);
  const formattedEn = new Intl.NumberFormat('en-IN').format(rounded);
  if (lang === 'bn') {
    return `৳ ${toBanglaDigits(formattedEn)}`;
  }
  return `৳ ${formattedEn}`;
}

export function formatNumber(val: number, lang: Language = 'bn', decimals = 2): string {
  const formatted = val.toFixed(decimals);
  if (lang === 'bn') {
    return toBanglaDigits(formatted);
  }
  return formatted;
}

/**
 * Sawn Timber (চেরা কাঠ) CFT Formula:
 * Length in feet * Width in inches * Thickness in inches / 144
 */
export interface SawnTimberInput {
  lengthFeet: number;
  lengthInches?: number;
  widthInches: number;
  thicknessInches: number;
  quantity?: number;
  ratePerCft: number;
}

export interface SawnTimberResult {
  singleItemCft: number;
  totalCft: number;
  totalPrice: number;
  ratePerCft: number;
  quantity: number;
  dimensionsSummaryEn: string;
  dimensionsSummaryBn: string;
}

export function calculateSawnTimberCFT(input: SawnTimberInput): SawnTimberResult {
  const totalLengthFeet = Math.max(0, input.lengthFeet || 0) + Math.max(0, input.lengthInches || 0) / 12;
  const width = Math.max(0, input.widthInches || 0);
  const thickness = Math.max(0, input.thicknessInches || 0);
  const qty = Math.max(1, input.quantity || 1);
  const rate = Math.max(0, input.ratePerCft || 0);

  // CFT for 1 piece
  const singleItemCft = (totalLengthFeet * width * thickness) / 144;
  const totalCft = singleItemCft * qty;
  const totalPrice = totalCft * rate;

  return {
    singleItemCft: Number(singleItemCft.toFixed(3)),
    totalCft: Number(totalCft.toFixed(3)),
    totalPrice: Math.round(totalPrice),
    ratePerCft: rate,
    quantity: qty,
    dimensionsSummaryEn: `${totalLengthFeet.toFixed(1)}' × ${width}" × ${thickness}" (Qty: ${qty})`,
    dimensionsSummaryBn: `${toBanglaDigits(totalLengthFeet.toFixed(1))}' × ${toBanglaDigits(width)}" × ${toBanglaDigits(thickness)}" (পরিমাণ: ${toBanglaDigits(qty)})`,
  };
}

/**
 * Round Wood Log (গোল কাঠ) CFT Formula:
 * Bangladesh Sawmill Standard (Quarter-Girth / Hoppus Formula):
 * (Girth in inches / 4)^2 * (Length in feet) / 144 = (Girth * Girth * Length) / 2304
 */
export interface WoodLogInput {
  lengthFeet: number;
  lengthInches?: number;
  girthInches: number; // বের বা পরিধি
  quantity?: number;
  ratePerCft: number;
}

export interface WoodLogResult {
  singleItemCft: number;
  totalCft: number;
  totalPrice: number;
  ratePerCft: number;
  quantity: number;
  formulaUsed: string;
}

export function calculateWoodLogCFT(input: WoodLogInput): WoodLogResult {
  const totalLengthFeet = Math.max(0, input.lengthFeet || 0) + Math.max(0, input.lengthInches || 0) / 12;
  const girth = Math.max(0, input.girthInches || 0);
  const qty = Math.max(1, input.quantity || 1);
  const rate = Math.max(0, input.ratePerCft || 0);

  // Hoppus Quarter Girth Formula: (girth / 4)^2 * length / 144
  const singleItemCft = Math.pow(girth / 4, 2) * (totalLengthFeet / 144);
  const totalCft = singleItemCft * qty;
  const totalPrice = totalCft * rate;

  return {
    singleItemCft: Number(singleItemCft.toFixed(3)),
    totalCft: Number(totalCft.toFixed(3)),
    totalPrice: Math.round(totalPrice),
    ratePerCft: rate,
    quantity: qty,
    formulaUsed: "Hoppus Quarter-Girth (হোপের নিয়ম: (বেড়/৪)² × দৈর্ঘ্য / ১৪৪)",
  };
}

/**
 * Door Frame (চৌকাঠ) Estimator:
 * Standard Frame consists of 2 Vertical Posts (বাতি) and 1 Top Header (শীর্ষবট)
 * Wall opening: Height (feet/inches) and Width (feet/inches)
 * Frame Section: e.g. 5" x 2.5" (standard) or 6" x 2.5"
 */
export interface DoorFrameInput {
  doorHeightFeet: number;
  doorHeightInches?: number;
  doorWidthFeet: number;
  doorWidthInches?: number;
  sectionWidthInches: number; // e.g. 5"
  sectionThicknessInches: number; // e.g. 2.5"
  woodRatePerCft: number;
  laborRatePerPiece: number;
  seasoningRatePerCft?: number;
  includeSeasoning: boolean;
  quantity?: number;
  wastagePercent?: number; // e.g. 12%
}

export interface DoorFrameResult {
  totalLinearFeet: number;
  netCft: number;
  grossCftWithWastage: number;
  timberCost: number;
  laborCost: number;
  seasoningCost: number;
  totalCost: number;
  costPerFrame: number;
  quantity: number;
}

export function calculateDoorFrame(input: DoorFrameInput): DoorFrameResult {
  const heightFeet = Math.max(0, input.doorHeightFeet || 0) + Math.max(0, input.doorHeightInches || 0) / 12;
  const widthFeet = Math.max(0, input.doorWidthFeet || 0) + Math.max(0, input.doorWidthInches || 0) / 12;
  const secW = Math.max(0, input.sectionWidthInches || 0);
  const secT = Math.max(0, input.sectionThicknessInches || 0);
  const qty = Math.max(1, input.quantity || 1);
  const wastage = (input.wastagePercent ?? 12) / 100;

  // 2 vertical legs + 1 top piece + joint allowance (approx 1 foot for mortise & tenon / lap joints)
  const singleFrameLinearFeet = (2 * heightFeet) + widthFeet + 1.0;
  const totalLinearFeet = singleFrameLinearFeet * qty;

  // Net CFT per frame
  const singleNetCft = (singleFrameLinearFeet * secW * secT) / 144;
  const netCft = singleNetCft * qty;
  const grossCft = netCft * (1 + wastage);

  const timberCost = grossCft * input.woodRatePerCft;
  const laborCost = (input.laborRatePerPiece || 0) * qty;
  const seasoningCost = input.includeSeasoning ? (grossCft * (input.seasoningRatePerCft || 250)) : 0;
  const totalCost = timberCost + laborCost + seasoningCost;

  return {
    totalLinearFeet: Number(totalLinearFeet.toFixed(2)),
    netCft: Number(netCft.toFixed(3)),
    grossCftWithWastage: Number(grossCft.toFixed(3)),
    timberCost: Math.round(timberCost),
    laborCost: Math.round(laborCost),
    seasoningCost: Math.round(seasoningCost),
    totalCost: Math.round(totalCost),
    costPerFrame: Math.round(totalCost / qty),
    quantity: qty,
  };
}

/**
 * Builds direct WhatsApp URL with pre-filled message
 */
export function buildWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
