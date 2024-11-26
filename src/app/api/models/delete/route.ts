import { NextRequest, NextResponse } from "next/server";
import { cloneRequest } from "@/app/util/requestUtils";

export async function DELETE(request: NextRequest) {
  const url: string = `${process.env.OLLAMA_ENDPOINT}api/delete`;
  const clonedResponse: NextResponse = await cloneRequest(request, url);
  return clonedResponse;
}
