'use client';

import ChatHistoryNavbar from "@/app/components/ChatHistoryNavbar";
import ChatHeader from "./ChatHeader";
import InputField from "./InputField";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function InitialChatPage() {
  const { user } = useAuth();
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const firstName = user!.displayName?.split(" ")[0];

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  }

  return (
    <div className="flex flex-row gap-0 w-full h-screen">
      <div
        className={`h-full bg-black transition-all duration-300 ${
          isNavbarOpen ? 'w-2/12' : 'w-0'
        } flex-shrink-0`}
      >
        <ChatHistoryNavbar toggleNavbar={toggleNavbar} isNavbarOpen={isNavbarOpen} />
      </div>

      <button onClick={toggleNavbar}
      className={`fixed top-4 left-8 transform -translate-x-1/2 p-2 transition-colors duration-300
        ${isNavbarOpen ? 'hidden' : 'block'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-black">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <div className="w-full flex flex-col">
        <ChatHeader />
        <div className="w-4/5 flex flex-grow flex-col gap-3 m-auto mt-10">
          <span className="font-semibold text-7xl">{`Hello, ${firstName}`}</span>
          <span className="text-primaryColor font-semibold text-3xl">How can I help you today?</span>
        </div>

        <div className="mb-10">
          <InputField />
        </div>
      </div>
    </div>
  );
}