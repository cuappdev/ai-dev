import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT;

const ChatCompletionRequestSchema = z.object({
  model: z.string(),
  prompt: z.string(),
});

// const ChatCompletionResponseSchema = z.object({
//     model: z.string(),
//     created_at: z.string(),
//     response: z.string(),
//     done: z.boolean(),
// });

export async function GET() {
  const response = await fetch(`${OLLAMA_ENDPOINT}${"api/generate"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.2:1b",
      prompt: "Hi",
      stream: false,
    }),
  });

  return NextResponse.json(await response.json());
}


export async function POST(request: NextRequest) {
  const body = await request.json();
  const chatCompletion = ChatCompletionRequestSchema.safeParse(body);
  if (!chatCompletion.success) {
    return NextResponse.json( chatCompletion.error.errors, { status: 400 });
  }

  const response = await fetch(`${OLLAMA_ENDPOINT}${"/api/generate"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: chatCompletion.data.model,
      prompt: chatCompletion.data.prompt,
      stream: false,
    }),
  });
  return NextResponse.json(await response.json());
}
