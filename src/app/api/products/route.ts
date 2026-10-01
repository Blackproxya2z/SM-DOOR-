import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const species = searchParams.get('species');
    const featured = searchParams.get('featured');

    let products = db.getProducts();

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    if (species && species !== 'all') {
      products = products.filter(p => 
        p.defaultWoodSpeciesId === species || 
        p.woodVariants.some(v => v.speciesId === species)
      );
    }

    if (featured === 'true') {
      products = products.filter(p => p.isFeatured);
    }

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticatedAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.titleBn || !body.category || !body.defaultPrice) {
      return NextResponse.json({ success: false, error: 'Title, category, and default price are required' }, { status: 400 });
    }

    // Auto-generate FE Design number if missing
    let designNumber = body.designNumber;
    if (!designNumber) {
      const prefixMap: Record<string, string> = {
        'wood': 'FE-WOOD',
        'door': 'FE-DOOR',
        'furniture': 'FE-FURN',
        'dining-table': 'FE-DINING',
        'bed': 'FE-BED',
        'tea-table': 'FE-TEA',
        'sofa': 'FE-SOFA',
        'custom-design': 'FE-CUSTOM'
      };
      const catPrefix = prefixMap[body.category] || 'FE-ITEM';
      const existingCount = db.getProducts().filter(p => p.category === body.category).length;
      designNumber = `${catPrefix}-${String(existingCount + 1).padStart(3, '0')}`;
    }

    const saved = db.saveProduct({
      ...body,
      designNumber,
      id: body.id || `prod-${Date.now()}`,
      slug: body.slug || body.titleEn?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `item-${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Instant on-demand cache revalidation across website
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
      product: saved,
      messageBn: 'আপডেট সফল হয়েছে। ওয়েবসাইটে দেখা যাচ্ছে।',
      messageEn: 'Update successful. Changes are now live on website.'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
