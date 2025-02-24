import { getUserByUid, updateUserEmailByUid, upsertUser } from '@/app/utils/databaseUtils';
import { validateHeaders } from '@/app/utils/requestUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const validatedHeaders = await validateHeaders(request);
  if (validatedHeaders instanceof NextResponse) {
    return validatedHeaders;
  }

  const { uid, email } = validatedHeaders;
  let user = await getUserByUid(uid);

  // User was created before
  if (user) {
    if (user.email === email) {
      return NextResponse.json({ user: user }, { status: 200 });
    }

    // User changed their email
    const newUser = await updateUserEmailByUid(uid, email);
    return NextResponse.json({ user: newUser }, { status: 200 });
  }

  // User was not created - either create a new user for non-Appdev or update uid of AppDev user
  user = await upsertUser(email, uid);
  return NextResponse.json({ user: user }, { status: 201 });
}
