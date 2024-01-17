import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_SERVICE_KEY,
  authDomain: "ic-pos.firebaseapp.com",
  projectId: "ic-pos",
  storageBucket: "ic-pos.appspot.com",
  messagingSenderId: "934631668976",
  appId: "1:934631668976:web:d136d223d7ed1181e21635",
  measurementId: "G-M6F68ZE9EC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
// const messaging = getMessaging();
getToken(messaging, { vapidKey: 'BLkYaJKQf2MdrmEwMofkfizo9C3TEFz2a2LCRwpmq0qJRYIK9cB9_oIdGDB8N-i2gVlKwsgzQmcBwc6hvr6uWFo' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // console.log("current token fcm", currentToken)
    console.log("Token FCM was generated")
    window.sessionStorage.setItem("token_fcm", currentToken)
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});

export default messaging
