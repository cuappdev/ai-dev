'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ModelProvider } from '../contexts/ModelContext'; // Import the ModelProvider

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