import { NextRequest, NextResponse } from 'next/server';
import { cloneRequest } from '@/app/utils/requestUtils';

export async function POST(request: NextRequest) {
  const url: string = `/api/embed`;
  const clonedResponse: NextResponse = await cloneRequest(request, url);
  return clonedResponse;
}
