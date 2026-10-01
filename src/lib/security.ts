import crypto from 'crypto';
import { z } from 'zod';

// ==========================================
// 1. DATA PROTECTION & LOG MASKING
// ==========================================

export function maskPhoneNumber(phone?: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length < 8) return '****';
  const prefix = cleaned.slice(0, 3);
  const suffix = cleaned.slice(-4);
  return `${prefix}****${suffix}`;
}

export function safeLog(message: string, meta?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'test') return;
  const sanitizedMeta: Record<string, unknown> = {};

  if (meta) {
    for (const [key, val] of Object.entries(meta)) {
      if (/password|pin|secret|token|cookie/i.test(key)) {
        sanitizedMeta[key] = '[REDACTED]';
      } else if (/phone|mobile|whatsapp/i.test(key) && typeof val === 'string') {
        sanitizedMeta[key] = maskPhoneNumber(val);
      } else {
        sanitizedMeta[key] = val;
      }
    }
  }

  // Server-side logging without sensitive leaks
  console.log(`[SM_SECURITY_LOG] ${new Date().toISOString()} - ${message}`, sanitizedMeta);
}

// ==========================================
// 2. CENTRALIZED RATE LIMITER (DDoS & ABUSE MITIGATION)
// ==========================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodic cleanup to avoid memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((entry, key) => {
      if (now > entry.resetAt) {
        rateLimitStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
  };
}

// ==========================================
// 3. CRYPTOGRAPHIC TOKEN & SESSION SECURITY
// ==========================================

const SESSION_SECRET = process.env.SESSION_SECRET || 'sm_door_production_session_secure_key_default_9921';

export function generateSessionToken(adminId = 'admin'): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = `${adminId}:${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

export function verifySessionToken(tokenString: string): boolean {
  try {
    const decoded = Buffer.from(tokenString, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;

    const [adminId, expiresAtStr, signature] = parts;
    const expiresAt = Number(expiresAtStr);

    if (Date.now() > expiresAt) {
      return false; // Expired
    }

    const expectedPayload = `${adminId}:${expiresAt}`;
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(expectedPayload)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
}

// Secure hash verification for admin PIN/password
export function hashPassword(plainText: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(plainText, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(plainText: string, storedHashOrPlain: string): boolean {
  if (!storedHashOrPlain) return false;

  // If already hashed in salt:hash format
  if (storedHashOrPlain.includes(':')) {
    const [salt, key] = storedHashOrPlain.split(':');
    const testHash = crypto.scryptSync(plainText, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(testHash, 'hex'));
  }

  // Fallback for default seed pins with constant-time equality
  const a = Buffer.from(plainText);
  const b = Buffer.from(storedHashOrPlain);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ==========================================
// 4. ZOD INPUT VALIDATION SCHEMAS
// ==========================================

export const ContactFormSchema = z.object({
  customerName: z.string().trim().min(2, 'নাম অন্তত ২ অক্ষরের হতে হবে').max(100),
  customerPhone: z.string().trim().min(6, 'সঠিক ফোন নম্বর প্রদান করুন').max(30),
  notes: z.string().trim().min(3, 'বার্তা লিখুন').max(2000),
  productType: z.string().optional().default('contact'),
});

export const InquiryFormSchema = z.object({
  customerName: z.string().trim().min(2, 'নাম আবশ্যক').max(100),
  customerPhone: z.string().trim().min(6, 'ফোন নম্বর আবশ্যক').max(30),
  customerWhatsApp: z.string().trim().max(30).optional(),
  customerDistrict: z.string().trim().max(100).optional(),
  deliveryAddress: z.string().trim().max(255).optional(),
  productType: z.enum([
    'door', 
    'bed', 
    'dining-table', 
    'tea-table', 
    'sofa', 
    'furniture', 
    'wood', 
    'frame', 
    'timber', 
    'quote-list', 
    'contact', 
    'other'
  ]).default('door'),
  woodSpeciesId: z.string().max(50).optional().default('custom'),
  woodSpeciesName: z.string().max(100).optional().default('Custom Choice'),
  dimensions: z
    .object({
      height: z.number().nonnegative().max(500).default(81),
      width: z.number().nonnegative().max(500).default(39),
      thickness: z.number().nonnegative().max(50).default(1.5),
      unit: z.enum(['inch', 'feet']).default('inch'),
    })
    .optional(),
  quantity: z.number().int().min(1).max(500).default(1),
  polishPreference: z.string().max(50).optional(),
  notes: z.string().max(3000).optional(),
  designImageUrl: z.string().max(2000).optional(),
  estimatedCost: z.number().nonnegative().max(10000000).optional(),
  items: z.array(z.any()).optional(),
});

export const AdminLoginSchema = z.object({
  pin: z.string().min(4, 'PIN/Password must be at least 4 characters').max(100),
});
