import React from "react";
import { useFamily } from "../FamilyContext.jsx";
import { formatINR } from "../utils.js";

const CATEGORIES = ["Food", "Transport", "Education", "Shopping", "Medical", "Other"];

export default function SpendingLimits() {
  const { family, setFamily, currentUser } = useFamily();
  const isAdmin = currentUser?.role === "Admin";

  const handleUpdateMember = (memberId, updates) => {
    setFamily({
      ...family,
      members: family.members.map((m) => (m.id === memberId ? { ...m, ...updates } : m))
    });
  };

  if (!isAdmin) {
    return (
      <div className="text-sm text-slate-500">
        Only the Admin can configure spending limits for the family.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <section className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Spending controls
        </h3>
        <p className="text-[11px] text-slate-500">
          Set monthly limits, allowed categories, and approval rules for each member.
        </p>
      </section>

      {family.members.map((m) => (
        <section
          key={m.id}
          className="rounded-2xl bg-white p-3 text-xs shadow-sm dark:bg-slate-950"
        >
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-900 dark:text-slate-50">
                {m.name} ({m.role})
              </div>
              <div className="text-[10px] text-slate-500">{m.handle}</div>
            </div>
          </div>

          <div className="mt-2">
            <label className="mb-1 block text-[10px] font-medium text-slate-600 dark:text-slate-300">
              Monthly limit (₹)
            </label>
            <input
              type="number"
              min="0"
              value={m.monthlyLimit ?? ""}
              onChange={(e) =>
                handleUpdateMember(m.id, {
                  monthlyLimit:
                    e.target.value === "" ? null : Math.max(0, Number(e.target.value))
                })
              }
              placeholder={
                m.role === "Teen" || m.role === "Child"
                  ? "e.g. 3000"
                  : "No hard limit (leave empty)"
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900"
            />
            {m.monthlyLimit != null && (
              <p className="mt-0.5 text-[10px] text-slate-500">
                Current limit: <span className="font-semibold">{formatINR(m.monthlyLimit)}</span>
              </p>
            )}
          </div>

          <div className="mt-3">
            <div className="mb-1 text-[10px] font-medium text-slate-600 dark:text-slate-300">
              Allowed categories
            </div>
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map((cat) => {
                const selected = m.categoriesAllowed.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      const set = new Set(m.categoriesAllowed);
                      if (set.has(cat)) {
                        set.delete(cat);
                      } else {
                        set.add(cat);
                      }
                      handleUpdateMember(m.id, { categoriesAllowed: Array.from(set) });
                    }}
                    className={`rounded-full px-2 py-1 text-[10px] ${
                      selected
                        ? "bg-teal text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3">
            <label className="mb-1 block text-[10px] font-medium text-slate-600 dark:text-slate-300">
              Approval mode threshold (₹)
            </label>
            <input
              type="number"
              min="0"
              value={m.approvalThreshold ?? ""}
              onChange={(e) =>
                handleUpdateMember(m.id, {
                  approvalThreshold:
                    e.target.value === "" ? null : Math.max(0, Number(e.target.value))
                })
              }
              placeholder="Above this amount, require tap-to-approve"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          {m.monthlyLimit != null && (
            <div className="mt-2 rounded-xl bg-amber-50 p-2 text-[10px] text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
              When this member crosses 80% of their limit, you will get a real-time alert.
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

