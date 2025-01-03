import { useState, useEffect, useRef } from 'react';
import { Chat } from '@prisma/client';
import { toast } from 'react-toastify';
import Toast from '../Toast';
import ChatHistoryEntry from './ChatHistoryEntry';

export default function ChatHistory() {
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Figure out why this is being called twice?
    const fetchChatHistory = async () => {
      try {
        const response = await fetch('/api/chats');
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = await response.json();
        setChatHistory(data.chats);
      } catch (error) {
        toast.error(JSON.parse((error as Error).message).message);
      } finally {
        setLoadingHistory(false);
      }
    };
    setLoadingHistory(true);
    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, [loadingHistory]);

  const getRandomWidth = () => {
    const min = 50;
    const max = 100;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const renderSkeletonLoaders = () => {
    const skeletonLoaders = [];
    const loaderHeight = 24 + 16; // height (24px) + margin-bottom (16px)
    const numberOfLoaders = Math.ceil(containerHeight / loaderHeight);

    for (let i = 0; i < numberOfLoaders; i++) {
      const randomWidth = getRandomWidth();
      skeletonLoaders.push(
        <div
          key={i}
          className="mb-4 h-6 animate-pulse rounded-sm bg-gray-500"
          style={{ width: `${randomWidth}%` }}
        ></div>,
      );
    }
    return skeletonLoaders;
  };

  return (
    <>
      <div
        ref={containerRef}
        className="no-scrollbar m-auto mt-5 w-11/12 flex-1 flex-col overflow-y-auto"
      >
        {loadingHistory ? (
          renderSkeletonLoaders()
        ) : (
          <>
            {chatHistory.map((chat, index) => (
              <ChatHistoryEntry key={index} chat={chat} />
            ))}
          </>
        )}
      </div>
      <Toast />
    </>
  );
}
