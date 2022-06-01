import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBNx_1tcIFthWlOS6BJcBM9GPx3ZO8G6nc",
  authDomain: "whatsapp-2-e1cb6.firebaseapp.com",
  projectId: "whatsapp-2-e1cb6",
  storageBucket: "whatsapp-2-e1cb6.appspot.com",
  messagingSenderId: "556653495225",
  appId: "1:556653495225:web:1f099b3ce8a28557ea2c68",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
