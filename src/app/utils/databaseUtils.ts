import prisma from '@/prisma';
import { User, Chat, Message } from '@prisma/client';

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

export async function upsertUser(email: string): Promise<User | null> {
  return await prisma.user.upsert({
    where: {
      email: email,
    },
    update: {
      isAppDev: false,
    },
    create: {
      email: email,
      isAppDev: false,
    },
  });
}

export async function getChatsByEmail(email: string): Promise<Chat[]> {
  return await prisma.chat.findMany({
    where: {
      userEmail: email,
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

export async function createChat(
  email: string,
  chatId: string,
  summary: string,
  updatedAt: Date,
): Promise<Chat | null> {
  return await prisma.chat.create({
    data: {
      id: chatId,
      summary: summary,
      updatedAt: updatedAt,
      user: {
        connect: {
          email: email,
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

// Cascade to delete all the messages
export async function deleteChatById(chatId: string): Promise<Chat | null> {
  return await prisma.chat.delete({
    where: {
      id: chatId,
    },
  });
}

export async function getMessagesByChatId(chatId: string): Promise<Message[]> {
  return await prisma.message.findMany({
    where: {
      chatId: chatId,
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
