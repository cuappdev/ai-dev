import { NextResponse } from 'next/server';

export async function GET() {
  // Middleware handles auth, if it succeeds return 200
  return NextResponse.json({ success: true });
}
