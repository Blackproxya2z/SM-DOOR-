import { NextRequest, NextResponse } from 'next/server';
import { db } from './db';
import { 
  generateSessionToken, 
  verifySessionToken, 
  checkRateLimit, 
  safeLog 
} from './security';

const ADMIN_COOKIE_NAME = 'sm_admin_session';

export function isAuthenticatedAdmin(request: NextRequest): boolean {
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (verifySessionToken(token)) {
      return true;
    }
  }

  // 2. Check HttpOnly Session Cookie
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME);
  if (cookie && verifySessionToken(cookie.value)) {
    return true;
  }

  // 3. Check custom admin PIN header (for direct CLI / debug testing)
  const pinHeader = request.headers.get('x-admin-pin');
  if (pinHeader && db.verifyAdminPin(pinHeader)) {
    return true;
  }

  return false;
}

export function createAdminAuthResponse(pinValid: boolean, adminId = 'admin'): NextResponse {
  if (!pinValid) {
    safeLog('Admin login failed: Invalid PIN/Password attempt');
    return NextResponse.json(
      { success: false, error: 'Invalid admin credentials' }, 
      { status: 401 }
    );
  }

  const token = generateSessionToken(adminId);
  safeLog('Admin login successful', { adminId });

  const response = NextResponse.json({ 
    success: true, 
    message: 'Authentication successful', 
    token 
  });

  // Secure HttpOnly session cookie
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return response;
}

export function clearAdminAuthResponse(): NextResponse {
  safeLog('Admin logged out');
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
