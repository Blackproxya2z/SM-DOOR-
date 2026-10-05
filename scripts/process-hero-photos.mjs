import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const src1 = 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791198400622.jpg';
const src2 = 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791198400793.jpg'; // Signboard
const src3 = 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791198400747.jpg';

const heroDir = path.join(process.cwd(), 'public', 'images', 'hero');
const rawDir = path.join(process.cwd(), 'raw_images');

if (!fs.existsSync(heroDir)) fs.mkdirSync(heroDir, { recursive: true });
if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });

// Copy raw originals
fs.copyFileSync(src1, path.join(rawDir, 'raw-sawmill-yard.jpg'));
fs.copyFileSync(src2, path.join(rawDir, 'raw-farhan-signboard.jpg'));
fs.copyFileSync(src3, path.join(rawDir, 'raw-timber-logs.jpg'));

async function enhanceAndSave(inputPath, desktopOut, mobileOut, cropPosition = 'center') {
  console.log(`Processing: ${path.basename(inputPath)}...`);

  // Subtle natural enhancement:
  // - Light boost to shadows and wood warmth (saturation 1.12, brightness 1.02)
  // - Mild sharpening to bring out timber texture and lettering
  // - Professional high-effort WebP compression (quality 84)

  // 1. Desktop 16:9 full-width crop (1600x900)
  const desktopBuffer = await sharp(inputPath)
    .rotate()
    .resize({
      width: 1600,
      height: 900,
      fit: 'cover',
      position: cropPosition
    })
    .modulate({
      brightness: 1.02,
      saturation: 1.12
    })
    .sharpen({
      sigma: 1.1,
      m1: 0.6,
      m2: 2.0
    })
    .webp({ quality: 84, effort: 4 })
    .toBuffer();

  fs.writeFileSync(desktopOut, desktopBuffer);
  console.log(`  -> Desktop saved: ${path.basename(desktopOut)} (${desktopBuffer.length} bytes)`);

  // 2. Mobile 1:1 portrait crop (800x800)
  const mobileBuffer = await sharp(inputPath)
    .rotate()
    .resize({
      width: 800,
      height: 800,
      fit: 'cover',
      position: cropPosition
    })
    .modulate({
      brightness: 1.02,
      saturation: 1.12
    })
    .sharpen({
      sigma: 1.0,
      m1: 0.5,
      m2: 1.8
    })
    .webp({ quality: 84, effort: 4 })
    .toBuffer();

  fs.writeFileSync(mobileOut, mobileBuffer);
  console.log(`  -> Mobile saved: ${path.basename(mobileOut)} (${mobileBuffer.length} bytes)`);
}

async function run() {
  // Photo 1: Sawmill Yard with logs and sawn timber
  await enhanceAndSave(
    src1,
    path.join(heroDir, 'hero-sawmill-yard.webp'),
    path.join(heroDir, 'hero-sawmill-yard-mobile.webp'),
    'center'
  );
  // Also copy to banner-1.webp for immediate backwards-compatibility
  fs.copyFileSync(path.join(heroDir, 'hero-sawmill-yard.webp'), path.join(heroDir, 'banner-1.webp'));
  fs.copyFileSync(path.join(heroDir, 'hero-sawmill-yard-mobile.webp'), path.join(heroDir, 'banner-1-mobile.webp'));

  // Photo 2: Signboard (Focus on signboard)
  await enhanceAndSave(
    src2,
    path.join(heroDir, 'hero-farhan-signboard.webp'),
    path.join(heroDir, 'hero-farhan-signboard-mobile.webp'),
    'center'
  );
  fs.copyFileSync(path.join(heroDir, 'hero-farhan-signboard.webp'), path.join(heroDir, 'banner-2.webp'));
  fs.copyFileSync(path.join(heroDir, 'hero-farhan-signboard-mobile.webp'), path.join(heroDir, 'banner-2-mobile.webp'));

  // Photo 3: Timber Logs Yard
  await enhanceAndSave(
    src3,
    path.join(heroDir, 'hero-timber-logs.webp'),
    path.join(heroDir, 'hero-timber-logs-mobile.webp'),
    'center'
  );
  fs.copyFileSync(path.join(heroDir, 'hero-timber-logs.webp'), path.join(heroDir, 'banner-3.webp'));
  fs.copyFileSync(path.join(heroDir, 'hero-timber-logs-mobile.webp'), path.join(heroDir, 'banner-3-mobile.webp'));

  // Update data/db.json with actual authentic Farhan Enterprise titles and mobile images
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  if (fs.existsSync(dbPath)) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    db.heroBanners = [
      {
        id: 'banner-1',
        titleBn: 'মেসার্স ফারহান এন্টারপ্রাইজ - সমিল ও কাঠের কারখানা',
        titleEn: 'M/S Farhan Enterprise - Sawmill & Timber Plant',
        subtitleBn: 'খাঁটি চিটাগাং সেগুন, সিজনড মেহগনি ও গামারি গোল লগ ও চেরা সাইজ কাঠ। ১০০% ট্রিটমেন্ট কাঠ দ্বারা তৈরি টেকসই ও মজবুত পণ্য।',
        subtitleEn: 'Chittagong Teak, Seasoned Mahogany & Gamari logs and sawn timber. High-pressure vacuum treated durable woodwork.',
        tagBn: 'খাঁটি কাঠের বিশ্বস্ত কারখানা',
        tagEn: 'Trusted Hardwood Sawmill & Workshop',
        badgeBn: 'প্রোঃ মোঃ আব্দুছ ছালাম খাঁন • বাদে নাভারন, ঝিকরগাছা, যশোর',
        badgeEn: 'Proprietor: Md. Abdus Salam Khan • Jhikargachha, Jashore',
        ctaTextBn: 'পণ্য ক্যাটালগ দেখুন',
        ctaTextEn: 'View Catalog',
        ctaLink: '#catalog',
        secondaryCtaTextBn: 'সরাসরি কল করুন',
        secondaryCtaTextEn: 'Call Now',
        secondaryCtaLink: 'tel:+8801710820987',
        bgImageUrl: '/images/hero/hero-sawmill-yard.webp',
        mobileBgImageUrl: '/images/hero/hero-sawmill-yard-mobile.webp',
        overlayOpacity: 0.75,
        order: 1,
        isActive: true
      },
      {
        id: 'banner-2',
        titleBn: 'লগ ও সাইজ কাঠ ক্রয়-বিক্রয় ও কাস্টম কাঠের সামগ্রী',
        titleEn: 'Logs & Sized Timber Supply and Custom Woodwork',
        subtitleBn: 'দরজা, চৌকাঠ ও ফার্নিচার সহ যাবতীয় কাঠের সামগ্রী কিম্বন ড্রাইড ও ভ্যাকুয়াম কেমিক্যাল ট্রিটমেন্ট কাঠে নিজস্ব কারখানায় নিখুঁতভাবে তৈরি।',
        subtitleEn: 'Doors, chowkaths, and furniture crafted with mature kiln-dried CCB treated timber in our own workshop.',
        tagBn: 'আকিজ কলেজিয়েট স্কুলের পশ্চিম পার্শ্বে, বাদে নাভারন',
        tagEn: 'West side of Akij Collegiate School, Bade Nabaran',
        badgeBn: '১০০% পাকা ও ভ্যাকুয়াম কেমিক্যাল ট্রিটমেন্ট কাঠ',
        badgeEn: '100% Mature & Vacuum CCB Treated Wood',
        ctaTextBn: 'সিএফটি ক্যালকুলেটর',
        ctaTextEn: 'CFT Calculator',
        ctaLink: '#calculator',
        secondaryCtaTextBn: 'হোয়াটসঅ্যাপ করুন',
        secondaryCtaTextEn: 'WhatsApp Us',
        secondaryCtaLink: 'https://wa.me/8801710820987',
        bgImageUrl: '/images/hero/hero-farhan-signboard.webp',
        mobileBgImageUrl: '/images/hero/hero-farhan-signboard-mobile.webp',
        overlayOpacity: 0.75,
        order: 2,
        isActive: true
      },
      {
        id: 'banner-3',
        titleBn: 'সরাসরি কারখানা থেকে পাইকারি ও খুচরা মূল্যে কাঠ',
        titleEn: 'Direct Sawmill Factory Sawn Wood & Custom Orders',
        subtitleBn: 'উইপোকা ও ঘুণপোকার বিরুদ্ধে আজীবন সুরক্ষা। বাড়ির প্রধান দরজা, চৌকাঠ ও যেকোনো সাইজের অর্ডারে দ্রুত ডেলিভারি।',
        subtitleEn: 'Lifetime immunity against termites and borers. Fast delivery on doors, frames, and custom sized orders.',
        tagBn: 'মোবাঃ ০১৭১০-৮২০৯৮৭, ০১৯৪২-২৩৭৩৯৯',
        tagEn: 'Mobile: 01710-820987, 01942-237399',
        badgeBn: '২৫ বছরের উইপোকা প্রতিরোধী লাইফটাইম সুরক্ষা',
        badgeEn: '25-Year Termite Immersion Shield',
        ctaTextBn: 'কাস্টম অর্ডার দিন',
        ctaTextEn: 'Custom Order',
        ctaLink: '#custom-order',
        secondaryCtaTextBn: 'দরজা ক্যাটালগ',
        secondaryCtaTextEn: 'Door Catalog',
        secondaryCtaLink: '/doors',
        bgImageUrl: '/images/hero/hero-timber-logs.webp',
        mobileBgImageUrl: '/images/hero/hero-timber-logs-mobile.webp',
        overlayOpacity: 0.75,
        order: 3,
        isActive: true
      }
    ];

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log('[SUCCESS] Updated data/db.json with actual hero banners');
  }

  console.log('🎉 Hero section banners processed and set up successfully!');
}

run().catch(err => {
  console.error('Error processing hero photos:', err);
  process.exit(1);
});
