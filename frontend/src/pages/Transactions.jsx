import React from "react";
import { useFamily } from "../FamilyContext.jsx";
import { formatINR, memberById } from "../utils.js";

export default function Transactions() {
  const { family } = useFamily();
  const [memberFilter, setMemberFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");

  const members = family.members;
  const categories = [
    "Food",
    "Transport",
    "Education",
    "Shopping",
    "Medical",
    "Other"
  ];

  const filtered = family.transactions
    .filter((t) => (memberFilter === "all" ? true : t.memberId === memberFilter))
    .filter((t) => (categoryFilter === "all" ? true : t.category === categoryFilter))
    .slice()
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="space-y-3">
      <section className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Transaction history
        </h3>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="all">All members</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="mb-4 rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
        <div className="space-y-1.5 text-xs">
          {filtered.length === 0 && (
            <div className="text-[11px] text-slate-500">No transactions found.</div>
          )}
          {filtered.map((t) => {
            const m = memberById(family, t.memberId);
            return (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2 dark:bg-slate-900"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ${m?.color}`}
                  >
                    {m?.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {t.merchant}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        • {m?.name} • {t.category}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(t.time).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
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
            );
          })}
        </div>
      </section>
    </div>
  );
}

