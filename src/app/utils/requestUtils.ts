import { NextRequest, NextResponse } from "next/server";

// TODO: Remove auth headers from cloned request
async function createClonedRequest(request: NextRequest) {
  const init: RequestInit = {
    method: request.method,
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.clone().text() : undefined,
  };
  return init;
}

export async function cloneRequest(request: NextRequest, url: string) {
  const init: RequestInit = await createClonedRequest(request);

  try {
    const clonedResponse = await fetch(`${process.env.OLLAMA_ENDPOINT}${url}`, init);

    // if (!clonedResponse.ok || !clonedResponse.body) {
    //   return NextResponse.json({ error: `Ollama API error: ${clonedResponse.statusText}` }, { status: clonedResponse.status });
    // }

    const headers = new Headers(clonedResponse.headers);
    const contentType = clonedResponse.headers.get('Content-Type');
    if (contentType) {
      headers.set('Content-Type', contentType);
    } else {
      headers.set('Content-Type', 'application/json');
    }

    const transferEncoding = clonedResponse.headers.get('Transfer-Encoding');
    if (transferEncoding) {
      headers.set('Transfer-Encoding', transferEncoding);
    }

    return new NextResponse(clonedResponse.body, { headers });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
