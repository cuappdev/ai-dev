'use client';

// import ChatHistoryNavbar from "@/app/components/ChatHistoryNavbar";
import ChatHeader from "./ChatHeader";

export default function InitialChatPage() {
  return (
    <div className="flex flex-row gap-0 w-full">
      {/* <div className="w-2/12">
        <ChatHistoryNavbar />
      </div> */}

      <div className="w-full">
        <ChatHeader />
      </div>
    </div>
  )
}
