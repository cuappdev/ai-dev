import { getUserByEmail, upsertUser } from '@/app/utils/databaseUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const email = request.headers.get('email');
  if (!email) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    await upsertUser(email);
  }
  // TODO: Return back user to frontend to store, should contain name, pfp, email, isAppDev
  return NextResponse.json({});
}
