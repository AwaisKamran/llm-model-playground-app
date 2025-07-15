
import { Message } from '@/types';

export const filterPanelMessages = (messages: Message[], panelIndex: number): Message[] => {
  return messages.filter((message, index) => {
    if (message.isUser) return true;
    // For AI messages, show every 3rd message starting from panelIndex
    const aiMessageIndex = messages.slice(0, index).filter(m => !m.isUser).length;
    return aiMessageIndex % 3 === panelIndex;
  });
};

export const formatTime = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

export const formatTimestamp = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
