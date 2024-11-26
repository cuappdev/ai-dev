import { NextRequest, NextResponse } from "next/server";
import { cloneRequest } from "@/app/util/requestUtils";

export async function POST(request: NextRequest) {
  const url: string = `${process.env.OLLAMA_ENDPOINT}api/create`;
  const clonedResponse: NextResponse = await cloneRequest(request, url);
  return clonedResponse;
}
