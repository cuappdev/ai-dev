import { NextRequest, NextResponse } from "next/server";
import { cloneRequest } from "@/app/utils/requestUtils";

export async function DELETE(request: NextRequest) {
  const url: string = `${process.env.OLLAMA_ENDPOINT}api/delete`;
  const clonedResponse: NextResponse = await cloneRequest(request, url);
  return clonedResponse;
}
