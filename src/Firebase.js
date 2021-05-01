import React from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

// FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyA-5cOhNZFmcbMFljt4_UR7-jYJ5lnRvzk",
    authDomain: "cse330-mod7.firebaseapp.com",
    databaseURL: "https://cse330-mod7-default-rtdb.firebaseio.com",
    projectId: "cse330-mod7",
    storageBucket: "cse330-mod7.appspot.com",
    messagingSenderId: "374442748752",
    appId: "1:374442748752:web:7c9e7e792a580a7b9f5a55",
    measurementId: "G-5DFC9BY1VJ"
  };

firebase.initializeApp(firebaseConfig);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

//Initializes the firebase app so that other files
//can access the user info and the data


// export const AuthContext = React.createContext(null);


export var auth = firebase.auth();
export var database = firebase.database();
export var provider = new firebase.auth.GoogleAuthProvider();