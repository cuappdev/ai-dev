import * as admin from "firebase-admin";

let adminAuth: admin.auth.Auth | null = null;

const getServiceAccount = () => {
  console.log("From env", process.env.ADMIN_FIREBASE_PRIVATE_KEY);
  console.log("\nParsed", JSON.parse(process.env.ADMIN_FIREBASE_PRIVATE_KEY!));
  const { privateKey } = JSON.parse(process.env.ADMIN_FIREBASE_PRIVATE_KEY!);
  console.log("\nPrivate key", privateKey);
  console.log("\nProject ID", process.env.ADMIN_FIREBASE_PROJECT_ID);
  console.log("\nClient email", process.env.ADMIN_FIREBASE_CLIENT_EMAIL);
  console.log("\nService account", {
    projectId: process.env.ADMIN_FIREBASE_PROJECT_ID,
    clientEmail: process.env.ADMIN_FIREBASE_CLIENT_EMAIL,
    privateKey,
  });

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
