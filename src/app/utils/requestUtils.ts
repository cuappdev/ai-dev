// import { getUserByUid } from './databaseUtils';
import { notionDispatch } from './notionUtils';
import { NextRequest, NextResponse } from 'next/server';

export async function createClonedRequest(request: NextRequest) {
  const originalBody =
    request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.clone().text()
      : undefined;

  let parsedBody = originalBody ? JSON.parse(originalBody) : undefined;
  let lastMessage = parsedBody?.messages?.[parsedBody.messages.length - 1]?.content;
  let updatedLastMessage = originalBody ? await notionDispatch(lastMessage) : undefined;

  if (parsedBody?.messages && updatedLastMessage !== undefined) {
    parsedBody.messages[parsedBody.messages.length - 1].content = updatedLastMessage;
  }

  const updatedBody = JSON.stringify(parsedBody);

  const init: RequestInit = {
    method: request.method,
    headers: (() => {
      const headers = new Headers();
      request.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (['authorization', 'origin', 'referer', 'host', 'content-length'].includes(lowerKey)) {
          return;
        }
        headers.append(key, value);
      });
      headers.set('Content-Type', 'application/json');
      return headers;
    })(),
    body: updatedBody,
  };
  return init;
}

export async function cloneRequest(request: NextRequest, url: string) {
  const init: RequestInit = await createClonedRequest(request);

  try {
    let requestBody = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        requestBody = await request.json();
      } catch (error) {
        console.log('Error parsing request body:', error);
      }
    }

    console.log(
      `\nSending Request at ${new Date()}.\nURL: ${url}\nRequest: ${
        requestBody ? JSON.stringify(requestBody) : 'No body or invalid JSON'
      }\n`,
    );

    const clonedResponse = await fetch(`${process.env.OLLAMA_ENDPOINT}${url}`, init);

    if (!clonedResponse.ok || !clonedResponse.body) {
      throw new Error(await clonedResponse.json());
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
    console.log(`${error}\n`);
    return NextResponse.json({ error: `Ollama Error - ${error}` }, { status: 500 });
  }
}

export async function validateHeaders(request: NextRequest) {
  const uid = request.headers.get('uid');
  const email = request.headers.get('email');

  // If the middleware is passed with special token
  if (!uid || !email) {
    return NextResponse.json({ message: 'Apps cannot access this route' }, { status: 400 });
  }

  return { uid, email };
}

export async function validateAppDev(request: NextRequest) {
  // TODO: Uncomment this when done with AppDev member parser
  console.log(request);
  // const uid = request.headers.get('uid');

  // // User request
  // if (uid) {
  //   const user = await getUserByUid(uid);
  //   if (!user || !user.isAppDev) {
  //     // Not an appdev user
  //     return NextResponse.json(
  //       { message: 'Only AppDev users can use this feature' },
  //       { status: 403 },
  //     );
  //   }
  // }
  return {};
}
