import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// console.log(firebaseConfig)

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Initialize Firebase for SSR
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// console.log(app);
const firestore = getFirestore(app);
// console.log(firestore);
const auth = getAuth(app);
// console.log(auth);
const storage = getStorage(app);
// console.log(storage);

export { app, firestore, auth, storage };
