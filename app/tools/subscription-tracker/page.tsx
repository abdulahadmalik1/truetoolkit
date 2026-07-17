"use client";
import { useState, useEffect } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, TextInput, Select, Toggle, ResultCard, ResultHeadline, ResultRow, AddButton, RemoveButton, CopyButton, Disclaimer, SeoContent } from "@/components/ui";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  cycle: "weekly" | "monthly" | "yearly";
}

function toMonthly(amount: number, cycle: string): number {
  if (cycle === "weekly") return amount * 4.33;
  if (cycle === "yearly") return amount / 12;
  return amount;
}

const COFFEE_PRICE = 5;

export default function SubscriptionTracker() {
  const [subs, setSubs] = useState<Subscription[]>([
    { id: "1", name: "Netflix", amount: 15, cycle: "monthly" },
    { id: "2", name: "Spotify", amount: 10, cycle: "monthly" },
  ]);
  const [income, setIncome] = useState(0);
  const [showIncome, setShowIncome] = useState(false);

  // localStorage persistence
  useEffect(() => {
    const saved = localStorage.getItem("handytools-subscriptions");
    if (saved) { try { setSubs(JSON.parse(saved)); } catch {} }
  }, []);
  useEffect(() => {
    localStorage.setItem("handytools-subscriptions", JSON.stringify(subs));
  }, [subs]);

  const addRow = () => {
    setSubs((s) => [...s, { id: Date.now().toString(), name: "", amount: 0, cycle: "monthly" }]);
  };
  const removeRow = (id: string) => setSubs((s) => s.filter((r) => r.id !== id));
  const update = (id: string, field: keyof Subscription, val: string | number) => {
    setSubs((s) => s.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };

  const monthlyTotals = subs.map((s) => toMonthly(s.amount, s.cycle));
  const totalMonthly = monthlyTotals.reduce((a, b) => a + b, 0);
  const totalYearly = totalMonthly * 12;
  const coffees = totalMonthly / COFFEE_PRICE;
  const pctIncome = income > 0 ? (totalYearly / income) * 100 : null;

  const sorted = [...subs]
    .map((s, i) => ({ ...s, monthly: monthlyTotals[i] }))
    .sort((a, b) => b.monthly - a.monthly);

  const maxMonthly = sorted[0]?.monthly || 1;

  return (
    <ToolLayout
      toolNum={2} category="💰 Money & Freelance"
      title="Subscription Creep" titleHighlight="Tracker"
      description="Calculate the total cost of your recurring subscriptions, highlighting exactly how much money is leaking from your budget."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-5">
          <Card>
            <SectionTitle>Your Subscriptions</SectionTitle>
            <div className="space-y-3">
              {subs.map((sub) => (
                <div key={sub.id} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center p-3 sm:p-0 rounded-xl bg-slate-800/20 sm:bg-transparent border border-slate-800/50 sm:border-0">
                  <input
                    type="text" value={sub.name} placeholder="Service name"
                    onChange={(e) => update(sub.id, "name", e.target.value)}
                    className="flex-1 px-3 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500 min-h-[44px]"
                  />
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 sm:w-28">
                      <NumInput id={`amt-${sub.id}`} value={sub.amount} onChange={(v) => update(sub.id, "amount", v)} prefix="$" min={0} step={0.01} />
                    </div>
                    <select
                      value={sub.cycle} onChange={(e) => update(sub.id, "cycle", e.target.value)}
                      className="h-12 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 text-sm outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="weekly">/ week</option>
                      <option value="monthly">/ month</option>
                      <option value="yearly">/ year</option>
                    </select>
                    <RemoveButton onClick={() => removeRow(sub.id)} />
                  </div>
                </div>
              ))}
              <AddButton onClick={addRow} label="Add subscription" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <SectionTitle>Annual Income (optional)</SectionTitle>
              <Toggle checked={showIncome} onChange={setShowIncome} />
            </div>
            {showIncome && (
              <NumInput id="income" value={income} onChange={setIncome} prefix="$" min={0} step={1000} />
            )}
          </Card>

          {sorted.length > 0 && (
            <Card>
              <SectionTitle>Highest to Lowest (monthly)</SectionTitle>
              <div className="space-y-2.5">
                {sorted.map((s) => (
                  <div key={s.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700">{s.name || "Unnamed"}</span>
                      <span className="text-slate-900 font-medium tabular-nums">${s.monthly.toFixed(2)}/mo</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(s.monthly / maxMonthly) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <ResultHeadline label="Total Monthly Spend" value={`$${totalMonthly.toFixed(2)}`} sub="across all subscriptions" />
            <div className="px-4 py-4">
              <ResultRow label="Total Yearly Spend" value={`$${totalYearly.toFixed(2)}`} highlight />
              <ResultRow label="= Coffees per month" value={`${coffees.toFixed(1)} ☕`} />
              {pctIncome !== null && (
                <ResultRow label="% of Annual Income" value={`${pctIncome.toFixed(1)}%`} highlight={pctIncome > 5} />
              )}
              <ResultRow label="Active subscriptions" value={`${subs.length}`} />
            </div>
            <div className="px-4 pb-4">
              <CopyButton getText={() =>
                `Subscription Tracker — TrueToolkit.com\n\nMonthly: $${totalMonthly.toFixed(2)}\nYearly: $${totalYearly.toFixed(2)}\nCoffees/month: ${coffees.toFixed(1)}\n\nBreakdown:\n${sorted.map(s => `  ${s.name || "Unnamed"}: $${s.monthly.toFixed(2)}/mo`).join("\n")}`
              } />
            </div>
          </ResultCard>
        </div>
      </div>

    </ToolLayout>
  );
}
