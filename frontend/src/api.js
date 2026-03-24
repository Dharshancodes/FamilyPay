import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api"
});

export function signup({ name, phone, password }) {
  return api.post("/auth/signup", { name, phone, password });
}

export function loginWithPassword({ phone, password }) {
  return api.post("/auth/login", { phone, password });
}

export function createRazorpayOrder(amount, memberId, merchant = "Add Money") {
  return api.post("/payments/create-order", { amount, memberId, merchant });
}

export function verifyRazorpayPayment(verificationData) {
  return api.post("/payments/verify", verificationData);
}

export function getFamily(familyId) {
  return api.get(`/family/${familyId}`);
}

