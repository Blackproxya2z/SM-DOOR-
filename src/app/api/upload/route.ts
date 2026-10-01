import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { checkRateLimit, safeLog } from '@/lib/security';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

// Magic byte verification to prevent polyglot / extension spoofing attacks
function isValidImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 8) return false;

  // JPEG magic bytes: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true;
  }

  // WebP magic bytes: "RIFF" .... "WEBP"
  const riff = buffer.toString('ascii', 0, 4);
  const webp = buffer.toString('ascii', 8, 12);
  if (riff === 'RIFF' && webp === 'WEBP') {
    return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown_ip';
    
    // Rate Limiting: 20 uploads per hour per IP
    const rate = checkRateLimit(`upload_${ip}`, 20, 60 * 60 * 1000);
    if (!rate.allowed) {
      safeLog('Upload rate limit triggered', { ip });
      return NextResponse.json(
        { 
          success: false, 
          error: `অনেক বেশি ফাইল আপলোড করা হয়েছে। অনুগ্রহ করে ${Math.ceil(rate.retryAfterSeconds / 60)} মিনিট পর চেষ্টা করুন।` 
        }, 
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'কোনো ফাইল আপলোড করা হয়নি।' }, { status: 400 });
    }

    // 1. File size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'ছবির সাইজ অবশ্যই ৫ মেগাবাইটের কম হতে হবে।' }, 
        { status: 400 }
      );
    }

    // 2. MIME type check
    const mime = file.type.toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(mime)) {
      return NextResponse.json(
        { success: false, error: 'শুধুমাত্র JPG, PNG বা WebP ছবি আপলোড করা যাবে।' }, 
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Magic bytes validation (verifies real image structure)
    if (!isValidImageMagicBytes(buffer)) {
      safeLog('Upload rejected: Invalid magic bytes detected', { mime });
      return NextResponse.json(
        { success: false, error: 'ফাইলটির গঠন সঠিক ছবির মতো নয়। অন্য ছবি দিয়ে চেষ্টা করুন।' }, 
        { status: 400 }
      );
    }

    // 4. Safe random filename with UUID (prevent path traversal & overwrite)
    let safeExt = 'jpg';
    if (mime === 'image/png') safeExt = 'png';
    else if (mime === 'image/webp') safeExt = 'webp';

    const safeFilename = `design_${Date.now()}_${crypto.randomUUID().substring(0, 8)}.${safeExt}`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadsDir, safeFilename), buffer);
      const publicUrl = `/uploads/${safeFilename}`;
      safeLog('File uploaded successfully', { filename: safeFilename, size: file.size });
      return NextResponse.json({ success: true, url: publicUrl, filename: safeFilename });
    } catch {
      // In serverless / read-only environment fallback to safe data URI
      const base64 = buffer.toString('base64');
      const dataUri = `data:${mime};base64,${base64}`;
      return NextResponse.json({ success: true, url: dataUri, filename: safeFilename });
    }
  } catch (error) {
    safeLog('File upload exception', { error: String(error) });
    return NextResponse.json({ success: false, error: 'ফাইল আপলোড ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}
