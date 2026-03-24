import React from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api.js";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !phone || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await signup({ name, phone, password });
      setSuccess("Account created. You can now log in.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-md flex-col justify-center px-4">
      <h2 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
        Create FamilyPay account
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        This demo stores your signup details in the backend memory so you can
        practice login flows.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Full name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900"
            placeholder="Rajesh Sharma"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Mobile number
          </label>
          <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <span className="mr-2 text-slate-500">+91</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98765 43210"
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900"
            placeholder="Min 6 characters"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Confirm password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900"
            placeholder="Re-enter password"
          />
        </div>

        {error && (
          <p className="text-[11px] text-red-500">
            {error}
          </p>
        )}
        {success && (
          <p className="text-[11px] text-teal">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md shadow-primary/30 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="mt-4 text-center text-xs font-medium text-primary underline underline-offset-4"
      >
        Already have an account? Log in
      </button>
    </div>
  );
}

