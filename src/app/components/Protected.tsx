import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Spinner from './Spinner';

interface ProtectedProps {
  children: ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen justify-center align-middle">
        <Spinner width="5" height="5" />
      </div>
    );
  }

  return <>{user ? children : <></>}</>;
}
