// TODO: Clean up types

export interface CreateModelRequest {
  model: string;
  modelfile?: string;
  stream?: boolean;
  path?: string;
  quantize?: string;
}

export interface CreateModelResponse {
  status: string;
}

export interface Model {
  name: string;
  model?: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    parent_model?: string;
    format: string;
    family: string;
    families: string[] | null;
    parameter_size: string;
    quantization_level: string;
  };
  expires_at: string;
  size_vram: number;
}

export interface AllModelsResponse {
  models: Model[];
}

export interface ModelInfoRequest {
  model: string;
  verbose?: boolean;
}

export interface ModelInfoResponse {
  model: string;
  parameters: string;
  template: string;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
  // model_info: {
  // general.architecture: string;
  // general.file_type: number;
  // general.parameter_count: number;
  // general.quantization_version: number;
  // llama.attention.head_count: number;
  // llama.attention.head_count_kv: number;
  // llama.attention.layer_norm_rms_epsilon: number;
  // llama.block_count: number;
  // llama.context_length: number;
  // llama.embedding_length: number;
  // llama.feed_forward_length: number;
  // llama.rope.dimension_count: number;
  // llama.rope.freq_base: number;
  // llama.vocab_size: number;
  // tokenizer.ggml.bos_token_id: number
  // tokenizer.ggml.eos_token_id: number
  // tokenizer.ggml.merges?: string[];
  // tokenizer.ggml.model: string;
  // tokenizer.ggml.pre: string;
  // tokenizer.ggml.token_type?: string[];
  // tokenizer.ggml.tokens?: string[];
  // }
}

export interface DeleteModelRequest {
  model: string;
}

export interface PullModelRequest {
  model: string;
  insecure?: boolean;
  stream?: boolean;
}

export interface PullModelResponse {
  status: string;
  digest?: string;
  total?: number;
  completed?: number;
}
