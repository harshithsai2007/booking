import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCT5im2-X1MMOhyZVYezcXzJMslSJm0c7c",
    authDomain: "flight-ticket-booking-64979.firebaseapp.com",
    projectId: "flight-ticket-booking-64979",
    storageBucket: "flight-ticket-booking-64979.firebasestorage.app",
    messagingSenderId: "951189660965",
    appId: "1:951189660965:web:603afac952bde80d9b26cc",
    measurementId: "G-D0E1QGPW9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
