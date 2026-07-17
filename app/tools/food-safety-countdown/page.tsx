"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, Select, Toggle, Disclaimer } from "@/components/ui";
import shelfData from "@/data/food-safety-shelf-life.json";

export default function FoodSafetyCountdown() {
  const [category, setCategory] = useState(shelfData.categories[0].id);
  const [cookedDate, setCookedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isFreezer, setIsFreezer] = useState(false);

  const cat = shelfData.categories.find((c) => c.id === category)!;
  const storage = isFreezer ? cat.freezer : cat.fridge;
  const cooked = new Date(cookedDate);
  const useBy = new Date(cooked.getTime() + storage.days * 24 * 60 * 60 * 1000);
  const today = new Date();
  const daysLeft = Math.floor((useBy.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  let status: "safe" | "today" | "discard";
  let statusText: string;
  let color: string;
  if (daysLeft > 1) { status = "safe"; statusText = `Safe for ${daysLeft} more days`; color = "text-emerald-400"; }
  else if (daysLeft >= 0) { status = "today"; statusText = "Use today!"; color = "text-amber-400"; }
  else { status = "discard"; statusText = `Past the safe window by ${Math.abs(daysLeft)} days — discard`; color = "text-red-400"; }

  return (
    <ToolLayout toolNum={16} category="🛠️ Everyday Practical" title="Food Safety" titleHighlight="Countdown"
      description="Know exactly when your leftovers are no longer safe to eat, based on standard food safety guidelines."
    >
      <div className="max-w-lg mx-auto space-y-5">
        <Card>
          <SectionTitle>Food Details</SectionTitle>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Food Category</label>
              <Select id="cat" value={category} onChange={setCategory} options={shelfData.categories.map((c) => ({ value: c.id, label: c.label }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date Cooked / Opened</label>
              <input type="date" value={cookedDate} onChange={(e) => setCookedDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
            </div>
            <Toggle checked={isFreezer} onChange={setIsFreezer} label={isFreezer ? "Freezer storage" : "Fridge storage"} />
          </div>
        </Card>

        <div className={`p-6 rounded-2xl border text-center ${
          status === "safe" ? "bg-emerald-500/10 border-emerald-500/30" :
          status === "today" ? "bg-amber-500/10 border-amber-500/30" :
          "bg-red-500/10 border-red-500/30"
        }`}>
          <div className="text-5xl mb-3">{status === "safe" ? "✅" : status === "today" ? "⚠️" : "🚨"}</div>
          <p className={`text-xl font-bold mb-1 ${color}`}>{statusText}</p>
          <p className="text-slate-600 text-sm">Use-by date: <strong>{useBy.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</strong></p>
          <p className="text-slate-600 text-sm mt-1">Max safe storage: <strong>{storage.days} days</strong> in {isFreezer ? "freezer" : "fridge"}</p>
        </div>

        <Card>
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide mb-2">Storage Tip</p>
          <p className="text-sm text-slate-700">{storage.tip}</p>
        </Card>

        <Disclaimer>
          ⚠️ Based on general US FDA & UK NHS food safety guidelines. Not medical advice.
        </Disclaimer>
      </div>
    </ToolLayout>
  );
}
