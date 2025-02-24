import prisma from '@/prisma';
import { User, Chat, Message } from '@prisma/client';

export async function getUserByUid(uid: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      uid: uid,
    },
  });
}

export async function updateUserEmailByUid(uid: string, newEmail: string): Promise<User | null> {
  return await prisma.user.update({
    where: {
      uid: uid,
    },
    data: {
      email: newEmail,
    },
  });
}

export async function upsertUser(email: string, uid: string): Promise<User | null> {
  return await prisma.user.upsert({
    where: {
      email: email,
    },
    update: {
      uid: uid,
    },
    create: {
      uid: uid,
      email: email,
      isAppDev: false,
    },
  });
}

export async function getChatsByUid(uid: string): Promise<Chat[]> {
  return await prisma.chat.findMany({
    where: {
      userId: uid,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export async function getChatById(chatId: string): Promise<Chat | null> {
  return await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
  });
}

export async function getChatWithMessagesById(chatId: string): Promise<Chat | null> {
  return await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
    include: {
      messages: true,
    },
  });
}

export async function createChat(
  uid: string,
  chatId: string,
  summary: string,
): Promise<Chat | null> {
  return await prisma.chat.create({
    data: {
      id: chatId,
      summary: summary,
      user: {
        connect: {
          uid: uid,
        },
      },
    },
  });
}

export async function updateChatTimestamp(chatId: string, timestamp: Date): Promise<Chat | null> {
  return await prisma.chat.update({
    where: {
      id: chatId,
    },
    data: {
      updatedAt: timestamp,
    },
  });
}

// TODO: Test if cascade deletes all the messages
export async function deleteChatById(chatId: string): Promise<Chat | null> {
  return await prisma.chat.delete({
    where: {
      id: chatId,
    },
  });
}

export async function createMessage(
  chatId: string,
  content: string,
  images: string[],
  timestamp: Date,
  sender: string,
): Promise<Message | null> {
  return await prisma.message.create({
    data: {
      content: content,
      images: images,
      timestamp: timestamp,
      sender: sender,
      chat: {
        connect: {
          id: chatId,
        },
      },
    },
  });
}
