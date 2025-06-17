import React from 'react';
import { Select } from '@/components/ui/Select';
import { AI_MODELS } from '@/lib/constants';
import { AIModel } from '@/types';

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange
}) => {
  const handleModelChange = (modelId: string) => {
    const model = AI_MODELS.find(m => m.id === modelId);
    if (model) {
      onModelChange(model);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">AI Model Selection</h3>
      
      <Select
        label="Choose AI Model"
        value={selectedModel.id}
        onChange={(e) => handleModelChange(e.target.value)}
        options={AI_MODELS.map(model => ({
          value: model.id,
          label: model.name
        }))}
      />
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Selected Model:</h4>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Name:</span> {selectedModel.name}
          </p>
          <p className="text-sm">
            <span className="font-medium">Provider:</span> {selectedModel.provider}
          </p>
          <p className="text-sm text-gray-600">
            {selectedModel.description}
          </p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-primary-light rounded-lg border border-primary-red">
        <p className="text-xs text-primary-red">
          <strong>Default:</strong> Groq AI is selected for optimal performance and speed.
        </p>
      </div>
    </div>
  );
};