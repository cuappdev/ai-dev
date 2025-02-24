'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { User as PrismaUser } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { auth, provider } from '@/firebase';

interface User {
  uid: string;
  email: string;
  isAppDev: boolean;
  displayName: string;
  photoURL: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signInWithGoogle = async () => {
    setError(null);
    await signInWithPopup(auth, provider).catch((error) => {
      setError((error as Error).message);
    });
  };

  const signOut = async () => {
    setError(null);
    await firebaseSignOut(auth)
      .then(async () => {
        router.push('/');
        await fetch('/api/logout');
      })
      .catch((error) => {
        setError((error as Error).message);
      });
  };

  useEffect(() => {
    const authChange = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      if (!user && currentUser) {
        try {
          const token = await currentUser.getIdToken();
          // Validate firebase token and set cookie
          const firebaseResponse = await fetch('/api/login', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!firebaseResponse.ok) {
            await signOut();
            throw new Error(await firebaseResponse.text());
          }

          // Ensures Cornell email and upserts a user which is returned
          const userResponse = await fetch('/api/authenticate');
          if (!userResponse.ok) {
            await signOut();
            throw new Error(await userResponse.text());
          }

          const userInfo: PrismaUser = (await userResponse.json()).user;

          setUser({
            uid: userInfo.uid!,
            email: userInfo.email,
            isAppDev: userInfo.isAppDev,
            displayName: currentUser.displayName!,
            photoURL: currentUser.photoURL!,
          });
        } catch (error) {
          setError(JSON.parse((error as Error).message).message);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => authChange();
  });

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
