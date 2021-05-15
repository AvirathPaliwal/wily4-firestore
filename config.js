import firebase from 'firebase'

//require("@firebase/firestore")
require('firebase/app')


var firebaseConfig = {
  apiKey: "AIzaSyB0lz2NbOBVEebPmnpxZA8I-dD-WnXqioQ",
  authDomain: "wily-f6ef7.firebaseapp.com",
  projectId: "wily-f6ef7",
  storageBucket: "wily-f6ef7.appspot.com",
  messagingSenderId: "894737147178",
  appId: "1:894737147178:web:960cc11c4ad59c43f36a53"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore()



