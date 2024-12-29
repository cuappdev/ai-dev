import { NextRequest, NextResponse } from 'next/server';
import { getChatsByEmail } from '@/app/utils/databaseUtils';

export async function GET(request: NextRequest) {
  const email = request.headers.get('email');
  if (!email) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const chats = await getChatsByEmail(email);
  return NextResponse.json({ chats: chats });
}
