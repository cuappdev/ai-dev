'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { env } from 'next-runtime-env';

interface ModelContextType {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
};

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const useModel = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModel must be used within a ModelProvider');
  };
  return context;
};

export const ModelProvider = ({ children }: { children: ReactNode }) => {
  const defaultModel = env('NEXT_PUBLIC_DEFAULT_MODEL');
  const [selectedModel, setSelectedModel] = useState<string>(defaultModel!);

  return (
    <ModelContext.Provider value={{ selectedModel, setSelectedModel }}>
      {children}
    </ModelContext.Provider>
  );
};
