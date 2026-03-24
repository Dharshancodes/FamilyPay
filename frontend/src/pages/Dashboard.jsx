import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFamily } from "../FamilyContext.jsx";
import { computeMonthlySpends, formatINR, memberById } from "../utils.js";
import { initializeRazorpayPayment } from "../paymentUtils.js";

export default function Dashboard() {
  const { family, currentUser, approvals } = useFamily();
  const navigate = useNavigate();
  const monthlySpends = computeMonthlySpends(family);

  const recent = [...family.transactions]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 5);

  const totalSavedToGoals = family.sharedGoals.reduce(
    (sum, g) => sum + (g.current || 0),
    0
  );

  const isAdmin = currentUser?.role === "Admin";

  const handleAddMoney = async () => {
    // Demo flow: Add money to wallet, simulate 1000 INR
    await initializeRazorpayPayment({
      amount: 1000,
      memberId: currentUser?.id,
      merchant: "Wallet Recharge",
      userName: currentUser?.name,
      onSuccess: () => alert("Money added successfully!"),
      onError: (err) => alert("Failed or cancelled: " + (err.description || err.message))
    });
  };

  const handleSendMoney = async () => {
    // Demo flow: Send money 500 INR
    await initializeRazorpayPayment({
      amount: 500,
      memberId: currentUser?.id,
      merchant: "Send to Contact",
      userName: currentUser?.name,
      onSuccess: () => alert("Money sent successfully!"),
      onError: (err) => alert("Failed or cancelled: " + (err.description || err.message))
    });
  };

  return (
    <div className="space-y-4">
      {/* Family balance card */}
      <section className="rounded-2xl bg-gradient-to-br from-primary to-teal p-4 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-white/70">
              {family.name}
            </div>
            <div className="mt-1 text-[11px] text-white/70">
              Unified balance across all members
            </div>
          </div>
          {isAdmin && approvals.length > 0 && (
            <button
              type="button"
              onClick={() => navigate("/approvals")}
              className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium"
            >
              {approvals.length} pending approval
            </button>
          )}
        </div>
        <div className="mt-5 text-xs text-white/70">Total Family Wallet</div>
        <div className="text-3xl font-semibold">{formatINR(family.walletBalance)}</div>
        <div className="mt-4 flex gap-2 text-[11px]">
          <QuickAction label="Add Money" onClick={handleAddMoney} />
          <QuickAction label="Send" onClick={handleSendMoney} />
          <QuickAction label="Set Limit" onClick={() => navigate("/limits")} />
          <QuickAction label="View Report" onClick={() => navigate("/reports")} />
        </div>
      </section>

      {/* Members spend overview */}
      <section className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            This month by member
          </h3>
          <span className="text-[10px] text-slate-400">Tap to open wallet</span>
        </div>
        <div className="space-y-2">
          {family.members.map((m) => {
            const spent = monthlySpends[m.id] || 0;
            const limit = m.monthlyLimit || null;
            const pct = limit ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => navigate(`/member/${m.id}`)}
                className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-2.5 py-2 text-left text-xs dark:bg-slate-900"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white ${m.color}`}
                  >
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">
                      {m.name}{" "}
                      <span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-slate-600 dark:bg-slate-700 dark:text-slate-100">
                        {m.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">{m.handle}</div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-end gap-1 pl-2">
                  <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-50">
                    {formatINR(spent)}
                  </div>
                  {limit && (
                    <div className="flex w-full items-center gap-1">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className={`h-full rounded-full ${
                            pct > 80 ? "bg-red-500" : "bg-teal"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-500">
                        {pct}% of {formatINR(limit)}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Shared goals */}
      <section className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Shared savings goals
          </h3>
          <Link
            to="/goals"
            className="text-[11px] font-medium text-primary underline underline-offset-4"
          >
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {family.sharedGoals.map((g) => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
            return (
              <div key={g.id} className="rounded-xl bg-slate-50 p-2 text-xs dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-800 dark:text-slate-100">
                    {g.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {formatINR(g.current)} / {formatINR(g.target)}
                  </div>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-teal"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-0.5 flex justify-between text-[10px] text-slate-500">
                  <span>{pct}% achieved</span>
                  <span>Target by {new Date(g.deadline).toLocaleDateString("en-IN")}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-[10px] text-slate-500">
          Total saved towards goals:{" "}
          <span className="font-semibold text-teal">{formatINR(totalSavedToGoals)}</span>
        </div>
      </section>

      {/* Recent transactions */}
      <section className="mb-4 rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Recent activity
          </h3>
          <Link
            to="/transactions"
            className="text-[11px] font-medium text-primary underline underline-offset-4"
          >
            View all
          </Link>
        </div>
        <div className="space-y-1.5 text-xs">
          {recent.map((t) => {
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
                      t.type === "debit"
                        ? "text-red-500"
                        : "text-teal"
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

function QuickAction({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm"
    >
      {label}
    </button>
  );
}

