import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [onboarding, setOnboarding] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const doc = await firestore()
            .collection('users')
            .doc(firebaseUser.uid)
            .get();
          setProfile(doc.exists ? doc.data() : null);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const signUp = async (email, password, displayName) => {
    setOnboarding(true);
    const cred = await auth().createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName });
    await firestore().collection('users').doc(cred.user.uid).set({
      displayName,
      email,
      createdAt: firestore.FieldValue.serverTimestamp(),
      preferences: [],
    });
    const doc = await firestore().collection('users').doc(cred.user.uid).get();
    setProfile(doc.data());
    return cred.user;
  };

  const signIn = async (email, password) => {
    const cred = await auth().signInWithEmailAndPassword(email, password);
    const doc = await firestore().collection('users').doc(cred.user.uid).get();
    setProfile(doc.exists ? doc.data() : null);
    return cred.user;
  };

  const signOut = async () => {
    await auth().signOut();
    setProfile(null);
  };

  const resetPassword = (email) => auth().sendPasswordResetEmail(email);

  const savePreferences = async (preferences) => {
    if (!user) return;
    await firestore().collection('users').doc(user.uid).update({ preferences });
    setProfile((prev) => ({ ...prev, preferences }));
  };

  const displayName = profile?.displayName || user?.displayName || '';

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      displayName,
      initializing,
      onboarding,
      finishOnboarding: () => setOnboarding(false),
      signUp,
      signIn,
      signOut,
      resetPassword,
      savePreferences,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
