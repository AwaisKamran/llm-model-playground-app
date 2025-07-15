import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ModelOption {
  id: string;
  name: string;
  description?: string;
}

interface ModelSelectorProps {
  panelIndex: number;
  provider: 'openai' | 'anthropic' | 'xai';
  selectedModel: string;
  onModelChange: (panelIndex: number, modelId: string) => void;
}

const MODEL_OPTIONS: Record<string, ModelOption[]> = {
  openai: [
    { id: 'gpt-4.1-2025-04-14', name: 'GPT-4.1', description: 'Latest flagship model' },
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Older powerful model' },
  ],
  anthropic: [
    { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: 'Fastest model' },
    { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', description: 'Extended thinking' },
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Previous intelligent model' },
  ],
  xai: [
    { id: 'grok-3', name: 'Grok 3', description: 'xAI\'s conversational model' },
    { id: 'grok-2', name: 'Grok 2', description: 'Latest Grok model' },
  ],
};

export const DEFAULT_MODELS: Record<string, string> = {
  openai: 'gpt-4.1-2025-04-14',
  anthropic: 'claude-3-5-sonnet-20241022',
  xai: 'grok-3',
};

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  panelIndex,
  provider,
  selectedModel,
  onModelChange,
}) => {
  const models = MODEL_OPTIONS[provider] || [];
  const currentModel = models.find(m => m.id === selectedModel) || models[0];

  return (
    <div className="px-4 pb-3">
      <Select
        value={selectedModel}
        onValueChange={(value) => onModelChange(panelIndex, value)}
      >
        <SelectTrigger className="w-full h-8 bg-white/50 border-white/30 text-sm hover:bg-white/70 transition-colors">
          <SelectValue>
            <div className="flex flex-col items-start">
              <span className="font-medium text-gray-800">{currentModel?.name}</span>
              {currentModel?.description && (
                <span className="text-xs text-gray-600">{currentModel.description}</span>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-sm border-white/20 shadow-xl max-h-64">
          {models.map((model) => (
            <SelectItem 
              key={model.id} 
              value={model.id}
              className="hover:bg-gray-100/70 focus:bg-gray-100/70"
            >
              <div className="flex flex-col items-start py-1">
                <span className="font-medium text-gray-800">{model.name}</span>
                {model.description && (
                  <span className="text-xs text-gray-600">{model.description}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export { MODEL_OPTIONS };
export type { ModelOption };