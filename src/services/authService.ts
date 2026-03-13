import { db, auth } from '../firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import { UserProfile } from '../types';
import { handleFirestoreError, OperationType } from './firestoreErrorHandler';

export const setupRecaptcha = (container: string | HTMLElement) => {
  if (!auth) {
    console.error("Auth not initialized");
    return null;
  }
  
  try {
    // Check if the container exists if it's a string
    if (typeof container === 'string' && !document.getElementById(container)) {
      console.warn(`Recaptcha container with id "${container}" not found yet.`);
      return null;
    }

    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, container, {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        }
      });
    }
    return (window as any).recaptchaVerifier;
  } catch (error) {
    console.error("Recaptcha setup error:", error);
    return null;
  }
};

export const loginWithPhone = async (phoneNumber: string, appVerifier: any) => {
  if (!auth || !phoneNumber || !appVerifier) {
    throw new Error("Missing required arguments for phone login");
  }
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error("Phone login error:", error);
    throw error;
  }
};

export const sendEmailOTP = async (email: string) => {
  if (!auth || !email) {
    throw new Error("Missing auth or email");
  }
  const actionCodeSettings = {
    url: window.location.origin + '/login-callback',
    handleCodeInApp: true,
  };
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
  } catch (error) {
    console.error("Email link error:", error);
    throw error;
  }
};

export const completeEmailLinkSignIn = async () => {
  if (!auth) return null;
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      email = window.prompt('Please provide your email for confirmation');
    }
    if (email) {
      try {
        const result = await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        return result.user;
      } catch (error) {
        console.error("Email link sign in error:", error);
        throw error;
      }
    }
  }
  return null;
};

export const loginWithGoogle = async () => {
  if (!auth) throw new Error("Auth not initialized");
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user profile exists
    let userDoc;
    try {
      userDoc = await getDoc(doc(db, 'users', user.uid));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      return null as any; // Should not reach here
    }

    if (!userDoc.exists()) {
      const newUser: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        role: user.email === '4tvsami@gmail.com' ? 'admin' : 'client',
        phoneNumber: user.phoneNumber || null,
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, 'users', user.uid), newUser);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`);
      }
      return newUser;
    }
    return userDoc.data() as UserProfile;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = () => {
  if (!auth) return Promise.resolve();
  return signOut(auth);
};

export const subscribeToAuth = (callback: (user: UserProfile | null) => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          callback(userDoc.data() as UserProfile);
        } else {
          // Create profile for OTP/Magic Link users
          const newUser: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.phoneNumber || 'User',
            role: (user.email === '4tvsami@gmail.com' || user.phoneNumber === '+919876543210') ? 'admin' : 'client', // Replace with real admin phone if known
            phoneNumber: user.phoneNumber || null,
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', user.uid), newUser);
          callback(newUser);
        }
      } catch (error) {
        console.error("Auth subscription error:", error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
