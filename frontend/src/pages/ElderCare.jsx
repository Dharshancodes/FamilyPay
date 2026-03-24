import React from "react";
import { useFamily } from "../FamilyContext.jsx";
import { formatINR, transactionsForMember } from "../utils.js";

export default function ElderCare() {
  const { family, setFamily } = useFamily();
  const elders = family.members.filter((m) => m.isElder);

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const weeklySummaries = elders.map((elder) => {
    const tx = transactionsForMember(family, elder.id).filter(
      (t) => new Date(t.time) >= weekAgo && t.type === "debit"
    );
    const total = tx.reduce((s, t) => s + t.amount, 0);
    return { elder, tx, total };
  });

  const riskyTransactions = family.transactions.filter(
    (t) =>
      elders.some((e) => e.id === t.memberId) &&
      t.type === "debit" &&
      t.amount > 2000 &&
      (t.isUnknownMerchant ?? true)
  );

  const toggleBlockElder = (elderId) => {
    setFamily({
      ...family,
      members: family.members.map((m) =>
        m.id === elderId
          ? {
              ...m,
              blocked: !m.blocked
            }
          : m
      )
    });
  };

  return (
    <div className="space-y-3">
      <section className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Elder care mode
        </h3>
        <p className="text-[11px] text-slate-500">
          Keep an eye on high-value or unusual spends for elders and block in one tap if needed.
        </p>
      </section>

      {elders.map((elder) => {
        const weekly = weeklySummaries.find((s) => s.elder.id === elder.id);
        return (
          <section
            key={elder.id}
            className="rounded-2xl bg-white p-3 text-xs shadow-sm dark:bg-slate-950"
          >
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                  {elder.name}
                </div>
                <div className="text-[10px] text-slate-500">{elder.handle}</div>
              </div>
              <button
                type="button"
                onClick={() => toggleBlockElder(elder.id)}
                className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
                  elder.blocked
                    ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    : "bg-red-500 text-white"
                }`}
              >
                {elder.blocked ? "Unblock wallet" : "Emergency block"}
              </button>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5 text-[11px] dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Weekly spend (last 7 days)</span>
                <span className="font-semibold text-slate-900 dark:text-slate-50">
                  {formatINR(weekly?.total ?? 0)}
                </span>
              </div>
              <div className="mt-1 text-[10px] text-slate-500">
                Auto-sent to Admin every Sunday at 9 AM.
              </div>
            </div>
          </section>
        );
      })}

      <section className="mb-4 rounded-2xl bg-white p-3 text-xs shadow-sm dark:bg-slate-950">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Risk alerts (above ₹2,000 from unknown merchants)
        </h3>
        <div className="space-y-1.5">
          {riskyTransactions.length === 0 && (
            <div className="text-[11px] text-slate-500">No risky spends detected right now.</div>
          )}
          {riskyTransactions.map((t) => {
            const elder = elders.find((e) => e.id === t.memberId);
            return (
              <div
                key={t.id}
                className="rounded-lg bg-amber-50 px-2.5 py-2 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {elder?.name} • {t.merchant}
                  </span>
                  <span className="text-[11px] font-semibold">{formatINR(t.amount)}</span>
                </div>
                <div className="text-[10px]">
                  {new Date(t.time).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                  . Marked as unknown merchant.
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

