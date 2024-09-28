// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB6lpBOc0lfxZX07AaI8SSt6K87xjlr39s",
  authDomain: "savealot-db183.firebaseapp.com",
  projectId: "savealot-db183",
  storageBucket: "savealot-db183.appspot.com",
  messagingSenderId: "872432706076",
  appId: "1:872432706076:web:b1f6873b952c8b5492b5d9",
  measurementId: "G-F73G189VMS",
};
// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication, Storage, and Analytics
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export auth, storage, and analytics to be used in other parts of your app
export { app, auth, storage, analytics };
