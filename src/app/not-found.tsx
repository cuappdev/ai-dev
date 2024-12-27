'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ChatMenuNavbar from '@/app/components/chat/ChatMenuNavbar';
import ChatHeader from '@/app/components/chat/ChatHeader';
import Spinner from './components/Spinner';
import Protected from './components/Protected';

export default function NotFoundPage() {
  const { loading } = useAuth();
  const router = useRouter();
  const [timer, setTimer] = useState(5);

  if (loading) {
    return (
      <div className="flex h-screen w-screen justify-center align-middle">
        <Spinner width="5" height="5" />
      </div>
    );
  }

  setTimeout(() => {
    setTimer(timer - 1);
    if (timer === 0) {
      router.push('/');
    }
  }, 1000);

  return (
    <Protected>
      <div className="flex h-svh flex-row gap-0">
        <ChatMenuNavbar />
        <div className="flex w-full flex-col">
          <ChatHeader />
          <div className="m-auto mt-10 flex w-4/5 flex-grow flex-col gap-3">
            <span className="text-7xl font-semibold">404 - Not Found</span>
            <span className="text-3xl font-semibold text-primaryColor">
              The requested page could not be found.
            </span>
            {timer > 0 ? (
              <span>Redirecting home in {timer} seconds.</span>
            ) : (
              <span>Redirecting...</span>
            )}
          </div>
        </div>
      </div>
    </Protected>
  );
}
