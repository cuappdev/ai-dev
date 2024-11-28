export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
}

export interface ChatHistory {
  messages: ChatMessage[];
}
