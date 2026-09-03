import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc,
  deleteDoc,
  collection,
  query,
  where
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { UserProfile, PublicProfile, UserPsychologicalVector } from '../types';
import { getArchetypeById } from '../utils/scoring';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string, username: string) => Promise<void>;
  sendPasswordlessEmailLink: (email: string) => Promise<void>;
  completePasswordlessSignIn: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  syncVectorToCloud: (vector: UserPsychologicalVector) => Promise<void>;
  updateUserProfileData: (data: Partial<UserProfile>) => Promise<void>;
  exportUserData: () => Promise<Record<string, any>>;
  deleteUserAccountAndData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function generateFriendCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'PSY-';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const AVATAR_COLORS = [
  '#FFE600', '#FF3B30', '#007AFF', '#34C759', 
  '#FF9500', '#AF52DE', '#5856D6', '#00C7BE'
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize or fetch user profile from Firestore
  const fetchOrCreateProfile = async (firebaseUser: User, customUsername?: string, customDisplayName?: string) => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const publicDocRef = doc(db, 'public_profiles', firebaseUser.uid);
    
    try {
      const userSnap = await getDoc(userDocRef);
      const now = new Date().toISOString();

      if (userSnap.exists()) {
        const existingData = userSnap.data() as UserProfile;
        // Update lastActive
        await updateDoc(userDocRef, {
          lastActive: now,
          updatedAt: now,
        });
        setUserProfile({
          ...existingData,
          lastActive: now,
          updatedAt: now,
        });
      } else {
        // Create brand new profile with privacy defaults (opt-out of sensitive trait sharing)
        const friendCode = generateFriendCode();
        const displayName = customDisplayName || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Omni Explorer');
        const username = customUsername || (firebaseUser.email ? firebaseUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : `user_${Math.floor(Math.random() * 9000 + 1000)}`);
        const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName,
          username,
          friendCode,
          avatarColor,
          shareAttachmentStyle: false, // Default opt-in privacy gate
          shareHollandCode: false,     // Default opt-in privacy gate
          lastActive: now,
          createdAt: now,
          updatedAt: now,
        };

        const newPublicProfile: PublicProfile = {
          uid: firebaseUser.uid,
          displayName,
          username,
          friendCode,
          avatarColor,
          primaryArchetypeId: 'intj',
          archetypeTitle: 'The Grand Architect',
          house: 'The Strategists',
          identityVariant: 'A',
          shareAttachmentStyle: false,
          shareHollandCode: false,
          updatedAt: now,
        };

        await setDoc(userDocRef, newProfile);
        await setDoc(publicDocRef, newPublicProfile);

        setUserProfile(newProfile);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchOrCreateProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await fetchOrCreateProfile(result.user);
      }
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await fetchOrCreateProfile(result.user);
      }
    } catch (error) {
      console.error('Email sign-in failed:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string, username: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await updateProfile(result.user, { displayName });
        await fetchOrCreateProfile(result.user, username, displayName);
      }
    } catch (error) {
      console.error('Email registration failed:', error);
      throw error;
    }
  };

  const sendPasswordlessEmailLink = async (email: string) => {
    const actionCodeSettings = {
      url: window.location.origin,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      console.error('Failed to send email sign-in link:', error);
      throw error;
    }
  };

  const completePasswordlessSignIn = async (emailParam?: string): Promise<boolean> => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = emailParam || window.localStorage.getItem('emailForSignIn');
      if (!email) {
        return false;
      }
      try {
        const result = await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        if (result.user) {
          await fetchOrCreateProfile(result.user);
          return true;
        }
      } catch (error) {
        console.error('Error signing in with email link:', error);
        throw error;
      }
    }
    return false;
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  const syncVectorToCloud = async (vector: UserPsychologicalVector) => {
    if (!user) return;
    const now = new Date().toISOString();
    const archetype = getArchetypeById(vector.calculatedArchetypeId);

    const userDocRef = doc(db, 'users', user.uid);
    const publicDocRef = doc(db, 'public_profiles', user.uid);

    try {
      // Build trajectory snapshot
      const currentHistory = userProfile?.vectorHistory || [];
      const newSnapshot = {
        date: now,
        archetypeId: vector.calculatedArchetypeId,
        archetypeCode: archetype.code,
        variant: vector.identityVariant,
        conscientiousness: vector.hexaco.conscientiousness,
        openness: vector.hexaco.openness,
        extraversion: vector.hexaco.extraversion,
        agreeableness: vector.hexaco.agreeableness,
        emotionality: vector.hexaco.emotionality,
        honestyHumility: vector.hexaco.honestyHumility,
        eqScore: vector.traitEq.score,
      };
      const updatedHistory = [...currentHistory, newSnapshot].slice(-10); // Keep last 10 snapshots

      const updatedProfile: Partial<UserProfile> = {
        primaryArchetypeId: vector.calculatedArchetypeId,
        archetypeTitle: archetype?.title || 'Psychometric Pioneer',
        house: archetype?.house || 'The Strategists',
        identityVariant: vector.identityVariant,
        psychologicalVector: vector,
        vectorHistory: updatedHistory,
        updatedAt: now,
      };

      // Check user privacy opt-ins before publishing to public directory
      const isSharingAttachment = userProfile?.shareAttachmentStyle ?? false;
      const isSharingHolland = userProfile?.shareHollandCode ?? false;

      const updatedPublic: Record<string, any> = {
        primaryArchetypeId: vector.calculatedArchetypeId,
        archetypeTitle: archetype?.title || 'Psychometric Pioneer',
        house: archetype?.house || 'The Strategists',
        identityVariant: vector.identityVariant,
        shareAttachmentStyle: isSharingAttachment,
        shareHollandCode: isSharingHolland,
        updatedAt: now,
      };

      if (isSharingAttachment) {
        updatedPublic.attachmentStyle = vector.attachment.style;
      }
      if (isSharingHolland) {
        updatedPublic.hollandCode = vector.riasec.hollandCode;
      }

      await updateDoc(userDocRef, updatedProfile);
      await updateDoc(publicDocRef, updatedPublic);

      setUserProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const updateUserProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const now = new Date().toISOString();
    const userDocRef = doc(db, 'users', user.uid);
    const publicDocRef = doc(db, 'public_profiles', user.uid);

    try {
      const payload = { ...data, updatedAt: now };
      await updateDoc(userDocRef, payload);
      
      const publicPayload: Record<string, any> = {
        updatedAt: now,
      };
      if (data.displayName !== undefined) publicPayload.displayName = data.displayName;
      if (data.username !== undefined) publicPayload.username = data.username;
      if (data.avatarColor !== undefined) publicPayload.avatarColor = data.avatarColor;
      if (data.shareAttachmentStyle !== undefined) {
        publicPayload.shareAttachmentStyle = data.shareAttachmentStyle;
        if (data.shareAttachmentStyle && userProfile?.psychologicalVector?.attachment?.style) {
          publicPayload.attachmentStyle = userProfile.psychologicalVector.attachment.style;
        }
      }
      if (data.shareHollandCode !== undefined) {
        publicPayload.shareHollandCode = data.shareHollandCode;
        if (data.shareHollandCode && userProfile?.psychologicalVector?.riasec?.hollandCode) {
          publicPayload.hollandCode = userProfile.psychologicalVector.riasec.hollandCode;
        }
      }

      await updateDoc(publicDocRef, publicPayload);
      setUserProfile(prev => prev ? { ...prev, ...payload } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  /**
   * P3 Data Governance: Download user data package in compliant JSON format
   */
  const exportUserData = async (): Promise<Record<string, any>> => {
    const exportPackage: Record<string, any> = {
      exportTimestamp: new Date().toISOString(),
      platform: 'OmniPsyche Psychometric Platform',
      userProfile: userProfile || null,
      localVectors: localStorage.getItem('omnipsyche_user_vector_v1') ? JSON.parse(localStorage.getItem('omnipsyche_user_vector_v1')!) : null,
    };

    if (user) {
      try {
        // Fetch friends list
        const friendsSnap = await getDocs(collection(db, 'users', user.uid, 'friends'));
        exportPackage.friends = friendsSnap.docs.map(d => d.data());

        // Fetch user's duels
        const qDuelsInviter = query(collection(db, 'compatibility_duels'), where('inviterUid', '==', user.uid));
        const duelsSnap = await getDocs(qDuelsInviter);
        exportPackage.createdDuels = duelsSnap.docs.map(d => d.data());
      } catch (err) {
        console.warn('Could not fetch all subcollections for export', err);
      }
    }

    return exportPackage;
  };

  /**
   * P3 Data Governance: Completely delete user account, Firestore profile, and subcollections
   */
  const deleteUserAccountAndData = async (): Promise<void> => {
    if (!user) {
      localStorage.clear();
      setUserProfile(null);
      return;
    }

    const currentUid = user.uid;

    try {
      // 1. Delete friends subcollection documents
      const friendsSnap = await getDocs(collection(db, 'users', currentUid, 'friends'));
      for (const friendDoc of friendsSnap.docs) {
        await deleteDoc(friendDoc.ref);
      }

      // 2. Delete private user profile doc
      await deleteDoc(doc(db, 'users', currentUid));

      // 3. Delete public profile doc
      await deleteDoc(doc(db, 'public_profiles', currentUid));

      // 4. Delete created duels
      try {
        const qDuels = query(collection(db, 'compatibility_duels'), where('inviterUid', '==', currentUid));
        const duelsSnap = await getDocs(qDuels);
        for (const duelDoc of duelsSnap.docs) {
          await deleteDoc(duelDoc.ref);
        }
      } catch (e) {
        console.warn('Could not clean up all duels during deletion', e);
      }

      // 5. Clear local storage
      localStorage.clear();

      // 6. Delete Firebase Auth user
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
      }

      setUserProfile(null);
      setUser(null);
    } catch (error) {
      console.error('Account deletion encountered an issue:', error);
      // Even if cloud deletion had partial errors, sign out & clear local data
      await signOut(auth);
      localStorage.clear();
      setUserProfile(null);
      setUser(null);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordlessEmailLink,
        completePasswordlessSignIn,
        logout,
        syncVectorToCloud,
        updateUserProfileData,
        exportUserData,
        deleteUserAccountAndData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
