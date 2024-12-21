'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, provider } from '@/firebase-config';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface FirebaseAuthError {
  code: string;
  message: string;
  name: string;
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
    await signInWithPopup(auth, provider)
      .catch((error) => {
        setError((error as FirebaseAuthError).message);
      }
    );
  };

  const signOut = async () => {
    setError(null);
    await firebaseSignOut(auth)
      .then(() => {
        router.push('/');
      })
      // TODO: Add toast to tell user there is an error
      .catch((error) => {
        setError((error as FirebaseAuthError).message);
      });
  };

  useEffect(() => {
    const authChange = onAuthStateChanged(auth, async (currentUser) => {
      // User has not been authenticated or has signed out
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        await fetch("/api/logout", {
          method: "GET",
        });
        return
      }
      
      const token = await currentUser.getIdToken();
      try {
        const response = await fetch('/api/authenticate', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }
        
        setUser(currentUser);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    });
    return () => authChange();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
