import { NextRequest, NextResponse } from "next/server";
import { cloneRequest } from "@/app/utils/requestUtils";

export async function POST(request: NextRequest) {
  const url: string = `/api/chat`;
  const clonedResponse: NextResponse = await cloneRequest(request, url);
  return clonedResponse;  
}

export async function DELETE(request: NextRequest) {
  const url: string = `/api/delete`;
  const clonedResponse: NextResponse = await cloneRequest(request, url);
  return clonedResponse;
}
