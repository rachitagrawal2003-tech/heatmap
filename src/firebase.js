import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBNV-dCUYc7GPPufuqXcbofRz7hXcqCFRo",
    authDomain: "heatmap-a2434.firebaseapp.com",
    projectId: "heatmap-a2434",
    storageBucket: "heatmap-a2434.firebasestorage.app",
    messagingSenderId: "416146662212",
    appId: "1:416146662212:web:ec1f748616b201e37a6d11",
    databaseURL: "https://heatmap-a2434-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
