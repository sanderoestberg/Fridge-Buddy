"use strict";

// ========== GLOBAL FIREBASE CONFIG ========== //
// Your web app's Firebase configuration
const _firebaseConfig = {
    apiKey: "AIzaSyAXTzDFIz8LE_3U4BcV4byriV2GA8vHBh4",
    authDomain: "fridgebuddy-64b1f.firebaseapp.com",
    databaseURL: "https://fridgebuddy-64b1f.firebaseio.com",
    projectId: "fridgebuddy-64b1f",
    storageBucket: "fridgebuddy-64b1f.appspot.com",
    messagingSenderId: "120202777589",
    appId: "1:120202777589:web:61ebc2f3c42af368d686bc"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
const _db = firebase.firestore();