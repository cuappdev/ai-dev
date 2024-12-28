import { NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function GET() {
  await prisma.email.upsert({
    where: {
      email: 'aa2328@cornell.edu',
    },
    update: {},
    create: {
      email: 'aa2328@cornell.edu',
    },
  });

  const emails = await prisma.email.findMany();
  const users = await prisma.user.findMany();

  return NextResponse.json({ emails, users });
}
