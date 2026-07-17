"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, Select, ResultCard, ResultRow, Disclaimer } from "@/components/ui";
import depData from "@/data/depreciation-rates.json";

export default function ResalePrice() {
  const [category, setCategory] = useState("phones-laptops");
  const [originalPrice, setOriginalPrice] = useState(80000);
  const [ageMonths, setAgeMonths] = useState(18);
  const [condition, setCondition] = useState("good");

  const cat = depData.categories.find((c) => c.id === category)!;
  const ageYears = ageMonths / 12;
  const depreciated = originalPrice * Math.pow(1 - cat.annualRate, ageYears);
  const floored = Math.max(depreciated, originalPrice * cat.floorValue);
  const condMult = cat.conditionMultipliers[condition as keyof typeof cat.conditionMultipliers];
  const central = floored * condMult;
  const low = central * 0.90;
  const high = central * 1.10;

  return (
    <ToolLayout
      toolNum={40} category="💰 Money & Freelance"
      title="Used-Item Resale" titleHighlight="Price Estimator"
      description="Estimate a fair asking price range for a used item, based on depreciation curve and condition."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-5">
          <Card>
            <SectionTitle>Item Details</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="cat">Category</FieldLabel>
                <Select id="cat" value={category} onChange={setCategory} options={depData.categories.map((c) => ({ value: c.id, label: c.label }))} />
              </div>
              <div>
                <FieldLabel htmlFor="price">Original Purchase Price</FieldLabel>
                <NumInput id="price" value={originalPrice} onChange={setOriginalPrice} prefix="PKR" min={0} step={1000} />
              </div>
              <div>
                <FieldLabel htmlFor="age">Age</FieldLabel>
                <NumInput id="age" value={ageMonths} onChange={setAgeMonths} suffix="months" min={0} max={240} />
              </div>
              <div>
                <FieldLabel htmlFor="cond">Condition</FieldLabel>
                <Select id="cond" value={condition} onChange={setCondition} options={[
                  { value: "like-new", label: "Like New — barely used, no marks" },
                  { value: "good", label: "Good — minor signs of use" },
                  { value: "fair", label: "Fair — visible wear, fully functional" },
                  { value: "poor", label: "Poor — heavy wear or minor defects" },
                ]} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Depreciation Details</SectionTitle>
            <div className="space-y-2">
              <ResultRow label="Annual depreciation rate" value={`${(cat.annualRate * 100).toFixed(0)}%`} />
              <ResultRow label="Age" value={`${ageYears.toFixed(1)} years`} />
              <ResultRow label="Condition multiplier" value={`${(condMult * 100).toFixed(0)}%`} />
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-blue-600 to-violet-700 px-6 py-7 text-center">
              <p className="text-blue-100 text-sm mb-1">Fair Asking Price Range</p>
              <p className="text-3xl font-extrabold tabular-nums">PKR {low.toFixed(0)} – {high.toFixed(0)}</p>
            </div>
            <div className="px-4 py-4">
              <ResultRow label="Original price" value={`PKR ${originalPrice.toLocaleString()}`} />
              <ResultRow label="Depreciated value" value={`PKR ${floored.toFixed(0)}`} />
              <ResultRow label="After condition adj." value={`PKR ${central.toFixed(0)}`} highlight />
              <ResultRow label="Low estimate" value={`PKR ${low.toFixed(0)}`} />
              <ResultRow label="High estimate" value={`PKR ${high.toFixed(0)}`} />
            </div>
          </ResultCard>
          <Disclaimer>This is an estimate only. Actual market price depends on brand, demand, accessories, and buyer negotiations. Not a formal valuation.</Disclaimer>
        </div>
      </div>
    </ToolLayout>
  );
}
