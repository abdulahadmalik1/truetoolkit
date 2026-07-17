"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, ResultCard, TextInput } from "@/components/ui";

export default function HobbyCostRationalizer() {
  const [itemName, setItemName] = useState("Fender Stratocaster");
  const [cost, setCost] = useState(1500);
  const [resale, setResale] = useState(800);
  const [hoursPerWeek, setHoursPerWeek] = useState(4);
  const [yearsOwned, setYearsOwned] = useState(10);

  const math = useMemo(() => {
    const totalHours = hoursPerWeek * 52 * yearsOwned;
    const trueCost = Math.max(0, cost - resale);
    const costPerHour = totalHours > 0 ? trueCost / totalHours : 0;

    return {
      totalHours,
      trueCost,
      costPerHour
    };
  }, [cost, resale, hoursPerWeek, yearsOwned]);

  return (
    <ToolLayout
      toolNum={82} category="⏳ Life & Existential Math"
      title="Hobby Cost" titleHighlight="Rationalizer"
      description="Feel guilty about buying that expensive gear? Amortize the total cost against the hours of joy you'll get from it, minus its eventual resale value, to see its true Cost-Per-Hour."
    >
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>The Purchase</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="item">What are you buying?</FieldLabel>
                <TextInput id="item" value={itemName} onChange={setItemName} placeholder="e.g. Mountain Bike" />
              </div>
              <div>
                <FieldLabel htmlFor="cost">Purchase Price ($)</FieldLabel>
                <NumInput id="cost" value={cost} onChange={setCost} min={0} step={100} />
              </div>
              <div>
                <FieldLabel htmlFor="resale">Estimated Resale Value ($)</FieldLabel>
                <NumInput id="resale" value={resale} onChange={setResale} min={0} step={100} />
                <p className="text-xs text-slate-500 mt-1">High-quality gear retains value. Be honest.</p>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Estimated Usage</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <FieldLabel htmlFor="hpw">Usage (Hours per Week)</FieldLabel>
                <NumInput id="hpw" value={hoursPerWeek} onChange={setHoursPerWeek} min={0} step={1} />
              </div>
              <div>
                <FieldLabel htmlFor="yrs">Years You'll Keep It</FieldLabel>
                <NumInput id="yrs" value={yearsOwned} onChange={setYearsOwned} min={1} max={50} />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <p className="text-slate-600 text-sm">
                You will spend a total of <strong className="text-slate-900">{math.totalHours.toLocaleString()} hours</strong> using this item.
              </p>
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-indigo-700 to-blue-900 px-6 py-8 text-center rounded-t-2xl">
              <p className="text-white/80 text-sm font-medium mb-1">True Cost Per Hour of Joy</p>
              <p className="text-white text-7xl font-black tabular-nums tracking-tight">
                ${math.costPerHour.toFixed(2)}
              </p>
              <p className="text-white/80 text-sm mt-3 font-semibold bg-white/10 inline-block px-4 py-1.5 rounded-full">
                Total Sunk Cost: ${math.trueCost.toLocaleString()}
              </p>
            </div>
            
            <div className="px-4 py-6 bg-white rounded-b-2xl border-2 border-t-0 border-slate-200">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-4">How Does It Compare?</h4>
              
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-sans font-medium">Your {itemName || "Item"}</span>
                  <span className="font-bold text-indigo-700">${math.costPerHour.toFixed(2)}/hr</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded">
                  <span className="text-slate-500 font-sans">Movie Ticket ($15 / 2 hrs)</span>
                  <span className="text-slate-400">$7.50/hr</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-sans">Average Bar Night ($50 / 3 hrs)</span>
                  <span className="text-slate-400">$16.66/hr</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded">
                  <span className="text-slate-500 font-sans">Nice Dinner ($100 / 2 hrs)</span>
                  <span className="text-slate-400">$50.00/hr</span>
                </div>
              </div>
            </div>
          </ResultCard>

          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-indigo-800 leading-relaxed text-center">
            {math.costPerHour < 7.5 ? (
              <span><strong>Buy it without guilt.</strong> It is mathematically cheaper entertainment than going to the movies.</span>
            ) : (
              <span>This is a premium luxury. Make sure you actually use it {hoursPerWeek} hours a week!</span>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
