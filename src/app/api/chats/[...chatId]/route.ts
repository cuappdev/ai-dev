import { NextRequest, NextResponse } from 'next/server';
import { getMessagesByChatId } from '@/app/utils/databaseUtils';

export async function GET(request: NextRequest) {
  // TODO: Do Authorization check
  const uid = request.headers.get('uid');
  const chatId = request.nextUrl.pathname.split('/')[3];
  const messages = await getMessagesByChatId(chatId);
  return NextResponse.json({ messages: messages });
}
