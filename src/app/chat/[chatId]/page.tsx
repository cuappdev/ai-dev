'use client';

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import ChatMessage from "./chatMessage";

export default function ChatPage() {
  const pathname = usePathname();
  const chatId = pathname.split("/")[2];

  return (
    <div>
      <Suspense>
        <h1>Chat Page</h1>
        <h2>Chat ID: {chatId}</h2>
        <ChatMessage />
      </Suspense>
    </div>
  );
}