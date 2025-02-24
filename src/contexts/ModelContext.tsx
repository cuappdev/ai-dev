'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { AllModelsResponse } from '@/types/model';
import { env } from 'next-runtime-env';

interface ModelContextType {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  fetchAllModels: () => Promise<string[]>;
  fetchActiveModels: () => Promise<string[]>;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const useModel = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
};

export const ModelProvider = ({ children }: { children: ReactNode }) => {
  const defaultModel = env('NEXT_PUBLIC_DEFAULT_MODEL');
  const [selectedModel, setSelectedModel] = useState<string>(defaultModel!);

  // TODO: Maybe delete?
  const fetchAllModels = async () => {
    return await fetch('/api/models/all')
      .then((response) => response.json())
      .then((data: AllModelsResponse) => {
        return data.models.map((model) => model.name);
      });
  };

  // TODO: Maybe delete?
  const fetchActiveModels = async () => {
    return await fetch('/api/models/active')
      .then((response) => response.json())
      .then((data: AllModelsResponse) => {
        return data.models.map((model) => model.name);
      });
  };

  return (
    <ModelContext.Provider
      value={{ selectedModel, setSelectedModel, fetchAllModels, fetchActiveModels }}
    >
      {children}
    </ModelContext.Provider>
  );
};
