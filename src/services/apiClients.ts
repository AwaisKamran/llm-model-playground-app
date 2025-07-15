import { ModelParameters } from "@/types";

export interface APIResponse {
  response: string;
  stats: {
    responseTime: number;
    tokensUsed: number;
    price: number
  };
}

export interface APIError extends Error {
  provider: string;
  status?: number;
}

export const createAPIError = (provider: string, message: string, status?: number): APIError => {
  const error = new Error(message) as APIError;
  error.provider = provider;
  error.status = status;
  return error;
};

export const fetchLLMResponse = async (message: string, provider: string, modelParameters: ModelParameters, model: string): Promise<APIResponse> => {
  const startTime = Date.now();
  
  try {
     //https://llm-model-playground-server-8041ff817c50.herokuapp.com
     const response = await fetch('http://127.0.0.1:8000/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "prompt": message,
        "model": model,
        "provider": provider,
        "modelParameters": modelParameters
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw createAPIError('OpenAI', errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;

    return {
      response: data?.content || 'No response received',
      stats: {
        responseTime,
        tokensUsed: data?.token_usage || 0,
        price: data?.price || 0
      },
    };
  } catch (error) {
    if (error instanceof Error && 'provider' in error) {
      throw error;
    }
    throw createAPIError('OpenAI', `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};