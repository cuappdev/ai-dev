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
  idToken: string | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

interface FirebaseAuthError {
  code: string;
  message: string;
  name: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  idToken: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  refreshToken: async () => {},
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
  const [idToken, setIdToken] = useState<string | null>(null);
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

  const refreshToken = async () => {
    if (!user) return;
    const newToken = await user.getIdToken(true);
    setIdToken(newToken);
  };

  useEffect(() => {
    const authChange = onAuthStateChanged(auth, async (currentUser) => {
      // User has not been authenticated or has signed out
      if (!currentUser) {
        setUser(null);
        setIdToken(null);
        setLoading(false);
        return
      }
      
      const token = await currentUser.getIdToken();
      try {
        const response = await fetch('/api/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }
        
        setUser(currentUser);
        setIdToken(token);
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
      value={{ user, idToken, loading, error, signInWithGoogle, signOut, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
