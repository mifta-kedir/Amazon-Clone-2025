import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";;
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAX2bdYUHNhEhaA0SZQZyiPkwDxyoPbcuE",
    authDomain: "clone-11a1c.firebaseapp.com",
    projectId: "clone-11a1c",
    storageBucket: "clone-11a1c.firebasestorage.app",
    messagingSenderId: "137834190972",
    appId: "1:137834190972:web:e03d1d73b70314aafd11f9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);    
export default app;