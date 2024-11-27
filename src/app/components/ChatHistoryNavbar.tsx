import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react";
import { ChatHistory } from "@/types/chat";

export default function ChatHistoryNavbar() {
  const { user } = useAuth();
  const [chatHistory, setChatHistory] = useState<ChatHistory>({ userId: "", messages: [{
    id: "1",
    content: "some content",
    timestamp: "random timestamp",
    sender: "me"
  }] });

  const fetchChatHistory = async (userUid: string) => {
    // Fetch chat history from the server
    const response = await fetch(`/api/chat/history/${userUid}`);
    const chatHistory = await response.json();
    return chatHistory;
  }

  useEffect(() => {
    if (user) {
      fetchChatHistory(user.uid)
        .then((chatHistory) => {
          setChatHistory(chatHistory);
        })
        // .catch((error) => {
        //   console.error("Error fetching chat history", error);
        // });
    }
  }, [])

  return (
    <div>
      <h1>Chat History</h1>
      {chatHistory ? (
        <ul>
          {chatHistory.messages.map((message) => (
            <li key={message.id}>{message.content}</li>
          ))}
        </ul>
      ) : (
        <p>Loading chat history...</p>
      )}
    </div>
  )
}