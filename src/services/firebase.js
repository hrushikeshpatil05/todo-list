// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAi6KjtELO6rEOasmuWNeEDdoICO3vqJd8",
  authDomain: "todo-list-c656a.firebaseapp.com",
  projectId: "todo-list-c656a",
  storageBucket: "todo-list-c656a.appspot.com",
  messagingSenderId: "770203893827",
  appId: "1:770203893827:web:9d3a6bfb9e161bd55554f6",
  measurementId: "G-MELJZMFZY8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };