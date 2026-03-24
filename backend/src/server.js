import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

// For firebase backend
import { db, auth } from "./firebaseAdmin.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Fallback memory storage since Firestore DB isn't initialized on Spark tier
const memoryUsers = [];
const memoryFamilies = [];

app.use(
  cors({
    origin: "*"
  })
);
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || "dummy"; // Used if backend needs to hit REST API

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "familypay-backend" });
});

app.post("/api/auth/signup", async (req, res) => {
  const { name, phone, password } = req.body || {};

  if (!name || !phone || !password) {
    return res.status(400).json({ error: "name, phone and password are required" });
  }

  try {
    const email = `${phone}@familypay.demo`;
    
    // 1. Create user in Firebase Auth
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });
    } catch (firebaseErr) {
      if (firebaseErr.code === 'auth/email-already-exists') {
        return res.status(409).json({ error: "User with this phone already exists" });
      }
      throw firebaseErr;
    }

    const uid = userRecord.uid;

    // 2. Create family doc
    const familyRef = db.collection("families").doc();
    const familyId = familyRef.id;
    const familyData = {
      name: `${name}'s Family`,
      walletBalance: 0,
      createdAt: new Date().toISOString()
    };
    try {
      await familyRef.set(familyData);
    } catch(e) {
      if(e.message.includes('5 NOT_FOUND:')) {
        console.warn('Firestore Database not found, using memory fallback for family');
        memoryFamilies.push({ id: familyId, ...familyData });
      } else {
        throw e;
      }
    }

    // 3. Create user doc
    const userDoc = {
      id: uid,
      name,
      phone,
      email,
      role: "Admin",
      handle: `@${name.toLowerCase()}.${name.toLowerCase().substring(0, 3)}`,
      color: "bg-primary",
      balance: 0,
      familyId,
      monthlyLimit: null,
      categoriesAllowed: ["Food", "Transport", "Education", "Shopping", "Other"],
      approvalThreshold: 10000,
      isElder: false
    };

    try {
      await db.collection("users").doc(uid).set(userDoc);
    } catch(e) {
       if(e.message.includes('5 NOT_FOUND:')) {
         console.warn('Firestore Database not found, using memory fallback for user');
         memoryUsers.push(userDoc);
       } else {
         throw e;
       }
    }

    res.status(201).json({ id: uid, name, phone, familyId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch family and members
app.get("/api/family/:familyId", async (req, res) => {
  const { familyId } = req.params;
  try {
    let familyDocData = null;
    let members = [];
    
    try {
      const familyDoc = await db.collection("families").doc(familyId).get();
      if (familyDoc.exists) {
        familyDocData = { id: familyDoc.id, ...familyDoc.data() };
        const membersSnapshot = await db.collection("users").where("familyId", "==", familyId).get();
        membersSnapshot.forEach(doc => members.push(doc.data()));
      }
    } catch(e) {
       if(e.message.includes('5 NOT_FOUND:')) {
          familyDocData = memoryFamilies.find(f => f.id === familyId);
          members = memoryUsers.filter(u => u.familyId === familyId);
       } else {
          throw e;
       }
    }
    
    if (!familyDocData) {
      return res.status(404).json({ error: "Family not found" });
    }

    res.json({
      family: familyDocData,
      members
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/reports/monthly", (req, res) => {
  // In a real implementation, this would aggregate data from Firestore.
  res.json({
    month: "2026-03",
    totalSpent: 45230,
    totalSaved: 12000,
    comparisonVsLastMonth: "+8%",
    generatedAt: new Date().toISOString()
  });
});

app.post("/api/payments/create-order", async (req, res) => {
  const { amount, receipt, memberId, merchant } = req.body || {};
  
  if (!amount) {
    return res.status(400).json({ error: "amount is required" });
  }

  try {
    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: receipt || `receipt_${Date.now()}`
    };
    
    const order = await razorpay.orders.create(options);
    
    res.json({
      status: "success",
      order,
      memberId,
      merchant
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/payments/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, memberId, amount, merchant, category } = req.body;
  
  const hash = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
                     .update(razorpay_order_id + "|" + razorpay_payment_id)
                     .digest("hex");
                     
  if (hash === razorpay_signature) {
    // Verified. Here we would insert the verified transaction into Firestore.
    // e.g. db.collection('transactions').add(...)
    
    res.json({ success: true, message: "Payment validated" });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

app.listen(port, () => {
  console.log(`FamilyPay backend listening on http://localhost:${port}`);
});

