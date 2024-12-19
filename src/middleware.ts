import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 403,
      statusText: 'Forbidden',
    });
  }

  const response = NextResponse.next();

  response.headers.set('Access-Control-Allow-Origin', origin || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
