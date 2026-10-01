import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const banners = db.getHeroBanners();
    return NextResponse.json({ success: true, count: banners.length, banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticatedAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await request.json();
    const saved = db.saveHeroBanner({
      ...body,
      id: body.id || `banner-${Date.now()}`
    });

    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.warn('Revalidation error:', e);
    }

    return NextResponse.json({ 
      success: true, 
      banner: saved,
      messageBn: 'আপডেট সফল হয়েছে। ওয়েবসাইটে দেখা যাচ্ছে।',
      messageEn: 'Update successful. Changes are now live on website.'
    });
  } catch (error) {
    console.error('Error saving banner:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAuthenticatedAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Banner ID is required' }, { status: 400 });
    }

    const deleted = db.deleteHeroBanner(id);
    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.warn('Revalidation error:', e);
    }

    return NextResponse.json({ 
      success: deleted,
      messageBn: 'ব্যানার মুছে ফেলা হয়েছে। ওয়েবসাইটে আপডেট হয়েছে।',
      messageEn: 'Banner removed. Changes are live on website.'
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
