'use client';

import { usePathname } from "next/navigation";
import ChatMessage from "./chatMessage";
import Protected from "@/app/components/Protected";

export default function ChatPage() {
  const pathname = usePathname();
  const chatId = pathname.split("/")[2];

  return (
    <div>
      <Protected>
        <h1>Chat Page</h1>
        <h2>Chat ID: {chatId}</h2>
        <ChatMessage />
      </Protected>
    </div>
  );
}