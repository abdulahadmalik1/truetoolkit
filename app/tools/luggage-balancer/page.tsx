"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, Toggle, AddButton, RemoveButton } from "@/components/ui";

interface Bag { id: string; name: string; weight: number; limit: number; }

export default function LuggageBalancer() {
  const [bags, setBags] = useState<Bag[]>([
    { id: "1", name: "Cabin Bag", weight: 9, limit: 7 },
    { id: "2", name: "Checked Bag", weight: 18, limit: 23 },
  ]);
  const [sharedLimit, setSharedLimit] = useState(23);
  const [usePerBag, setUsePerBag] = useState(false);

  const add = () => setBags((b) => [...b, { id: Date.now().toString(), name: `Bag ${b.length + 1}`, weight: 0, limit: sharedLimit }]);
  const remove = (id: string) => setBags((b) => b.filter((r) => r.id !== id));
  const update = (id: string, f: keyof Bag, v: string | number) => setBags((b) => b.map((r) => r.id === id ? { ...r, [f]: v } : r));

  const bagsWithLimit = bags.map((b) => ({ ...b, limit: usePerBag ? b.limit : sharedLimit }));
  const totalWeight = bags.reduce((a, b) => a + b.weight, 0);
  const totalCapacity = bagsWithLimit.reduce((a, b) => a + b.limit, 0);
  const isOverallOverweight = totalWeight > totalCapacity;

  const moves: string[] = [];
  const projected = bagsWithLimit.map((b) => ({ ...b }));

  if (!isOverallOverweight) {
    let changed = true;
    let iter = 0;
    while (changed && iter < 50) {
      changed = false; iter++;
      for (const over of projected) {
        const limit = over.limit;
        const excess = over.weight - limit;
        if (excess <= 0) continue;
        for (const under of projected) {
          if (under.id === over.id) continue;
          const headroom = under.limit - under.weight;
          if (headroom <= 0) continue;
          const move = Math.min(excess, headroom);
          moves.push(`Move ~${move.toFixed(1)} kg from "${over.name}" to "${under.name}"`);
          over.weight -= move;
          under.weight += move;
          changed = true;
          break;
        }
      }
    }
  }

  return (
    <ToolLayout toolNum={17} category="🛠️ Everyday Practical" title="Luggage Weight" titleHighlight="Balancer"
      description="Redistribute weight across your bags so every one stays under the airline limit — with specific suggestions."
    >
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle>Weight Limits</SectionTitle>
            <Toggle checked={usePerBag} onChange={setUsePerBag} label="Per-bag limits" />
          </div>
          {!usePerBag && (
            <div>
              <FieldLabel htmlFor="shared">Shared Limit per Bag</FieldLabel>
              <NumInput id="shared" value={sharedLimit} onChange={setSharedLimit} suffix="kg" min={1} max={50} />
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle>Your Bags</SectionTitle>
          <div className="space-y-3">
            {bags.map((b) => (
              <div key={b.id} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center p-3 sm:p-0 rounded-xl bg-slate-800/20 sm:bg-transparent border border-slate-800/50 sm:border-0">
                <input value={b.name} onChange={(e) => update(b.id, "name", e.target.value)} placeholder="Bag name"
                  className="flex-1 px-3 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500 min-h-[44px]" />
                <div className="flex gap-2 items-center">
                  <div className="flex-1 sm:w-28">
                    <NumInput id={`w-${b.id}`} value={b.weight} onChange={(v) => update(b.id, "weight", v)} suffix="kg" min={0} step={0.1} />
                  </div>
                  {usePerBag && (
                    <div className="flex-1 sm:w-28">
                      <NumInput id={`l-${b.id}`} value={b.limit} onChange={(v) => update(b.id, "limit", v)} suffix="limit" min={1} step={0.5} />
                    </div>
                  )}
                  <RemoveButton onClick={() => remove(b.id)} />
                </div>
              </div>
            ))}
            <AddButton onClick={add} label="Add bag" />
          </div>
        </Card>

        <Card>
          <SectionTitle>Analysis & Suggestions</SectionTitle>
          {isOverallOverweight ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              🚨 <strong>Overall overweight:</strong> Total weight ({totalWeight.toFixed(1)} kg) exceeds total capacity ({totalCapacity.toFixed(1)} kg) by {(totalWeight - totalCapacity).toFixed(1)} kg. You need to remove items entirely.
            </div>
          ) : moves.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              ✅ All bags are within their weight limits. You're good to go!
            </div>
          ) : (
            <div className="space-y-2">
              {moves.map((m, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
                  <span className="text-amber-500">→</span> {m}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 space-y-2">
            <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Projected weights after moves</p>
            {projected.map((b) => (
              <div key={b.id} className="flex justify-between items-center">
                <span className="text-sm text-slate-700">{b.name}</span>
                <span className={`text-sm font-medium tabular-nums ${b.weight > b.limit ? "text-red-400" : "text-emerald-400"}`}>
                  {b.weight.toFixed(1)} kg / {b.limit} kg
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
}
