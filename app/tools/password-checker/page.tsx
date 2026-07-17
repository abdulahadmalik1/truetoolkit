"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle } from "@/components/ui";

interface Check { label: string; pass: boolean; tip: string; severity: "high" | "medium" | "low"; }

function analyzePassword(pw: string): Check[] {
  if (!pw) return [];
  return [
    {
      label: "At least 12 characters",
      pass: pw.length >= 12,
      tip: pw.length >= 12 ? "Great — shorter passwords are cracked faster." : `You have ${pw.length}. Add ${12 - pw.length} more characters.`,
      severity: "high",
    },
    {
      label: "Contains uppercase letters",
      pass: /[A-Z]/.test(pw),
      tip: "Mix upper and lowercase letters for more combinations.",
      severity: "medium",
    },
    {
      label: "Contains lowercase letters",
      pass: /[a-z]/.test(pw),
      tip: "Lowercase letters expand the character set.",
      severity: "medium",
    },
    {
      label: "Contains numbers",
      pass: /[0-9]/.test(pw),
      tip: "Adding digits multiplies possible combinations.",
      severity: "medium",
    },
    {
      label: "Contains symbols (!@#$...)",
      pass: /[^a-zA-Z0-9]/.test(pw),
      tip: "Symbols dramatically slow down brute-force attacks.",
      severity: "high",
    },
    {
      label: "Not all same character",
      pass: !(/^(.)\1+$/).test(pw),
      tip: "Repeated characters (aaaaaa, 111111) are among the first tried.",
      severity: "high",
    },
    {
      label: "No obvious patterns (123, abc, qwerty)",
      pass: !(/123|234|345|456|567|678|789|abc|bcd|qwerty|password|letmein/i).test(pw),
      tip: "Common patterns are in every cracker's dictionary.",
      severity: "high",
    },
    {
      label: "At least 16 characters (excellent)",
      pass: pw.length >= 16,
      tip: pw.length >= 16 ? "16+ characters makes brute-force computationally infeasible." : "16+ chars is the gold standard.",
      severity: "low",
    },
  ];
}

function estimateCrackTime(pw: string): string {
  if (!pw) return "—";
  const charsetSize = (() => {
    let s = 0;
    if (/[a-z]/.test(pw)) s += 26;
    if (/[A-Z]/.test(pw)) s += 26;
    if (/[0-9]/.test(pw)) s += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) s += 32;
    return Math.max(s, 1);
  })();
  const combinations = Math.pow(charsetSize, pw.length);
  const guessesPerSec = 1e11; // 100 billion/sec (offline attack GPU)
  const seconds = combinations / guessesPerSec / 2; // avg half keyspace
  if (seconds < 1) return "Less than a second";
  if (seconds < 60) return `~${seconds.toFixed(0)} seconds`;
  if (seconds < 3600) return `~${(seconds / 60).toFixed(0)} minutes`;
  if (seconds < 86400) return `~${(seconds / 3600).toFixed(0)} hours`;
  if (seconds < 365 * 86400) return `~${(seconds / 86400).toFixed(0)} days`;
  if (seconds < 100 * 365 * 86400) return `~${(seconds / 365 / 86400).toFixed(0)} years`;
  return "Centuries (computationally infeasible)";
}

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const checks = analyzePassword(password);
  const passed = checks.filter((c) => c.pass).length;
  const score = checks.length > 0 ? Math.round((passed / checks.length) * 100) : 0;
  const crackTime = estimateCrackTime(password);

  let grade: string, gradeColor: string;
  if (score >= 85) { grade = "Strong"; gradeColor = "text-emerald-400"; }
  else if (score >= 65) { grade = "Moderate"; gradeColor = "text-blue-400"; }
  else if (score >= 40) { grade = "Weak"; gradeColor = "text-amber-400"; }
  else { grade = "Very Weak"; gradeColor = "text-red-400"; }

  return (
    <ToolLayout toolNum={22} category="📱 Content & Social" title="Password Weakness" titleHighlight="Explainer"
      description="Understand WHY your password is weak or strong — with human-readable explanations, not just a score."
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-amber-400 text-xs">
          🔒 Privacy: Password analysis happens entirely in your browser. Nothing is sent to any server.
        </div>

        <Card>
          <SectionTitle>Enter Password to Analyse</SectionTitle>
          <div className="flex rounded-xl overflow-hidden border border-slate-300 bg-slate-50 focus-within:border-blue-500 transition-all">
            <input
              type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Type any password..."
              className="flex-1 px-3 py-3 bg-transparent text-slate-900 text-sm outline-none font-mono"
            />
            <button onClick={() => setShow((s) => !s)} className="px-4 text-slate-600 hover:text-slate-900 text-sm transition-colors">
              {show ? "Hide" : "Show"}
            </button>
          </div>
          {password && (
            <div className="mt-3">
              <div className="flex justify-between mb-1.5 text-sm">
                <span className="text-slate-600">Strength</span>
                <span className={`font-bold ${gradeColor}`}>{grade}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${score}%`, backgroundColor: score >= 85 ? "#10b981" : score >= 65 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444" }} />
              </div>
              <p className="text-xs text-slate-500 mt-2">Estimated GPU crack time: <strong className="text-slate-700">{crackTime}</strong></p>
            </div>
          )}
        </Card>

        {checks.length > 0 && (
          <Card>
            <SectionTitle>Detailed Check</SectionTitle>
            <div className="space-y-2">
              {checks.map((c) => (
                <div key={c.label} className={`flex gap-3 p-3 rounded-xl border ${c.pass ? "bg-emerald-500/5 border-emerald-500/20" : c.severity === "high" ? "bg-red-500/10 border-red-500/20" : "bg-amber-500/5 border-amber-500/20"}`}>
                  <span className={`text-lg flex-shrink-0 ${c.pass ? "text-emerald-400" : c.severity === "high" ? "text-red-400" : "text-amber-400"}`}>
                    {c.pass ? "✓" : "✗"}
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${c.pass ? "text-emerald-300" : "text-slate-900"}`}>{c.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{c.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
