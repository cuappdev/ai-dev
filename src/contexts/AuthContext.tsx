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
import { auth, provider } from '@/firebase';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  // TODO: Remove once there is a toast
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
  // TODO: Remove once there is a toast
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
  // TODO: Remove once there is a toast
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signInWithGoogle = async () => {
    setError(null);
    await signInWithPopup(auth, provider)
      .catch((error) => {
        // TODO: Add toast to tell user there is an error
        setError((error as FirebaseAuthError).message);
      }
    );
  };

  const signOut = async () => {
    setError(null);
    await firebaseSignOut(auth)
      .then(async () => {
        router.push('/');
        await fetch("/api/logout");
      })
      .catch((error) => {
        // TODO: Add toast to tell user there is an error
        setError((error as FirebaseAuthError).message);
      });
  };

  useEffect(() => {
    const authChange = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      };
      
      try {
        const token = await currentUser.getIdToken();
        // Validate firebase token
        const firebaseMiddlewareResponse = await fetch('/api/login', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (!firebaseMiddlewareResponse.ok) {
          await signOut();
          throw new Error(await firebaseMiddlewareResponse.text());
        }

        // Ensure user is in the database
        const userResponse  = await fetch('/api/authenticate');
        if (!userResponse.ok) {
          await signOut();
          throw new Error(await userResponse.text());
        }
        
        setUser(currentUser);
      } catch (error) {
        // TODO: Add toast to tell user there is an error
        setError(JSON.parse((error as Error).message).message);
        setUser(null);
      } finally {
        setLoading(false);
      };
    });
    return () => authChange();
  });

  return (
    <AuthContext.Provider
      // TODO: Remove once there is a toast
      value={{ user, loading, error, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
