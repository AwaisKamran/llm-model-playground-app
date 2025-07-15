
import { ChatStats } from '@/types';

const SAMPLE_RESPONSES = [
  "I understand your question. Let me help you with that.",
  "That's an interesting point. Here's my perspective on it.",
  "Based on what you've shared, I can provide some insights.",
  "Thank you for your message. I'll do my best to assist you.",
  "I see what you're asking about. Let me break this down for you."
];

export interface SimulationResult {
  response: string;
  stats: ChatStats;
}

export const simulateResponse = (panelIndex: number): Promise<SimulationResult> => {
  const startTime = Date.now();
  const responseTime = Math.random() * 2000 + 500; // 0.5-2.5 seconds
  const tokensUsed = Math.floor(Math.random() * 150) + 50; // 50-200 tokens

  return new Promise((resolve) => {
    setTimeout(() => {
      const response = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];
      const actualResponseTime = Date.now() - startTime;
      
      resolve({
        response,
        stats: { responseTime: actualResponseTime, tokensUsed, price: tokensUsed * 0.001 }
      });
    }, responseTime);
  });
};
