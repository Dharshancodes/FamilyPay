import React from "react";
import { useNavigate } from "react-router-dom";
import { useFamily } from "../FamilyContext.jsx";

export default function AddGoal() {
  const { family, setFamily } = useFamily();
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [target, setTarget] = React.useState("");
  const [deadline, setDeadline] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !target || !deadline) return;
    const newGoal = {
      id: `goal-${Date.now()}`,
      name,
      target: Number(target),
      current: 0,
      deadline
    };
    setFamily({
      ...family,
      sharedGoals: [...family.sharedGoals, newGoal]
    });
    navigate("/goals", { replace: true });
  };

  return (
    <div className="mx-auto max-w-md space-y-3">
      <section className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          New savings goal
        </h3>
        <p className="text-[11px] text-slate-500">
          Create a goal like &quot;Goa Trip&quot; or &quot;Dadaji Health Fund&quot;. Every
          member can contribute.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950"
      >
        <div className="text-xs">
          <label className="mb-1 block text-[11px] font-medium text-slate-600 dark:text-slate-300">
            Goal name
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
            placeholder="Goa Trip"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="text-xs">
          <label className="mb-1 block text-[11px] font-medium text-slate-600 dark:text-slate-300">
            Target amount (₹)
          </label>
          <input
            type="number"
            min="0"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
            placeholder="25000"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
        <div className="text-xs">
          <label className="mb-1 block text-[11px] font-medium text-slate-600 dark:text-slate-300">
            Deadline
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-teal px-4 py-3 text-sm font-semibold text-white shadow-md shadow-teal/30"
        >
          Create goal
        </button>
      </form>
    </div>
  );
}

