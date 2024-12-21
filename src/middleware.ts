import { NextRequest, NextResponse } from "next/server";
// import adminAuth from "./firebase-admin-config";

export async function middleware(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      throw new Error('Bearer token is required');
    }

    // const firebaseUser = await adminAuth.verifyIdToken(token);
    // console.log(firebaseUser);
    // if (!firebaseUser) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Check if uid in database or special user

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export const config = {
  matcher: ['/api/models', '/api/models/copy', '/api/models/create', '/api/models/pull', '/api/users/:path', '/api/embed'],
};
