import React from "react";
import { useParams } from "react-router-dom";
import { useFamily } from "../FamilyContext.jsx";
import { categoryBreakdown, formatINR, memberById, transactionsForMember } from "../utils.js";

export default function MemberWallet() {
  const { id } = useParams();
  const { family } = useFamily();
  const member = memberById(family, id);
  const tx = transactionsForMember(family, id);
  const breakdown = categoryBreakdown(tx);
  const spentThisMonth = Object.values(breakdown).reduce((s, v) => s + v, 0);
  const remainingLimit =
    member?.monthlyLimit != null ? Math.max(0, member.monthlyLimit - spentThisMonth) : null;
  const pctLimit =
    member?.monthlyLimit != null && member.monthlyLimit > 0
      ? Math.min(100, Math.round((spentThisMonth / member.monthlyLimit) * 100))
      : 0;

  if (!member) {
    return <div className="text-sm text-red-500">Member not found.</div>;
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${member.color}`}
          >
            {member.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {member.name}
            </div>
            <div className="text-[11px] text-slate-500">
              {member.role} • {member.handle}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900">
            <div className="text-[10px] text-slate-500">Wallet balance</div>
            <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
              {formatINR(member.balance)}
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900">
            <div className="text-[10px] text-slate-500">Spent this month</div>
            <div className="mt-1 text-lg font-semibold text-red-500">
              {formatINR(spentThisMonth)}
            </div>
          </div>
        </div>
        {member.monthlyLimit != null && (
          <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-[11px] dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Monthly limit</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {formatINR(member.monthlyLimit)}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-full rounded-full ${
                  pctLimit > 80 ? "bg-red-500" : "bg-teal"
                }`}
                style={{ width: `${pctLimit}%` }}
              />
            </div>
            <div className="mt-0.5 flex justify-between">
              <span className="text-[10px] text-slate-500">
                Remaining:{" "}
                <span
                  className={`font-semibold ${
                    pctLimit > 80 ? "text-red-500" : "text-teal"
                  }`}
                >
                  {formatINR(remainingLimit)}
                </span>
              </span>
              <span className="text-[10px] text-slate-500">{pctLimit}% used</span>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Spend by category
        </h3>
        <div className="space-y-2 text-xs">
          {Object.entries(breakdown).map(([cat, amt]) => (
            <div
              key={cat}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2 dark:bg-slate-900"
            >
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-100">
                {cat}
              </span>
              <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-50">
                {formatINR(amt)}
              </span>
            </div>
          ))}
          {Object.keys(breakdown).length === 0 && (
            <div className="text-[11px] text-slate-500">
              No spends recorded yet for this member.
            </div>
          )}
        </div>
      </section>

      <section className="mb-4 rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Recent transactions
        </h3>
        <div className="space-y-1.5 text-xs">
          {tx.length === 0 && (
            <div className="text-[11px] text-slate-500">No transactions yet.</div>
          )}
          {tx
            .slice()
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2 dark:bg-slate-900"
              >
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-100">
                    {t.merchant}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {t.category} •{" "}
                    {new Date(t.time).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-[11px] font-semibold ${
                      t.type === "debit" ? "text-red-500" : "text-teal"
                    }`}
                  >
                    {t.type === "debit" ? "-" : "+"}
                    {formatINR(t.amount)}
                  </div>
                  <div className="text-[9px] text-slate-500 capitalize">{t.status}</div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

