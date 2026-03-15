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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
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
        phoneNumber: user.phoneNumber || null,
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, 'users', user.uid), newUser);
        // Also create a client document for the user
        if (newUser.role === 'client') {
          await setDoc(doc(db, 'clients', user.uid), {
            name: newUser.displayName,
            email: newUser.email,
            phone: newUser.phoneNumber || '',
            createdAt: newUser.createdAt,
            updatedAt: newUser.createdAt
          });
        }
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

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    await updateProfile(user, { displayName });

    const newUser: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: displayName,
      role: 'client',
      phoneNumber: null,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), newUser);
    
    // Also create a client document for the user
    await setDoc(doc(db, 'clients', user.uid), {
      name: displayName,
      email: email,
      phone: '',
      createdAt: newUser.createdAt,
      updatedAt: newUser.createdAt
    });

    return newUser;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    console.log("Attempting email login for:", email);
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    console.log("Firebase Auth success for:", user.uid);
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      console.log("User profile found in Firestore");
      return userDoc.data() as UserProfile;
    }
    
    console.log("User profile missing in Firestore, creating default...");
    const newUser: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'User',
      role: user.email === '4tvsami@gmail.com' ? 'admin' : 'client',
      phoneNumber: user.phoneNumber || null,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', user.uid), newUser);
    return newUser;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

export const subscribeToAuth = (callback: (user: UserProfile | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("Auth state changed: User logged in", user.uid);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let userData: UserProfile;

        if (userDoc.exists()) {
          userData = userDoc.data() as UserProfile;
          console.log("Auth subscription: Profile found", userData.role);
        } else {
          console.log("Auth subscription: Profile missing, auto-creating...");
          userData = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'User',
            role: user.email === '4tvsami@gmail.com' ? 'admin' : 'client',
            phoneNumber: user.phoneNumber || null,
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', user.uid), userData);
        }
        
        // Ensure client document exists if role is client
        if (userData.role === 'client') {
          const clientDoc = await getDoc(doc(db, 'clients', user.uid));
          if (!clientDoc.exists()) {
            console.log("Auth subscription: Client doc missing, creating...");
            await setDoc(doc(db, 'clients', user.uid), {
              name: userData.displayName || 'Unnamed Client',
              email: userData.email,
              phone: userData.phoneNumber || '',
              createdAt: userData.createdAt,
              updatedAt: userData.createdAt
            });
          }
        }
        
        callback(userData);
      } catch (error) {
        console.error("Auth subscription error:", error);
        callback(null);
      }
    } else {
      console.log("Auth state changed: User logged out");
      callback(null);
    }
  });
};
