import * as admin from "firebase-admin";

let adminAuth: admin.auth.Auth | null = null;

const getServiceAccount = () => {
  console.log(process.env.ADMIN_FIREBASE_PRIVATE_KEY);
  const { privateKey } = JSON.parse(process.env.ADMIN_FIREBASE_PRIVATE_KEY!);

  return {
    projectId: process.env.ADMIN_FIREBASE_PROJECT_ID,
    clientEmail: process.env.ADMIN_FIREBASE_CLIENT_EMAIL,
    privateKey,
  };
};

const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(getServiceAccount()),
    });
  }
  adminAuth = admin.auth();
};

export const getAdminAuth = () => {
  if (!adminAuth) {
    initializeFirebaseAdmin();
  }
  return adminAuth;
};
