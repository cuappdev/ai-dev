import { NextRequest, NextResponse } from 'next/server';

// TODO: Remove auth headers from cloned request
async function createClonedRequest(request: NextRequest) {
  const init: RequestInit = {
    method: request.method,
    headers: (() => {
      const headers = new Headers();
      request.headers.forEach((value, key) => {
        if (['authorization', 'origin', 'referer', 'host'].includes(key.toLowerCase())) {
          return;
        }
        headers.append(key, value);
      });
      return headers;
    })(),
    body:
      request.method !== 'GET' && request.method !== 'HEAD'
        ? await request.clone().text()
        : undefined,
  };
  return init;
}

export async function cloneRequest(request: NextRequest, url: string) {
  console.log(`Hitting ${process.env.OLLAMA_ENDPOINT}${url} with inital request:`, request);
  const init: RequestInit = await createClonedRequest(request);

  try {
    console.log('Cloned request method:', init.method);
    console.log('Cloned request headers:', init.headers);
    console.log('Cloned request body:', init.body);
    const clonedResponse = await fetch(
      `${process.env.OLLAMA_ENDPOINT}${url}`,
      init
    );
    console.log('Cloned response headers:', clonedResponse.headers);
    console.log('Cloned response status:', clonedResponse.status);
    console.log('Cloned response status text:', clonedResponse.statusText);
    console.log('Cloned response body:', clonedResponse.body);

    if (!clonedResponse.ok || !clonedResponse.body) {
      return NextResponse.json({ error: `Ollama error: ${clonedResponse.statusText}` }, { status: clonedResponse.status });
    }

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

    return new NextResponse(clonedResponse.body, {
      headers,
      status: clonedResponse.status,
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
