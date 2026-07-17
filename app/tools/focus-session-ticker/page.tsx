"use client";
import { useState, useEffect, useRef } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, Select, Toggle } from "@/components/ui";

export default function FocusTicker() {
  const [hourlyRate, setHourlyRate] = useState(50);
  const [sessionMins, setSessionMins] = useState(90);
  const [isOpen, setIsOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const targetSeconds = isOpen ? Infinity : sessionMins * 60;
  const value = (elapsed / 3600) * hourlyRate;
  const progress = isOpen ? 0 : Math.min(elapsed / targetSeconds, 1);
  const remaining = isOpen ? null : Math.max(0, targetSeconds - elapsed);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          const next = e + 1;
          if (!isOpen && next >= targetSeconds) {
            setRunning(false);
            if (Notification.permission === "granted") {
              new Notification("Focus session complete! 🎉", { body: `You generated $${((next / 3600) * hourlyRate).toFixed(2)} of value.` });
            }
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, isOpen, targetSeconds, hourlyRate]);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60;
    return h > 0 ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}` : `${m}:${String(sec).padStart(2,"0")}`;
  };

  const reset = () => { setRunning(false); setElapsed(0); };

  const requestNotification = () => {
    if ("Notification" in window && Notification.permission !== "granted") Notification.requestPermission();
  };

  const circumference = 2 * Math.PI * 90;

  return (
    <ToolLayout toolNum={11} category="⏱️ Time & Remote Work" title="Focus Session" titleHighlight="Value Ticker"
      description="A live counter that shows the value you're generating during your work session in real time."
    >
      <div className="max-w-lg mx-auto space-y-5">
        <Card>
          <SectionTitle>Session Setup</SectionTitle>
          <div className="space-y-4">
            <div>
              <FieldLabel htmlFor="rate">Your Hourly Rate</FieldLabel>
              <NumInput id="rate" value={hourlyRate} onChange={setHourlyRate} prefix="$" min={1} step={5} />
            </div>
            <Toggle checked={isOpen} onChange={setIsOpen} label="Open-ended stopwatch (no timer)" />
            {!isOpen && (
              <div>
                <FieldLabel htmlFor="sess">Session Length</FieldLabel>
                <NumInput id="sess" value={sessionMins} onChange={setSessionMins} suffix="minutes" min={1} max={480} />
              </div>
            )}
            <button onClick={requestNotification} className="text-xs text-slate-500 hover:text-blue-400 transition-colors">
              Enable end-of-session notification →
            </button>
          </div>
        </Card>

        <div className="flex flex-col items-center gap-6">
          {/* Progress ring */}
          <div className="relative w-52 h-52">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#1e2540" strokeWidth="12" />
              <circle cx="100" cy="100" r="90" fill="none" stroke="#3b82f6" strokeWidth="12"
                strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold tabular-nums text-slate-900">{fmt(elapsed)}</span>
              <span className="text-green-400 font-bold text-xl mt-1">${value.toFixed(2)}</span>
              <span className="text-slate-500 text-xs mt-0.5">generated</span>
              {remaining !== null && remaining > 0 && (
                <span className="text-slate-500 text-xs mt-1">{fmt(remaining)} left</span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setRunning((r) => !r)}
              className={`px-8 py-3 rounded-xl font-semibold text-slate-900 transition-all ${running ? "bg-amber-600 hover:bg-amber-500" : "bg-blue-600 hover:bg-blue-500"}`}>
              {running ? "⏸ Pause" : elapsed > 0 ? "▶ Resume" : "▶ Start"}
            </button>
            <button onClick={reset} className="px-5 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all">
              ↺ Reset
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
