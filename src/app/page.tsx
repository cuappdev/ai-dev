'use client';

import { useAuth } from "../contexts/AuthContext";
import LoginPage from "./LoginPage";

export default function Home() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    // TODO: Add loading
    return <div>Loading...</div>
  }

  return (
    <>
      {user ? 
        (<div>
          <h1>
            You are signed in!
          </h1>
          {user.photoURL && <img src={user.photoURL} alt={`${user.displayName}'s avatar`} />}
          <button onClick={signOut}>Sign Out</button>
        </div>)
      :
      <LoginPage />}
    </>
  );
}