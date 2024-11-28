import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect } from "react";
import { ChatHistory } from "@/types/chat";
import Image from "next/image";
import Spinner from "./Spinner";

interface ChatHistoryNavbarProps {
  toggleNavbar: () => void;
  isNavbarOpen: boolean;
}

export default function ChatHistoryNavbar({ toggleNavbar, isNavbarOpen }: ChatHistoryNavbarProps) {
  const { user, signOut } = useAuth();
  const [chatHistory, setChatHistory] = useState<ChatHistory>({ messages: [
  //   {
  //   id: "1",
  //   content: "Some content",
  //   timestamp: "random timestamp",
  //   sender: "me"
  // }
] });
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const fetchChatHistory = async () => {
      // const response = await fetch(`/api/chat/history/${user!.uid}`);
      // const data = await response.json();
      // setChatHistory(data);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoadingHistory(false);
    }

    fetchChatHistory();
  }, []);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex flex-col mt-4 w-11/12 m-auto text-sm">
        <div className="flex align-middle justify-between">
          <div>
            <button onClick={toggleNavbar} className="text-white p-2 hover:opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          <div className="flex gap-3">
            <button className="text-white hover:opacity-80 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
            </button>
            <button className="text-white hover:opacity-80 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

        {isNavbarOpen && (
          loadingHistory ?
            <div className="flex-1 flex align-middle items-center justify-center">
              <Spinner />
            </div>
          : (
            chatHistory.messages.length > 0 ? (
              <div className="flex-1 flex-col mt-5 overflow-y-auto justify-start">
                {chatHistory.messages.map((message) => (
                  <div key={message.id} className="flex flex-row w-11/12 m-auto p-3 justify-between">
                    <div className="flex flex-row gap-2">
                      {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                      </svg> */}
                      <span className="text-white text-sm">{message.content}</span>
                    </div>
                    <div>
                      {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg> */}
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center">
                <span className="text-white text-semibold">No chat history</span>
              </div>
            )
          )
        )}

      {isNavbarOpen && (
        <div className="text-stone-300 gap-5 p-5 flex flex-col">
          <div className="w-full">
            <button className="flex items-center gap-2 cursor-default">
              <Image className="rounded-full" src={user!.photoURL!} alt={`${user!.displayName}'s avatar`} width={25} height={25} />
              <span>{user!.displayName}</span>
            </button>
          </div>

          <div className="h-px bg-slate-500"></div>
          
          <div className="w-full">
            <button className="flex items-center gap-2 hover:opacity-80">
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
              <span>Help</span>
            </button>
          </div>

          <div className="h-px bg-slate-500"></div>

          <div className="w-full">
            <button onClick={signOut} className="flex items-center gap-2 hover:opacity-80">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0">
                <path fillRule="evenodd" clipRule="evenodd" d="M6 4C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H10C10.5523 20 11 20.4477 11 21C11 21.5523 10.5523 22 10 22H6C4.34315 22 3 20.6569 3 19V5C3 3.34315 4.34315 2 6 2H10C10.5523 2 11 2.44772 11 3C11 3.55228 10.5523 4 10 4H6ZM15.2929 7.29289C15.6834 6.90237 16.3166 6.90237 16.7071 7.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071C14.9024 16.3166 14.9024 15.6834 15.2929 15.2929L17.5858 13H11C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11H17.5858L15.2929 8.70711C14.9024 8.31658 14.9024 7.68342 15.2929 7.29289Z" fill="currentColor"></path>
              </svg>
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}