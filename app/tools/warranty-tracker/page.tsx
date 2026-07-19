"use client";
import { useState, useEffect } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, AddButton, RemoveButton } from "@/components/ui";

interface WarrantyItem {
  id: string; name: string; purchaseDate: string; warrantyMonths: number; returnDays: number; notes: string;
}

export default function WarrantyTracker() {
  const [items, setItems] = useState<WarrantyItem[]>([
    { id: "1", name: "Laptop", purchaseDate: new Date().toISOString().split("T")[0], warrantyMonths: 12, returnDays: 15, notes: "From AmazonPK" },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("handytools-warranties");
    if (saved) { try { setItems(JSON.parse(saved)); } catch {} }
  }, []);
  useEffect(() => { localStorage.setItem("handytools-warranties", JSON.stringify(items)); }, [items]);

  const add = () => setItems((i) => [...i, { id: Date.now().toString(), name: "", purchaseDate: new Date().toISOString().split("T")[0], warrantyMonths: 12, returnDays: 14, notes: "" }]);
  const remove = (id: string) => setItems((i) => i.filter((r) => r.id !== id));
  const update = (id: string, f: keyof WarrantyItem, v: string | number) => setItems((i) => i.map((r) => r.id === id ? { ...r, [f]: v } : r));

  const today = new Date();

  function getDates(item: WarrantyItem) {
    const purchase = new Date(item.purchaseDate);
    const warrantyEnd = new Date(purchase); warrantyEnd.setMonth(warrantyEnd.getMonth() + item.warrantyMonths);
    const returnEnd = new Date(purchase); returnEnd.setDate(returnEnd.getDate() + item.returnDays);
    const daysToWarrantyEnd = Math.ceil((warrantyEnd.getTime() - today.getTime()) / 86400000);
    const daysToReturn = Math.ceil((returnEnd.getTime() - today.getTime()) / 86400000);
    return { warrantyEnd, returnEnd, daysToWarrantyEnd, daysToReturn };
  }

  const sorted = [...items].sort((a, b) => {
    const aD = getDates(a); const bD = getDates(b);
    return aD.daysToWarrantyEnd - bD.daysToWarrantyEnd;
  });

  return (
    <ToolLayout toolNum={31} category="🛠️ Everyday Practical" title="Warranty & Return-Window" titleHighlight="Tracker"
      description="Track warranty expiry and return windows for all your purchases in one place — with urgency alerts."
    >
      <div className="space-y-5">
        <p className="text-xs text-slate-500 text-center">💾 Data saved automatically in this browser</p>

        <div className="space-y-3">
          {sorted.map((item) => {
            const { warrantyEnd, returnEnd, daysToWarrantyEnd, daysToReturn } = getDates(item);
            const warrantyCritical = daysToWarrantyEnd <= 30 && daysToWarrantyEnd >= 0;
            const warrantyExpired = daysToWarrantyEnd < 0;
            const returnCritical = daysToReturn <= 3 && daysToReturn >= 0;
            const returnExpired = daysToReturn < 0;

            return (
              <Card key={item.id} className={warrantyExpired ? "opacity-60" : ""}>
                <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-start">
                  <div>
                    <input value={item.name} onChange={(e) => update(item.id, "name", e.target.value)} placeholder="Product name"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500 mb-2" />
                    <input value={item.notes} onChange={(e) => update(item.id, "notes", e.target.value)} placeholder="Notes (store, receipt#)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-800/40 text-slate-600 text-xs outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Purchase Date</label>
                    <input type="date" value={item.purchaseDate} onChange={(e) => update(item.id, "purchaseDate", e.target.value)}
                      className="w-full px-2 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Warranty (months)</label>
                    <NumInput id={`w-${item.id}`} value={item.warrantyMonths} onChange={(v) => update(item.id, "warrantyMonths", v)} min={0} max={120} />
                    <p className={`text-xs mt-1 ${warrantyCritical ? "text-amber-400" : warrantyExpired ? "text-red-400" : "text-emerald-400"}`}>
                      {warrantyExpired ? "Expired" : `${daysToWarrantyEnd}d left (until ${warrantyEnd.toLocaleDateString("en-PK", { month: "short", day: "numeric" })})`}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Return window (days)</label>
                    <NumInput id={`r-${item.id}`} value={item.returnDays} onChange={(v) => update(item.id, "returnDays", v)} min={0} max={365} />
                    <p className={`text-xs mt-1 ${returnCritical ? "text-red-400 font-bold" : returnExpired ? "text-slate-500" : "text-slate-600"}`}>
                      {returnExpired ? "Window closed" : returnCritical ? `⚠️ ${daysToReturn}d left!` : `${daysToReturn}d left`}
                    </p>
                  </div>
                  <RemoveButton onClick={() => remove(item.id)} />
                </div>
              </Card>
            );
          })}
        </div>
        <AddButton onClick={add} label="Track another item" />
      </div>
    </ToolLayout>
  );
}
