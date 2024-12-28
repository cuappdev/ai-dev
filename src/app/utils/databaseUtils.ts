import prisma from '@/prisma';
import { Email, Message, User } from '@prisma/client';

export async function createEmail(email: string): Promise<Email> {
  return await prisma.email.create({
    data: {
      email: email,
    },
  });
}

export async function getEmail(email: string) {
  return await prisma.email.findUnique({
    where: {
      email: email,
    },
  });
}

export async function deleteEmail(email: string) {
  return await prisma.email.delete({
    where: {
      email: email,
    },
  });
}

export async function getUserById(uid: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      uid: uid,
    },
  });
}

export async function getChatById(chatId: string) {
  return await prisma.chat.findUnique({
    where: {
      uuid: chatId,
    },
  });
}

// Order by timestamp
export async function getChatsByUserId(uid: string) {
  // return await prisma.chat.findMany({
  //   where: {
  //     userId: uid,
  //   },
  //   orderBy: {
  //     messages: {
  //       timestamp: 'desc',
  //     },
  //   },
  // });
  return await prisma.chat.findMany({
    where: {
      userId: uid,
    },
  });
}

export async function createChatWithMessage(uid: string, chatId: string, message: Message) {
  return await prisma.chat.create({
    data: {
      uuid: chatId,
      // TODO: Fix summary
      summary: message.content,
      userId: uid,
      messages: {
        create: {
          content: message.content,
          images: message.images,
          timestamp: message.timestamp,
          sender: message.sender,
        },
      },
    },
  });
}

export async function deleteChatById(chatId: string) {
  return await prisma.chat.delete({
    where: {
      uuid: chatId,
    },
  });
}

export async function getMessagesByChatId(chatId: string) {
  return await prisma.message.findMany({
    where: {
      chatId: chatId,
    },
  });
}
