export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
}

export interface ChatHistory {
  messages: ChatMessage[];
}

export interface ChatCompletionResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  done_reason: string;
  context: number[];
  total_duration: number;
  load_duration: number
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}
