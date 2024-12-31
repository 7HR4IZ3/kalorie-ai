import firebase from "firebase/compat/app";

import "firebase/analytics";
import "firebase/firestore";
import "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.GOOGLE_FIREBASE_API_KEY,
  authDomain: process.env.GOOGLE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.GOOGLE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.GOOGLE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.GOOGLE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.GOOGLE_FIREBASE_APP_ID,
  measurementId: process.env.GOOGLE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = firebase.default.initializeApp(firebaseConfig);
export const analytics = firebase.default.analytics(app);
export const db = firebase.default.firestore(app);
export const auth = firebase.default.auth(app);
