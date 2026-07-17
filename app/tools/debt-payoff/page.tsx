"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, AddButton, RemoveButton, ResultCard, ResultRow, SeoContent } from "@/components/ui";

interface Debt {
  id: string; name: string; balance: number; rate: number; minPayment: number;
}

function simulate(debts: Debt[], extra: number, strategy: "snowball" | "avalanche"): { months: number; totalInterest: number; order: string[] } {
  let ds = debts.map((d) => ({ ...d, remaining: d.balance }));
  if (strategy === "snowball") ds.sort((a, b) => a.remaining - b.remaining);
  else ds.sort((a, b) => b.rate - a.rate);

  const order = ds.map((d) => d.name);
  let months = 0, totalInterest = 0, extraPool = extra;

  while (ds.some((d) => d.remaining > 0) && months < 600) {
    months++;
    // Accrue interest
    ds = ds.map((d) => {
      if (d.remaining <= 0) return d;
      const interest = d.remaining * (d.rate / 100 / 12);
      totalInterest += interest;
      return { ...d, remaining: d.remaining + interest };
    });

    // Pay minimums
    let available = extraPool;
    ds = ds.map((d) => {
      if (d.remaining <= 0) return d;
      const pay = Math.min(d.remaining, d.minPayment);
      available += d.remaining <= d.minPayment ? d.minPayment - d.remaining : 0;
      return { ...d, remaining: Math.max(0, d.remaining - pay) };
    });

    // Apply extra to target
    for (let i = 0; i < ds.length; i++) {
      if (ds[i].remaining > 0) {
        const pay = Math.min(ds[i].remaining, available);
        available -= pay;
        ds[i] = { ...ds[i], remaining: Math.max(0, ds[i].remaining - pay) };
        break;
      }
    }

    // Roll freed payments
    for (const d of ds) {
      if (d.remaining <= 0) extraPool += d.minPayment;
    }
  }

  return { months, totalInterest, order };
}

export default function DebtPayoff() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: "1", name: "Credit Card", balance: 5000, rate: 18, minPayment: 100 },
    { id: "2", name: "Car Loan", balance: 15000, rate: 7, minPayment: 300 },
  ]);
  const [extra, setExtra] = useState(200);

  const add = () => setDebts((d) => [...d, { id: Date.now().toString(), name: "", balance: 0, rate: 0, minPayment: 0 }]);
  const remove = (id: string) => setDebts((d) => d.filter((r) => r.id !== id));
  const update = (id: string, f: keyof Debt, v: string | number) => setDebts((d) => d.map((r) => r.id === id ? { ...r, [f]: v } : r));

  const snow = useMemo(() => simulate(debts.filter(d => d.balance > 0), extra, "snowball"), [debts, extra]);
  const aval = useMemo(() => simulate(debts.filter(d => d.balance > 0), extra, "avalanche"), [debts, extra]);
  const diff = snow.totalInterest - aval.totalInterest;
  const monthDiff = snow.months - aval.months;

  return (
    <ToolLayout
      toolNum={5} category="💰 Money & Freelance"
      title="Debt Payoff" titleHighlight="Visualizer"
      description="See exactly how much time and money you save using the Avalanche vs Snowball payoff methods."
    >
      <div className="space-y-6">
        <Card>
          <SectionTitle>Your Debts</SectionTitle>
          <div className="space-y-3">
            {/* Headers: only visible on tablet/desktop */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 text-xs text-slate-500 px-1 mb-2">
              <span>Name</span><span>Balance</span><span>Interest %</span><span>Min. Payment</span><span />
            </div>
            {debts.map((d, index) => (
              <div key={d.id} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 p-4 md:p-0 rounded-xl bg-slate-800/20 md:bg-transparent border border-slate-200 md:border-0 relative">
                {/* Mobile header / index badge */}
                <div className="flex md:hidden justify-between items-center mb-2">
                  <span className="text-xs font-bold text-blue-400">Debt #{index + 1}</span>
                  <RemoveButton onClick={() => remove(d.id)} />
                </div>
                
                <div className="space-y-3 md:space-y-0 md:contents">
                  <div>
                    <label className="text-[10px] text-slate-550 md:hidden block mb-1">Debt Name</label>
                    <input type="text" value={d.name} placeholder="e.g. Credit Card" onChange={(e) => update(d.id, "name", e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-550 md:hidden block mb-1">Balance</label>
                    <NumInput id={`bal-${d.id}`} value={d.balance} onChange={(v) => update(d.id, "balance", v)} prefix="$" min={0} />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-550 md:hidden block mb-1">Interest Rate</label>
                    <NumInput id={`rate-${d.id}`} value={d.rate} onChange={(v) => update(d.id, "rate", v)} suffix="%" min={0} max={100} step={0.1} />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-550 md:hidden block mb-1">Min. Payment</label>
                    <NumInput id={`min-${d.id}`} value={d.minPayment} onChange={(v) => update(d.id, "minPayment", v)} prefix="$" min={0} />
                  </div>
                  <div className="hidden md:block">
                    <RemoveButton onClick={() => remove(d.id)} />
                  </div>
                </div>
              </div>
            ))}
            <AddButton onClick={add} label="Add debt" />
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <FieldLabel htmlFor="extra">Extra Monthly Payment Available</FieldLabel>
            <NumInput id="extra" value={extra} onChange={setExtra} prefix="$" min={0} />
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: "❄️ Snowball", sub: "Smallest balance first", r: snow, color: "from-blue-600 to-blue-800" },
            { label: "🌊 Avalanche", sub: "Highest interest first", r: aval, color: "from-violet-600 to-violet-800" },
          ].map(({ label, sub, r, color }) => (
            <ResultCard key={label} gradient>
              <div className={`bg-gradient-to-br ${color} px-5 py-5 text-center`}>
                <p className="text-white/80 text-sm">{label}</p>
                <p className="text-blue-100 text-xs">{sub}</p>
                <p className="text-white text-4xl font-extrabold mt-2">{r.months} <span className="text-xl font-normal">months</span></p>
              </div>
              <div className="px-4 py-4">
                <ResultRow label="Total interest paid" value={`$${r.totalInterest.toFixed(0)}`} highlight />
                <ResultRow label="Payoff order" value="" />
                <div className="flex flex-wrap gap-1 mt-1">
                  {r.order.map((n, i) => (
                    <span key={i} className="text-xs bg-slate-100 border border-slate-300 text-slate-700 px-2 py-0.5 rounded-full">{i + 1}. {n}</span>
                  ))}
                </div>
              </div>
            </ResultCard>
          ))}
        </div>

        {diff !== 0 && (
          <Card>
            <p className="text-sm text-slate-700 text-center">
              {diff > 0
                ? <>Avalanche saves <span className="text-emerald-400 font-bold">${diff.toFixed(0)}</span> in interest and finishes <span className="text-emerald-400 font-bold">{Math.abs(monthDiff)} months</span> faster</>
                : <>Snowball saves <span className="text-emerald-400 font-bold">${Math.abs(diff).toFixed(0)}</span> in interest</>}
              {" "}— but Snowball can feel more motivating as debts disappear faster.
            </p>
          </Card>
        )}
      </div>

    </ToolLayout>
  );
}
