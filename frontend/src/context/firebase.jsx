// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBkzrSd7hMeHP9SMKrNTtSpWCr0fENOUiU",
    authDomain: "todos-fullstack-65942.firebaseapp.com",
    projectId: "todos-fullstack-65942",
    storageBucket: "todos-fullstack-65942.appspot.com",
    messagingSenderId: "984150991569",
    appId: "1:984150991569:web:0586e07300df73cae81bf0",
    measurementId: "G-V0MMQH5HLY",
    databaseURL: "https://todos-fullstack-65942-default-rtdb.firebaseio.com",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
