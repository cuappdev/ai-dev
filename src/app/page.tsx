'use client';

import { useAuth } from "../contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import InitialChatPage from "./components/InitialChatPage";
import Spinner from "./components/Spinner";
import Protected from "./components/Protected";

export default function Home() {
  const { user, loading } = useAuth();

  console.log("Firebase API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);


  if (loading) {
    return (
      <div className="h-screen w-screen flex align-middle justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {user ?
        <Protected>
          <InitialChatPage />
        </Protected>
      :
        <LoginPage />
      }
    </>
  );
}
