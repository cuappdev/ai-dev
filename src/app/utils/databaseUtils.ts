import prisma from '@/prisma';
import { Email } from '@prisma/client';

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

export async function upsertUserFromEmail(email: Email, uid: string) {
  return await prisma.user.upsert({
    where: {
      uid: uid,
    },
    create: {
      uid: uid,
      emailId: email.id,
    },
    update: {
      emailId: email.id,
    },
  });
}

export async function getUser(uid: string) {
  return await prisma.user.findUnique({
    where: {
      uid: uid,
    },
  });
}
