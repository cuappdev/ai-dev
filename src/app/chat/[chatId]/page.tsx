'use client';

import { usePathname } from "next/navigation";
import Protected from "@/app/components/Protected";
import ChatMessage from "./chatMessage";

export default function ChatPage() {
  const pathname = usePathname();
  const chatId = pathname.split("/")[2];

  return (
    <Protected>
      <div>
        <h1>Chat Page</h1>
        <h2>Chat ID: {chatId}</h2>
        <ChatMessage />
      </div>
    </Protected>
  );
}