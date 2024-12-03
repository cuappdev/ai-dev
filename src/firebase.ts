import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Doesn't need to be private
const firebaseConfig = {
  apiKey: "AIzaSyCNf8_FlIH1G7f3lH5ZBQwIKkwi4M5vib4",
  authDomain: "ai-dev-24263.firebaseapp.com",
  projectId: "ai-dev-24263",
  storageBucket: "",
  messagingSenderId: "591469176148",
  appId: "1:591469176148:web:f93ba3a2b41fe4bf4cd4c1",
  measurementId: "G-3D6EFZBVM1"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
