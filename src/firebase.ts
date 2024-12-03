import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.replace(/^"|"$/g, '') || "";
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.replace(/^"|"$/g, '') || "";
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.replace(/^"|"$/g, '') || "";
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.replace(/^"|"$/g, '') || "";
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID?.replace(/^"|"$/g, '') || "";
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.replace(/^"|"$/g, '') || "";
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.replace(/^"|"$/g, '') || "";

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
};

console.log("Config:", firebaseConfig);

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
