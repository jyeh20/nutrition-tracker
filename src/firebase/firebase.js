// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQT7tQq0rhcVzOTuhMvEjix6gzaKc0oAc",
  authDomain: "nutrition-tracker-d2bd1.firebaseapp.com",
  projectId: "nutrition-tracker-d2bd1",
  storageBucket: "nutrition-tracker-d2bd1.appspot.com",
  messagingSenderId: "887697945123",
  appId: "1:887697945123:web:88d47610fbff61a8c7f796",
  measurementId: "G-PME60E3732",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
