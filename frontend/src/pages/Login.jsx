import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFamily } from "../FamilyContext.jsx";
import { auth } from "../firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUserId, setIsAuthenticated } = useFamily();

  const [mode, setMode] = React.useState("password"); // "otp" | "password"
  const [mobile, setMobile] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [otp, setOtp] = React.useState("");

  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const redirectAfterLogin =
    (location.state && location.state.from && location.state.from.pathname) ||
    "/dashboard";

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError("");
    if (!mobile) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError("");
    if (!otp || otp.length < 4) {
      setError("Please enter the OTP sent to your number.");
      return;
    }
    // Demo mode: just log in as dummy rajesh if firebase not configured
    setCurrentUserId("rajesh");
    setIsAuthenticated(true);
    navigate(redirectAfterLogin, { replace: true });
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!identifier || !password) {
      setError("Enter both mobile number and password.");
      return;
    }

    try {
      if (auth) {
        const email = `${identifier}@familypay.demo`;
        await signInWithEmailAndPassword(auth, email, password);
        // Context will automatically update!
      } else {
        // Fallback to demo logic if no Firebase config
        setCurrentUserId("rajesh");
        setIsAuthenticated(true);
      }
      navigate(redirectAfterLogin, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Login failed. Check your mobile number and password.");
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-md flex-col justify-center px-4">
      <h2 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
        Welcome to FamilyPay
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        Sign in using OTP on your mobile, or your FamilyPay handle and password.
      </p>

      <div className="mb-4 flex rounded-full bg-slate-100 p-0.5 text-xs dark:bg-slate-800">
        <button
          type="button"
          onClick={() => {
            setMode("otp");
            setError("");
          }}
          className={`flex-1 rounded-full py-1.5 ${
            mode === "otp"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-50"
              : "text-slate-500"
          }`}
        >
          OTP Login
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("password");
            setError("");
          }}
          className={`flex-1 rounded-full py-1.5 ${
            mode === "password"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-50"
              : "text-slate-500"
          }`}
        >
          User ID & Password
        </button>
      </div>

      {mode === "otp" ? (
        <form className="space-y-4" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
              Mobile number
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <span className="mr-2 text-slate-500">+91</span>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="98765 43210"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {otpSent && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                Enter OTP
              </label>
              <input
                type="tel"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit OTP"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900"
              />
              <p className="mt-1 text-[11px] text-teal">
                Demo mode: enter any 6 digits to continue as Rajesh (Admin).
              </p>
            </div>
          )}

          {error && (
            <p className="text-[11px] text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md shadow-primary/30"
          >
            {otpSent ? "Verify & Continue" : "Send OTP"}
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handlePasswordLogin}>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
              Mobile Number
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          {error && (
            <p className="text-[11px] text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-teal px-4 py-3 text-sm font-semibold text-white shadow-md shadow-teal/30"
          >
            Login
          </button>
        </form>
      )}

      <button
        type="button"
        onClick={() => navigate("/signup")}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-white px-4 py-2 text-xs font-semibold text-primary shadow-sm dark:bg-slate-900"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-white">
          +
        </span>
        Create a new FamilyPay account
      </button>

      <div className="mt-4 rounded-xl bg-slate-100 p-3 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-200">
        <div className="font-semibold text-slate-800 dark:text-slate-50">
          Demo credentials
        </div>
        <p>If you signed up, use the mobile number and password you created.</p>
        <p>Alternatively, use the OTP mode as a fallback demo.</p>
      </div>
    </div>
  );
}

