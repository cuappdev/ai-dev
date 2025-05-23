'use client';

import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import Toast from './Toast';
import Logo from './Logo';

export default function LoginPage() {
  const { signInWithGoogle, error } = useAuth();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <main className="flex h-svh flex-col items-center justify-center gap-10">
      <Logo />

      <div className="w-[380px] rounded-lg border border-neutral-200 py-5 text-neutral-950 shadow-sm max-[400px]:w-[95%]">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold">Welcome to AI Dev!</h3>
          <p className="text-sm text-secondaryColor">Login with your Cornell email account</p>
        </div>

        <div className="flex items-center p-6 pt-0">
          <button
            onClick={signInWithGoogle}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white hover:opacity-80"
          >
            <svg
              height="20"
              viewBox="0 0 20 20"
              width="20"
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
            >
              <path
                d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
                fill="#4285F4"
              ></path>
              <path
                d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
                fill="#34A853"
              ></path>
              <path
                d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
                fill="#FBBC05"
              ></path>
              <path
                d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
                fill="#EA4335"
              />
            </svg>
            <span>Login</span>
          </button>
        </div>
        <Toast />
      </div>
    </main>
  );
}
