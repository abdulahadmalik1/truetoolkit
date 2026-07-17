"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, Toggle, ResultCard, ResultRow, CopyButton } from "@/components/ui";

export default function CostPerUse() {
  const [price1, setPrice1] = useState(200);
  const [uses1, setUses1] = useState(100);
  const [name1, setName1] = useState("Item A");
  const [showB, setShowB] = useState(false);
  const [price2, setPrice2] = useState(50);
  const [uses2, setUses2] = useState(20);
  const [name2, setName2] = useState("Item B");

  const cpu1 = uses1 > 0 ? price1 / uses1 : 0;
  const cpu2 = uses2 > 0 ? price2 / uses2 : 0;
  const winner = showB ? (cpu1 <= cpu2 ? name1 : name2) : null;

  return (
    <ToolLayout
      toolNum={6} category="💰 Money & Freelance"
      title="Cost-Per-Use" titleHighlight="Calculator"
      description="Divide the purchase price by expected uses to find the true cost-per-use — a better way to judge value."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-5">
          <Card>
            <SectionTitle>Item 1</SectionTitle>
            <div className="space-y-3">
              <div>
                <FieldLabel htmlFor="n1">Item Name</FieldLabel>
                <input id="n1" type="text" value={name1} onChange={(e) => setName1(e.target.value)} placeholder="e.g. Running Shoes"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <FieldLabel htmlFor="p1">Purchase Price</FieldLabel>
                <NumInput id="p1" value={price1} onChange={setPrice1} prefix="$" min={0} step={1} />
              </div>
              <div>
                <FieldLabel htmlFor="u1">Expected Number of Uses</FieldLabel>
                <NumInput id="u1" value={uses1} onChange={setUses1} min={1} step={1} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <SectionTitle>Compare with Item 2</SectionTitle>
              <Toggle checked={showB} onChange={setShowB} />
            </div>
            {showB && (
              <div className="space-y-3">
                <div>
                  <FieldLabel htmlFor="n2">Item Name</FieldLabel>
                  <input id="n2" type="text" value={name2} onChange={(e) => setName2(e.target.value)} placeholder="e.g. Budget Shoes"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <FieldLabel htmlFor="p2">Purchase Price</FieldLabel>
                  <NumInput id="p2" value={price2} onChange={setPrice2} prefix="$" min={0} step={1} />
                </div>
                <div>
                  <FieldLabel htmlFor="u2">Expected Number of Uses</FieldLabel>
                  <NumInput id="u2" value={uses2} onChange={setUses2} min={1} step={1} />
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-blue-600 to-cyan-700 px-6 py-7 text-center">
              <p className="text-blue-100 text-sm mb-1">{name1} costs</p>
              <p className="text-white text-5xl font-extrabold tabular-nums">${cpu1.toFixed(2)}</p>
              <p className="text-blue-100 text-sm mt-1">per use</p>
            </div>
            <div className="px-4 py-4">
              <ResultRow label={name1} value={`$${price1} ÷ ${uses1} uses`} />
              {showB && (
                <>
                  <ResultRow label={`${name2} cost/use`} value={`$${cpu2.toFixed(2)}`} highlight />
                  <ResultRow label={`${name2}`} value={`$${price2} ÷ ${uses2} uses`} />
                  {winner && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                      ✅ <strong>{winner}</strong> is better value per use
                      {cpu1 !== cpu2 && (
                        <span className="block text-xs mt-0.5 text-emerald-300 opacity-80">
                          by ${Math.abs(cpu1 - cpu2).toFixed(2)}/use
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="px-4 pb-4">
              <CopyButton getText={() => `${name1}: $${cpu1.toFixed(2)}/use${showB ? `\n${name2}: $${cpu2.toFixed(2)}/use\nBetter value: ${winner}` : ""}\n— TrueToolkit.com`} />
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
