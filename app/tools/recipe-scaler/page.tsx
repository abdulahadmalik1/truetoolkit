"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, Select, AddButton, RemoveButton, Disclaimer } from "@/components/ui";
import panData from "@/data/pan-sizes.json";

interface Ingredient { id: string; name: string; amount: number; unit: string; }

export default function RecipeScaler() {
  const [scaleMode, setScaleMode] = useState<"servings" | "pan">("servings");
  const [origServings, setOrigServings] = useState(8);
  const [targetServings, setTargetServings] = useState(12);
  const [origPan, setOrigPan] = useState("round-8");
  const [targetPan, setTargetPan] = useState("round-9");
  const [bakeMins, setBakeMins] = useState(30);
  const [bakeTemp, setBakeTemp] = useState(180);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "Flour", amount: 200, unit: "g" },
    { id: "2", name: "Sugar", amount: 150, unit: "g" },
    { id: "3", name: "Eggs", amount: 3, unit: "whole" },
    { id: "4", name: "Butter", amount: 100, unit: "g" },
  ]);

  const add = () => setIngredients((i) => [...i, { id: Date.now().toString(), name: "", amount: 0, unit: "g" }]);
  const remove = (id: string) => setIngredients((i) => i.filter((r) => r.id !== id));
  const update = (id: string, f: keyof Ingredient, v: string | number) =>
    setIngredients((i) => i.map((r) => r.id === id ? { ...r, [f]: v } : r));

  const scaleFactor = scaleMode === "servings"
    ? (origServings > 0 ? targetServings / origServings : 1)
    : (() => {
        const op = panData.panSizes.find((p) => p.id === origPan)?.areaSqIn ?? 1;
        const tp = panData.panSizes.find((p) => p.id === targetPan)?.areaSqIn ?? 1;
        return tp / op;
      })();

  const adj = panData.timeAdjustments.find((a) => scaleFactor >= a.scaleFactor.min && scaleFactor < a.scaleFactor.max) ?? panData.timeAdjustments[2];
  const adjTemp = bakeTemp + adj.tempAdjustCelsius;
  const adjTimeMin = Math.round(bakeMins * adj.timeMultiplier);
  const adjTimeMax = Math.round(bakeMins * adj.timeMultiplier * 1.1);
  const adjTempF = Math.round(adjTemp * 9 / 5 + 32);

  const panOptions = panData.panSizes.map((p) => ({ value: p.id, label: p.label }));

  return (
    <ToolLayout toolNum={15} category="🛠️ Everyday Practical" title="Recipe Scaler" titleHighlight="with Pan Adjustment"
      description="Scale ingredient quantities for a different serving size or pan, with bake time and temperature guidance."
    >
      <div className="space-y-6">
        <Card>
          <div className="flex gap-2 mb-4">
            {(["servings", "pan"] as const).map((m) => (
              <button key={m} onClick={() => setScaleMode(m)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${scaleMode === m ? "bg-blue-600 border-blue-500 text-slate-900" : "bg-slate-100 border-slate-300 text-slate-600"}`}
              >{m === "servings" ? "Scale by Servings" : "Scale by Pan Size"}</button>
            ))}
          </div>

          {scaleMode === "servings" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="os">Original Servings</FieldLabel>
                <NumInput id="os" value={origServings} onChange={setOrigServings} min={1} />
              </div>
              <div>
                <FieldLabel htmlFor="ts">Target Servings</FieldLabel>
                <NumInput id="ts" value={targetServings} onChange={setTargetServings} min={1} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="op">Original Pan</FieldLabel>
                <Select id="op" value={origPan} onChange={setOrigPan} options={panOptions} />
              </div>
              <div>
                <FieldLabel htmlFor="tp">Target Pan</FieldLabel>
                <Select id="tp" value={targetPan} onChange={setTargetPan} options={panOptions} />
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-sm">
            Scale factor: <strong>{scaleFactor.toFixed(2)}×</strong>
          </div>
        </Card>

        <Card>
          <SectionTitle>Original Bake Settings</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="bt">Bake Time</FieldLabel>
              <NumInput id="bt" value={bakeMins} onChange={setBakeMins} suffix="min" min={1} />
            </div>
            <div>
              <FieldLabel htmlFor="temp">Temperature (°C)</FieldLabel>
              <NumInput id="temp" value={bakeTemp} onChange={setBakeTemp} suffix="°C" min={50} max={280} />
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-5">
          <Card>
            <SectionTitle>Scaled Ingredients</SectionTitle>
            <div className="space-y-2 mb-3">
              {ingredients.map((ing) => (
                <div key={ing.id} className="flex gap-2 items-center">
                  <input value={ing.name} onChange={(e) => update(ing.id, "name", e.target.value)} placeholder="Name"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
                  <div className="w-24">
                    <NumInput id={`a-${ing.id}`} value={ing.amount} onChange={(v) => update(ing.id, "amount", v)} min={0} step={0.1} />
                  </div>
                  <input value={ing.unit} onChange={(e) => update(ing.id, "unit", e.target.value)} placeholder="unit"
                    className="w-16 px-2 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
                  <RemoveButton onClick={() => remove(ing.id)} />
                </div>
              ))}
              <AddButton onClick={add} label="Add ingredient" />
            </div>
          </Card>

          <Card>
            <SectionTitle>Scaled Results</SectionTitle>
            <div className="space-y-1.5 mb-4">
              {ingredients.map((ing) => (
                <div key={ing.id} className="flex justify-between text-sm">
                  <span className="text-slate-600">{ing.name || "—"}</span>
                  <span className="text-slate-900 font-medium tabular-nums">
                    {(ing.amount * scaleFactor).toFixed(1)} {ing.unit}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
              <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Adjusted Bake Settings</p>
              <p className="text-slate-900 text-sm">🌡️ <strong>{adjTemp}°C</strong> ({adjTempF}°F)</p>
              <p className="text-slate-900 text-sm">⏱️ <strong>{adjTimeMin}–{adjTimeMax} minutes</strong></p>
              <p className="text-xs text-slate-500 mt-1">{adj.note}</p>
            </div>
            <Disclaimer>Bake time/temperature adjustments are approximations — ovens vary. Always check doneness visually.</Disclaimer>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
