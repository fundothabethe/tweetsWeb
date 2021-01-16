import firebase from "firebase";
import "firebase/firebase-storage";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsKYtP9XANTbyWfnAaWq5IsMv0SLRp1YQ",
  authDomain: "lets-tweet.firebaseapp.com",
  projectId: "lets-tweet",
  storageBucket: "lets-tweet.appspot.com",
  messagingSenderId: "687079571362",
  appId: "1:687079571362:web:f5ecf37715cbf2edfabcfb",
  measurementId: "G-81E41ZMLDB",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
const data = firebaseApp.firestore();
export const storage = firebaseApp.storage().ref();
const auth = firebase.auth();

export { auth };
export default data;
