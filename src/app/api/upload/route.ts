import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { checkRateLimit, safeLog } from '@/lib/security';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // Allow phone photos up to 15MB since sharp compresses them

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
    
    // Rate Limiting: 30 uploads per hour per IP
    const rate = checkRateLimit(`upload_${ip}`, 30, 60 * 60 * 1000);
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

    // 1. File size check (15MB raw max)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'ছবির সাইজ অবশ্যই ১৫ মেগাবাইটের কম হতে হবে।' }, 
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    // 2. Validate magic bytes if JPEG/PNG/WebP
    if (!isValidImageMagicBytes(rawBuffer)) {
      safeLog('Upload rejected: Invalid magic bytes detected');
      return NextResponse.json(
        { success: false, error: 'ফাইলটির গঠন সঠিক ছবির মতো নয়। অন্য ছবি দিয়ে চেষ্টা করুন।' }, 
        { status: 400 }
      );
    }

    // 3. Automated Server-Side Optimization via Sharp:
    // - Auto-rotates using EXIF orientation (crucial for phone photos taken vertically)
    // - Resizes to max 1200px width/height while maintaining aspect ratio
    // - Strips EXIF GPS metadata for privacy
    // - Compresses to lightweight modern WebP format
    let optimizedBuffer: Buffer;
    let imageInfo: {
      width?: number;
      height?: number;
      format?: string;
      size?: number;
      channels?: number;
      premultiplied?: boolean;
    };

    try {
      const transformPipeline = sharp(rawBuffer)
        .rotate() // Auto-orient phone photos
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({
          quality: 82,
          effort: 4
        });

      const { data, info } = await transformPipeline.toBuffer({ resolveWithObject: true });
      optimizedBuffer = data;
      imageInfo = info;
    } catch (sharpError) {
      safeLog('Sharp processing error, falling back to raw buffer', { error: String(sharpError) });
      optimizedBuffer = rawBuffer;
      imageInfo = {
        format: 'webp',
        size: rawBuffer.length,
        width: 0,
        height: 0,
        channels: 3,
        premultiplied: false
      };
    }

    // 4. Safe random filename with .webp extension
    const safeFilename = `farhan_${Date.now()}_${crypto.randomUUID().substring(0, 8)}.webp`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadsDir, safeFilename), optimizedBuffer);
      const publicUrl = `/uploads/${safeFilename}`;
      safeLog('File uploaded and optimized successfully', { 
        filename: safeFilename, 
        originalSize: file.size, 
        optimizedSize: optimizedBuffer.length,
        reductionPercent: Math.round((1 - optimizedBuffer.length / file.size) * 100)
      });

      return NextResponse.json({ 
        success: true, 
        url: publicUrl, 
        filename: safeFilename,
        width: imageInfo.width,
        height: imageInfo.height,
        format: 'webp',
        originalSize: file.size,
        optimizedSize: optimizedBuffer.length
      });
    } catch {
      // In serverless / read-only environment fallback to optimized WebP data URI
      const base64 = optimizedBuffer.toString('base64');
      const dataUri = `data:image/webp;base64,${base64}`;
      return NextResponse.json({ 
        success: true, 
        url: dataUri, 
        filename: safeFilename,
        format: 'webp',
        optimizedSize: optimizedBuffer.length
      });
    }
  } catch (error) {
    safeLog('File upload exception', { error: String(error) });
    return NextResponse.json({ success: false, error: 'ফাইল আপলোড ও প্রসেসিং ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}
