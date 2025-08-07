// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDWNtflhUgoB5HK1EUERIEAf8LQ2LYyFw0',
  authDomain: 'youf-ea5aa.firebaseapp.com',
  projectId: 'youf-ea5aa',
  storageBucket: 'youf-ea5aa.firebasestorage.app',
  messagingSenderId: '259805875113',
  appId: '1:259805875113:web:d6c78cdbe4ac171eacd2b8',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
