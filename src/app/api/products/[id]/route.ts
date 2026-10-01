import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = db.getProductById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAuthenticatedAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await request.json();
    const updated = db.saveProduct({
      ...body,
      id: params.id,
      updatedAt: new Date().toISOString()
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/doors');
      revalidatePath('/catalog');
      revalidatePath('/categories');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ 
      success: true, 
      product: updated,
      messageBn: 'আপডেট সফল হয়েছে। ওয়েবসাইটে দেখা যাচ্ছে।',
      messageEn: 'Update successful. Changes are now live on website.'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAuthenticatedAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const success = db.deleteProduct(params.id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Product not found or already deleted' }, { status: 404 });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/doors');
      revalidatePath('/catalog');
      revalidatePath('/categories');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully',
      messageBn: 'ডিজাইন সফলভাবে মুছে ফেলা হয়েছে। ওয়েবসাইটে আর দেখা যাবে না।',
      messageEn: 'Item deleted successfully. Changes are live on website.'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
