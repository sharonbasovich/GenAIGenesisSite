import { initializeApp, getApps } from 'firebase/app'
import { initializeAuth } from 'firebase/auth'; //getReactNativePersistance
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDS6MkFZKLr1i2k_B6qLX6krvjq9kxIvuU",
    authDomain: "gymit-7b9d7.firebaseapp.com",
    projectId: "gymit-7b9d7",
    storageBucket: "gymit-7b9d7.firebasestorage.app",
    messagingSenderId: "472135898684",
    appId: "1:472135898684:web:165c1af997480c2400d539",
    measurementId: "g-6RZ1F23W07"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
const auth = initializeAuth(app
)
const db = getFirestore(app)

export default { app, auth, db }