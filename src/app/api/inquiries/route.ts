import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { checkRateLimit, InquiryFormSchema, safeLog } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticatedAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let inquiries = await db.getInquiriesAsync();
    if (status && status !== 'all') {
      inquiries = inquiries.filter(i => i.status === status);
    }

    return NextResponse.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    safeLog('Error fetching inquiries', { error: String(error) });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous';
    
    // Rate Limiting: 10 inquiries/quotes per hour per IP
    const rateCheck = checkRateLimit(`inquiry_${ip}`, 10, 60 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: `অনেক বেশি অনুরোধ জমা দেওয়া হয়েছে। অনুগ্রহ করে ${Math.ceil(rateCheck.retryAfterSeconds / 60)} মিনিট পর চেষ্টা করুন অথবা সরাসরি হোয়াটসঅ্যাপে যোগাযোগ করুন।` 
        },
        { 
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) }
        }
      );
    }

    const rawBody = await request.json();
    const parseResult = InquiryFormSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'অবৈধ তথ্য প্রদান করা হয়েছে।';
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const valid = parseResult.data;

    const newInquiry = db.createInquiry({
      customerName: valid.customerName,
      customerPhone: valid.customerPhone,
      customerWhatsApp: valid.customerWhatsApp || valid.customerPhone,
      customerDistrict: valid.customerDistrict || 'Not specified',
      deliveryAddress: valid.deliveryAddress || '',
      productType: valid.productType as any,
      woodSpeciesId: valid.woodSpeciesId || 'custom',
      woodSpeciesName: valid.woodSpeciesName || (valid.productType === 'quote-list' ? 'Multiple Products' : 'Custom Request'),
      qualityGrade: rawBody.qualityGrade || 'premium',
      preferredFinish: rawBody.preferredFinish || '',
      dimensions: valid.dimensions || {
        height: 81,
        width: 39,
        thickness: 1.5,
        unit: 'inch',
      },
      quantity: valid.quantity,
      polishPreference: (valid.polishPreference as any) || 'raw',
      notes: valid.notes || '',
      designImageUrl: valid.designImageUrl || '',
      estimatedCost: valid.estimatedCost,
    });

    safeLog('New inquiry submitted successfully', {
      id: newInquiry.id,
      phone: valid.customerPhone,
      type: valid.productType,
    });

    return NextResponse.json({ success: true, inquiry: newInquiry }, { status: 201 });
  } catch (error) {
    safeLog('Error creating inquiry', { error: String(error) });
    return NextResponse.json({ success: false, error: 'ইনকোয়ারি প্রক্রিয়া ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}
