import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../../firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create Firestore profile
  const fetchOrCreateProfile = async (firebaseUser) => {
    const ref = doc(db, 'user_profiles', firebaseUser.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setUserProfile(snap.data());
    } else {
      const newProfile = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || '',
        targetInstitution: '',
        intendedCourse: '',
        jambScore: 0,
        syllabusProgress: {},
        createdAt: serverTimestamp()
      };
      await setDoc(ref, newProfile);
      setUserProfile(newProfile);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchOrCreateProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signup = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(result.user, { displayName });
    await fetchOrCreateProfile({ ...result.user, displayName });
    return result;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await fetchOrCreateProfile(result.user);
    return result;
  };

  const logout = () => signOut(auth);

  const updateUserProfile = async (data) => {
    if (!currentUser) return;
    const ref = doc(db, 'user_profiles', currentUser.uid);
    await updateDoc(ref, data);
    setUserProfile(prev => ({ ...prev, ...data }));
  };

  const refreshProfile = async () => {
    if (!currentUser) return;
    const ref = doc(db, 'user_profiles', currentUser.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) setUserProfile(snap.data());
  };

  return (
    <AuthContext.Provider value={{
      currentUser, userProfile, loading,
      signup, login, loginWithGoogle, logout,
      updateUserProfile, refreshProfile
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
