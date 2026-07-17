"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, ResultCard, ResultRow, SeoContent } from "@/components/ui";

export default function RaiseCalculator() {
  const [currentSalary, setCurrentSalary] = useState(1200000);
  const [raiseType, setRaiseType] = useState<"percent" | "fixed">("percent");
  const [raiseAmount, setRaiseAmount] = useState(20);
  const [taxRate, setTaxRate] = useState(20);

  const newSalary = raiseType === "percent"
    ? currentSalary * (1 + raiseAmount / 100)
    : currentSalary + raiseAmount;

  const rate = taxRate / 100;
  const oldTax = currentSalary * rate;
  const newTax = newSalary * rate;

  const oldTakeHome = currentSalary - oldTax;
  const newTakeHome = newSalary - newTax;
  const deltaMonthly = (newTakeHome - oldTakeHome) / 12;
  const grossIncrease = newSalary - currentSalary;
  const grossPct = ((newSalary - currentSalary) / currentSalary) * 100;
  const oldEffRate = (oldTax / currentSalary) * 100;
  const newEffRate = (newTax / newSalary) * 100;

  const maxBar = Math.max(currentSalary, newSalary);

  return (
    <ToolLayout
      toolNum={4} category="💰 Money & Freelance"
      title="Raise Real-Impact" titleHighlight="Calculator"
      description="Calculate the actual monthly cash increase of a salary raise by accounting for marginal tax brackets and inflation."
    >
      <div className="grid md:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-5">
          <Card>
            <SectionTitle>Salary Details</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="curr-sal">Current Annual Salary</FieldLabel>
                <NumInput id="curr-sal" value={currentSalary} onChange={setCurrentSalary} prefix="PKR" min={0} step={10000} />
              </div>
              <div>
                <FieldLabel>Raise Type</FieldLabel>
                <div className="flex gap-2">
                  {(["percent", "fixed"] as const).map((t) => (
                    <button key={t} onClick={() => setRaiseType(t)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${raiseType === t ? "bg-blue-600 border-blue-500 text-slate-900" : "bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900"}`}
                    >{t === "percent" ? "Percentage %" : "Fixed Amount"}</button>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="raise-amt">Raise Amount</FieldLabel>
                <NumInput id="raise-amt" value={raiseAmount} onChange={setRaiseAmount} suffix={raiseType === "percent" ? "%" : "PKR"} min={0} />
              </div>
              <div>
                <FieldLabel htmlFor="tax-rate">Tax Rate</FieldLabel>
                <NumInput id="tax-rate" value={taxRate} onChange={setTaxRate} suffix="%" min={0} step={1} max={100} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Before vs After — Gross Salary</SectionTitle>
            <div className="space-y-3">
              {[
                { label: "Before", value: currentSalary },
                { label: "After Raise", value: newSalary },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{b.label}</span>
                    <span className="text-slate-900 font-medium">PKR {b.value.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${b.label === "After Raise" ? "bg-emerald-500" : "bg-blue-500"}`}
                      style={{ width: `${(b.value / maxBar) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-emerald-700 to-teal-700 px-6 py-7 text-center">
              <p className="text-emerald-200 text-sm font-medium mb-1">Monthly take-home increase</p>
              <p className="text-white text-4xl font-extrabold tabular-nums">+PKR {Math.abs(deltaMonthly).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-emerald-200 text-sm mt-1">after estimated tax</p>
            </div>
            <div className="px-4 py-4">
              <ResultRow label="Gross raise" value={`PKR ${grossIncrease.toLocaleString(undefined, { maximumFractionDigits: 0 })} (+${grossPct.toFixed(1)}%)`} />
              <ResultRow label="Old take-home / yr" value={`PKR ${oldTakeHome.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
              <ResultRow label="New take-home / yr" value={`PKR ${newTakeHome.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} highlight />
              <ResultRow label="Old effective tax rate" value={`${oldEffRate.toFixed(1)}%`} />
              <ResultRow label="New effective tax rate" value={`${newEffRate.toFixed(1)}%`} />
            </div>
          </ResultCard>
        </div>
      </div>

    </ToolLayout>
  );
}
