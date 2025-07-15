
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Message, ChatStats, ModelParameters, APP_CONFIG } from '@/types';
import { DEFAULT_MODELS } from '@/components/ModelSelector';

interface ChatState {
  messages: Message[];
  chatStats: ChatStats[];
  inputMessage: string;
  isLoading: boolean;
  selectedModels: Record<number, string>;
  modelParameters: Record<number, ModelParameters>;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'ADD_MESSAGES'; payload: Message[] }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_STATS'; payload: ChatStats[] }
  | { type: 'SET_SELECTED_MODEL'; payload: { panelIndex: number; modelId: string } }
  | { type: 'SET_MODEL_PARAMETERS'; payload: { panelIndex: number; parameters: ModelParameters } }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'LOAD_STATE'; payload: Partial<ChatState> };

const createInitialStats = (): ChatStats[] => 
  Array.from({ length: APP_CONFIG.panelCount }, () => ({ 
    responseTime: 0, 
    tokensUsed: 0, 
    price: 0 
  }));

const createInitialModels = (): Record<number, string> => ({
  0: DEFAULT_MODELS.openai,
  1: DEFAULT_MODELS.anthropic,
  2: DEFAULT_MODELS.xai,
});

const createInitialParameters = (): Record<number, ModelParameters> => {
  const params: Record<number, ModelParameters> = {};
  for (let i = 0; i < APP_CONFIG.panelCount; i++) {
    params[i] = APP_CONFIG.defaultModelParameters;
  }
  return params;
};

const initialState: ChatState = {
  messages: [],
  chatStats: createInitialStats(),
  inputMessage: '',
  isLoading: false,
  selectedModels: createInitialModels(),
  modelParameters: createInitialParameters(),
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case 'ADD_MESSAGES':
      return {
        ...state,
        messages: [...state.messages, ...action.payload]
      };
    case 'SET_INPUT':
      return {
        ...state,
        inputMessage: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'UPDATE_STATS':
      return {
        ...state,
        chatStats: action.payload
      };
    case 'SET_SELECTED_MODEL':
      return {
        ...state,
        selectedModels: {
          ...state.selectedModels,
          [action.payload.panelIndex]: action.payload.modelId
        }
      };
    case 'SET_MODEL_PARAMETERS':
      return {
        ...state,
        modelParameters: {
          ...state.modelParameters,
          [action.payload.panelIndex]: action.payload.parameters
        }
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        chatStats: createInitialStats()
      };
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  clearMessages: () => void;
  setSelectedModel: (panelIndex: number, modelId: string) => void;
  setModelParameters: (panelIndex: number, parameters: ModelParameters) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = 'llm-playground-chat-state';

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Convert timestamp strings back to Date objects
        if (parsedState.messages) {
          parsedState.messages = parsedState.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        }
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error('Error loading chat state from localStorage:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving chat state to localStorage:', error);
    }
  }, [state]);

  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  };

  const setSelectedModel = (panelIndex: number, modelId: string) => {
    dispatch({ type: 'SET_SELECTED_MODEL', payload: { panelIndex, modelId } });
  };

  const setModelParameters = (panelIndex: number, parameters: ModelParameters) => {
    dispatch({ type: 'SET_MODEL_PARAMETERS', payload: { panelIndex, parameters } });
  };

  return (
    <ChatContext.Provider value={{ 
      state, 
      dispatch, 
      clearMessages, 
      setSelectedModel, 
      setModelParameters 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
