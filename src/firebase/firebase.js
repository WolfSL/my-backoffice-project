import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD8P__VHGwxRzMYvBx7EirC73ej8I00uc8",
  authDomain: "my-backoffice-f492b.firebaseapp.com",
  projectId: "my-backoffice-f492b",
  storageBucket: "my-backoffice-f492b.firebasestorage.app",
  messagingSenderId: "998182039467",
  appId: "1:998182039467:web:69890fe762573420e7ecee",
  measurementId: "G-LDPGCS18M2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db, firebase };
