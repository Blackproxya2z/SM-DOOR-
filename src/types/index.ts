export type Language = 'bn' | 'en';

export type ProductCategory = 
  | 'wood' 
  | 'door' 
  | 'furniture' 
  | 'dining-table' 
  | 'bed' 
  | 'tea-table' 
  | 'sofa' 
  | 'custom-design'
  | string;

export type QualityGrade = 'premium' | 'standard' | 'economy';

export interface WoodSpecies {
  id: string;
  nameBn: string;
  nameEn: string;
  scientificName?: string;
  originBn: string;
  originEn: string;
  descriptionBn: string;
  descriptionEn: string;
  colorTone: string; // e.g. "Deep Golden Amber to Reddish Brown"
  grainPatternBn: string;
  grainPatternEn: string;
  durabilityBn: string;
  durabilityEn: string;
  currentRatePerCft: number; // Sawn timber rate in BDT
  roundLogRatePerCft: number; // Log rate in BDT
  seasoningTimeDays: number;
  bestForBn: string[];
  bestForEn: string[];
  isPopular?: boolean;
}

export interface WoodVariantPrice {
  speciesId: string;
  speciesNameBn: string;
  speciesNameEn: string;
  price: number;
  regularPrice?: number;
  inStock: boolean;
  leadTimeDays: number;
  finishOptions: string[];
}

export interface ProductSpecification {
  standardHeight: string; // e.g. "81 inch (6.75 ft)"
  standardWidth: string;  // e.g. "39 inch (3.25 ft)" or "6 ft"
  standardThickness: string; // e.g. "1.5 inch (38mm)"
  moistureContent: string; // e.g. "12% - 14% (KILN DRIED)"
  seasoningMethodBn: string;
  seasoningMethodEn: string;
  chemicalTreatmentBn: string;
  chemicalTreatmentEn: string;
  warrantyYears: number;
  carvingDepth?: string; // e.g. "10mm CNC Deep Carving"
  suitableForBn: string;
  suitableForEn: string;
}

export interface Product {
  id: string;
  designNumber: string; // Format: FE-CAT-001 (e.g. FE-DOOR-001, FE-BED-001)
  slug: string;
  titleBn: string;
  titleEn: string;
  category: ProductCategory;
  categoryLabelBn: string;
  categoryLabelEn: string;
  defaultWoodSpeciesId: string;
  woodVariants: WoodVariantPrice[];
  defaultPrice: number;
  regularPrice?: number;
  priceType?: 'fixed' | 'starting' | 'request';
  qualityGrade?: QualityGrade;
  finishOptions?: string[];
  treatmentOptionsBn?: string;
  treatmentOptionsEn?: string;
  descriptionBn: string;
  descriptionEn: string;
  featuresBn: string[];
  featuresEn: string[];
  specifications: ProductSpecification;
  images: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  stockStatus: 'in_stock' | 'made_to_order' | 'custom_order' | 'out_of_stock';
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CalculatorRates {
  woodSpeciesRates: Record<string, number>; // speciesId -> per CFT sawn timber price (BDT)
  roundLogRates: Record<string, number>;    // speciesId -> per CFT log price (BDT)
  chowkathLaborRatePerPiece: number;       // Labor rate per door frame (BDT)
  seasoningRatePerCft: number;             // Chemical & Kiln rate per CFT (BDT)
  standardWastePercentage: number;         // e.g. 12%
  lastUpdated: string;
}

export interface CustomOrderInquiry {
  id: string; // Format: FE-YYYYMMDD-XXXX
  customerName: string;
  customerPhone: string;
  customerWhatsApp?: string;
  customerDistrict: string;
  deliveryAddress?: string;
  productType: 'door' | 'bed' | 'dining-table' | 'tea-table' | 'sofa' | 'furniture' | 'wood' | 'other';
  woodSpeciesId: string;
  woodSpeciesName: string;
  qualityGrade?: QualityGrade;
  preferredFinish?: string;
  dimensions: {
    height: number;
    width: number;
    thickness: number;
    unit: 'inch' | 'feet';
  };
  quantity: number;
  polishPreference: 'raw' | 'lacquer' | 'pu_polish' | 'burnish' | 'hand_polish';
  notes?: string;
  designImageUrl?: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
  estimatedCost?: number;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroBanner {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  tagBn: string;
  tagEn: string;
  badgeBn: string;
  badgeEn: string;
  ctaTextBn: string;
  ctaTextEn: string;
  ctaLink: string;
  secondaryCtaTextBn?: string;
  secondaryCtaTextEn?: string;
  secondaryCtaLink?: string;
  bgImageUrl: string;
  overlayOpacity?: number;
  order: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  authorNameBn: string;
  authorNameEn: string;
  locationBn: string;
  locationEn: string;
  rating: number;
  commentBn: string;
  commentEn: string;
  projectTypeBn: string;
  projectTypeEn: string;
  verifiedBuyer: boolean;
  date: string;
}

export interface SiteSettings {
  siteNameBn: string;
  siteNameEn: string;
  proprietorBn: string;
  proprietorEn: string;
  taglineBn: string;
  taglineEn: string;
  servicesBn: string;
  servicesEn: string;
  phone1: string;
  phone2: string;
  whatsappNumber: string;
  whatsappNumberSecondary?: string;
  email: string;
  addressBn: string;
  addressEn: string;
  locationCity: string;
  sawmillAddressBn: string;
  sawmillAddressEn: string;
  showroomAddressBn: string;
  showroomAddressEn: string;
  facebookUrl: string;
  youtubeUrl: string;
  mapEmbedUrl: string;
  noticeTextBn: string;
  noticeTextEn: string;
  isNoticeActive: boolean;
  bkashNumber: string;
  nagadNumber: string;
}

export interface SawmillService {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  icon: string;
  highlightBn: string;
  highlightEn: string;
  imageUrl: string;
}

export interface QuoteItem {
  id: string;
  designNumber?: string;
  type: 'product' | 'calculator' | 'custom';
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  image?: string;
  price?: number;
  woodSpeciesBn?: string;
  woodSpeciesEn?: string;
  measurementsBn?: string;
  measurementsEn?: string;
  quantity: number;
  sourceUrl?: string;
  createdAt: string;
}

export interface CategoryInfo {
  id: string;
  slug: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  imageUrl: string;
  itemCount: number;
  iconName: string;
}
