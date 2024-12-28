import { NextRequest, NextResponse } from 'next/server';
import {
  deleteChatById,
  getChatsByUserId,
  getChatById,
  createChatWithMessage,
} from '@/app/utils/databaseUtils';

export async function GET(request: NextRequest) {
  const uid = request.headers.get('uid');
  const chats = await getChatsByUserId(uid!);
  return NextResponse.json({ chats: chats });
}

export async function POST(request: NextRequest) {
  const uid = request.headers.get('uid');
  const { chatId, message } = await request.json();
  if (!chatId || !message) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  await createChatWithMessage(uid!, chatId, message);
  return NextResponse.json({});
}

export async function DELETE(request: NextRequest) {
  const uid = request.headers.get('uid');
  const { chatId } = await request.json();
  if (!chatId) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const chat = await getChatById(chatId);
  if (!chat) {
    return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
  }

  if (chat.userId !== uid) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await deleteChatById(chatId);
  return NextResponse.json({ chats: await getChatsByUserId(uid!) });
}
