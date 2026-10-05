import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { checkRateLimit, safeLog } from '@/lib/security';
import { cleanImageFilename, inferCategoryFromFilename, CATEGORY_DEFINITIONS } from '@/lib/image-utils';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB raw camera photo limit

function isValidImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 8) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true;
  // WebP: RIFF ... WEBP
  const riff = buffer.toString('ascii', 0, 4);
  const webp = buffer.toString('ascii', 8, 12);
  if (riff === 'RIFF' && webp === 'WEBP') return true;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown_ip';

    // Rate Limiting: 30 image uploads per hour
    const rate = checkRateLimit(`image_process_${ip}`, 30, 60 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: `অনেক বেশি ফাইল আপলোড করা হয়েছে। ${Math.ceil(rate.retryAfterSeconds / 60)} মিনিট পর চেষ্টা করুন।` 
        }, 
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    let category = formData.get('category') as string | null;
    const isHero = formData.get('isHero') === 'true';
    const customTitle = formData.get('title') as string | null;
    const customPrice = formData.get('price') ? Number(formData.get('price')) : null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'কোনো ছবি পাওয়া যায়নি।' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'ছবির সাইজ ২৫ মেগাবাইটের কম হতে হবে।' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    if (!isValidImageMagicBytes(rawBuffer)) {
      return NextResponse.json({ success: false, error: 'ফাইলটি সঠিক ছবি ফরম্যাটে নয়।' }, { status: 400 });
    }

    // Clean filename (lowercase, hyphen, .webp)
    const cleanName = cleanImageFilename(file.name, 'webp');

    // Auto-infer category if not provided
    if (isHero) {
      category = 'hero';
    } else if (!category || !CATEGORY_DEFINITIONS[category]) {
      const inference = inferCategoryFromFilename(file.name);
      category = inference.category;
    }

    // Determine target folder
    const targetDir = isHero
      ? path.join(process.cwd(), 'public', 'images', 'hero')
      : path.join(process.cwd(), 'public', 'images', 'products', category);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetFilePath = path.join(targetDir, cleanName);
    const webPath = isHero ? `/images/hero/${cleanName}` : `/images/products/${category}/${cleanName}`;

    // Process with Sharp
    const pipeline = sharp(rawBuffer).rotate(); // auto orient mobile camera
    if (isHero) {
      pipeline.resize({ width: 1600, height: 900, fit: 'cover', position: 'center' });
    } else {
      pipeline.resize({ width: 1600, withoutEnlargement: true });
    }

    const { data: webpBuffer, info } = await pipeline
      .webp({ quality: 82, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    // Write file to disk
    fs.writeFileSync(targetFilePath, webpBuffer);

    // If not hero, update central products.json and db.json
    if (!isHero) {
      const productsJsonPath = path.join(process.cwd(), 'data', 'products.json');
      const dbPath = path.join(process.cwd(), 'data', 'db.json');

      let products: any[] = [];
      if (fs.existsSync(productsJsonPath)) {
        try {
          products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
        } catch {
          products = [];
        }
      }

      const catDef = CATEGORY_DEFINITIONS[category] || { labelBn: 'পণ্য', labelEn: 'Product' };
      const catCount = products.filter(p => p.category === category).length + 1;
      const designNumber = `FE-${category.toUpperCase().replace(/-/g, '')}-${String(catCount).padStart(3, '0')}`;

      const titleBn = customTitle || `${catDef.labelBn} (${designNumber})`;
      const titleEn = `${catDef.labelEn} Model ${designNumber}`;
      const price = customPrice || 25000;

      const existingIdx = products.findIndex(p => p.imagePath === webPath || p.images?.includes(webPath));
      if (existingIdx >= 0) {
        products[existingIdx].updatedAt = new Date().toISOString();
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

        products.unshift(newProduct);
      }

      fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 2), 'utf8');

      if (fs.existsSync(dbPath)) {
        try {
          const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
          db.products = products;
          fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
        } catch {}
      }
    }

    safeLog('Image processed and saved', {
      originalName: file.name,
      savedAs: cleanName,
      category,
      originalSize: file.size,
      optimizedSize: webpBuffer.length,
      width: info.width,
      height: info.height
    });

    return NextResponse.json({
      success: true,
      url: webPath,
      webPath,
      filename: cleanName,
      category,
      width: info.width,
      height: info.height,
      originalSize: file.size,
      optimizedSize: webpBuffer.length,
      reductionPercent: Math.round((1 - webpBuffer.length / file.size) * 100)
    });
  } catch (error) {
    safeLog('Image processing exception', { error: String(error) });
    return NextResponse.json({ success: false, error: 'ছবি প্রসেসিং ও কনভার্সন ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}
