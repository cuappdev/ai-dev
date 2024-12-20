import { NextRequest, NextResponse } from 'next/server';
import { cloneRequest, createClonedRequest } from '@/app/utils/requestUtils';

export const runtime = "edge";
export const dynamic = "force-dynamic";

// export async function POST(request: NextRequest) {
//   const url: string = `/api/chat`;
//   const clonedResponse: NextResponse = await cloneRequest(request, url);
//   return clonedResponse;
// }

export async function DELETE(request: NextRequest) {
  const url: string = `/api/delete`;
  const clonedResponse: NextResponse = await cloneRequest(request, url);
  return clonedResponse;
}

export async function POST(request: NextRequest) {
  const url: string = `/api/chat`;
  const encoder = new TextEncoder();
  console.log(url, request, createClonedRequest);

  const customReadable = new ReadableStream({
    async start(controller) {
      const data1 = { message: { content: "First data" }};
      const data2 = { message: { content: "Second data" }};
      const data3 = { message: { content: "Third data" }};
      const data4 = { message: { content: "Fourth data" }};
      // Send the first data, then wait 3 seconds and then enque the next
      controller.enqueue(encoder.encode(JSON.stringify(data1) + '\n'));
      await new Promise((resolve) => setTimeout(resolve, 3000));
      controller.enqueue(encoder.encode(JSON.stringify(data2) + '\n'));
      await new Promise((resolve) => setTimeout(resolve, 3000));
      controller.enqueue(encoder.encode(JSON.stringify(data3) + '\n'));
      await new Promise((resolve) => setTimeout(resolve, 3000));
      controller.enqueue(encoder.encode(JSON.stringify(data4) + '\n'));


      // const init: RequestInit = await createClonedRequest(request);

      // const clonedResponse = await fetch(
      //   `${process.env.OLLAMA_ENDPOINT}${url}`,
      //   init
      // );

      // if (!clonedResponse.ok || !clonedResponse.body) {
      //   return NextResponse.json({ error: `Ollama error: ${clonedResponse.statusText}` }, { status: clonedResponse.status });
      // };

      // const reader = clonedResponse.body!.getReader();
      // const decoder = new TextDecoder();

      // let buffer = '';
      // let done = false;

      // while (!done) {
      //   const { value, done: streamDone } = await reader.read();
      //   done = streamDone;
      //   buffer += decoder.decode(value, { stream: true });

      //   const lines = buffer.split(/\r?\n/);
      //   buffer = lines.pop() || '';

      //   for (const line of lines) {
      //     if (line.trim()) {
      //       try {
      //         const response = JSON.parse(line);
      //         controller.enqueue(encoder.encode(JSON.stringify(response) + '\n'));
      //         if (response.done) {
      //           done = true;
      //           break;
      //         }
      //       } catch (error) {
      //         controller.error(error);
      //         done = true;
      //       }
      //     }
      //   }
      // }

      // if (buffer.trim()) {
      //   try {
      //     const response = JSON.parse(buffer);
      //     controller.enqueue(encoder.encode(JSON.stringify(response) + '\n'));
      //   } catch (error) {
      //     controller.error(error);
      //   }
      // }

      controller.close();
    },
  });

  return new Response(customReadable, {
    headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}
