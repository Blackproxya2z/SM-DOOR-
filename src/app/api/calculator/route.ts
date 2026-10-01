import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { calculateSawnTimberCFT, calculateWoodLogCFT, calculateDoorFrame } from '@/lib/calculator';

export async function GET() {
  try {
    const rates = db.getCalculatorRates();
    const species = db.getSpecies();
    return NextResponse.json({ success: true, rates, species });
  } catch (error) {
    console.error('Error fetching calculator rates:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'sawn_timber') {
      const result = calculateSawnTimberCFT(body);
      return NextResponse.json({ success: true, result });
    } else if (type === 'wood_log') {
      const result = calculateWoodLogCFT(body);
      return NextResponse.json({ success: true, result });
    } else if (type === 'door_frame') {
      const result = calculateDoorFrame(body);
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ success: false, error: 'Invalid calculation type' }, { status: 400 });
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json({ success: false, error: 'Calculation failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAuthenticatedAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await request.json();
    const updatedRates = db.updateCalculatorRates(body);

    return NextResponse.json({ success: true, rates: updatedRates });
  } catch (error) {
    console.error('Error updating rates:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
