export interface Message {
  id: string;
  chatId: string;
  content: string;
  images?: string[];
  timestamp: string;
  sender: string;
}

export interface Chat {
  id: string;
  userId: string;
  summary: string;
  messages: Message[];
}

export interface ChatHistory {
  chats: Chat[];
}

export enum Role {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  TOOL = 'tool',
}

export interface ChatCompletionMessage {
  // role: Role;
  role: string;
  content: string;
  images?: string[];
  tool_calls?: string[];
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatCompletionMessage[];
  format?: 'json';
  options?: {
    num_keep: number;
    seed: number;
    num_predict: number;
    top_k: number;
    top_p: number;
    min_p: number;
    tfs_z: number;
    typical_p: number;
    repeat_last_n: number;
    temperature: number;
    repeat_penalty: number;
    presence_penalty: number;
    frequency_penalty: number;
    mirostat: number;
    mirostat_tau: number;
    mirostat_eta: number;
    penalize_newline: boolean;
    stop: string[];
    numa: boolean;
    num_ctx: number;
    num_batch: number;
    num_gpu: number;
    main_gpu: number;
    low_vram: boolean;
    vocab_only: boolean;
    use_mmap: boolean;
    use_mlock: boolean;
    num_thread: number;
  };
  stream?: boolean;
  keep_alive?: number;
}

export interface ChatCompletionResponse {
  model: string;
  created_at: string;
  message: ChatCompletionMessage;
  done: boolean;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

export interface ChatStreamCompletionResponse {
  model: string;
  created_at: string;
  message?: ChatCompletionMessage;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}
