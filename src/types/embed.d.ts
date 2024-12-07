export interface EmbedRequest {
  model: string;
  input: string | string[];
  truncate?: boolean;
  options?: {
    microstat: number;
    microstat_eta: number;
    microstat_tau: number;
    num_ctx: number;
    repeat_last_n: number;
    repeat_penalty: number;
    temperature: number;
    seed: number;
    stop: string;
    tfs_z: number;
    num_predict: number;
    top_k: number;
    top_p: number;
    min_p: number;
  };
  keep_alive?: number;
}

export interface EmbedResponse {
  model: string;
  embeddings: number[][];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
}
