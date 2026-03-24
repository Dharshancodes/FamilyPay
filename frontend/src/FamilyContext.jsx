import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFamily } from "./api.js";
import { family as initialFamily, pendingApprovals as initialApprovals } from "./dummyData.js";

const FamilyContext = createContext(null);

export function FamilyProvider({ children }) {
  const [family, setFamily] = useState(initialFamily);
  const [approvals, setApprovals] = useState(initialApprovals);
  
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!auth) {
      // Fallback if Firebase isn't configured, stay with dummy data
      setCurrentUserId("rajesh");
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          if (db) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const familyId = userData.familyId;
              
              if (familyId) {
                const res = await getFamily(familyId);
                const { family: fetchedFamily, members } = res.data;
                // Add transactions/goals arrays if they don't exist since our backend currently doesn't fetch them, 
                // we'll merge with initialFamily arrays for hackathon presentation
                setFamily({
                  ...fetchedFamily,
                  members,
                  transactions: initialFamily.transactions,
                  sharedGoals: initialFamily.sharedGoals
                });
              }
            }
          }
        } catch (err) {
          console.error("Error fetching family data", err);
        }
        
        setIsAuthenticated(true);
        setCurrentUserId(user.uid);
      } else {
        setIsAuthenticated(false);
        setCurrentUserId(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const currentUser = useMemo(
    () => family?.members?.find((m) => m.id === currentUserId) || family?.members?.[0] || null,
    [family, currentUserId]
  );

  const value = useMemo(
    () => ({
      family,
      setFamily,
      approvals,
      setApprovals,
      currentUser,
      currentUserId,
      setCurrentUserId,
      darkMode,
      setDarkMode,
      isAuthenticated,
      setIsAuthenticated,
      firebaseUser
    }),
    [family, approvals, currentUser, currentUserId, darkMode, isAuthenticated, firebaseUser]
  );

  if (loading) {
    return <div className="flex h-full items-center justify-center bg-slate-50 dark:bg-slate-900">Loading FamilyPay...</div>;
  }

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamily() {
  const ctx = useContext(FamilyContext);
  if (!ctx) {
    throw new Error("useFamily must be used within FamilyProvider");
  }
  return ctx;
}

