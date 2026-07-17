"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, Toggle, AddButton, RemoveButton, ResultCard, ResultRow } from "@/components/ui";

interface Contributor { id: string; name: string; weight: number; }

export default function GiftSplitter() {
  const [totalCost, setTotalCost] = useState(5000);
  const [isWeighted, setIsWeighted] = useState(false);
  const [contributors, setContributors] = useState<Contributor[]>([
    { id: "1", name: "Ali", weight: 1 },
    { id: "2", name: "Sara", weight: 1 },
    { id: "3", name: "Usman", weight: 1 },
  ]);

  const add = () => setContributors((c) => [...c, { id: Date.now().toString(), name: "", weight: 1 }]);
  const remove = (id: string) => setContributors((c) => c.filter((r) => r.id !== id));
  const update = (id: string, f: keyof Contributor, v: string | number) =>
    setContributors((c) => c.map((r) => r.id === id ? { ...r, [f]: v } : r));

  const totalWeight = contributors.reduce((a, b) => a + b.weight, 0);
  const amounts = contributors.map((c, i) => {
    const base = isWeighted ? (totalWeight > 0 ? (c.weight / totalWeight) * totalCost : 0) : totalCost / contributors.length;
    return i < contributors.length - 1 ? parseFloat(base.toFixed(2)) : 0;
  });
  const sumSoFar = amounts.slice(0, -1).reduce((a, b) => a + b, 0);
  amounts[amounts.length - 1] = parseFloat((totalCost - sumSoFar).toFixed(2));
  const checksum = amounts.reduce((a, b) => a + b, 0);

  return (
    <ToolLayout toolNum={18} category="🛠️ Everyday Practical" title="Group Gift" titleHighlight="Contribution Splitter"
      description="Split a gift's cost fairly across multiple people — even or weighted. Totals always reconcile exactly."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-5">
          <Card>
            <SectionTitle>Gift Details</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="cost">Total Gift Cost</FieldLabel>
                <NumInput id="cost" value={totalCost} onChange={setTotalCost} prefix="PKR" min={0} step={100} />
              </div>
              <Toggle checked={isWeighted} onChange={setIsWeighted} label="Weighted split (different amounts per person)" />
            </div>
          </Card>

          <Card>
            <SectionTitle>Contributors</SectionTitle>
            <div className="space-y-2">
              {contributors.map((c, index) => (
                <div key={c.id} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center p-3 sm:p-0 rounded-xl bg-slate-800/20 sm:bg-transparent border border-slate-800/50 sm:border-0">
                  <input value={c.name} onChange={(e) => update(c.id, "name", e.target.value)} placeholder={`Contributor ${index + 1}`}
                    className="flex-1 px-3 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500 min-h-[44px]" />
                  <div className="flex gap-2 items-center">
                    {isWeighted && (
                      <div className="flex-1 sm:w-24">
                        <NumInput id={`w-${c.id}`} value={c.weight} onChange={(v) => update(c.id, "weight", v)} suffix="share" min={1} step={1} />
                      </div>
                    )}
                    <RemoveButton onClick={() => remove(c.id)} />
                  </div>
                </div>
              ))}
              <AddButton onClick={add} label="Add contributor" />
            </div>
          </Card>
        </div>

        <div className="sticky top-24">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-blue-600 to-violet-700 px-6 py-6 text-center">
              <p className="text-blue-100 text-sm mb-1">Each person owes</p>
              {!isWeighted && <p className="text-white text-4xl font-extrabold">PKR {(totalCost / Math.max(1, contributors.length)).toFixed(2)}</p>}
              {isWeighted && <p className="text-2xl font-bold">See breakdown</p>}
            </div>
            <div className="px-4 py-4">
              {contributors.map((c, i) => (
                <div key={c.id} className="flex justify-between items-center py-2.5 border-b border-slate-200 last:border-0">
                  <span className="text-sm text-slate-700">{c.name || `Person ${i + 1}`}</span>
                  <span className="text-slate-900 font-bold tabular-nums">PKR {amounts[i]?.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3 mt-1 text-xs">
                <span className="text-slate-500">Total check</span>
                <span className={checksum === totalCost ? "text-emerald-400" : "text-amber-400"}>PKR {checksum.toFixed(2)}</span>
              </div>
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
