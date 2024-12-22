import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Middleware handles auth, if it succeeds return 200
  console.log('GET /api/authenticate');
  console.log(request.headers.get('uid'));
  return NextResponse.json({ success: true });
}
