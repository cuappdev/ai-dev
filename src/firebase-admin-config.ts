import "server-only";
import * as admin from "firebase-admin";
import { env } from 'next-runtime-env';

const getFirebaseAdminConfig = () => {
  const privateKeyEnv = env('ADMIN_FIREBASE_PRIVATE_KEY');
  if (!privateKeyEnv) {
    throw new Error('ADMIN_FIREBASE_PRIVATE_KEY environment variable is not set');
  }

  let privateKey;
  try {
    privateKey = JSON.parse(privateKeyEnv);
  } catch (error) {
    throw new Error((error as Error).message);
  }

  return {
    projectId: env('ADMIN_FIREBASE_PROJECT_ID'),
    clientEmail: env('ADMIN_FIREBASE_CLIENT_EMAIL'),
    privateKey,
  };
};

if (!admin.apps.length) {
  const serviceAccount = getFirebaseAdminConfig();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminAuth = admin.auth();
