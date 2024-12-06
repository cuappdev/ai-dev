import { NextRequest, NextResponse } from "next/server";
import { cloneRequest } from "@/app/utils/requestUtils";

export async function GET(request: NextRequest) {
  const url: string = `/api/tags`;
  const clonedResponse: NextResponse = await cloneRequest(request, url);
  return clonedResponse;
}
