'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ModelProvider } from '../contexts/ModelContext';

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AuthProvider>
      <ModelProvider>
        {children}
      </ModelProvider>
    </AuthProvider>
  );
};

export default Providers;