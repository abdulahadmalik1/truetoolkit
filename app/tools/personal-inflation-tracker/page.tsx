"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, NumInput, ResultCard, ResultRow } from "@/components/ui";

type BasketItem = {
  id: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  monthlyQty: number;
};

export default function PersonalInflationTracker() {
  const [cpiRate, setCpiRate] = useState(3.4); // Standard generic government CPI
  
  const [items, setItems] = useState<BasketItem[]>([
    { id: "1", name: "Dozen Eggs", oldPrice: 2.50, newPrice: 4.20, monthlyQty: 4 },
    { id: "2", name: "Premium Dog Food (30lb)", oldPrice: 55.00, newPrice: 78.00, monthlyQty: 1 },
    { id: "3", name: "Iced Latte (Oat Milk)", oldPrice: 4.50, newPrice: 6.25, monthlyQty: 20 },
  ]);

  const addItem = () => setItems([...items, { id: Math.random().toString(), name: "", oldPrice: 0, newPrice: 0, monthlyQty: 1 }]);
  const updateItem = (id: string, key: keyof BasketItem, val: string | number) => setItems(items.map(i => i.id === id ? { ...i, [key]: val } : i));
  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const math = useMemo(() => {
    let oldTotal = 0;
    let newTotal = 0;

    items.forEach(item => {
      oldTotal += item.oldPrice * item.monthlyQty;
      newTotal += item.newPrice * item.monthlyQty;
    });

    const inflationRate = oldTotal > 0 ? ((newTotal - oldTotal) / oldTotal) * 100 : 0;
    const monthlyDifference = newTotal - oldTotal;
    const annualDifference = monthlyDifference * 12;

    const rateDifference = inflationRate - cpiRate;

    return {
      oldTotal,
      newTotal,
      inflationRate,
      monthlyDifference,
      annualDifference,
      rateDifference
    };
  }, [items, cpiRate]);

  return (
    <ToolLayout
      toolNum={83} category="⏳ Life & Existential Math"
      title="Personal" titleHighlight="Inflation Tracker"
      description="The government says inflation is 3%. But what is the inflation rate of the exact things YOU actually buy? Build your personal basket to see the true mathematical erosion of your purchasing power."
    >
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <SectionTitle>Your Monthly Basket</SectionTitle>
              <button onClick={addItem} className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                + Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
                  {items.length > 1 && (
                    <button onClick={() => removeItem(item.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 font-bold px-2">✕</button>
                  )}
                  
                  <div className="mb-4 pr-8">
                    <FieldLabel htmlFor={`n-${item.id}`}>Item Name</FieldLabel>
                    <TextInput id={`n-${item.id}`} value={item.name} onChange={(v) => updateItem(item.id, 'name', v)} placeholder="e.g. Specific Coffee Order" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <FieldLabel htmlFor={`o-${item.id}`}>Old Price ($)</FieldLabel>
                      <NumInput id={`o-${item.id}`} value={item.oldPrice} onChange={(v) => updateItem(item.id, 'oldPrice', v)} min={0} step={0.5} />
                    </div>
                    <div>
                      <FieldLabel htmlFor={`nw-${item.id}`}>New Price ($)</FieldLabel>
                      <NumInput id={`nw-${item.id}`} value={item.newPrice} onChange={(v) => updateItem(item.id, 'newPrice', v)} min={0} step={0.5} />
                    </div>
                    <div>
                      <FieldLabel htmlFor={`q-${item.id}`}>Qty / Month</FieldLabel>
                      <NumInput id={`q-${item.id}`} value={item.monthlyQty} onChange={(v) => updateItem(item.id, 'monthlyQty', v)} min={1} step={1} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <FieldLabel htmlFor="cpi">Government Claimed CPI (%)</FieldLabel>
              <div className="w-1/3">
                <NumInput id="cpi" value={cpiRate} onChange={setCpiRate} min={0} step={0.1} />
              </div>
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className={`bg-gradient-to-br px-6 py-8 text-center rounded-t-2xl ${math.inflationRate > 10 ? 'from-rose-700 to-red-900' : 'from-amber-600 to-orange-700'}`}>
              <p className="text-white/80 text-sm font-medium mb-1">Your True Inflation Rate</p>
              <p className="text-white text-6xl font-black tabular-nums tracking-tight">
                {math.inflationRate.toFixed(1)}%
              </p>
              <p className="text-white/80 text-sm mt-3 font-semibold bg-white/10 inline-block px-4 py-1.5 rounded-full">
                {math.rateDifference > 0 ? `+${math.rateDifference.toFixed(1)}% worse` : `${math.rateDifference.toFixed(1)}% better`} than Gov CPI
              </p>
            </div>
            
            <div className="px-4 py-6 bg-white rounded-b-2xl border-2 border-t-0 border-slate-200 space-y-2">
              <ResultRow label="Old Monthly Cost" value={`$${math.oldTotal.toFixed(2)}`} />
              <ResultRow label="New Monthly Cost" value={`$${math.newTotal.toFixed(2)}`} />
              
              <div className="border-t border-dashed border-slate-200 my-3"></div>
              
              <ResultRow label="Extra Cost / Month" value={<span className="text-rose-600 font-bold">${math.monthlyDifference.toFixed(2)}</span>} />
              <ResultRow label="Extra Cost / Year" value={<span className="text-rose-600 font-black text-lg">${math.annualDifference.toFixed(2)}</span>} />
            </div>
          </ResultCard>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 leading-relaxed text-center">
            You now have to earn an extra <strong>${math.annualDifference.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong> this year just to maintain the exact same standard of living for these items.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
