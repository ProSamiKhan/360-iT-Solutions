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
  signInAnonymously,
  signInWithCustomToken
} from 'firebase/auth';
import { UserProfile } from '../types';
import { handleFirestoreError, OperationType } from './firestoreErrorHandler';

// Custom Email OTP Auth
export const sendEmailOTP = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: normalizedEmail }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
  return data;
};

export const verifyEmailOTP = async (email: string, otp: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: normalizedEmail, otp }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Invalid OTP');

  try {
    // Sign in with the Custom Token from the server
    const userResult = await signInWithCustomToken(auth, data.customToken);
    const uid = userResult.user.uid;
    
    // Check if profile exists for this email
    const userDoc = await getDoc(doc(db, 'users', normalizedEmail));
    
    if (!userDoc.exists()) {
      const newUser: UserProfile = {
        uid: uid,
        email: normalizedEmail,
        displayName: normalizedEmail.split('@')[0],
        role: normalizedEmail === '4tvsami@gmail.com' ? 'admin' : 'client',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', normalizedEmail), newUser);
      return newUser;
    }
    return userDoc.data() as UserProfile;
  } catch (error: any) {
    console.error("OTP Verification Error:", error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  if (!auth) throw new Error("Auth not initialized");
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const normalizedEmail = user.email?.toLowerCase().trim();
    const docId = normalizedEmail || user.uid;
    
    // Check if user profile exists
    let userDoc;
    try {
      userDoc = await getDoc(doc(db, 'users', docId));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${docId}`);
      return null as any; // Should not reach here
    }

    if (!userDoc.exists()) {
      const newUser: UserProfile = {
        uid: user.uid,
        email: normalizedEmail || '',
        displayName: user.displayName || '',
        role: normalizedEmail === '4tvsami@gmail.com' ? 'admin' : 'client',
        phoneNumber: user.phoneNumber || null,
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, 'users', docId), newUser);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${docId}`);
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
        // Try to find profile by UID or Email
        const normalizedEmail = user.email?.toLowerCase().trim();
        const docId = normalizedEmail || user.uid;
        const userDoc = await getDoc(doc(db, 'users', docId));
        if (userDoc.exists()) {
          callback(userDoc.data() as UserProfile);
        } else {
          // If anonymous but we have email in local storage (from OTP flow)
          const savedEmail = localStorage.getItem('otp_email')?.toLowerCase().trim();
          if (savedEmail) {
            const emailDoc = await getDoc(doc(db, 'users', savedEmail));
            if (emailDoc.exists()) {
              callback(emailDoc.data() as UserProfile);
              return;
            }
          }
          callback(null);
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
