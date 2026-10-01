import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin, clearAdminAuthResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const isAuth = isAuthenticatedAdmin(request);
  return NextResponse.json({ authenticated: isAuth });
}

export async function POST() {
  return clearAdminAuthResponse();
}
