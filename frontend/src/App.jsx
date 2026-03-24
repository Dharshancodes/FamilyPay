import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { FamilyProvider, useFamily } from "./FamilyContext.jsx";
import SplashOnboarding from "./pages/SplashOnboarding.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import CreateFamily from "./pages/CreateFamily.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MemberWallet from "./pages/MemberWallet.jsx";
import Transactions from "./pages/Transactions.jsx";
import SpendingLimits from "./pages/SpendingLimits.jsx";
import Goals from "./pages/Goals.jsx";
import AddGoal from "./pages/AddGoal.jsx";
import ElderCare from "./pages/ElderCare.jsx";
import Reports from "./pages/Reports.jsx";
import Approvals from "./pages/Approvals.jsx";
import AddMember from "./pages/AddMember.jsx";

function AppShell() {
  const location = useLocation();
  const { darkMode, setDarkMode, isAuthenticated } = useFamily();

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const showBottomNav =
    isAuthenticated && !["/", "/login"].includes(location.pathname);

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white shadow-sm">
            F
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            FamilyPay
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          {darkMode ? "Light" : "Dark"}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-50 px-3 pb-20 pt-3 dark:bg-slate-900">
        <Routes>
          <Route path="/" element={<SplashOnboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/family/create" element={<CreateFamily />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/:id"
            element={
              <ProtectedRoute>
                <MemberWallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/limits"
            element={
              <ProtectedRoute>
                <SpendingLimits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals/new"
            element={
              <ProtectedRoute>
                <AddGoal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/elder-care"
            element={
              <ProtectedRoute>
                <ElderCare />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approvals"
            element={
              <ProtectedRoute>
                <Approvals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/family/add"
            element={
              <ProtectedRoute>
                <AddMember />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showBottomNav && (
        <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white/95 px-2 py-1.5 text-xs backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
          <div className="mx-auto flex max-w-md items-center justify-between gap-1">
            <BottomNavItem to="/dashboard" label="Home" icon="🏠" />
            <BottomNavItem to="/transactions" label="Wallet" icon="💼" />
            <BottomNavItem to="/goals" label="Goals" icon="🎯" />
            <BottomNavItem to="/elder-care" label="Family" icon="👨‍👩‍👧‍👦" />
            <BottomNavItem to="/reports" label="Reports" icon="📊" />
          </div>
        </nav>
      )}
    </div>
  );
}

function BottomNavItem({ to, label, icon }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex flex-1 flex-col items-center rounded-full px-2 py-1 ${
        active
          ? "bg-primary/10 text-primary dark:bg-primary/20"
          : "text-slate-500 dark:text-slate-300"
      }`}
    >
      <span className="text-base leading-none">{icon}</span>
      <span className="mt-0.5 text-[10px] font-medium">{label}</span>
    </Link>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useFamily();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default function App() {
  return (
    <FamilyProvider>
      <AppShell />
    </FamilyProvider>
  );
}

