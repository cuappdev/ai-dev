'use client';

import { useAuth } from '@/contexts/AuthContext';
import Spinner from '../components/Spinner';
import Protected from '../components/Protected';

export default function HelpPage() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen justify-center align-middle">
        <Spinner width="5" height="5" />
      </div>
    );
  }

  return (
    // TODO: Finish
    <Protected>
      <h1>Help</h1>
      <p>Here is some help text</p>
    </Protected>
  );
}
