import * as firebase from 'firebase';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB63ISzxnHEcfiOE6Ag3FlL9pgCah7dhDY",
    authDomain: "gqlreactnode45.firebaseapp.com",
    // databaseURL: "https://gqlreactnode45.firebaseio.com",
    projectId: "gqlreactnode45",
    storageBucket: "gqlreactnode45.appspot.com",
    // messagingSenderId: "971606671071",
    appId: "1:971606671071:web:a7fec16a50860f7a18736a",
    measurementId: "G-L27LED0RBE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();