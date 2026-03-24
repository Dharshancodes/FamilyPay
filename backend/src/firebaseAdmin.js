import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";
import dns from "node:dns";

// Fix for Node >= 17 IPv6 ENOTFOUND resolution issues on certain networks
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

let app;

// Attempt to initialize using GOOGLE_APPLICATION_CREDENTIALS
try {
  // getApps().length checks if we're already initialized logic.
  if (getApps().length === 0) {
    app = initializeApp();
    console.log("Firebase Admin Initialized successfully.");
  } else {
    app = getApp();
  }
} catch (error) {
  console.warn("Failed to initialize Firebase Admin. Ensure GOOGLE_APPLICATION_CREDENTIALS env variable is set to a valid service account JSON.");
  console.warn(error.message);
}

export const db = getFirestore(app);
export const auth = getAuth(app);
