"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, NumInput, Select, ResultCard, ResultRow } from "@/components/ui";

type CostItem = { id: string; category: string; desc: string; amount: number };

const COST_CATEGORIES = [
  { value: "Seed", label: "Seed / Plants" },
  { value: "Fertilizer", label: "Fertilizer / Soil" },
  { value: "Chemicals", label: "Chemicals / Pest Control" },
  { value: "Labor", label: "Labor (Hired)" },
  { value: "Fuel", label: "Fuel / Equipment" },
  { value: "Water", label: "Irrigation / Water" },
  { value: "Other", label: "Other / Misc" },
];

const YIELD_UNITS = [
  { value: "Bushels", label: "Bushels (bu)" },
  { value: "Lbs", label: "Pounds (lbs)" },
  { value: "Tons", label: "Tons" },
  { value: "Flats", label: "Flats / Crates" },
  { value: "Items", label: "Individual Items" }
];

export default function FarmYieldLedger() {
  const [fieldName, setFieldName] = useState("North Pasture (Plot A)");
  const [cropName, setCropName] = useState("Heirloom Tomatoes");
  const [acres, setAcres] = useState(2.5);
  
  const [yieldQuantity, setYieldQuantity] = useState(8500);
  const [yieldUnit, setYieldUnit] = useState("Lbs");

  const [costs, setCosts] = useState<CostItem[]>([
    { id: "1", category: "Seed", desc: "Heirloom Seeds", amount: 250 },
    { id: "2", category: "Fertilizer", desc: "Compost Load", amount: 400 },
    { id: "3", category: "Labor", desc: "Harvesting Hands", amount: 1200 },
    { id: "4", category: "Fuel", desc: "Tractor Diesel", amount: 180 },
  ]);

  const addCost = () => setCosts([...costs, { id: Math.random().toString(), category: "Other", desc: "", amount: 0 }]);
  const updateCost = (id: string, key: keyof CostItem, val: any) => setCosts(costs.map(c => c.id === id ? { ...c, [key]: val } : c));
  const removeCost = (id: string) => setCosts(costs.filter(c => c.id !== id));

  const math = useMemo(() => {
    const totalCost = costs.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
    const validYield = Math.max(0.001, yieldQuantity);
    const validAcres = Math.max(0.001, acres);

    return {
      totalCost,
      costPerUnit: totalCost / validYield,
      yieldPerAcre: validYield / validAcres,
      costPerAcre: totalCost / validAcres
    };
  }, [costs, yieldQuantity, acres]);

  return (
    <ToolLayout
      toolNum={66} category="🛠️ Business & Operations"
      title="Small Farm" titleHighlight="Cost-Per-Yield Ledger"
      description="Calculate your exact breakeven cost-per-unit-yield. Designed for the under-500-acre farm segment to generate a lender/crop-insurance-ready financial snapshot."
    >
      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Field & Harvest Data</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="field">Field / Location ID</FieldLabel>
                <TextInput id="field" value={fieldName} onChange={setFieldName} />
              </div>
              <div>
                <FieldLabel htmlFor="crop">Crop Planted</FieldLabel>
                <TextInput id="crop" value={cropName} onChange={setCropName} />
              </div>
              <div>
                <FieldLabel htmlFor="acres">Size (Acres)</FieldLabel>
                <NumInput id="acres" value={acres} onChange={setAcres} min={0.1} />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <FieldLabel htmlFor="yieldQ">Total Yield</FieldLabel>
                  <NumInput id="yieldQ" value={yieldQuantity} onChange={setYieldQuantity} min={1} />
                </div>
                <div className="w-24">
                  <FieldLabel htmlFor="unit">Unit</FieldLabel>
                  <Select id="unit" value={yieldUnit} onChange={setYieldUnit} options={YIELD_UNITS} />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <SectionTitle>Input Costs</SectionTitle>
              <button onClick={addCost} className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
                + Add Cost
              </button>
            </div>
            
            <div className="space-y-3">
              {costs.map((item, idx) => (
                <div key={item.id} className="flex gap-2 items-end p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-32">
                    <FieldLabel htmlFor={`cat-${item.id}`}>Category</FieldLabel>
                    <Select id={`cat-${item.id}`} value={item.category} onChange={(v) => updateCost(item.id, 'category', v)} options={COST_CATEGORIES} />
                  </div>
                  <div className="flex-1">
                    <FieldLabel htmlFor={`desc-${item.id}`}>Description</FieldLabel>
                    <TextInput id={`desc-${item.id}`} value={item.desc} onChange={(v) => updateCost(item.id, 'desc', v)} placeholder="Item..." />
                  </div>
                  <div className="w-28">
                    <FieldLabel htmlFor={`amt-${item.id}`}>Amount ($)</FieldLabel>
                    <NumInput id={`amt-${item.id}`} value={item.amount} onChange={(v) => updateCost(item.id, 'amount', v)} min={0} />
                  </div>
                  {costs.length > 1 && (
                    <button onClick={() => removeCost(item.id)} className="w-10 h-[42px] mb-[2px] flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-red-500 rounded-xl transition-colors">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-emerald-700 to-green-800 px-6 py-7 text-center rounded-t-2xl">
              <p className="text-emerald-200 text-sm font-medium mb-1">True Break-Even Cost</p>
              <p className="text-white text-4xl font-extrabold tabular-nums tracking-tight">
                ${math.costPerUnit.toFixed(2)}
              </p>
              <p className="text-emerald-200 text-sm mt-1 font-semibold">per {yieldUnit.toLowerCase()}</p>
            </div>
            <div className="px-4 py-4 space-y-1 bg-white rounded-b-2xl">
              <ResultRow label="Total Input Costs" value={`$${math.totalCost.toLocaleString(undefined, {minimumFractionDigits: 2})}`} />
              <ResultRow label={`Yield / Acre`} value={`${math.yieldPerAcre.toLocaleString(undefined, {maximumFractionDigits: 1})} ${yieldUnit}`} />
              <ResultRow label={`Cost / Acre`} value={`$${math.costPerAcre.toLocaleString(undefined, {maximumFractionDigits: 2})}`} />
            </div>
          </ResultCard>
          
          <div className="text-center print:hidden">
            <button onClick={() => window.print()} className="bg-slate-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-105">
              Print Lender Report
            </button>
          </div>

          <div className="hidden print:block text-center pb-8 border-b-2 border-black mb-8">
            <h1 className="text-3xl font-black mb-2">CROP YIELD LEDGER REPORT</h1>
            <p className="text-lg">Field: <strong>{fieldName}</strong> | Crop: <strong>{cropName}</strong></p>
            <p className="text-sm text-slate-600 mt-1">Generated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
