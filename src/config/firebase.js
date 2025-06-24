// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-hb5zaI0ZThxDW7gxbGQItGDtZiSNxmk",
  authDomain: "foodorderingapp-75a69.firebaseapp.com",
  projectId: "foodorderingapp-75a69",
  storageBucket: "foodorderingapp-75a69.firebasestorage.app",
  messagingSenderId: "946536151801",
  appId: "1:946536151801:web:fc551c61612d9bdc85c028",
  measurementId: "G-QPBZ8V3MS7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
export { db };