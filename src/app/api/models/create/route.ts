import { cloneRequest, validateAppDev } from '@/app/utils/requestUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const appDevValidation = await validateAppDev(request);
  if (appDevValidation instanceof NextResponse) {
    return appDevValidation;
  }

  const url: string = '/api/create';
  const clonedResponse: NextResponse = await cloneRequest(request, url);
  return clonedResponse;
}
