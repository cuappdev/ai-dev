import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma';

export async function GET() {
  const emails = await prisma.email.findMany();
  const users = await prisma.user.findMany();
  return NextResponse.json({ emails, users });
}
