import * as admin from "firebase-admin";
import * as serviceAccount from "../firebase-service-account.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
}

const adminAuth = admin.auth();

export default adminAuth;
