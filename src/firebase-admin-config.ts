import "server-only"
import * as admin from "firebase-admin";
import { env } from 'next-runtime-env';

const { privateKey } = JSON.parse(env('ADMIN_FIREBASE_PRIVATE_KEY')!);

const serviceAccount: admin.ServiceAccount = {
  projectId: env('ADMIN_FIREBASE_PROJECT_ID'),
  clientEmail: env('ADMIN_FIREBASE_CLIENT_EMAIL'),
  privateKey,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const adminAuth = admin.auth();

