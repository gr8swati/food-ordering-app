// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBU-YNMUhSzWs6RjXAvwXtCiyimD2Z61U",
  authDomain: "foodorderapp-334f7.firebaseapp.com",
  projectId: "foodorderapp-334f7",
  storageBucket: "foodorderapp-334f7.appspot.com",

  messagingSenderId: "761893075700",
  appId: "1:761893075700:web:f2025ee7fc8b6c9b2b3ca1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
