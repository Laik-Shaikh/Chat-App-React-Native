// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRKVtSMOk7i08AaXDXjANfD0P9dJkiLxU",
  authDomain: "chat-app-react-native-4a1c7.firebaseapp.com",
  projectId: "chat-app-react-native-4a1c7",
  storageBucket: "chat-app-react-native-4a1c7.appspot.com",
  messagingSenderId: "749744999910",
  appId: "1:749744999910:web:8d24709553813e714a1a27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };