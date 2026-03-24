import React from "react";
import { useFamily } from "../FamilyContext.jsx";
import { formatINR, memberById } from "../utils.js";

export default function Approvals() {
  const { family, setFamily, approvals, setApprovals, currentUser } = useFamily();
  const isAdmin = currentUser?.role === "Admin";

  const handleDecision = (approvalId, decision) => {
    const approval = approvals.find((a) => a.id === approvalId);
    if (!approval) return;
    const txId = approval.transactionId;
    const tx = family.transactions.find((t) => t.id === txId);
    if (!tx) return;

    let updatedFamily = { ...family };

    if (decision === "approve") {
      updatedFamily = {
        ...family,
        transactions: family.transactions.map((t) =>
          t.id === txId ? { ...t, status: "completed" } : t
        )
      };
    } else if (decision === "decline") {
      updatedFamily = {
        ...family,
        transactions: family.transactions.map((t) =>
          t.id === txId ? { ...t, status: "refunded" } : t
        ),
        members: family.members.map((m) =>
          m.id === tx.memberId ? { ...m, balance: m.balance + tx.amount } : m
        )
      };
    }

    setFamily(updatedFamily);
    setApprovals(approvals.filter((a) => a.id !== approvalId));
  };

  if (!isAdmin) {
    return (
      <div className="text-sm text-slate-500">
        Only the Admin can view and act on pending approvals.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <section className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Pending approvals
        </h3>
        <p className="text-[11px] text-slate-500">
          Transactions from Teens / Children above their configured limit come here for
          your approval.
        </p>
      </section>

      <section className="mb-4 rounded-2xl bg-white p-3 text-xs shadow-sm dark:bg-slate-950">
        <div className="space-y-2">
          {approvals.length === 0 && (
            <div className="text-[11px] text-slate-500">
              No pending approvals. All clear for now.
            </div>
          )}
          {approvals.map((a) => {
            const member = memberById(family, a.memberId);
            return (
              <div
                key={a.id}
                className="rounded-xl bg-slate-50 p-2.5 shadow-sm dark:bg-slate-900"
              >
                <div className="mb-1 flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-50">
                      {a.merchant}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {member?.name} • {a.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-semibold text-red-500">
                      {formatINR(a.amount)}
                    </div>
                    <div className="text-[9px] text-slate-500">
                      Requested at{" "}
                      {new Date(a.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                </div>
                <div className="mb-2 text-[10px] text-slate-500">{a.reason}</div>
                <div className="flex gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleDecision(a.id, "decline")}
                    className="flex-1 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    Decline & Refund
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision(a.id, "approve")}
                    className="flex-1 rounded-full bg-teal px-3 py-1 font-semibold text-white"
                  >
                    Approve
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

