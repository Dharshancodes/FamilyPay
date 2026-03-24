import React from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "One Wallet. Whole Family.",
    body: "Manage pocket money, bills, and savings for everyone in one shared family wallet."
  },
  {
    title: "Smart Limits for Kids.",
    body: "Set monthly limits, approve big spends, and nudge better money habits for teens and children."
  },
  {
    title: "Peace of Mind for Elders.",
    body: "Get alerts for risky spends, one-tap emergency block, and weekly elder summaries."
  }
];

export default function SplashOnboarding() {
  const navigate = useNavigate();
  const [index, setIndex] = React.useState(0);
  const current = slides[index];

  return (
    <div className="flex h-full flex-col items-center justify-between py-8">
      <div className="flex w-full items-center justify-between px-4 text-xs">
        <span className="font-semibold text-primary">FamilyPay</span>
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-white px-3 py-1 text-[11px] font-semibold text-primary shadow-sm dark:bg-slate-950"
        >
          <span className="h-5 w-5 rounded-full bg-primary text-[11px] text-white flex items-center justify-center">
            +
          </span>
          Sign up
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center px-4 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-2xl text-white shadow-lg">
          ₹
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {current.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">{current.body}</p>
      </div>

      <div className="mb-4 flex flex-col items-center gap-6 px-4">
        <div className="flex gap-2">
          {slides.map((s, i) => (
            <span
              key={s.title}
              className={`h-1.5 w-5 rounded-full ${
                i === index ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            if (index < slides.length - 1) {
              setIndex(index + 1);
            } else {
              navigate("/login");
            }
          }}
          className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30"
        >
          {index < slides.length - 1 ? "Next" : "Get Started"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-xs font-medium text-slate-500 underline underline-offset-4"
        >
          Skip to login
        </button>
      </div>
    </div>
  );
}

