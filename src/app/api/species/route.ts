import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const species = db.getSpecies();
    return NextResponse.json({ success: true, count: species.length, species });
  } catch (error) {
    console.error('Error fetching species:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticatedAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.nameBn || !body.currentRatePerCft) {
      return NextResponse.json({ success: false, error: 'Species name and rate per CFT are required' }, { status: 400 });
    }

    const saved = db.saveSpecies({
      ...body,
      id: body.id || `species-${Date.now()}`
    });

    return NextResponse.json({ success: true, species: saved }, { status: 201 });
  } catch (error) {
    console.error('Error saving species:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAuthenticatedAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Species ID is required' }, { status: 400 });
    }

    const saved = db.saveSpecies(body);
    return NextResponse.json({ success: true, species: saved });
  } catch (error) {
    console.error('Error updating species:', error);
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
      return NextResponse.json({ success: false, error: 'Species ID is required' }, { status: 400 });
    }

    const deleted = db.deleteSpecies(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error deleting species:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
