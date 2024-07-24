// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
//import exp from "constants";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkqgaQs8AunAwUIzVwizqw1lM8C_N8aig", //ok to leave in
  authDomain: "movidex-17721.firebaseapp.com",
  projectId: "movidex-17721",
  storageBucket: "movidex-17721.appspot.com",
  messagingSenderId: "343284681163",
  appId: "1:343284681163:web:9a25036d6efdbe003d4e4e",
  measurementId: "G-5LHHJ079SW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export{db, auth};