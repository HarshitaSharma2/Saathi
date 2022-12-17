import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCH4R0a_RrxqYnKYc67KV2NpjfoxZO4aGY",
    authDomain: "saathi-87ecf.firebaseapp.com",
    projectId: "saathi-87ecf",
    storageBucket: "saathi-87ecf.appspot.com",
    messagingSenderId: "954028477170",
    appId: "1:954028477170:web:ad3d768955b3b70c441e6b"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);