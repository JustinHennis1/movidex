// src/auth_signup.js
import {createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase';

export const signupWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Congratulations we signed you up');
    return user;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
};
