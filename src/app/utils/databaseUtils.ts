import prisma from '@/prisma';
import { User } from '@prisma/client';

export async function createEmail(email: string) {
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

export async function getUser(uid: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      uid: uid,
    },
  });
}
