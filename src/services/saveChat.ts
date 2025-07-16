import { createAPIError } from "./apiClients";


const PRODUCTION_SERVER_URL = import.meta.env.VITE_PRODUCTION_SERVER_URL;
const LOCAL_SERVER_URL = import.meta.env.VITE_LOCALHOST;

export interface SaveChatAPIResponse{
  status: string,
  id: string
}

export const saveChat = async (state: any): Promise<SaveChatAPIResponse> => {
  try {
    const response = await fetch(
      `${PRODUCTION_SERVER_URL}/v1/chat/save`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            data: {
                ...state
            }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw createAPIError(
        "Mongo DB Save Chat Error",
        errorData.error?.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return {
        id: data.id || 'unknown',
        status: 'success'
    }
  } catch (error) {
    throw createAPIError(
      "Mongo DB",
      `Save Chat Errorr: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
