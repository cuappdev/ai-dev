import { NextRequest, NextResponse } from 'next/server';
import { getEmail, upsertUserFromEmail } from '@/app/utils/databaseUtils';

export async function GET(request: NextRequest) {
  const uid = request.headers.get('uid');
  if (!uid) {
    return NextResponse.json({ message: 'No uid found' }, { status: 400 });
  }

  const userEmail = request.headers.get('email')!;
  const email = await getEmail(userEmail);
  if (!email) {
    return NextResponse.json(
      { message: 'Only Cornell AppDev members can use this app' },
      { status: 401 },
    );
  }

  const newUser = await upsertUserFromEmail(email, uid);
  return NextResponse.json({ success: true, user: newUser });
}
