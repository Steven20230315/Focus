// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDk2pXnYIEBJTYMyzlIamwRTq5MrSaGCrw',
  authDomain: 'focus-27466.firebaseapp.com',
  projectId: 'focus-27466',
  storageBucket: 'focus-27466.appspot.com',
  messagingSenderId: '886884732201',
  appId: '1:886884732201:web:280fbb437ac8595d177b38',
  measurementId: 'G-H6C9W4BYGF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
// Uncomment below to connect to emulator
connectFirestoreEmulator(db, 'localhost', 8080);
connectAuthEmulator(auth, 'http://localhost:9099');
connectFunctionsEmulator(functions, 'localhost', 5001);
