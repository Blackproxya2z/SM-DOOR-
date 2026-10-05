import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const uploadedFiles = [
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791199601816.jpg',
    category: 'furniture',
    categoryLabelBn: 'ফার্নিচার',
    categoryLabelEn: 'Furniture',
    designNumber: 'FE-FURN-003',
    slug: 'luxury-solid-teak-dressing-table-with-showcase',
    titleBn: 'লাক্সারি সলিড সেগুন কাঠের ড্রেসিং টেবিল ও শোকেস কেবিনেট',
    titleEn: 'Luxury Solid Teak Wood Dressing Table with Display Showcase',
    filename: 'fe-furn-003.webp',
    defaultPrice: 38000,
    regularPrice: 43000,
    qualityGrade: 'luxury',
    defaultWoodSpeciesId: 'ctg-teak',
    woodVariants: [
      {
        speciesId: 'ctg-teak',
        speciesNameBn: 'চিটাগাং সেগুন',
        speciesNameEn: 'Chittagong Teak',
        price: 38000,
        regularPrice: 43000,
        inStock: true,
        leadTimeDays: 7,
        finishOptions: ['ল্যাকার পলিশ', 'ম্যাট ফিনিশ']
      },
      {
        speciesId: 'seasoned-mahogany',
        speciesNameBn: 'সিজনড মেহগনি',
        speciesNameEn: 'Seasoned Mahogany',
        price: 25000,
        regularPrice: 29000,
        inStock: true,
        leadTimeDays: 7,
        finishOptions: ['ল্যাকার পলিশ']
      },
      {
        speciesId: 'gamari',
        speciesNameBn: 'পার্বত্য গামারি',
        speciesNameEn: 'Gamari Wood',
        price: 22000,
        regularPrice: 26000,
        inStock: true,
        leadTimeDays: 10,
        finishOptions: ['হ্যান্ড পলিশ', 'ল্যাকার পলিশ']
      }
    ],
    descriptionBn: 'সম্পূর্ণ খাঁটি সলিড সেগুন কাঠে নির্মিত লাক্সারি ড্রেসিং টেবিল ও ডিসপ্লে শোকেস ইউনিট। শীর্ষে রয়েছে রাজকীয় খোদাই করা খিলান, ডানপাশে ৪-স্তরের গ্লাস শোকেস তাক ও কাঠের টার্নড স্পিন্ডল রেলিং, এবং নিচে সুপরিসর স্টোরেজ ড্রয়ার ও সাইড কেবিনেট।',
    descriptionEn: 'Mastercrafted solid Chittagong Teak dressing unit featuring an ornate full-length arch mirror, 4-tier glass display shelves with turned railings, and deep-relief carved drawers.',
    featuresBn: [
      '১০০% সিজনড ও কেমিক্যাল ট্রিটমেন্ট সেগুন কাঠ',
      '৪-স্তরের গ্লাস ডিসপ্লে শোকেস ও ভেলভেট ফিনিশ ড্রয়ার',
      'প্রাকৃতিক কাঠের গ্রেইন ও প্রিমিয়াম ল্যাকার ফিনিশ',
      'উইপোকা ও ঘুণপোকার বিরুদ্ধে আজীবন গ্যারান্টি'
    ],
    featuresEn: [
      '100% Kiln-seasoned & CCB treated solid teak',
      '4-tier glass showcase shelves & deep carved pull drawers',
      'Natural honey-amber wood grain with silky lacquer',
      'Lifetime immunity against borers and termites'
    ],
    specifications: {
      standardHeight: '78 inch (6.5 ft)',
      standardWidth: '42 inch (3.5 ft)',
      standardThickness: '20 inch depth',
      moistureContent: '12% - 14% (KILN DRIED)',
      seasoningMethodBn: 'অটোমেটেড স্টিম কিম্বন ড্রাইং',
      seasoningMethodEn: 'Automated Steam Kiln Drying',
      chemicalTreatmentBn: 'ভ্যাকুয়াম প্রেসার CCB ট্রিটমেন্ট',
      chemicalTreatmentEn: 'High-Pressure Vacuum CCB Treatment',
      warrantyYears: 25,
      carvingDepth: '10mm Master Hand Carving',
      suitableForBn: 'মাস্টার বেডরুম ও লাক্সারি ইন্টেরিয়র',
      suitableForEn: 'Master Bedroom and Luxury Dressing Space'
    },
    isFeatured: true,
    isBestSeller: true
  },
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791199601999.jpg',
    category: 'bed',
    categoryLabelBn: 'বেড / খাট',
    categoryLabelEn: 'Beds',
    designNumber: 'FE-BED-003',
    slug: 'royal-victorian-master-carved-solid-teak-king-bed',
    titleBn: 'রাজকীয় ভিক্টোরিয়ান ক্রাউন খোদাইকৃত সলিড কাঠের কিং সাইজ খাট',
    titleEn: 'Royal Victorian Master-Carved Solid Hardwood King Size Bed',
    filename: 'fe-bed-003.webp',
    defaultPrice: 48000,
    regularPrice: 55000,
    qualityGrade: 'luxury',
    defaultWoodSpeciesId: 'ctg-teak',
    woodVariants: [
      {
        speciesId: 'ctg-teak',
        speciesNameBn: 'চিটাগাং সেগুন',
        speciesNameEn: 'Chittagong Teak',
        price: 48000,
        regularPrice: 55000,
        inStock: true,
        leadTimeDays: 10,
        finishOptions: ['ল্যাকার পলিশ', 'ম্যাট ফিনিশ']
      },
      {
        speciesId: 'seasoned-mahogany',
        speciesNameBn: 'সিজনড মেহগনি',
        speciesNameEn: 'Seasoned Mahogany',
        price: 32000,
        regularPrice: 38000,
        inStock: true,
        leadTimeDays: 8,
        finishOptions: ['ল্যাকার পলিশ']
      },
      {
        speciesId: 'gamari',
        speciesNameBn: 'পার্বত্য গামারি',
        speciesNameEn: 'Gamari Wood',
        price: 28000,
        regularPrice: 33000,
        inStock: true,
        leadTimeDays: 10,
        finishOptions: ['ল্যাকার পলিশ']
      }
    ],
    descriptionBn: 'ভিক্টোরিয়ান রাজকীয় শৈলীতে হস্তনির্মিত এক্সক্লুসিভ কিং সাইজ সলিড কাঠের খাট। হেডবোর্ডের শীর্ষে সুউচ্চ মুকুট (Crown) এবং কেন্দ্রস্থলে নিখুঁত ফ্লোরাল মোটিফ খোদাই। সাথে রয়েছে সামঞ্জস্যপূর্ণ ম্যাচিং খোদাইকৃত ফুটবোর্ড ও ভারী কাঠের পায়া।',
    descriptionEn: 'Royal master-carved solid teak king size bed featuring an exquisite Victorian crown crest, intricate acanthus leaf relief, and matching engraved footboard.',
    featuresBn: [
      'নিখুঁত হস্তশিল্পে ১২ মিমি গভীর থ্রি-ডি খোদাই নকশা',
      '১০০% পাকা সলিড কাঠের ফ্রেম ও হেভি-ডিউটি বিম',
      'প্রাকৃতিক বাদামী-অ্যাম্বার নিখুঁত পিইউ ল্যাকার ফিনিশ',
      '৫০ বছরের কাঠ স্থায়িত্ব ও আজীবন ঘুণমুক্ত গ্যারান্টি'
    ],
    featuresEn: [
      'Precision 12mm deep 3D hand-carved floral motif',
      'Heavy-duty solid timber posts and frame',
      'Rich amber polyurethane lacquer luster',
      '50-year structural longevity guarantee'
    ],
    specifications: {
      standardHeight: '54 inch Headboard',
      standardWidth: '72 inch (6 ft)',
      standardThickness: '84 inch Length (7 ft King)',
      moistureContent: '12% - 14% (KILN DRIED)',
      seasoningMethodBn: 'অটোমেটেড স্টিম কিম্বন ড্রাইং',
      seasoningMethodEn: 'Automated Steam Kiln Drying',
      chemicalTreatmentBn: 'ভ্যাকুয়াম প্রেসার CCB ট্রিটমেন্ট',
      chemicalTreatmentEn: 'High-Pressure Vacuum CCB Treatment',
      warrantyYears: 25,
      carvingDepth: '12mm Deep 3D Relief',
      suitableForBn: 'মাস্টার বেডরুম ও নবদম্পতির উপহার',
      suitableForEn: 'Master Suite and Luxury Bridal Bedroom'
    },
    isFeatured: true,
    isBestSeller: true
  },
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791199602053.jpg',
    category: 'bed',
    categoryLabelBn: 'বেড / খাট',
    categoryLabelEn: 'Beds',
    designNumber: 'FE-BED-004',
    slug: 'modern-minimalist-solid-wood-queen-bed',
    titleBn: 'মডার্ন মিনিমালিস্ট সলিড কাঠের কুইন সাইজ খাট',
    titleEn: 'Modern Minimalist Solid Hardwood Bed with Geometric Accents',
    filename: 'fe-bed-004.webp',
    defaultPrice: 34000,
    regularPrice: 39000,
    qualityGrade: 'premium',
    defaultWoodSpeciesId: 'ctg-teak',
    woodVariants: [
      {
        speciesId: 'ctg-teak',
        speciesNameBn: 'চিটাগাং সেগুন',
        speciesNameEn: 'Chittagong Teak',
        price: 34000,
        regularPrice: 39000,
        inStock: true,
        leadTimeDays: 7,
        finishOptions: ['ল্যাকার পলিশ', 'ম্যাট ফিনিশ']
      },
      {
        speciesId: 'seasoned-mahogany',
        speciesNameBn: 'সিজনড মেহগনি',
        speciesNameEn: 'Seasoned Mahogany',
        price: 24000,
        regularPrice: 28000,
        inStock: true,
        leadTimeDays: 6,
        finishOptions: ['ল্যাকার পলিশ']
      },
      {
        speciesId: 'gamari',
        speciesNameBn: 'পার্বত্য গামারি',
        speciesNameEn: 'Gamari Wood',
        price: 21000,
        regularPrice: 25000,
        inStock: true,
        leadTimeDays: 8,
        finishOptions: ['ল্যাকার পলিশ']
      }
    ],
    descriptionBn: 'আধুনিক ফ্ল্যাট ও ইন্টেরিয়রের উপযোগী পরিষ্কার জ্যামিতিক নকশার কুইন সাইজ খাট। চার কোণে আধুনিক তির্যক খাঁজকাটা প্যাটার্ন এবং কেন্দ্রস্থলে মসৃণ লতাপাতার মৃদু নকশা। কাঠের প্রাকৃতিক রেশম গ্রেইন এই মডেলের বিশেষ সৌন্দর্য।',
    descriptionEn: 'Contemporary minimalist solid wood bed featuring clean rectangular panelling, diagonal corner fluting, and a graceful central scrollwork medallion.',
    featuresBn: [
      'সহজ পরিচ্ছন্ন ও আধুনিক জ্যামিতিক নকশা',
      'প্রাকৃতিক কাঠের ওয়েভি টেক্সচার দৃশ্যমান',
      'শব্দহীন ও মজবুত জয়েন্টারি ইন্টারলক সিস্টেম',
      '২৫ বছরের অ্যান্টি-টার্মাইট কেমিক্যাল সুরক্ষা'
    ],
    featuresEn: [
      'Sleek modern geometric corner fluting and scroll accent',
      'Prominent natural wavy wood grain',
      'Squeak-free heavy timber joint interlocking system',
      '25-year anti-termite vacuum immersion protection'
    ],
    specifications: {
      standardHeight: '42 inch Headboard',
      standardWidth: '60 inch (5 ft)',
      standardThickness: '84 inch Length (7 ft Queen)',
      moistureContent: '12% - 14% (KILN DRIED)',
      seasoningMethodBn: 'অটোমেটেড স্টিম কিম্বন ড্রাইং',
      seasoningMethodEn: 'Automated Steam Kiln Drying',
      chemicalTreatmentBn: 'ভ্যাকুয়াম প্রেসার CCB ট্রিটমেন্ট',
      chemicalTreatmentEn: 'High-Pressure Vacuum CCB Treatment',
      warrantyYears: 25,
      carvingDepth: '6mm CNC Geometric Routing',
      suitableForBn: 'অ্যাপার্টমেন্ট ও যেকোনো আধুনিক বেডরুম',
      suitableForEn: 'Contemporary Apartments & Modern Homes'
    },
    isFeatured: true,
    isBestSeller: false
  },
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791199602095.jpg',
    category: 'furniture',
    categoryLabelBn: 'ফার্নিচার',
    categoryLabelEn: 'Furniture',
    designNumber: 'FE-FURN-004',
    slug: 'solid-hardwood-4-drawer-chest-cabinet-wardrobe',
    titleBn: '৪-ড্রয়ার সলিড কাঠের রাজকীয় চেস্ট অব ড্রয়ার ও আলমিরা কেবিনেট',
    titleEn: 'Solid Hardwood 4-Drawer Chest & Storage Cabinet Wardrobe',
    filename: 'fe-furn-004.webp',
    defaultPrice: 36000,
    regularPrice: 42000,
    qualityGrade: 'luxury',
    defaultWoodSpeciesId: 'ctg-teak',
    woodVariants: [
      {
        speciesId: 'ctg-teak',
        speciesNameBn: 'চিটাগাং সেগুন',
        speciesNameEn: 'Chittagong Teak',
        price: 36000,
        regularPrice: 42000,
        inStock: true,
        leadTimeDays: 8,
        finishOptions: ['ল্যাকার পলিশ', 'ম্যাট ফিনিশ']
      },
      {
        speciesId: 'seasoned-mahogany',
        speciesNameBn: 'সিজনড মেহগনি',
        speciesNameEn: 'Seasoned Mahogany',
        price: 24000,
        regularPrice: 28000,
        inStock: true,
        leadTimeDays: 7,
        finishOptions: ['ল্যাকার পলিশ']
      }
    ],
    descriptionBn: 'পোশাক ও মূল্যবান সামগ্রী সুরক্ষিত রাখার জন্য সম্পূর্ণ সলিড কাঠে নির্মিত মাল্টিপারপাস চেস্ট অব ড্রয়ার ও আলমিরা কেবিনেট। বামপাশে ৪টি গভীর খোদাইকৃত ড্রয়ার এবং ডানপাশে ডায়মন্ড ফ্লোরাল মোটিফের লম্বা স্টোরেজ আলমিরা পাল্লা।',
    descriptionEn: 'Versatile solid wood chest of drawers and side storage cabinet featuring four deep relief carved drawers and an ornate full-height wardrobe door.',
    featuresBn: [
      '৪টি গভীর ড্রয়ার ও ১টি সাইড আলমিরা কেবিনেট',
      'নিখুঁত হস্তশিল্পে ডায়মন্ড ও ফ্লোরাল কার্ভিং',
      'হেভি-ডিউটি কাঠের চ্যানেল ও স্মুথ স্লাইডিং',
      '১০০% সিজনড ও কেমিক্যাল ট্রিটমেন্ট কাঠ'
    ],
    featuresEn: [
      '4 deep glide drawers + 1 full-height wardrobe door',
      'Artisan-crafted diamond floral relief medallion',
      'Heavy-duty solid wood sliders and brass keylocks',
      '100% Kiln-seasoned borer-immune timber'
    ],
    specifications: {
      standardHeight: '48 inch (4 ft)',
      standardWidth: '45 inch (3.75 ft)',
      standardThickness: '22 inch depth',
      moistureContent: '12% - 14% (KILN DRIED)',
      seasoningMethodBn: 'অটোমেটেড স্টিম কিম্বন ড্রাইং',
      seasoningMethodEn: 'Automated Steam Kiln Drying',
      chemicalTreatmentBn: 'ভ্যাকুয়াম প্রেসার CCB ট্রিটমেন্ট',
      chemicalTreatmentEn: 'High-Pressure Vacuum CCB Treatment',
      warrantyYears: 25,
      carvingDepth: '10mm Relief Carving',
      suitableForBn: 'বেডরুমের কাপড়চোপড় ও প্রয়োজনীয় স্টোরেজ',
      suitableForEn: 'Bedroom Clothes, Linens & Valuables Storage'
    },
    isFeatured: false,
    isBestSeller: true
  },
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791199602117.jpg',
    category: 'dining-table',
    categoryLabelBn: 'ডাইনিং টেবিল',
    categoryLabelEn: 'Dining Tables',
    designNumber: 'FE-DINING-003',
    slug: 'luxury-solid-hardwood-dining-table-and-chairs-set',
    titleBn: '৪/৬-সিটার লাক্সারি সলিড কাঠের ডাইনিং টেবিল ও চেয়ার সেট',
    titleEn: 'Luxury Solid Hardwood Dining Table and Chairs Set',
    filename: 'fe-dining-003.webp',
    defaultPrice: 42000,
    regularPrice: 48000,
    qualityGrade: 'luxury',
    defaultWoodSpeciesId: 'ctg-teak',
    woodVariants: [
      {
        speciesId: 'ctg-teak',
        speciesNameBn: 'চিটাগাং সেগুন',
        speciesNameEn: 'Chittagong Teak',
        price: 42000,
        regularPrice: 48000,
        inStock: true,
        leadTimeDays: 10,
        finishOptions: ['ল্যাকার পলিশ', 'ম্যাট ফিনিশ']
      },
      {
        speciesId: 'seasoned-mahogany',
        speciesNameBn: 'সিজনড মেহগনি',
        speciesNameEn: 'Seasoned Mahogany',
        price: 29000,
        regularPrice: 34000,
        inStock: true,
        leadTimeDays: 8,
        finishOptions: ['ল্যাকার পলিশ']
      }
    ],
    descriptionBn: 'পারিবারিক খাবার ঘরের সৌন্দর্য বাড়াতে মজবুত সলিড কাঠে তৈরি ৪ বা ৬ সিটার ডাইনিং টেবিল এবং ম্যাচিং হাই-ব্যাক চেয়ার সেট। ভারী কাঠের পায়া ও চারপাশের স্ট্রেইট স্ট্রেচারের কারণে টেবিলটি আজীবন মজবুত ও অনড় থাকে।',
    descriptionEn: 'Luxury 4/6-seater solid hardwood dining suite featuring an ultra-sturdy timber table and ergonomic high-back solid wooden dining chairs.',
    featuresBn: [
      'ভারী সলিড কাঠের পায়া ও মজবুত সাপোর্ট কাঠামো',
      'আরামদায়ক কার্ভড ব্যাকরেস্ট বিশিষ্ট কাঠের চেয়ার',
      'হট ও কোল্ড স্পিল প্রতিরোধী ওয়াটারপ্রুফ ল্যাকার ফিনিশ',
      'চিটাগাং সেগুন ও সিজনড মেহগনি কাঠের অপশন'
    ],
    featuresEn: [
      'Heavy solid timber leg posts with reinforced undercarriage',
      'Ergonomically shaped contoured wooden dining chairs',
      'Spill-resistant protective polyurethane dining polish',
      'Available in mature Chittagong Teak and Mahogany'
    ],
    specifications: {
      standardHeight: '30 inch Table Height',
      standardWidth: '36 inch (3 ft)',
      standardThickness: '54 inch Length (4/6 Seater)',
      moistureContent: '12% - 14% (KILN DRIED)',
      seasoningMethodBn: 'অটোমেটেড স্টিম কিম্বন ড্রাইং',
      seasoningMethodEn: 'Automated Steam Kiln Drying',
      chemicalTreatmentBn: 'ভ্যাকুয়াম প্রেসার CCB ট্রিটমেন্ট',
      chemicalTreatmentEn: 'High-Pressure Vacuum CCB Treatment',
      warrantyYears: 25,
      suitableForBn: 'পারিবারিক ডাইনিং রুম ও কর্পোরেট ডাইনিং স্পেস',
      suitableForEn: 'Family Dining Rooms & Executive Dining Suites'
    },
    isFeatured: true,
    isBestSeller: true
  }
];

const productsJsonPath = path.join(process.cwd(), 'data', 'products.json');
const dbPath = path.join(process.cwd(), 'data', 'db.json');

let products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));

async function processProducts() {
  console.log('--- Processing 5 Authentic Product Photos ---');

  for (const item of uploadedFiles) {
    const targetDir = path.join(process.cwd(), 'public', 'images', 'products', item.category);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    const destPath = path.join(targetDir, item.filename);
    const webPath = `/images/products/${item.category}/${item.filename}`;

    // Also copy to raw_images for record
    const rawDir = path.join(process.cwd(), 'raw_images');
    if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });
    fs.copyFileSync(item.src, path.join(rawDir, `${item.designNumber.toLowerCase()}.jpg`));

    // Optimize with Sharp:
    // - Auto-rotate
    // - Max width 1400px, 4:3 fit
    // - Light color enhancement (saturation 1.10, brightness 1.02)
    // - Subtle sharpening for rich wood carving definition
    // - Modern WebP compression (quality 84)
    const webpBuffer = await sharp(item.src)
      .rotate()
      .resize({
        width: 1400,
        height: 1050,
        fit: 'inside',
        withoutEnlargement: true
      })
      .modulate({
        brightness: 1.02,
        saturation: 1.10
      })
      .sharpen({
        sigma: 1.0,
        m1: 0.5,
        m2: 2.0
      })
      .webp({ quality: 84, effort: 4 })
      .toBuffer();

    fs.writeFileSync(destPath, webpBuffer);
    console.log(`[OK] Saved ${webPath} (${webpBuffer.length} bytes)`);

    // Create complete product object
    const newProduct = {
      id: `prod-${item.designNumber.toLowerCase()}`,
      designNumber: item.designNumber,
      slug: item.slug,
      titleBn: item.titleBn,
      titleEn: item.titleEn,
      category: item.category,
      categoryLabelBn: item.categoryLabelBn,
      categoryLabelEn: item.categoryLabelEn,
      imagePath: webPath,
      images: [webPath],
      altText: `${item.titleBn} - মেসার্স ফারহান এন্টারপ্রাইজ কাঠের সামগ্রী`,
      altBn: `${item.titleBn} - মেসার্স ফারহান এন্টারপ্রাইজ`,
      altEn: `${item.titleEn} - SM Door Solid Wood`,
      defaultPrice: item.defaultPrice,
      regularPrice: item.regularPrice,
      priceType: 'starting',
      qualityGrade: item.qualityGrade,
      defaultWoodSpeciesId: item.defaultWoodSpeciesId,
      woodVariants: item.woodVariants,
      descriptionBn: item.descriptionBn,
      descriptionEn: item.descriptionEn,
      featuresBn: item.featuresBn,
      featuresEn: item.featuresEn,
      specifications: item.specifications,
      isFeatured: item.isFeatured,
      isBestSeller: item.isBestSeller,
      stockStatus: 'in_stock',
      rating: 5,
      reviewsCount: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Check duplicate
    const existingIdx = products.findIndex(p => p.designNumber === item.designNumber || p.imagePath === webPath);
    if (existingIdx >= 0) {
      products[existingIdx] = { ...products[existingIdx], ...newProduct };
      console.log(`[Update] Updated ${item.designNumber}`);
    } else {
      // Insert in products list
      products.push(newProduct);
      console.log(`[Add] Added ${item.designNumber} to ${item.category}`);
    }
  }

  // Save data/products.json
  fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 2), 'utf8');
  console.log(`[SUCCESS] data/products.json updated! Total products: ${products.length}`);

  // Sync data/db.json
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  db.products = products;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log(`[SUCCESS] data/db.json synchronized!`);
}

processProducts().catch(err => {
  console.error('Error adding products:', err);
  process.exit(1);
});
