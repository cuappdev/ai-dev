import { NextRequest, NextResponse } from 'next/server';
import {
  createChat,
  createMessage,
  deleteChatById,
  getChatById,
  getChatsByEmail,
  getMessagesByChatId,
  updateChatTimestamp,
} from '@/app/utils/databaseUtils';

export async function GET(request: NextRequest) {
  const email = request.headers.get('email');
  if (!email) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const chatId = request.nextUrl.pathname.split('/')[3];
  const chat = await getChatById(chatId);
  if (!chat) {
    return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
  }

  if (chat.userEmail !== email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const messages = await getMessagesByChatId(chatId);
  return NextResponse.json({ messages: messages });
}

export async function POST(request: NextRequest) {
  const email = request.headers.get('email');
  if (!email) {
    return NextResponse.json({ message: 'No email' }, { status: 400 });
  }

  const chatId = request.nextUrl.pathname.split('/')[3];
  const { content, images, timestamp, sender } = await request.json();
  if (!content) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const chat = await getChatById(chatId);
  if (!chat) {
    await createChat(email, chatId, content, timestamp);
  }
  await createMessage(chatId, content, images, timestamp, sender);
  await updateChatTimestamp(chatId, timestamp);
  return NextResponse.json({});
}

export async function DELETE(request: NextRequest) {
  const email = request.headers.get('email');
  if (!email) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const chatId = request.nextUrl.pathname.split('/')[3];
  const chat = await getChatById(chatId);
  if (!chat) {
    return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
  }

  if (chat.userEmail !== email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await deleteChatById(chatId);
  return NextResponse.json({ chats: await getChatsByEmail(email) });
}
