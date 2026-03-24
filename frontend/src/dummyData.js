export const family = {
  id: "sharma-family",
  name: "Sharma Family",
  walletBalance: 45230,
  sharedGoals: [
    {
      id: "goal-goa-trip",
      name: "Goa Trip",
      target: 25000,
      current: 12000,
      deadline: "2026-12-31"
    },
    {
      id: "goal-laptop-aryan",
      name: "Aryan's Laptop",
      target: 55000,
      current: 15000,
      deadline: "2026-09-30"
    },
    {
      id: "goal-dadaji-health",
      name: "Dadaji Health Fund",
      target: 40000,
      current: 22000,
      deadline: "2026-08-15"
    }
  ],
  members: [
    {
      id: "rajesh",
      name: "Rajesh",
      role: "Admin",
      handle: "@sharma.rajesh",
      color: "bg-primary",
      balance: 15000,
      monthlyLimit: null,
      categoriesAllowed: ["Food", "Transport", "Education", "Shopping", "Other"],
      approvalThreshold: 10000,
      isElder: false
    },
    {
      id: "priya",
      name: "Priya",
      role: "Spouse",
      handle: "@sharma.priya",
      color: "bg-teal",
      balance: 12000,
      monthlyLimit: null,
      categoriesAllowed: ["Food", "Transport", "Education", "Shopping", "Other"],
      approvalThreshold: 8000,
      isElder: false
    },
    {
      id: "aryan",
      name: "Aryan",
      role: "Teen",
      handle: "@sharma.aryan",
      color: "bg-indigo-500",
      balance: 3500,
      monthlyLimit: 3000,
      categoriesAllowed: ["Food", "Education", "Shopping"],
      approvalThreshold: 1000,
      isElder: false
    },
    {
      id: "neha",
      name: "Neha",
      role: "Child",
      handle: "@sharma.neha",
      color: "bg-pink-500",
      balance: 1200,
      monthlyLimit: 1500,
      categoriesAllowed: ["Food", "Education"],
      approvalThreshold: 500,
      isElder: false
    },
    {
      id: "dadaji",
      name: "Dadaji",
      role: "Elder",
      handle: "@sharma.dadaji",
      color: "bg-amber-500",
      balance: 8000,
      monthlyLimit: null,
      categoriesAllowed: ["Food", "Transport", "Other", "Medical"],
      approvalThreshold: 2000,
      isElder: true
    }
  ],
  transactions: [
    {
      id: "tx1",
      memberId: "aryan",
      amount: 450,
      type: "debit",
      category: "Food",
      merchant: "Swiggy",
      time: "2026-03-10T18:45:00+05:30",
      status: "completed"
    },
    {
      id: "tx2",
      memberId: "neha",
      amount: 220,
      type: "debit",
      category: "Education",
      merchant: "Sapna Book House",
      time: "2026-03-09T16:10:00+05:30",
      status: "completed"
    },
    {
      id: "tx3",
      memberId: "priya",
      amount: 980,
      type: "debit",
      category: "Shopping",
      merchant: "Big Bazaar",
      time: "2026-03-08T12:30:00+05:30",
      status: "completed"
    },
    {
      id: "tx4",
      memberId: "rajesh",
      amount: 1500,
      type: "debit",
      category: "Transport",
      merchant: "KSRTC",
      time: "2026-03-07T09:15:00+05:30",
      status: "completed"
    },
    {
      id: "tx5",
      memberId: "dadaji",
      amount: 2300,
      type: "debit",
      category: "Medical",
      merchant: "Apollo Pharmacy",
      time: "2026-03-06T11:00:00+05:30",
      status: "completed",
      isUnknownMerchant: false
    },
    {
      id: "tx7",
      memberId: "dadaji",
      amount: 3200,
      type: "debit",
      category: "Other",
      merchant: "XYZ Online Store",
      time: "2026-03-11T15:20:00+05:30",
      status: "completed",
      isUnknownMerchant: true
    },
    {
      id: "tx6",
      memberId: "aryan",
      amount: 1200,
      type: "debit",
      category: "Shopping",
      merchant: "Amazon India",
      time: "2026-03-05T19:20:00+05:30",
      status: "pending-approval"
    }
  ]
};

export const pendingApprovals = [
  {
    id: "approval-aryan-1",
    transactionId: "tx6",
    memberId: "aryan",
    amount: 1200,
    merchant: "Amazon India",
    category: "Shopping",
    createdAt: "2026-03-05T19:20:00+05:30",
    reason: "Above teen auto-approve limit"
  }
];

