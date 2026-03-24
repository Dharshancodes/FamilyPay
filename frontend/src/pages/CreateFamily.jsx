import React from "react";
import { useNavigate } from "react-router-dom";
import { useFamily } from "../FamilyContext.jsx";

const ROLE_OPTIONS = ["Admin", "Spouse", "Teen", "Child", "Elder"];

export default function CreateFamily() {
  const navigate = useNavigate();
  const { setFamily, setCurrentUserId, setIsAuthenticated } = useFamily();

  const [step, setStep] = React.useState(1);
  const [familyName, setFamilyName] = React.useState("Sharma Family");
  const [adminName, setAdminName] = React.useState("Rajesh");
  const [adminPhone, setAdminPhone] = React.useState("");
  const [members, setMembers] = React.useState([
    { name: "Priya", role: "Spouse" },
    { name: "Aryan", role: "Teen" },
    { name: "Neha", role: "Child" },
    { name: "Dadaji", role: "Elder" }
  ]);
  const [error, setError] = React.useState("");

  const totalMembers = 1 + members.filter((m) => m.name.trim()).length;

  const handleCreate = () => {
    setError("");
    if (!familyName.trim()) {
      setError("Please enter a family name.");
      return;
    }
    if (!adminName.trim()) {
      setError("Please enter the Admin name.");
      return;
    }

    const famSlug = familyName.split(" ")[0].toLowerCase();

    const adminId = adminName.toLowerCase().replace(/\s+/g, "");
    const builtMembers = [
      {
        id: adminId,
        name: adminName.trim(),
        role: "Admin",
        handle: `@${famSlug}.${adminId}`,
        color: "bg-primary",
        balance: 0,
        monthlyLimit: null,
        categoriesAllowed: ["Food", "Transport", "Education", "Shopping", "Other"],
        approvalThreshold: 10000,
        isElder: false
      }
    ];

    members.forEach((m, idx) => {
      if (!m.name.trim()) return;
      const baseId = m.name.toLowerCase().replace(/\s+/g, "");
      const role = m.role || "Spouse";
      builtMembers.push({
        id: baseId,
        name: m.name.trim(),
        role,
        handle: `@${famSlug}.${baseId}`,
        color: pickColorForIndex(idx),
        balance: 0,
        monthlyLimit: role === "Teen" ? 3000 : role === "Child" ? 1500 : null,
        categoriesAllowed:
          role === "Teen"
            ? ["Food", "Education", "Shopping"]
            : role === "Child"
            ? ["Food", "Education"]
            : ["Food", "Transport", "Education", "Shopping", "Other"],
        approvalThreshold: role === "Teen" || role === "Child" ? 1000 : 5000,
        isElder: role === "Elder"
      });
    });

    const newFamily = {
      id: `${famSlug}-family`,
      name: familyName.trim(),
      walletBalance: 0,
      sharedGoals: [],
      members: builtMembers,
      transactions: []
    };

    setFamily(newFamily);
    setCurrentUserId(adminId);
    setIsAuthenticated(true);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="mx-auto flex h-full max-w-md flex-col justify-center px-4">
      <h2 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
        Set up your family
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        Create one shared FamilyPay account with up to 5 members.
      </p>

      <div className="mb-4 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          Step {step} of 2
        </span>
        <span>
          Members: {totalMembers} / 5
        </span>
      </div>

      {step === 1 ? (
        <section className="space-y-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
              Family name
            </label>
            <input
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Sharma Family"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
            <p className="mt-1 text-[10px] text-slate-500">
              Used to generate UPI-style handles like @sharma.rajesh.
            </p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
              Admin / Parent name
            </label>
            <input
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Rajesh"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
              Admin mobile (for OTP)
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
              <span className="mr-2 text-slate-500">+91</span>
              <input
                type="tel"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="98765 43210"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md shadow-primary/30"
          >
            Next: Add family members
          </button>
        </section>
      ) : (
        <section className="space-y-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
          <p className="text-[11px] text-slate-500">
            Add your spouse, kids, and elders. You can always edit roles and limits later.
          </p>
          {members.map((m, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-2 text-xs dark:bg-slate-900"
            >
              <div className="flex-1">
                <label className="mb-1 block text-[10px] font-medium text-slate-600 dark:text-slate-300">
                  Member {index + 2} name
                </label>
                <input
                  value={m.name}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((mm, i) =>
                        i === index ? { ...mm, name: e.target.value } : mm
                      )
                    )
                  }
                  placeholder={["Priya", "Aryan", "Neha", "Dadaji"][index]}
                  className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div className="w-28">
                <label className="mb-1 block text-[10px] font-medium text-slate-600 dark:text-slate-300">
                  Role
                </label>
                <select
                  value={m.role}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((mm, i) =>
                        i === index ? { ...mm, role: e.target.value } : mm
                      )
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-[11px] dark:border-slate-700 dark:bg-slate-950"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {error && (
            <p className="text-[11px] text-red-500">
              {error}
            </p>
          )}

          <div className="mt-1 flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-full bg-slate-100 px-4 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="flex-1 rounded-full bg-teal px-4 py-2 font-semibold text-white shadow-md shadow-teal/30"
            >
              Create family & continue
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function pickColorForIndex(index) {
  const palette = ["bg-teal", "bg-indigo-500", "bg-pink-500", "bg-amber-500"];
  return palette[index % palette.length];
}

