export function formatINR(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function memberById(family, id) {
  return family.members.find((m) => m.id === id);
}

export function transactionsForMember(family, memberId) {
  return family.transactions.filter((t) => t.memberId === memberId);
}

export function computeMonthlySpends(family, month = new Date()) {
  const result = {};
  const ym = `${month.getFullYear()}-${month.getMonth() + 1}`;
  for (const t of family.transactions) {
    if (t.type !== "debit") continue;
    const d = new Date(t.time);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    if (key !== ym) continue;
    result[t.memberId] = (result[t.memberId] || 0) + t.amount;
  }
  return result;
}

export function categoryBreakdown(transactions) {
  const totals = {};
  for (const t of transactions) {
    if (t.type !== "debit") continue;
    const cat = t.category || "Other";
    totals[cat] = (totals[cat] || 0) + t.amount;
  }
  return totals;
}

