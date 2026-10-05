import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const files = [
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791198887498.jpg',
    filename: 'factory-timber-yard.webp',
    titleBn: 'উন্মুক্ত কাঠ সিজনিং ও চেরা কাঠের সুবিশাল স্টক ইয়ার্ড',
    titleEn: 'Open Timber Seasoning & Sawn Wood Inventory Yard',
    tagBn: 'স্টক ইয়ার্ড ও সিজনিং',
    tagEn: 'Stock Yard & Seasoning',
    descBn: 'কারখানার খোলামেলা প্রাঙ্গণে প্রাকৃতিক বাতাস ও রোদে ড্রাইড করার জন্য সুশৃঙ্খলভাবে স্তুপীকৃত চেরা কাঠের তক্তা ও বাটাম। সামনে রয়েছে পরিণত গোল কাঠের বিশাল গুঁড়ি, যা থেকে নিখুঁত মাপে সাইজ কাঠ চেরাই করা হয়।',
    descEn: 'Neatly organized stacks of sawn timber planks drying under open shed and sunshine, ready for kiln seasoning.',
    specsBn: '১০০% প্রাকৃতিক এয়ার-ড্রাই ও সিজনিং সুবিধা'
  },
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791198887588.jpg',
    filename: 'factory-surface-planer.webp',
    titleBn: 'অটোমেটিক উড সারফেস প্ল্যানার ও থিকনেসার প্রসেসিং',
    titleEn: 'Automated Wood Planing & Thicknessing Unit',
    tagBn: 'প্ল্যানিং ও সাইজিং',
    tagEn: 'Planing & Sizing',
    descBn: 'শিল্পমানের হেভি-ডিউটি সারফেস প্ল্যানার মেশিনের সাহায্যে চেরা কাঠের অসমান আঁশ ছেঁটে একদম মসৃণ ও সঠিক থিকনেসে প্রস্তুত করা হচ্ছে। সামনে চমৎকার প্রাকৃতিক গ্রেইনযুক্ত তৈরি তক্তার সারি।',
    descEn: 'Industrial surface planers and thicknessers finishing timber planks to absolute flatness and silky texture.',
    specsBn: 'লেজার-লেভেল সমতল ফিনিশিং ও নিখুঁত থিকনেস'
  },
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791198887632.jpg',
    filename: 'factory-workshop-interior.webp',
    titleBn: 'ফারহান এন্টারপ্রাইজের অভ্যন্তরীণ কাটিং ও জয়েন্টারি কারখানা',
    titleEn: 'Inside the Farhan Enterprise Woodworking Plant',
    tagBn: 'কারখানার অভ্যন্তরীণ দৃশ্য',
    tagEn: 'Interior Workshop',
    descBn: 'সুবিশাল ছাউনিযুক্ত কারখানার ভেতরের দৃশ্য। পর্যাপ্ত আলো ও ভেন্টিলেশনে দক্ষ কারিগররা দরজা, চৌকাঠ ও ফার্নিচারের কাঠামো অনুযায়ী গ্রেডিং করে সুবিন্যস্তভাবে কাঠ প্রস্তুত করছেন।',
    descEn: 'Expansive indoor woodworking floor where skilled artisans grade, organize and prep timber for furniture manufacturing.',
    specsBn: 'নিরাপদ কর্মপরিবেশ ও আধুনিক কাটিং প্রযুক্তি'
  },
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791198887731.jpg',
    filename: 'factory-log-bandsaw-cutting.webp',
    titleBn: 'হেভি-ডিউটি ব্যান্ড সমিলে গোল কাঠের গুঁড়ি চেরাই কার্যক্রম',
    titleEn: 'Heavy-Duty Band Saw Log Slicing in Action',
    tagBn: 'ব্যান্ড সমিল কাটিং',
    tagEn: 'Bandsaw Milling',
    descBn: 'অভিজ্ঞ স’মিল কারিগরদের সরাসরি তত্ত্বাবধানে বড় আকারের পরিণত গাছের গোল গুঁড়ি নিখুঁত সরলরেখায় চেরাই করা হচ্ছে। এতে কাঠের গ্রেইনের স্বাভাবিক সৌন্দর্য বজায় থাকে।',
    descEn: 'Skilled sawmill artisans expertly guiding heavy mature timber logs through vertical band saw blades.',
    specsBn: 'অভিজ্ঞ কারিগর দ্বারা নিখুঁত স্ট্রেইট কাটিং'
  },
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791198887792.jpg',
    filename: 'factory-precision-plank-sizing.webp',
    titleBn: '১০০% খাঁটি হার্টউড (মজ্জা) থেকে নিখুঁত মাপে তক্তা তৈরি',
    titleEn: 'Precision Timber Plank Sizing from Mature Heartwood',
    tagBn: 'খাঁটি হার্টউড সাইজিং',
    tagEn: 'Mature Heartwood Sizing',
    descBn: 'সামনে রাখা তাজা চেরাই কাঠের গাঢ় লালচে-কমলা খাঁটি হার্টউড বা কাঠের মজ্জা অংশ স্পষ্ট দেখা যাচ্ছে। দক্ষ কারিগররা কাঠের পাতলা তক্তা নিখুঁত পরিমাপে সাইজ করছেন।',
    descEn: 'Freshly cut timber displaying rich reddish-orange mature heartwood, perfectly sized for door panels and frames.',
    specsBn: 'ঘুণপোকা ও উইপোকা মুক্ত ১০০% পাকা কাঠ'
  }
];

const targetDir = path.join(process.cwd(), 'public', 'images', 'factory');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy raw copies to raw_images
const rawDir = path.join(process.cwd(), 'raw_images');
if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });

async function processAll() {
  console.log('--- Processing 5 Factory Photos with Sharp ---');
  const results = [];

  for (const item of files) {
    fs.copyFileSync(item.src, path.join(rawDir, item.filename.replace('.webp', '.jpg')));

    const destPath = path.join(targetDir, item.filename);
    const webPath = `/images/factory/${item.filename}`;

    // Natural enhancement:
    // - Light boost to warmth and contrast
    // - Mild unsharp mask
    // - Resize max 1400px width
    // - High quality WebP
    const buffer = await sharp(item.src)
      .rotate()
      .resize({
        width: 1400,
        height: 1050,
        fit: 'inside',
        withoutEnlargement: true
      })
      .modulate({
        brightness: 1.02,
        saturation: 1.12
      })
      .sharpen({
        sigma: 1.0,
        m1: 0.5,
        m2: 2.0
      })
      .webp({ quality: 84, effort: 4 })
      .toBuffer();

    fs.writeFileSync(destPath, buffer);
    console.log(`[OK] Saved ${item.filename} (${buffer.length} bytes)`);

    results.push({
      ...item,
      imagePath: webPath,
      sizeBytes: buffer.length
    });
  }

  // Update data/db.json sawmillServices or factoryPhotos
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  if (fs.existsSync(dbPath)) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // Attach factoryPhotos
    db.factoryPhotos = results.map((r, idx) => ({
      id: `factory-photo-${idx + 1}`,
      titleBn: r.titleBn,
      titleEn: r.titleEn,
      tagBn: r.tagBn,
      tagEn: r.tagEn,
      descriptionBn: r.descBn,
      descriptionEn: r.descEn,
      specsBn: r.specsBn,
      imageUrl: r.imagePath,
      order: idx + 1
    }));

    // Update sawmillServices with actual photos as well
    if (db.sawmillServices && db.sawmillServices.length >= 4) {
      db.sawmillServices[0].imageUrl = '/images/factory/factory-log-bandsaw-cutting.webp';
      db.sawmillServices[1].imageUrl = '/images/factory/factory-timber-yard.webp';
      db.sawmillServices[2].imageUrl = '/images/factory/factory-surface-planer.webp';
      db.sawmillServices[3].imageUrl = '/images/factory/factory-precision-plank-sizing.webp';
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log('[SUCCESS] Updated data/db.json with factoryPhotos and sawmillServices!');
  }

  console.log('🎉 All 5 factory pictures processed and registered!');
}

processAll().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
