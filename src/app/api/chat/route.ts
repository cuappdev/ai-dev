import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // const { uuid, message } = await request.json();
  // if (!uuid || !message) {
  //   return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  // }
  console.log(request);
  return NextResponse.json({ success: true });
}
