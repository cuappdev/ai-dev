import { NextRequest, NextResponse } from "next/server";

// TODO: Remove auth headers from cloned request
export async function cloneRequest(request: NextRequest, url: string) {
  const init: RequestInit = {
    method: request.method,
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.clone().text() : undefined,
  };

  try {
    const clonedRequest = new Request(url, init);
    const clonedResponse = await fetch(clonedRequest);

    const clonedResponseBody = await clonedResponse.text();
    const headers = new Headers(clonedResponse.headers);
    const status = clonedResponse.status;

    return new NextResponse(clonedResponseBody, { headers, status });
  } catch (error) {
    console.error("Error in cloneRequest:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
