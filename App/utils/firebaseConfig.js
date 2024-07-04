// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSEvRA0rey-Au9gaarRsfsnXxsKmeFzOg",
  authDomain: "stationscout-707ae.firebaseapp.com",
  projectId: "stationscout-707ae",
  storageBucket: "stationscout-707ae.appspot.com",
  messagingSenderId: "364940144142",
  appId: "1:364940144142:web:c27967c8394fbdcfa8d65f",
  measurementId: "G-W8E8P21LZV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
