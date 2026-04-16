import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, query, collection, limit, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { sendWelcomeEmail } from '../lib/email';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  signup: (name: string, email: string, password: string) => Promise<{success: boolean, error?: string}>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: data.name || '',
              isAdmin: data.isAdmin || false
            });
          } else {
            // Fallback if doc doesn't exist yet but auth does
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: 'User',
              isAdmin: false
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{success: boolean, error?: string}> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{success: boolean, error?: string}> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      let isAdmin = false;
      try {
        const q = query(collection(db, 'users'), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          isAdmin = true; // First ever user becomes admin
        }
      } catch (error) {
        console.error('Error checking users collection:', error);
      }

      const newUser = {
        name,
        email,
        isAdmin
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      
      setUser({
        id: userCredential.user.uid,
        email,
        name,
        isAdmin
      });

      // Send the welcome email
      sendWelcomeEmail(email, name);

      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
