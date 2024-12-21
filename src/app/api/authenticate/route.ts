import { NextRequest, NextResponse } from "next/server";
import adminAuth from "../../../firebase-admin-config";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = body.token;
  
  if (!token) {
    throw new Error("Token is required");
  }

  try {
    const firebaseUser = await adminAuth.verifyIdToken(token);

    // TODO: Check if in database or special user
    console.log(firebaseUser);
    // const uid = firebaseUser.uid;
    // return NextResponse.json('You must be part of Cornell AppDev to use this app', { status: 403 });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 400 });
  }
}
