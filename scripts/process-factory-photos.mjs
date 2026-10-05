import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const factoryDir = path.join(process.cwd(), 'public', 'images', 'factory');
if (!fs.existsSync(factoryDir)) {
  fs.mkdirSync(factoryDir, { recursive: true });
}

const imagesToProcess = [
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791200945090.jpg',
    outName: 'factory-sawmill-yard.webp',
    titleBn: 'সমিল ইয়ার্ড ও কাঁচামাল কাঠ প্রসেসিং',
    titleEn: 'Sawmill Log Yard & Sized Timber Stacks'
  },
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791200945100.jpg',
    outName: 'factory-planer-craftsman.webp',
    titleBn: 'থিকনেস প্ল্যানার ও সারফেস স্মুথিং সেকশন',
    titleEn: 'Thickness Planer & Surface Preparation'
  },
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791200945108.jpg',
    outName: 'factory-workshop-assembly.webp',
    titleBn: 'দক্ষ কারিগরদের কাঠ প্রক্রিয়াকরণ ওয়ার্কশপ',
    titleEn: 'Master Craftsmen Timber Workshop'
  },
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791200945138.jpg',
    outName: 'factory-bandsaw-cutting.webp',
    titleBn: 'হাই-প্রিসিশন ব্যান্ড স মিল কাটিং অপারেশন',
    titleEn: 'Precision Band Saw Log Slicing'
  },
  {
    src: 'C:/Users/Jain/.gemini/antigravity-ide/brain/1fa29d97-5f1e-489b-820e-fd6d27f92aa9/.user_uploaded/media_1791200945146.jpg',
    outName: 'factory-mature-log-slicing.webp',
    titleBn: '১০০% পাকা গাছের লগ বাছাই ও চেরাই',
    titleEn: 'Mature Timber Log Selection & Slicing'
  }
];

async function run() {
  console.log('Optimizing factory photos with Sharp...');
  for (const item of imagesToProcess) {
    const targetPath = path.join(factoryDir, item.outName);
    const originalStat = fs.statSync(item.src);

    const buffer = await sharp(item.src)
      .rotate()
      .resize({
        width: 1200,
        height: 900,
        fit: 'cover',
        position: 'center'
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

    fs.writeFileSync(targetPath, buffer);
    console.log(`[OK] Saved ${item.outName} (${(originalStat.size/1024).toFixed(1)} KB -> ${(buffer.length/1024).toFixed(1)} KB)`);
  }
  console.log('All 5 factory photos optimized successfully!');
}

run().catch(console.error);
