'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useModel } from '@/contexts/ModelContext';
import { usePathname } from 'next/navigation';
import {
  ChatCompletionRequest,
  ChatStreamCompletionResponse,
  FileComponent,
  Message,
} from '@/types/chat';
import Protected from '@/app/components/Protected';
import ChatMenuNavbar from '@/app/components/chat/ChatMenuNavbar';
import ChatHeader from '@/app/components/chat/ChatHeader';
import InputField from '@/app/components/InputField';
import ChatMessage from '@/app/components/chat/ChatMessage';

export default function ChatPage() {
  const { user } = useAuth();
  const { selectedModel, fetchActiveModels } = useModel();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageStreaming, setMessageStreaming] = useState(false);
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatId = pathname.split('/')[2];

  // TODO: Change title of page to summary of the chat on each page
  // TODO: Fix navbar toggle and rerendering
  // TODO: Fetch the chat from the server and load it into messages, then send a request to get the response if messages.length == 1

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const createChatCompletionRequestBody = (message: string, files: FileComponent[]) => {
    const body: ChatCompletionRequest = {
      model: selectedModel,
      stream: true,
      messages: [
        ...messages.map((message) => ({
          role: message.sender === user!.displayName ? 'user' : 'assistant',
          content: message.content,
        })),
        {
          role: 'user',
          content: message,
          images: files.map((file) => file.base64.split(',')[1]),
        },
      ],
    };
    return body;
  };

  const sendStreamedMessage = async (message: string, files: FileComponent[]) => {
    const body = createChatCompletionRequestBody(message, files);
    try {
      const reader = await fetchChatResponse(body);
      await processStreamedResponse(reader);
    } catch (error: unknown) {
      displayError(error);
    } finally {
      setMessageStreaming(false);
    }
  };

  const fetchChatResponse = async (body: ChatCompletionRequest) => {
    const response = await fetch(`/api/models`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok || !response.body) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to send message.');
    }

    setMessages((prevMessages) => [...prevMessages.slice(0, -1)]);
    return response.body.getReader();
  };

  const processStreamedResponse = async (reader: ReadableStreamDefaultReader) => {
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let done = false;

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const response: ChatStreamCompletionResponse = JSON.parse(line);
            updateMessages(response);
            if (response.done) {
              done = true;
              break;
            }
          } catch (error) {
            displayError(error);
            done = true;
          }
        }
      }
    }

    if (buffer.trim()) {
      try {
        const response: ChatStreamCompletionResponse = JSON.parse(buffer);
        updateMessages(response);
      } catch (error) {
        displayError(error);
      }
    }
  };

  const updateMessages = (response: ChatStreamCompletionResponse) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage && lastMessage.sender !== 'user') {
        return [
          ...prevMessages.slice(0, -1),
          {
            ...lastMessage,
            content: lastMessage.content + response.message!.content,
          },
        ];
      } else {
        return [
          ...prevMessages,
          {
            id: `${messages.length + 1}`,
            chatId: chatId,
            content: response.message!.content,
            images: response.message!.images,
            timestamp: new Date().toLocaleString(),
            sender: selectedModel,
          },
        ];
      }
    });
  };

  const displayError = (error: unknown) => {
    if (error instanceof Error) {
      const errorMessage = {
        id: `${messages.length + 1}`,
        chatId: chatId,
        content: `${error.message}`,
        timestamp: new Date().toLocaleString(),
        sender: selectedModel,
      };
      setMessages((prevMessages) => [...prevMessages.slice(0, -1), errorMessage]);
    }
  };

  const processSubmit = async (message: string, files: FileComponent[]) => {
    const userMessage: Message = {
      id: `${messages.length}`,
      chatId: chatId,
      content: message,
      images: files.map((file) => file.base64),
      timestamp: new Date().toLocaleString(),
      sender: 'user',
    };

    const assistantMessage: Message = {
      id: `${messages.length + 1}`,
      chatId: chatId,
      content: ``,
      timestamp: new Date().toLocaleString(),
      sender: selectedModel,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage, assistantMessage]);
    setMessageStreaming(true);
    sendStreamedMessage(message, files);
  };

  return (
    <Protected>
      <div className="flex h-svh flex-row gap-0">
        <ChatMenuNavbar />

        <div className="flex w-full flex-col">
          <ChatHeader />

          <div className="no-scrollbar m-auto mb-10 mt-5 flex w-4/5 flex-grow flex-col gap-3 overflow-y-scroll">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                lastMessage={index === messages.length - 1}
                streaming={messageStreaming}
                message={message}
              />
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="mb-5">
            <InputField onSubmit={processSubmit} messageStreaming={messageStreaming} />
          </div>
        </div>
      </div>
    </Protected>
  );
}
