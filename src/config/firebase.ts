import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDVOfj7gcHCIujHC5DVpz2pSGHrpl5FHMc",
  authDomain: "notes-app-pro-bf0f0.firebaseapp.com",
  projectId: "notes-app-pro-bf0f0",
  storageBucket: "notes-app-pro-bf0f0.firebasestorage.app",
  messagingSenderId: "481079247304",
  appId: "1:481079247304:web:9c2d7678de8a3cab7b40fd",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;