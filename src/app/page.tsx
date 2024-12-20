'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginPage from './components/LoginPage';
import InitialChatPage from './components/InitialChatPage';
import Spinner from './components/Spinner';
import Protected from './components/Protected';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex align-middle justify-center">
        <Spinner width='5' height='5' />
      </div>
    );
  }

  return (
    <>
      {user ? (
        <Protected>
          <InitialChatPage />
        </Protected>
      ) : (
        <LoginPage />
      )}
    </>
  );
}
