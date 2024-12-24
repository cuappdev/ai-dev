'use client';

import ChatHistoryNavbar from '@/app/components/chatHistory/ChatHistoryNavbar';
import ChatHeader from './chat/ChatHeader';
import InputField from './InputField';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

export default function InitialChatPage() {
  const { user } = useAuth();
  const [isNavbarOpen, setIsNavbarOpen] = useState(!(window.innerWidth < 768));
  const firstName = user!.displayName!.split(' ')[0];
  const router = useRouter();

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleInitialSendMessage = (message: string) => {
    // TODO: Add the chat and message to the database
    const chatId = uuidv4();
    // Delete, needed for linter
    console.log(`Message: ${message}`);
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className="flex h-svh flex-row gap-0">
      <div
        className={`flex-shrink-0 overscroll-none bg-black transition-all duration-300 ${isNavbarOpen ? 'w-64' : 'w-0'}`}
      >
        <ChatHistoryNavbar toggleNavbar={toggleNavbar} isNavbarOpen={isNavbarOpen} />
      </div>

      <button
        onClick={toggleNavbar}
        className={`fixed left-8 top-4 -translate-x-1/2 transform p-2 transition-colors duration-300 ${isNavbarOpen ? 'hidden' : 'block'}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6 text-black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <div className="flex w-full flex-col">
        <ChatHeader />
        <div className="m-auto mt-10 flex w-4/5 flex-grow flex-col gap-3">
          <span className="text-7xl font-semibold">{`Hello, ${firstName}`}</span>
          <span className="text-3xl font-semibold text-primaryColor">
            How can I help you today?
          </span>
        </div>

        <div className="mb-10">
          <InputField messageStreaming={false} onSubmit={handleInitialSendMessage} />
        </div>
      </div>
    </div>
  );
}
