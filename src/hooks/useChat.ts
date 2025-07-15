
import { useCallback } from 'react';
import { Message, ChatStats, APP_CONFIG } from '@/types';
import { fetchLLMResponse, APIError } from '@/services/apiClients';
import { saveChat } from '@/services/saveChat';
import { toast } from '@/hooks/use-toast';
import { useChatContext } from '@/contexts/ChatContext';
import { PROVIDER_CONFIGS } from '@/constants/providers';

export const useChat = () => {
  const { state, dispatch } = useChatContext();
  const { messages, inputMessage, isLoading, chatStats, modelParameters, selectedModels } = state;

  const setInputMessage = useCallback((message: string) => {
    dispatch({ type: 'SET_INPUT', payload: message });
  }, [dispatch]);

  const sendMessage = useCallback(async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: trimmedMessage,
      isUser: true,
      timestamp: new Date()
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_INPUT', payload: '' });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const apiCalls = Array.from({ length: APP_CONFIG.panelCount }, (_, index) => 
        fetchLLMResponse(trimmedMessage, PROVIDER_CONFIGS[index].tag, modelParameters[index], selectedModels[index])
      );

      // Save chat attempt
      try {
        await saveChat({ 
          message: trimmedMessage, 
          stats: chatStats, 
          isUser: true,
          timestamp: new Date().toISOString()
        });
      } catch (saveError) {
        console.warn('Failed to save chat:', saveError);
        // Continue with the main flow even if saving fails
      }

      const results = await Promise.allSettled(apiCalls);
      
      const aiMessages: Message[] = [];
      const newStats: ChatStats[] = [...chatStats];
      let successCount = 0;
      let errorCount = 0;

      results.forEach((result, index) => {
        const timestamp = new Date();
        
        if (result.status === 'fulfilled') {
          aiMessages.push({
            id: `ai-${timestamp.getTime()}-${index}`,
            content: result.value.response,
            isUser: false,
            timestamp
          });
          newStats[index] = result.value.stats;
          successCount++;
        } else {
          const error = result.reason as APIError;
          const errorMessage = error.provider 
            ? `${error.provider} Error: ${error.message}`
            : `API Error: ${error.message}`;
          
          aiMessages.push({
            id: `error-${timestamp.getTime()}-${index}`,
            content: errorMessage,
            isUser: false,
            timestamp
          });
          
          console.error(`API ${index} error:`, error);
          errorCount++;
        }
      });

      dispatch({ type: 'ADD_MESSAGES', payload: aiMessages });
      dispatch({ type: 'UPDATE_STATS', payload: newStats });

      // Show summary toast
      if (successCount > 0 && errorCount > 0) {
        toast({
          title: "Partial Success",
          description: `${successCount} of 3 providers responded successfully`,
          variant: "default",
        });
      } else if (errorCount === 3) {
        toast({
          title: "All Requests Failed",
          description: "Please check your configuration and try again",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Unexpected error in sendMessage:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while processing your request",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [inputMessage, isLoading, dispatch, chatStats, modelParameters]);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    chatStats,
    sendMessage
  };
};
