import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/types/ApiError';

export async function createClonedRequest(request: NextRequest) {
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
  const init: RequestInit = await createClonedRequest(request);

  try {
    const clonedResponse = await fetch(
      `${process.env.OLLAMA_ENDPOINT}${url}`,
      init
    );

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

// export async function isUserInDatabase(firebaseUser: any) {
//   console.log(firebaseUser);
//   // TODO: Check if user is in database
//   // const uid = firebaseUser.uid;
//   // return NextResponse.json('You must be part of Cornell AppDev to use this app', { status: 403 });
//   return true;
// }
