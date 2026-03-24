import React from "react";
import { useNavigate } from "react-router-dom";
import { useFamily } from "../FamilyContext.jsx";

const ROLES = ["Admin", "Spouse", "Teen", "Child", "Elder"];

export default function AddMember() {
  const { family, setFamily } = useFamily();
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("Teen");
  const [mobile, setMobile] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (family.members.length >= 5) {
      setError("This family already has 5 members. You cannot add more.");
      return;
    }
    if (!name || !role || !mobile) return;

    const baseId = name.toLowerCase().replace(/\s+/g, "");
    const id = `${baseId}-${Date.now().toString(36)}`;
    const handle = `@${family.name.split(" ")[0].toLowerCase()}.${baseId}`;

    const newMember = {
      id,
      name,
      role,
      handle,
      color: "bg-slate-500",
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
    };

    setFamily({
      ...family,
      members: [...family.members, newMember]
    });
    navigate("/dashboard");
  };

  return (
    <div className="mx-auto max-w-md space-y-3">
      <section className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Add family member
        </h3>
        <p className="text-[11px] text-slate-500">
          One family account supports up to 5 members. Each member gets their own handle
          and wallet view.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950"
      >
        <div className="text-xs">
          <label className="mb-1 block text-[11px] font-medium text-slate-600 dark:text-slate-300">
            Full name
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
            placeholder="Ananya"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="text-xs">
          <label className="mb-1 block text-[11px] font-medium text-slate-600 dark:text-slate-300">
            Mobile number
          </label>
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            <span className="mr-1 text-[11px] text-slate-500">+91</span>
            <input
              className="w-full bg-transparent text-xs outline-none"
              placeholder="98765 12345"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        </div>
        <div className="text-xs">
          <label className="mb-1 block text-[11px] font-medium text-slate-600 dark:text-slate-300">
            Role
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md shadow-primary/30"
        >
          Invite member
        </button>
        {error && (
          <p className="mt-2 text-[10px] font-medium text-red-500">
            {error}
          </p>
        )}
        <p className="text-[10px] text-slate-500">
          In a production setup, this would trigger an SMS with OTP and a deep link to
          install the FamilyPay PWA.
        </p>
      </form>
    </div>
  );
}

