'use client';

import { useAuth } from "../contexts/AuthContext";
import { useModel } from "../contexts/ModelContext";
import LoginPage from "./components/LoginPage";
import InitialChatPage from "./components/InitialChatPage";
import Spinner from "./components/Spinner";
import Protected from "./components/Protected";

export default function Home() {
  const { user, loading } = useAuth();
  const { selectedModel } = useModel();

  console.log('selectedModel', selectedModel);
  console.log("env:", process.env.NEXT_PUBLIC_DEFAULT_MODEL);
  console.log("url", process.env.OLLAMA_ENDPOINT);

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
