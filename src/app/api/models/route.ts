import { cloneRequest, validateAppDev } from '@/app/utils/requestUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const url: string = '/api/chat';
  const clonedResponse: NextResponse = await cloneRequest(request, url);
  return clonedResponse;
}

export async function DELETE(request: NextRequest) {
  const appDevValidation = await validateAppDev(request);
  if (appDevValidation instanceof NextResponse) {
    return appDevValidation;
  }

  const url: string = '/api/delete';
  const clonedResponse: NextResponse = await cloneRequest(request, url);
  return clonedResponse;
}
