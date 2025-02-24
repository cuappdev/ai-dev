import {
  getChatsByUid,
  getChatById,
  getChatWithMessagesById,
  createChat,
  updateChatTimestamp,
  deleteChatById,
  createMessage,
} from '@/app/utils/databaseUtils';
import { validateHeaders } from '@/app/utils/requestUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const validatedHeaders = await validateHeaders(request);
  if (validatedHeaders instanceof NextResponse) {
    return validatedHeaders;
  }

  const { uid } = validatedHeaders;
  const chatId = request.nextUrl.pathname.split('/')[3];
  const chat = await getChatWithMessagesById(chatId);

  // Not found
  if (!chat) {
    return NextResponse.json({}, { status: 404 });
  }

  // Forbidden
  if (chat.userId !== uid) {
    return NextResponse.json({}, { status: 403 });
  }

  return NextResponse.json({ chat: chat });
}

export async function POST(request: NextRequest) {
  const validatedHeaders = await validateHeaders(request);
  if (validatedHeaders instanceof NextResponse) {
    return validatedHeaders;
  }

  const { uid } = validatedHeaders;
  const chatId = request.nextUrl.pathname.split('/')[3];

  // TODO: Add validation for message requests
  const { content, images, sender } = await request.json();
  if (!content) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  // Create chat if it doesn't exist
  let chat = await getChatById(chatId);
  if (!chat) {
    chat = await createChat(uid, chatId, content);
  }

  const timestamp = new Date();
  await createMessage(chatId, content, images, timestamp, sender);
  await updateChatTimestamp(chatId, timestamp);
  return NextResponse.json({ chat: await getChatWithMessagesById(chatId) }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const validatedHeaders = await validateHeaders(request);
  if (validatedHeaders instanceof NextResponse) {
    return validatedHeaders;
  }

  const { uid } = validatedHeaders;
  const chatId = request.nextUrl.pathname.split('/')[3];
  const chat = await getChatWithMessagesById(chatId);

  // Not found
  if (!chat) {
    return NextResponse.json({}, { status: 404 });
  }

  // Forbidden
  if (chat.userId !== uid) {
    return NextResponse.json({}, { status: 403 });
  }

  await deleteChatById(chatId);
  return NextResponse.json({ chats: await getChatsByUid(uid) });
}
