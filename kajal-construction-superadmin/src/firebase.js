import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCtaBnlTBMxOeeDlZAZ1cPgkpffWJBuTP8",
    authDomain: "kajalconstructions-b4ed8.firebaseapp.com",
    projectId: "kajalconstructions-b4ed8",
    storageBucket: "kajalconstructions-b4ed8.appspot.com",
    messagingSenderId: "299094655328",
    appId: "1:299094655328:web:c7198e6a1114d43069de05"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app)
export {storage, auth};


export default db;
