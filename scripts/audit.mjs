import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('./public');
const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
const db = JSON.parse(fs.readFileSync('./data/db.json', 'utf8'));

console.log('=== 1. CHECKING PRODUCT IMAGES ===');
let missingImages = 0;
products.forEach(p => {
  const checkImg = (imgUrl, context) => {
    if (!imgUrl) return;
    if (imgUrl.startsWith('http')) return;
    const localPath = path.join(publicDir, imgUrl.startsWith('/') ? imgUrl.slice(1) : imgUrl);
    if (!fs.existsSync(localPath)) {
      console.log(`[MISSING IMAGE] Product ${p.id} (${p.titleBn}) - ${context}: ${imgUrl}`);
      missingImages++;
    }
  };

  checkImg(p.imageUrl, 'primary imageUrl');
  if (Array.isArray(p.galleryImages)) {
    p.galleryImages.forEach((img, i) => checkImg(img, `gallery[${i}]`));
  }
});
console.log('Total checked products:', products.length);
console.log('Total missing product images:', missingImages);

console.log('\n=== 2. CHECKING HERO BANNERS ===');
let missingHero = 0;
(db.heroBanners || []).forEach(b => {
  const checkHeroImg = (url, type) => {
    if (!url) return;
    const localPath = path.join(publicDir, url.startsWith('/') ? url.slice(1) : url);
    if (!fs.existsSync(localPath)) {
      console.log(`[MISSING HERO] Banner ${b.id} - ${type}: ${url}`);
      missingHero++;
    }
  };
  checkHeroImg(b.bgImageUrl, 'desktop');
  checkHeroImg(b.mobileBgImageUrl, 'mobile');
});
console.log('Total missing hero banner images:', missingHero);

console.log('\n=== 3. CHECKING CATEGORIES DATA ===');
const categories = ['door', 'wood', 'bed', 'dining-table', 'sofa', 'tea-table', 'furniture', 'custom-design'];
const catCounts = {};
categories.forEach(c => catCounts[c] = 0);
products.forEach(p => {
  if (catCounts[p.category] !== undefined) {
    catCounts[p.category]++;
  } else {
    console.log(`[UNKNOWN CATEGORY] Product ${p.id} has category: ${p.category}`);
  }
});
console.log('Category product counts:', catCounts);

console.log('\n=== 4. CHECKING CATEGORIES IN CATEGORIES.TS ===');
import('../src/lib/categories.js').catch(async () => {
  // If compiled or import fail, read file directly
  const content = fs.readFileSync('./src/lib/categories.ts', 'utf8');
  const matches = content.match(/\/images\/[^\s'"]+/g) || [];
  let missingCatImg = 0;
  matches.forEach(url => {
    const localPath = path.join(publicDir, url.startsWith('/') ? url.slice(1) : url);
    if (!fs.existsSync(localPath)) {
      console.log(`[MISSING CATEGORY IMAGE] in categories.ts: ${url}`);
      missingCatImg++;
    }
  });
  console.log('Total checked image paths in categories.ts:', matches.length);
  console.log('Total missing category images:', missingCatImg);
});
