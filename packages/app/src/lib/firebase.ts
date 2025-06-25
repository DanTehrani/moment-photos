// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { initializeAuth } from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBav0y8XUcD6CDwNMh6sAPc68zw4AbsHDE',
  authDomain: 'raylac-72351.firebaseapp.com',
  projectId: 'raylac-72351',
  storageBucket: 'raylac-72351.appspot.com',
  messagingSenderId: '528384252023',
  appId: '1:528384252023:web:88d958d6a414cd38d0ce72',
  measurementId: 'G-TRZXT7DVG6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const auth = initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});

export default app;
