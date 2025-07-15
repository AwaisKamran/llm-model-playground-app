// Shared types for the chat application
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatStats {
  responseTime: number;
  tokensUsed: number;
  price: number;
}

export interface ModelParameters {
  temperature: number;
  topP: number;
}

export interface AppConfig {
  panelCount: number;
  defaultModelParameters: ModelParameters;
}

export const APP_CONFIG: AppConfig = {
  panelCount: 3,
  defaultModelParameters: {
    temperature: 0.7,
    topP: 0.5,
  }
};