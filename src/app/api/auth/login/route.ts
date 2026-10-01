import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createAdminAuthResponse } from '@/lib/auth';
import { checkRateLimit, AdminLoginSchema, safeLog } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown_ip';
    
    // Strict Rate Limiting: 5 login attempts per 15 minutes
    const rate = checkRateLimit(`login_${ip}`, 5, 15 * 60 * 1000);
    if (!rate.allowed) {
      safeLog('Rate limit triggered for admin login', { ip });
      return NextResponse.json(
        { 
          success: false, 
          error: `অনেক বেশি চেষ্টা করা হয়েছে। অনুগ্রহ করে ${Math.ceil(rate.retryAfterSeconds / 60)} মিনিট পর আবার চেষ্টা করুন। (Too many attempts. Retry later.)` 
        }, 
        { 
          status: 429,
          headers: { 'Retry-After': String(rate.retryAfterSeconds) }
        }
      );
    }

    const rawBody = await request.json();
    const parseResult = AdminLoginSchema.safeParse({
      pin: rawBody.pin || rawBody.password,
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'সঠিক পাসওয়ার্ড লিখুন (Password required).' }, 
        { status: 400 }
      );
    }

    const { pin } = parseResult.data;
    const isValid = db.verifyAdminPin(pin);
    return createAdminAuthResponse(isValid);
  } catch (error) {
    safeLog('Admin login exception', { error: String(error) });
    return NextResponse.json(
      { success: false, error: 'লগইন প্রক্রিয়া ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' }, 
      { status: 500 }
    );
  }
}
