import React from "react";
import { useFamily } from "../FamilyContext.jsx";
import { categoryBreakdown, formatINR, memberById } from "../utils.js";

export default function Reports() {
  const { family } = useFamily();

  const totalSpent = family.transactions
    .filter((t) => t.type === "debit")
    .reduce((s, t) => s + t.amount, 0);

  const totalReceived = family.transactions
    .filter((t) => t.type === "credit")
    .reduce((s, t) => s + t.amount, 0);

  const byMember = family.members.map((m) => {
    const tx = family.transactions.filter(
      (t) => t.memberId === m.id && t.type === "debit"
    );
    return {
      member: m,
      total: tx.reduce((s, t) => s + t.amount, 0)
    };
  });

  const byCategory = categoryBreakdown(family.transactions);

  const comparisonVsLastMonth = "+8% vs last month (demo)";

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-3 print:bg-white">
      <section className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950 print:shadow-none">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Monthly family report
          </h3>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white shadow-sm"
          >
            Download PDF
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          Auto-generated on 1st of every month and sent to the Admin.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
          <div className="text-[10px] text-slate-500">Total spent</div>
          <div className="mt-1 text-lg font-semibold text-red-500">
            {formatINR(totalSpent)}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
          <div className="text-[10px] text-slate-500">Total added / saved</div>
          <div className="mt-1 text-lg font-semibold text-teal">
            {formatINR(totalReceived)}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
          <div className="text-[10px] text-slate-500">Month-on-month change</div>
          <div className="mt-1 text-[13px] font-semibold text-amber-600">
            {comparisonVsLastMonth}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
          <div className="text-[10px] text-slate-500">Active goals</div>
          <div className="mt-1 text-[13px] font-semibold text-slate-900 dark:text-slate-50">
            {family.sharedGoals.length} goals
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-3 text-xs shadow-sm dark:bg-slate-950">
        <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          By member
        </h4>
        <div className="space-y-1.5">
          {byMember.map(({ member, total }) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2 dark:bg-slate-900"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ${member.color}`}
                >
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-100">
                    {member.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{member.role}</div>
                </div>
              </div>
              <div className="text-[11px] font-semibold text-slate-900 dark:text-slate-50">
                {formatINR(total)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-4 rounded-2xl bg-white p-3 text-xs shadow-sm dark:bg-slate-950">
        <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          By category
        </h4>
        <div className="space-y-1.5">
          {Object.entries(byCategory).map(([cat, amt]) => (
            <div
              key={cat}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2 dark:bg-slate-900"
            >
              <span className="text-[11px] font-medium text-slate-800 dark:text-slate-100">
                {cat}
              </span>
              <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-50">
                {formatINR(amt)}
              </span>
            </div>
          ))}
          {Object.keys(byCategory).length === 0 && (
            <div className="text-[11px] text-slate-500">No data yet for this month.</div>
          )}
        </div>
      </section>
    </div>
  );
}

