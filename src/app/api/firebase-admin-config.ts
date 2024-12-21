import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert("../../../firebase-service-account.json")
  });
}

const adminAuth = admin.auth();

export default adminAuth;
