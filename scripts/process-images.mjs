import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import readline from 'readline';

const CATEGORIES = {
  door: { labelBn: 'দরজা', labelEn: 'Doors', prefix: 'FE-DOOR' },
  wood: { labelBn: 'কাঠ ও চৌকাঠ', labelEn: 'Wood & Chowkath', prefix: 'FE-WOOD' },
  bed: { labelBn: 'বেড / খাট', labelEn: 'Beds', prefix: 'FE-BED' },
  'dining-table': { labelBn: 'ডাইনিং টেবিল', labelEn: 'Dining Tables', prefix: 'FE-DINING' },
  sofa: { labelBn: 'সোফা', labelEn: 'Sofas', prefix: 'FE-SOFA' },
  'tea-table': { labelBn: 'টি টেবিল', labelEn: 'Tea Tables', prefix: 'FE-TEA' },
  furniture: { labelBn: 'ফার্নিচার ও ক্যাবিনেট', labelEn: 'Furniture', prefix: 'FE-FURN' },
  'custom-design': { labelBn: 'কাস্টম ডিজাইন', labelEn: 'Custom Design', prefix: 'FE-CUSTOM' }
};

const CATEGORY_KEYWORDS = {
  door: ['door', 'dorja', 'palla', 'main-door', 'pal', 'entrance', 'choukat', 'gate'],
  wood: ['wood', 'log', 'timber', 'chera', 'saiz', 'teak', 'shegun', 'segun', 'mahogany', 'gamari', 'shal'],
  bed: ['bed', 'khat', 'cot', 'bedroom', 'king', 'queen'],
  'dining-table': ['dining', 'table-chair', 'khabar-table', 'chair'],
  sofa: ['sofa', 'couch', 'living-set'],
  'tea-table': ['tea', 'coffee', 'center-table', 'corner-table'],
  furniture: ['furniture', 'dressing', 'almirah', 'wardrobe', 'showcase', 'bookshelf'],
  'custom-design': ['custom', 'design', 'sketch', 'client']
};

function cleanFilename(originalName) {
  const base = path.basename(originalName, path.extname(originalName));
  const cleaned = base
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${cleaned || 'product-' + Date.now()}.webp`;
}

function inferCategory(filename) {
  const lower = filename.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return { category: cat, confidence: 'high', matched: kw };
      }
    }
  }
  return { category: 'door', confidence: 'low' };
}

async function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function processSingleImage(filePath, userCategory, isHero = false, productTitle = null, productPrice = null) {
  const originalStats = fs.statSync(filePath);
  const originalSizeKb = (originalStats.size / 1024).toFixed(1);

  const cleanName = cleanFilename(filePath);
  let category = userCategory;

  if (isHero) {
    category = 'hero';
  } else if (!category) {
    const inference = inferCategory(filePath);
    if (inference.confidence === 'high') {
      category = inference.category;
      console.log(`[Auto-Category] Inferred category "${category}" from filename keyword "${inference.matched}".`);
    } else {
      console.log(`\n⚠️  Category could not be definitively determined for: ${path.basename(filePath)}`);
      console.log('Available categories:', Object.keys(CATEGORIES).join(', '));
      const chosen = await promptUser('Enter category for this image (or press Enter for "door"): ');
      category = chosen && CATEGORIES[chosen] ? chosen : 'door';
    }
  }

  // Target directory
  const targetDir = isHero
    ? path.join(process.cwd(), 'public', 'images', 'hero')
    : path.join(process.cwd(), 'public', 'images', 'products', category);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetPath = path.join(targetDir, cleanName);
  const webPath = isHero ? `/images/hero/${cleanName}` : `/images/products/${category}/${cleanName}`;

  // Processing with Sharp:
  // - Auto-rotate based on EXIF (essential for phone orientation)
  // - Resize to max 1600px width (without enlarging)
  // - Compress to WebP (quality: 82)
  console.log(`Processing image: ${filePath}...`);
  const imagePipeline = sharp(filePath).rotate();

  if (isHero) {
    imagePipeline.resize({ width: 1600, height: 900, fit: 'cover', position: 'center' });
  } else {
    imagePipeline.resize({ width: 1600, withoutEnlargement: true });
  }

  const { data, info } = await imagePipeline.webp({ quality: 82, effort: 4 }).toBuffer({ resolveWithObject: true });
  fs.writeFileSync(targetPath, data);

  const newSizeKb = (data.length / 1024).toFixed(1);
  const reduction = (((originalStats.size - data.length) / originalStats.size) * 100).toFixed(0);

  console.log(`✅ [Optimized] Saved to: ${webPath}`);
  console.log(`   Dimensions: ${info.width}x${info.height}px | Format: WebP`);
  console.log(`   Size: ${originalSizeKb} KB ➔ ${newSizeKb} KB (${reduction}% reduction)\n`);

  if (!isHero) {
    // Add/Update entry in data/products.json
    await updateProductsJson(category, cleanName, webPath, productTitle, productPrice);
  }

  return { webPath, cleanName, category, newSizeKb };
}

async function updateProductsJson(category, filename, webPath, customTitle, customPrice) {
  const productsJsonPath = path.join(process.cwd(), 'data', 'products.json');
  const dbPath = path.join(process.cwd(), 'data', 'db.json');

  let products = [];
  if (fs.existsSync(productsJsonPath)) {
    products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
  }

  const baseTitle = filename.replace('.webp', '').replace(/-/g, ' ');
  const formattedTitle = baseTitle.charAt(0).toUpperCase() + baseTitle.slice(1);
  const catDef = CATEGORIES[category] || { labelBn: 'দরজা', labelEn: 'Door', prefix: 'FE-ITEM' };

  const catCount = products.filter(p => p.category === category).length + 1;
  const designNumber = `${catDef.prefix}-${String(catCount).padStart(3, '0')}`;

  const titleBn = customTitle || `${catDef.labelBn} ডিজাইন (${designNumber})`;
  const titleEn = `${catDef.labelEn} Model ${designNumber}`;
  const price = customPrice ? Number(customPrice) : 25000;

  // Check if an entry with this image already exists
  const existingIdx = products.findIndex(p => p.imagePath === webPath || p.images?.includes(webPath));
  if (existingIdx >= 0) {
    products[existingIdx].updatedAt = new Date().toISOString();
    console.log(`[Data] Updated existing product entry for ${webPath}`);
  } else {
    const newProduct = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      designNumber,
      slug: `${category}-${designNumber.toLowerCase()}`,
      titleBn,
      titleEn,
      category,
      categoryLabelBn: catDef.labelBn,
      categoryLabelEn: catDef.labelEn,
      imagePath: webPath,
      images: [webPath],
      altText: `${titleBn} - মেসার্স ফারহান এন্টারপ্রাইজ কাঠের সামগ্রী`,
      altBn: `${titleBn} - মেসার্স ফারহান এন্টারপ্রাইজ`,
      altEn: `${titleEn} - SM Door Solid Wood`,
      defaultPrice: price,
      regularPrice: Math.round(price * 1.15),
      priceType: 'starting',
      qualityGrade: 'premium',
      defaultWoodSpeciesId: 'ctg-teak',
      woodVariants: [
        {
          speciesId: 'ctg-teak',
          speciesNameBn: 'চিটাগাং সেগুন',
          speciesNameEn: 'Chittagong Teak',
          price: price,
          regularPrice: Math.round(price * 1.15),
          inStock: true,
          leadTimeDays: 7,
          finishOptions: ['ল্যাকার পলিশ', 'ম্যাট ফিনিশ']
        },
        {
          speciesId: 'seasoned-mahogany',
          speciesNameBn: 'সিজনড মেহগনি',
          speciesNameEn: 'Seasoned Mahogany',
          price: Math.round(price * 0.65),
          regularPrice: Math.round(price * 0.75),
          inStock: true,
          leadTimeDays: 5,
          finishOptions: ['ল্যাকার পলিশ']
        }
      ],
      descriptionBn: `খাঁটি সিজনড কাঠে নিখুঁত কারুকাজে তৈরি ${catDef.labelBn}। ১২-১৪% কিম্বন ড্রাই ও কেমিক্যাল ট্রিটমেন্ট সহ আজীবন টেকসই।`,
      descriptionEn: `Mastercrafted ${catDef.labelEn} made with mature kiln-seasoned and vacuum treated timber.`,
      featuresBn: [
        '১০০% সিজনড ও কেমিক্যাল ট্রিটমেন্ট কাঠ',
        'উইপোকা ও ঘুণপোকা প্রতিরোধী লাইফটাইম গ্যারান্টি',
        'নিখুঁত হ্যান্ড ও সিএনসি কার্ভিং'
      ],
      featuresEn: [
        '100% Kiln-seasoned & CCB treated timber',
        'Zero warping & termite immunity',
        'Precision hand and CNC finishes'
      ],
      specifications: {
        standardHeight: "81 inch (6.75 ft)",
        standardWidth: "39 inch (3.25 ft)",
        standardThickness: "1.5 inch (38mm)",
        moistureContent: "12% - 14% (KILN DRIED)",
        seasoningMethodBn: "অটোমেটেড স্টিম কিম্বন ড্রাইং",
        seasoningMethodEn: "Automated Steam Kiln Drying",
        chemicalTreatmentBn: "ভ্যাকুয়াম প্রেসার CCB ট্রিটমেন্ট",
        chemicalTreatmentEn: "High-Pressure Vacuum CCB Treatment",
        warrantyYears: 25,
        suitableForBn: "প্রধান প্রবেশদ্বার ও অভ্যন্তরীণ ব্যবহার",
        suitableForEn: "Main Entrance and Luxury Interiors"
      },
      isFeatured: false,
      isBestSeller: false,
      stockStatus: 'in_stock',
      rating: 5,
      reviewsCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);
    console.log(`[Data] Added new product ${designNumber} to data/products.json!`);
  }

  fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 2), 'utf8');

  // Also update data/db.json
  if (fs.existsSync(dbPath)) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    db.products = products;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  }
}

async function main() {
  console.log('====================================================');
  console.log('   SM Door - Image Upload & Processing Helper       ');
  console.log('====================================================\n');

  const args = process.argv.slice(2);
  let fileArg = null;
  let categoryArg = null;
  let isHero = false;
  let titleArg = null;
  let priceArg = null;

  for (const arg of args) {
    if (arg.startsWith('--file=')) fileArg = arg.split('=')[1];
    else if (arg.startsWith('--category=')) categoryArg = arg.split('=')[1];
    else if (arg === '--hero') isHero = true;
    else if (arg.startsWith('--title=')) titleArg = arg.split('=')[1];
    else if (arg.startsWith('--price=')) priceArg = arg.split('=')[1];
  }

  // If a single file was supplied via CLI
  if (fileArg) {
    const fullPath = path.resolve(fileArg);
    if (!fs.existsSync(fullPath)) {
      console.error(`Error: File not found: ${fullPath}`);
      process.exit(1);
    }
    await processSingleImage(fullPath, categoryArg, isHero, titleArg, priceArg);
    console.log('✨ All operations completed successfully!');
    return;
  }

  // Otherwise, inspect raw_images/ staging folder
  const rawDir = path.join(process.cwd(), 'raw_images');
  if (!fs.existsSync(rawDir)) {
    fs.mkdirSync(rawDir, { recursive: true });
  }

  const rawFiles = fs.readdirSync(rawDir).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'].includes(ext);
  });

  if (rawFiles.length === 0) {
    console.log('No raw images found in raw_images/ folder.');
    console.log('You can:');
    console.log('1. Drop mobile pictures into the "raw_images" folder and rerun this script.');
    console.log('2. Or run: node scripts/process-images.mjs --file="path/to/my-pic.jpg" --category=door\n');
    return;
  }

  console.log(`Found ${rawFiles.length} raw image(s) in "raw_images/":\n`);
  for (const file of rawFiles) {
    const fullPath = path.join(rawDir, file);
    await processSingleImage(fullPath, categoryArg, isHero, titleArg, priceArg);
  }

  console.log('🎉 Staging images successfully processed, optimized into WebP, and added to the website catalog!');
}

main().catch(err => {
  console.error('Processing error:', err);
  process.exit(1);
});
