import * as admin from "firebase-admin";

const { privateKey } = JSON.parse(process.env.ADMIN_FIREBASE_PRIVATE_KEY!);

const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.ADMIN_FIREBASE_PROJECT_ID,
  clientEmail: process.env.ADMIN_FIREBASE_CLIENT_EMAIL,
  privateKey,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const adminAuth = admin.auth();

export default adminAuth;
