'use client';

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useModel } from "@/contexts/ModelContext";
import { usePathname } from "next/navigation";
import { ChatCompletionRequest, ChatStreamCompletionResponse, Message } from "@/types/chat";
import Protected from "@/app/components/Protected";
import ChatHistoryNavbar from "@/app/components/ChatHistoryNavbar";
import ChatHeader from "@/app/components/ChatHeader";
import InputField from "@/app/components/InputField";
import ChatMessage from "@/app/components/ChatMessage";

export default function ChatPage() {
  const { user } = useAuth();
  const { selectedModel } = useModel();
  const [isNavbarOpen, setIsNavbarOpen] = useState(!(window.innerWidth < 768));
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageStreaming, setMessageStreaming] = useState(false);
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatId = pathname.split("/")[2];

  // TODO: Change title of page to summary of the chat on each page
  // TODO: Fix navbar toggle and rerendering
  // TODO: Fetch the chat from the server and load it into messages, then send a request to get the response if messages.length == 1
  
  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const createChatCompletionRequestBody = (message: string) => {
    const body: ChatCompletionRequest = {
      model: selectedModel,
      stream: true,
      messages: [...(messages.map((message) => ({
        role: message.sender === user!.displayName ? "user" : "assistant",
        content: message.content,
        images: message.images
      }))),
        {
          role: "user",
          content: message
        }
      ]
    };
    return body;
  }

  const sendStreamedMessage = async (message: string) => {
    const body = createChatCompletionRequestBody(message);
    try {
      const initialResponse = await fetch(`/api/models`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
      });

      if (!initialResponse.ok || !initialResponse.body) {
        const data = await initialResponse.json();
        throw new Error(data.error || 'Failed to send message.');
      }

      const reader = initialResponse.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let streamedMessage = '';

      while (true) {
        const data = await reader.read();
        const response: ChatStreamCompletionResponse = JSON.parse(decoder.decode(data.value, { stream: true }));
        if (response.done) {
          break;
        }

        streamedMessage += response!.message!.content;

        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.sender !== user!.displayName!) {
            lastMessage.content += response!.message!.content;
            return [...prevMessages.slice(0, -1),
              {
                ...lastMessage,
                content: streamedMessage
              }
            ]
          } else {
            return [...prevMessages, {
              id: `${messages.length + 1}`,
              chatId: chatId,
              content: streamedMessage,
              timestamp: new Date().toLocaleString(),
              sender: selectedModel
            }];
          }
        })
      }
    } catch (error) {
      const errorMessage = {
        id: `${messages.length + 1}`,
        chatId: chatId,
        content: `The following error occurred while processing your request:\n${error}\n Please try again.`,
        timestamp: new Date().toLocaleString(),
        sender: selectedModel
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setMessageStreaming(false);
    }
  }

  const processSubmit = async (message: string) => {
    const userMessage: Message = {
      id: `${messages.length}`,
      chatId: chatId,
      content: message,
      timestamp: new Date().toLocaleString(),
      sender: user!.displayName!
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessageStreaming(true);
    sendStreamedMessage(message);
  }

  return (
    <Protected>
      <div className="flex flex-row gap-0 w-full h-screen">
        <div className={`bg-black transition-all duration-300 flex-shrink-0 overflow-y-auto ${isNavbarOpen ? 'w-64' : 'w-0'}`}>
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

          <div className="w-4/5 flex flex-grow flex-col gap-3 m-auto mt-10 mb-10 overflow-y-scroll no-scrollbar">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="mb-10">
            <InputField onSubmit={processSubmit} messageStreaming={messageStreaming} />
          </div>

        </div>
      </div>
    </Protected>
  );
}
