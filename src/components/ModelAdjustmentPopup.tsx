import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MODEL_OPTIONS } from '@/components/ModelSelector';
import { ModelParameters } from '@/types';

interface ModelAdjustmentPopupProps {
  panelIndex: number;
  provider: 'openai' | 'anthropic' | 'xai';
  selectedModel: string;
  onParametersChange: (panelIndex: number, parameters: ModelParameters) => void;
  onModelChange: (panelIndex: number, modelId: string) => void;
  initialParameters?: ModelParameters;
}

import { APP_CONFIG } from '@/types';

const DEFAULT_PARAMETERS: ModelParameters = APP_CONFIG.defaultModelParameters;

export const ModelAdjustmentPopup: React.FC<ModelAdjustmentPopupProps> = ({
  panelIndex,
  provider,
  selectedModel,
  onParametersChange,
  onModelChange,
  initialParameters = DEFAULT_PARAMETERS,
}) => {
  const [parameters, setParameters] = useState<ModelParameters>(initialParameters);
  
  const models = MODEL_OPTIONS[provider] || [];
  const currentModel = models.find(m => m.id === selectedModel) || models[0];

  const handleTemperatureChange = (value: number[]) => {
    const newParams = { ...parameters, temperature: value[0] };
    setParameters(newParams);
    onParametersChange(panelIndex, newParams);
  };

  const handleTopPChange = (value: number[]) => {
    const newParams = { ...parameters, topP: value[0] };
    setParameters(newParams);
    onParametersChange(panelIndex, newParams);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-white/20 text-gray-700"
        >
          <Settings className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 bg-white/95 backdrop-blur-sm border-white/20 shadow-xl"
        align="end"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900">Model Settings</h4>
            <p className="text-xs text-gray-600">Select model and adjust parameters</p>
          </div>
          
          {/* Model Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Model</Label>
            <Select
              value={selectedModel}
              onValueChange={(value) => onModelChange(panelIndex, value)}
            >
              <SelectTrigger className="w-full bg-white/50 border-white/30 text-sm hover:bg-white/70 transition-colors">
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
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="temperature" className="text-sm font-medium text-gray-700">
                  Temperature
                </Label>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {parameters.temperature.toFixed(2)}
                </span>
              </div>
              <Slider
                id="temperature"
                min={0}
                max={2}
                step={0.01}
                value={[parameters.temperature]}
                onValueChange={handleTemperatureChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Controls randomness: 0 = focused, 2 = creative
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="topP" className="text-sm font-medium text-gray-700">
                  Top P
                </Label>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {parameters.topP}
                </span>
              </div>
              <Slider
                id="top_p"
                min={0}
                max={1}
                step={0.1}
                value={[parameters.topP]}
                onValueChange={handleTopPChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Limits vocabulary: lower = more focused
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200/50">
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Temperature:</strong> Higher values make output more random</p>
              <p><strong>Top P:</strong> Considers only the K most likely next words</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};