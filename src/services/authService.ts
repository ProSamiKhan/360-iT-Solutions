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
} from 'firebase/auth';
import { UserProfile } from '../types';
import { handleFirestoreError, OperationType } from './firestoreErrorHandler';

export const loginWithGoogle = async () => {
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
        phoneNumber: user.phoneNumber || undefined,
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

export const logout = () => signOut(auth);

export const subscribeToAuth = (callback: (user: UserProfile | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          callback(userDoc.data() as UserProfile);
        } else {
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
