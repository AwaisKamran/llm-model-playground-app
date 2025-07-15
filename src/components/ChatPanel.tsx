
import { useEffect, useRef } from 'react';
import { Clock, Zap, Bot, User, DollarSign } from 'lucide-react';
import { Message, ChatStats, ModelParameters } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModelAdjustmentPopup } from '@/components/ModelAdjustmentPopup';
import { PROVIDER_CONFIGS, DEFAULT_PROVIDER_CONFIG } from '@/constants/providers';
import { filterPanelMessages, formatTime, formatTimestamp } from '@/utils/messageUtils';

interface ChatPanelProps {
  panelIndex: number;
  messages: Message[];
  isLoading: boolean;
  stats: ChatStats;
  onModelParametersChange?: (panelIndex: number, parameters: ModelParameters) => void;
  onModelChange?: (panelIndex: number, modelId: string) => void;
  selectedModel?: string;
}

export const ChatPanel = ({ 
  panelIndex, 
  messages, 
  isLoading, 
  stats, 
  onModelParametersChange, 
  onModelChange,
  selectedModel 
}: ChatPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const provider = PROVIDER_CONFIGS[panelIndex] || DEFAULT_PROVIDER_CONFIG;
  const prevMessageCountRef = useRef(0);

  const panelMessages = filterPanelMessages(messages, panelIndex);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Only scroll if new messages were actually added
    if (panelMessages.length > prevMessageCountRef.current) {
      scrollToBottom();
      prevMessageCountRef.current = panelMessages.length;
    }
  }, [panelMessages.length]);

  return (
    <Card className="h-[600px] bg-white/70 backdrop-blur-sm border-white/20 shadow-xl flex flex-col">
      {/* Header with stats */}
      <div className={`p-4 border-b border-gray-200/50 bg-gradient-to-r ${provider.gradient}`}>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <img 
              src={provider.icon} 
              alt={`${provider.name} logo`} 
              width={24} 
              height={24}
              className="flex-shrink-0"
            />
            <h3 className="font-semibold text-gray-800">{provider.name}</h3>
          </div>
          <div className="flex gap-2 items-center" role="group" aria-label="Chat panel statistics">
            <Badge variant="secondary" className="bg-white/50 text-gray-700" aria-label="Response time">
              <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
              {stats?.responseTime > 0 ? formatTime(stats.responseTime) : '--'}
            </Badge>
            <Badge variant="secondary" className="bg-white/50 text-gray-700" aria-label="Tokens used">
              <Zap className="w-3 h-3 mr-1" aria-hidden="true" />
              {stats?.tokensUsed > 0 ? `${stats.tokensUsed}` : '--'}
            </Badge>
            <Badge variant="secondary" className="bg-white/50 text-gray-700" aria-label="Price">
              <DollarSign className="w-3 h-3 mr-1" aria-hidden="true" />
              {stats?.price > 0 ? `$${stats.price.toFixed(6)}` : '--'}
            </Badge>
            {onModelParametersChange && onModelChange && (
              <ModelAdjustmentPopup
                panelIndex={panelIndex}
                provider={provider.tag as 'openai' | 'anthropic' | 'xai'}
                selectedModel={selectedModel || ''}
                onParametersChange={onModelParametersChange}
                onModelChange={onModelChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {panelMessages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Send a message to start the conversation</p>
            </div>
          </div>
        )}

        {panelMessages.map((message) => (
          <div
            key={`${message.id}-${panelIndex}`}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.isUser
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-4'
                  : 'bg-white/80 text-gray-800 mr-4 border border-gray-200/50'
              }`}
            >
              <div className="flex items-start gap-2">
                {!message.isUser && (
                  <Bot className="w-4 h-4 mt-1 text-gray-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
                {message.isUser && (
                  <User className="w-4 h-4 mt-1 text-blue-100 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/80 border border-gray-200/50 rounded-2xl px-4 py-2 mr-4">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-gray-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </Card>
  );
};
