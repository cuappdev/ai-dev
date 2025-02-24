import { getChatsByUid } from '@/app/utils/databaseUtils';
import { validateHeaders } from '@/app/utils/requestUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const validatedHeaders = await validateHeaders(request);
  if (validatedHeaders instanceof NextResponse) {
    return validatedHeaders;
  }

  const { uid } = validatedHeaders;
  const chats = await getChatsByUid(uid);
  return NextResponse.json({ chats: chats }, { status: 200 });
}
