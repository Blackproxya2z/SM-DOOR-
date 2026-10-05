/**
 * Image Utilities for SM Door
 * - Blur shimmer placeholder data URL
 * - Filename sanitizer (lowercase, hyphens, clean extension)
 * - Category inference engine
 */

// Ultra-lightweight static cream placeholder data URL for Next.js Image
export function getShimmerBlurDataUrl(w = 400, h = 300): string {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#F4ECE1"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export const DEFAULT_BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjRFQ0UxIi8+PC9zdmc+';

/**
 * Clean and standardize image filenames:
 * - lowercase
 * - spaces, underscores, and special characters replaced with hyphens
 * - consecutive hyphens collapsed
 * - extension stripped or forced to .webp
 */
export function cleanImageFilename(originalName: string, targetExt = 'webp'): string {
  // Extract base name without extension
  const base = originalName.replace(/\.[^/.]+$/, '');
  
  const cleaned = base
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '') // remove special characters
    .trim()
    .replace(/[\s_]+/g, '-')  // replace spaces and underscores with hyphens
    .replace(/-+/g, '-')      // remove consecutive hyphens
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens

  const finalName = cleaned || `img-${Date.now()}`;
  return `${finalName}.${targetExt.replace(/^\./, '')}`;
}

export interface CategoryInferenceResult {
  category: string;
  categoryLabelBn: string;
  categoryLabelEn: string;
  confidence: 'high' | 'medium' | 'low';
  matchedKeyword?: string;
}

export const CATEGORY_DEFINITIONS: Record<string, { labelBn: string; labelEn: string; keywords: string[] }> = {
  door: {
    labelBn: 'দরজা',
    labelEn: 'Doors',
    keywords: ['door', 'dorja', 'palla', 'main-door', 'choukat', 'chowkath', 'entrance', 'carved-door', 'gate', 'pal']
  },
  wood: {
    labelBn: 'কাঠ ও চৌকাঠ',
    labelEn: 'Wood & Chowkath',
    keywords: ['wood', 'log', 'timber', 'chera', 'saiz', 'size-wood', 'teak', 'shegun', 'segun', 'mahogany', 'gamari', 'shal', 'plank', 'timber-log']
  },
  bed: {
    labelBn: 'বেড / খাট',
    labelEn: 'Beds',
    keywords: ['bed', 'khat', 'cot', 'king-bed', 'queen-bed', 'bedroom', 'box-bed']
  },
  'dining-table': {
    labelBn: 'ডাইনিং টেবিল',
    labelEn: 'Dining Tables',
    keywords: ['dining', 'dining-table', 'table-chair', 'khabar-table', 'dining-set']
  },
  sofa: {
    labelBn: 'সোফা',
    labelEn: 'Sofas',
    keywords: ['sofa', 'couch', 'living-set', 'sofa-set', 'wooden-sofa', 'l-sofa']
  },
  'tea-table': {
    labelBn: 'টি টেবিল',
    labelEn: 'Tea Tables',
    keywords: ['tea-table', 'coffee-table', 'center-table', 'corner-table', 'tea', 'coffee']
  },
  furniture: {
    labelBn: 'ফার্নিচার ও ক্যাবিনেট',
    labelEn: 'Furniture',
    keywords: ['furniture', 'dressing-table', 'almirah', 'wardrobe', 'showcase', 'bookshelf', 'cabinet']
  },
  'custom-design': {
    labelBn: 'কাস্টম ডিজাইন',
    labelEn: 'Custom Design',
    keywords: ['custom', 'special', 'design', 'drawing', 'sample', 'sketch', 'client-design']
  }
};

/**
 * Infer the best product category based on filename or text description
 */
export function inferCategoryFromFilename(filename: string): CategoryInferenceResult {
  const normalized = filename.toLowerCase();

  for (const [catKey, def] of Object.entries(CATEGORY_DEFINITIONS)) {
    for (const kw of def.keywords) {
      if (normalized.includes(kw)) {
        return {
          category: catKey,
          categoryLabelBn: def.labelBn,
          categoryLabelEn: def.labelEn,
          confidence: 'high',
          matchedKeyword: kw
        };
      }
    }
  }

  // Default fallback if no match
  return {
    category: 'door',
    categoryLabelBn: 'দরজা',
    categoryLabelEn: 'Doors',
    confidence: 'low'
  };
}
