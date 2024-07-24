// src/auth_loginwpass.js
import {signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from './firebase';

export const loginWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Congratulations You are Signed in');
    return user;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return 'Password reset email sent';
  } catch (error) {
    throw new Error(error.message);
  }
};
