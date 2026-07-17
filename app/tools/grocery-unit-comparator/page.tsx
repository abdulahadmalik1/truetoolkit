"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, TextInput, Select, ResultCard, ResultHeadline, ResultRow, Disclaimer, CopyButton } from "@/components/ui";

export default function GroceryUnitComparator() {
  const [currency, setCurrency] = useState("$");

  // Item A
  const [nameA, setNameA] = useState("");
  const [priceA, setPriceA] = useState(4.50);
  const [sizeA, setSizeA] = useState(250);
  const [unitA, setUnitA] = useState("g");

  // Item B
  const [nameB, setNameB] = useState("");
  const [priceB, setPriceB] = useState(7.00);
  const [sizeB, setSizeB] = useState(500);
  const [unitB, setUnitB] = useState("g");

  const units = [
    { value: "g", label: "Grams (g)" },
    { value: "kg", label: "Kilograms (kg)" },
    { value: "ml", label: "Milliliters (ml)" },
    { value: "L", label: "Liters (L)" },
    { value: "oz", label: "Ounces (oz)" },
    { value: "lb", label: "Pounds (lb)" },
    { value: "count", label: "Pieces/Count" },
  ];

  // Helper to normalize weight to Grams for comparison (or ML for volume)
  // Just comparing based on raw standard unit size for simplicity assuming user compares like-for-like.
  // e.g. converting everything to base unit if they mix, but let's assume they pick the same unit family.
  // Actually, let's normalize everything to a "base value".
  const getMultiplier = (u: string) => {
    switch (u) {
      case "kg": return 1000;
      case "L": return 1000;
      case "lb": return 453.592;
      case "oz": return 28.3495;
      default: return 1; // g, ml, count
    }
  };

  const getBaseName = (u: string) => {
    if (["g", "kg", "lb", "oz"].includes(u)) return "100g";
    if (["ml", "L"].includes(u)) return "100ml";
    return "1 piece";
  };

  const multA = getMultiplier(unitA);
  const multB = getMultiplier(unitB);

  const totalBaseUnitsA = sizeA * multA;
  const totalBaseUnitsB = sizeB * multB;

  // We want to show price per 100g or 100ml. If it's pieces, price per 1 piece.
  const isCount = unitA === "count" || unitB === "count";
  const standardChunk = isCount ? 1 : 100;

  const pricePerChunkA = totalBaseUnitsA > 0 ? (priceA / totalBaseUnitsA) * standardChunk : 0;
  const pricePerChunkB = totalBaseUnitsB > 0 ? (priceB / totalBaseUnitsB) * standardChunk : 0;

  const winner = pricePerChunkA < pricePerChunkB ? 'A' : pricePerChunkB < pricePerChunkA ? 'B' : 'Tie';
  const diffPercent = pricePerChunkA > 0 && pricePerChunkB > 0 
    ? Math.abs(pricePerChunkA - pricePerChunkB) / Math.max(pricePerChunkA, pricePerChunkB) * 100 
    : 0;

  const baseLabel = getBaseName(unitA);

  const getCopyText = () => {
    const nA = nameA || "Item A";
    const nB = nameB || "Item B";
    return `Grocery Comparison:\n${nA}: ${currency}${pricePerChunkA.toFixed(2)} per ${baseLabel}\n${nB}: ${currency}${pricePerChunkB.toFixed(2)} per ${baseLabel}\nWinner: ${winner === 'A' ? nA : winner === 'B' ? nB : 'Both cost the same per unit!'}`;
  };

  return (
    <ToolLayout
      toolNum={51} category="🛠️ Everyday Practical"
      title="Grocery Unit-Price" titleHighlight="Comparator"
      description="Compare true cost per 100g/ml across pack sizes so 'bigger = cheaper' stops fooling you at the supermarket."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <SectionTitle>Item Comparison</SectionTitle>
              <div className="w-24">
                <TextInput id="currency" value={currency} onChange={setCurrency} placeholder="Currency" prefix="$" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <h3 className="font-semibold text-slate-800">{nameA || 'Standard Size'}</h3>
                <div>
                  <FieldLabel htmlFor="nameA">Brand / Item A</FieldLabel>
                  <TextInput id="nameA" value={nameA} onChange={setNameA} placeholder="e.g. Regular Pack" />
                </div>
                <div>
                  <FieldLabel htmlFor="priceA">Price</FieldLabel>
                  <NumInput id="priceA" value={priceA} onChange={setPriceA} prefix={currency} min={0} step={0.1} />
                </div>
                <div className="grid grid-cols-[1fr_100px] gap-2">
                  <div>
                    <FieldLabel htmlFor="sizeA">Size / Weight</FieldLabel>
                    <NumInput id="sizeA" value={sizeA} onChange={setSizeA} min={0} step={1} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="unitA">Unit</FieldLabel>
                    <Select id="unitA" value={unitA} onChange={setUnitA} options={units} />
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <h3 className="font-semibold text-slate-800">{nameB || 'Family Size'}</h3>
                <div>
                  <FieldLabel htmlFor="nameB">Brand / Item B</FieldLabel>
                  <TextInput id="nameB" value={nameB} onChange={setNameB} placeholder="e.g. Family Pack" />
                </div>
                <div>
                  <FieldLabel htmlFor="priceB">Price</FieldLabel>
                  <NumInput id="priceB" value={priceB} onChange={setPriceB} prefix={currency} min={0} step={0.1} />
                </div>
                <div className="grid grid-cols-[1fr_100px] gap-2">
                  <div>
                    <FieldLabel htmlFor="sizeB">Size / Weight</FieldLabel>
                    <NumInput id="sizeB" value={sizeB} onChange={setSizeB} min={0} step={1} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="unitB">Unit</FieldLabel>
                    <Select id="unitB" value={unitB} onChange={setUnitB} options={units} />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Disclaimer>Always check the actual net weight on the package. Sometimes "Family Size" boxes have more air than actual product inside!</Disclaimer>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <ResultHeadline 
              label="Best Value" 
              value={winner === 'A' ? (nameA || 'Standard Size') : winner === 'B' ? (nameB || 'Family Size') : 'Exact Tie!'} 
              sub={winner !== 'Tie' ? `${diffPercent.toFixed(1)}% cheaper per unit` : 'Both cost the same'} 
            />
            
            <div className="px-4 py-4 space-y-1">
              <ResultRow 
                label={nameA || 'Standard Size'} 
                value={`${currency}${pricePerChunkA.toFixed(2)}`} 
                sub={`per ${baseLabel}`} 
                highlight={winner === 'A'} 
              />
              <ResultRow 
                label={nameB || 'Family Size'} 
                value={`${currency}${pricePerChunkB.toFixed(2)}`} 
                sub={`per ${baseLabel}`} 
                highlight={winner === 'B'} 
              />
            </div>
            <div className="px-4 pb-4">
              <CopyButton getText={getCopyText} />
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
