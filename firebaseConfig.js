import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDgj1gccYQ70f8nd1V3uPW6_IyOaK8v4kA",
  authDomain: "facebook-messenger-clone-c6583.firebaseapp.com",
  projectId: "facebook-messenger-clone-c6583",
  storageBucket: "facebook-messenger-clone-c6583.appspot.com",
  messagingSenderId: "314154276111",
  appId: "1:314154276111:web:b8f22400512fd641799a7a",
  measurementId: "G-ZGNH1QE54V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };