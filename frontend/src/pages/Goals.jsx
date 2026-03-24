import React from "react";
import { Link } from "react-router-dom";
import { useFamily } from "../FamilyContext.jsx";
import { formatINR } from "../utils.js";

export default function Goals() {
  const { family } = useFamily();

  return (
    <div className="space-y-3">
      <section className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Savings goals
          </h3>
          <Link
            to="/goals/new"
            className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white shadow-sm"
          >
            + New goal
          </Link>
        </div>
        <p className="text-[11px] text-slate-500">
          Any member can contribute to a goal. Track progress as a family.
        </p>
      </section>

      {family.sharedGoals.map((g) => {
        const pct = Math.min(100, Math.round((g.current / g.target) * 100));
        const complete = pct >= 100;
        return (
          <section
            key={g.id}
            className="overflow-hidden rounded-2xl bg-white text-xs shadow-sm dark:bg-slate-950"
          >
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                    {g.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Target by {new Date(g.deadline).toLocaleDateString("en-IN")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-semibold text-teal">
                    {formatINR(g.current)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    of {formatINR(g.target)} ({pct}%)
                  </div>
                </div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-full rounded-full ${
                    complete ? "bg-teal" : "bg-primary"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            {complete && (
              <div className="flex items-center justify-center bg-gradient-to-r from-teal to-primary py-2 text-[11px] font-semibold text-white">
                🎉 Goal completed! Time to celebrate together.
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

