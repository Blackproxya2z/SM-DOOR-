import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dbPath = path.join(process.cwd(), 'data', 'db.json');
const productsJsonPath = path.join(process.cwd(), 'data', 'products.json');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

async function downloadAndOptimize(url, outputPath, width, height, fit = 'cover') {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    
    const pipeline = sharp(buffer).rotate();
    if (width && height) {
      pipeline.resize({ width, height, fit, position: 'center' });
    } else if (width) {
      pipeline.resize({ width, withoutEnlargement: true });
    }

    const webpBuffer = await pipeline.webp({ quality: 82 }).toBuffer();
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, webpBuffer);
    console.log(`[OK] Saved ${outputPath} (${webpBuffer.length} bytes)`);
    return true;
  } catch (err) {
    console.error(`[Error] Failed to process ${url} -> ${outputPath}:`, err.message);
    return false;
  }
}

async function run() {
  console.log('--- Step 1: Processing Hero Banners ---');
  for (let i = 0; i < db.heroBanners.length; i++) {
    const b = db.heroBanners[i];
    const bannerId = b.id || `banner-${i + 1}`;
    const desktopFile = path.join(process.cwd(), 'public', 'images', 'hero', `${bannerId}.webp`);
    const mobileFile = path.join(process.cwd(), 'public', 'images', 'hero', `${bannerId}-mobile.webp`);

    await downloadAndOptimize(b.bgImageUrl, desktopFile, 1600, 900, 'cover');
    await downloadAndOptimize(b.bgImageUrl, mobileFile, 800, 800, 'cover');

    b.bgImageUrl = `/images/hero/${bannerId}.webp`;
    b.mobileBgImageUrl = `/images/hero/${bannerId}-mobile.webp`;
  }

  console.log('\n--- Step 2: Processing Products by Category ---');
  const productsList = [];

  for (let i = 0; i < db.products.length; i++) {
    const p = db.products[i];
    const cat = p.category || 'door';
    const cleanNumber = (p.designNumber || `prod-${i + 1}`).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const filename = `${cleanNumber}.webp`;
    const targetPath = path.join(process.cwd(), 'public', 'images', 'products', cat, filename);
    const localRelUrl = `/images/products/${cat}/${filename}`;

    const originalUrl = p.images?.[0] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&auto=format&fit=crop&q=80';
    await downloadAndOptimize(originalUrl, targetPath, 1200, 900, 'cover');

    const altBn = `${p.titleBn} - মেসার্স ফারহান এন্টারপ্রাইজ কাঠের দরজা ও সামগ্রী`;
    const altEn = `${p.titleEn} - SM Door Solid Wood Products`;

    p.imagePath = localRelUrl;
    p.images = [localRelUrl];
    p.altText = altBn;
    p.altBn = altBn;
    p.altEn = altEn;

    productsList.push({
      id: p.id,
      designNumber: p.designNumber,
      slug: p.slug,
      titleBn: p.titleBn,
      titleEn: p.titleEn,
      category: p.category,
      categoryLabelBn: p.categoryLabelBn,
      categoryLabelEn: p.categoryLabelEn,
      imagePath: localRelUrl,
      images: [localRelUrl],
      altText: altBn,
      altBn: altBn,
      altEn: altEn,
      defaultPrice: p.defaultPrice,
      regularPrice: p.regularPrice,
      priceType: p.priceType || 'starting',
      qualityGrade: p.qualityGrade || 'premium',
      defaultWoodSpeciesId: p.defaultWoodSpeciesId,
      woodVariants: p.woodVariants,
      descriptionBn: p.descriptionBn,
      descriptionEn: p.descriptionEn,
      featuresBn: p.featuresBn,
      featuresEn: p.featuresEn,
      specifications: p.specifications,
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
      stockStatus: p.stockStatus,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      createdAt: p.createdAt,
      updatedAt: new Date().toISOString()
    });
  }

  // Write central products.json
  fs.writeFileSync(productsJsonPath, JSON.stringify(productsList, null, 2), 'utf8');
  console.log(`\n[SUCCESS] Wrote ${productsList.length} products to ${productsJsonPath}`);

  // Update data/db.json
  db.products = productsList;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log(`[SUCCESS] Synced data/db.json`);
}

run().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
