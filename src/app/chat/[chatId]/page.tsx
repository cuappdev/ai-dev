'use client';

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useModel } from "@/contexts/ModelContext";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Protected from "@/app/components/Protected";
import ChatHistoryNavbar from "@/app/components/ChatHistoryNavbar";
import ChatHeader from "../../components/ChatHeader";
import InputField from "../../components/InputField";
import { ChatCompletionResponse, ChatMessage } from "@/types/chat";

export default function ChatPage() {
  const { user } = useAuth();
  const { selectedModel } = useModel();
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatId = pathname.split("/")[2];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  })

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Message copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const addMessage = (message: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  const handleSendMessage = async (message: string) => {
    // TODO: Add the chat and message to the database
    addMessage({
      id: `${messages.length}`,
      content: message,
      timestamp: new Date().toISOString(),
      sender: user!.displayName!.split(" ")[0]
    });

    await fetch(`http://localhost:3000/api/models`, {
      method: "POST",
      body: JSON.stringify({
        model: selectedModel,
        prompt: message,
        stream: false
      })
    }).then((data) => data.json())
      .then((response: ChatCompletionResponse) => 
        addMessage({
          id: `${messages.length + 1}`,
          content: response.response,
          timestamp: response.created_at,
          sender: selectedModel
        })
      )
    .catch((error) => {
      addMessage({
        id: `${messages.length + 1}`,
        content: "An error occurred while processing your request. Please try again.",
        timestamp: new Date().toISOString(),
        sender: "ollama"
      });
    });
  }

  return (
    <Protected>
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
          <div className="w-4/5 flex flex-grow flex-col gap-3 m-auto mt-10 mb-10 overflow-y-scroll">
            {messages.map((message, index) => (
              <div key={index} className="flex flex-row gap-2">
                <Image src={message.sender === user!.displayName!.split(" ")[0] ? user!.photoURL! : `/ollama.png`} width={40} height={40} alt={message.sender} className="rounded-full w-10 h-10 object-cover flex-shrink-0" />
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-2">
                    <span className="font-semibold text-lg">{message.sender}</span>
                    <svg onClick={() => handleCopy(message.content)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-gray-300 hover:text-gray-500 hover:cursor-pointer">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>
                  </div>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="mb-10">
            <InputField onSubmit={handleSendMessage} />
          </div>

        </div>
      </div>
    </Protected>
  );
}
