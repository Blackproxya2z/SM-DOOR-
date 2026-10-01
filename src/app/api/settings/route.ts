import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const settings = db.getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error getting settings:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAuthenticatedAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await request.json();
    const updated = db.updateSiteSettings(body);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/contact');
      revalidatePath('/about');
      revalidatePath('/doors');
      revalidatePath('/catalog');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ 
      success: true, 
      settings: updated,
      messageBn: 'আপডেট সফল হয়েছে। ওয়েবসাইটে দেখা যাচ্ছে।',
      messageEn: 'Update successful. Changes are now live on website.'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
