import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
// Your web app's Firebase configuration
const firebaseConfig = firebase.initializeApp({
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_KEY_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_KEY_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_ID
});

const fb = firebase;
// fb.firestore.setLogLevel('debug')

// firebaseConfig.firestore().settings({experimentalForceLongPolling: true })

// Fix for offline
// Initialize Firebase
const db = firebaseConfig.firestore();

if (location.hostname === "localhost") {
  firebaseConfig.firestore().useEmulator("localhost", 8081);
  firebaseConfig.functions().useEmulator("localhost", 8082);
}

export { db };
