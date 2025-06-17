// Firebase configuration and setup
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Your Firebase configuration - UPDATE WITH YOUR REAL VALUES
// Get these from Firebase Console → Project Settings → Your apps → Web app
const firebaseConfig = {
  apiKey: "AIzaSyD1aeVrmfMUEet4S1tga7BE5cNiTotTzWU", // ⚠️ REPLACE: Should start with "AIzaSy..."
  authDomain: "techtyrone-cacc3.firebaseapp.com", // ⚠️ REPLACE: Should be "yourproject.firebaseapp.com"
  projectId: "techtyrone-cacc3", // ⚠️ REPLACE: Your actual project ID
  storageBucket: "techtyrone-cacc3.firebasestorage.app", // ⚠️ REPLACE: Should be "yourproject.appspot.com"
  messagingSenderId: "705432263871", // ⚠️ REPLACE: Should be numbers only
  appId: "1:705432263871:web:3a3c9d8d97d987c218fa0a", // ⚠️ REPLACE: Should start with "1:" and contain ":web:"
  measurementId: "G-J4SS2W1P6D" // ⚠️ REPLACE: Optional, starts with "G-"
};

// Validate configuration
const isConfigValid = 
  firebaseConfig.apiKey.startsWith('AIzaSy') &&
  firebaseConfig.authDomain.endsWith('.firebaseapp.com') &&
  !firebaseConfig.projectId.includes('myproject') &&
  firebaseConfig.storageBucket.endsWith('.appspot.com');

if (!isConfigValid) {
  console.error('🚨 FIREBASE CONFIG ERROR: You are still using placeholder values!');
  console.error('Please replace the placeholder values with your actual Firebase configuration.');
  console.error('Go to: https://console.firebase.google.com/ → Your Project → Settings → General → Your apps');
}

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  console.error('Please check your Firebase configuration values.');
}

export { auth, db };

// Google provider for social login
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, displayName?: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName || email.split('@')[0],
        createdAt: new Date(),
        lastLogin: new Date(),
        subscription: 'free'
      });
      
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: new Date()
      }, { merge: true });
      
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user document exists, create if not
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          photoURL: user.photoURL,
          createdAt: new Date(),
          lastLogin: new Date(),
          subscription: 'free'
        });
      } else {
        // Update last login
        await setDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date()
        }, { merge: true });
      }
      
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
};