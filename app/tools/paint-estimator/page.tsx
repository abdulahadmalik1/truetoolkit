"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, ResultCard, ResultRow } from "@/components/ui";

const STD_DOOR = 21; // sq ft
const STD_WINDOW = 12; // sq ft

export default function PaintEstimator() {
  const [length, setLength] = useState(15);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(9);
  const [doors, setDoors] = useState(1);
  const [windows, setWindows] = useState(2);
  const [coats, setCoats] = useState(2);
  const [coveragePerCan, setCoveragePerCan] = useState(350);
  const [wasteBuffer, setWasteBuffer] = useState(10);
  const [pricePerCan, setPricePerCan] = useState(0);

  const perimeter = 2 * (length + width);
  const wallArea = perimeter * height - (doors * STD_DOOR + windows * STD_WINDOW);
  const paintNeeded = wallArea * coats / coveragePerCan * (1 + wasteBuffer / 100);
  const cansNeeded = Math.ceil(paintNeeded);
  const totalCost = pricePerCan > 0 ? cansNeeded * pricePerCan : null;

  return (
    <ToolLayout toolNum={14} category="🛠️ Everyday Practical" title="Paint & Wallpaper" titleHighlight="Estimator"
      description="How many cans of paint or rolls of wallpaper do you need? Enter room dimensions to find out."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-5">
          <Card>
            <SectionTitle>Room Dimensions</SectionTitle>
            <div className="grid grid-cols-3 gap-3">
              {[["Length", length, setLength], ["Width", width, setWidth], ["Height", height, setHeight]].map(([label, val, setter]) => (
                <div key={label as string}>
                  <FieldLabel htmlFor={label as string}>{label as string} (ft)</FieldLabel>
                  <NumInput id={label as string} value={val as number} onChange={setter as (v: number) => void} min={0} step={0.5} />
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <SectionTitle>Openings & Coats</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel htmlFor="doors">Number of Doors</FieldLabel>
                <NumInput id="doors" value={doors} onChange={setDoors} min={0} />
              </div>
              <div>
                <FieldLabel htmlFor="windows">Number of Windows</FieldLabel>
                <NumInput id="windows" value={windows} onChange={setWindows} min={0} />
              </div>
              <div>
                <FieldLabel htmlFor="coats">Coats of Paint</FieldLabel>
                <NumInput id="coats" value={coats} onChange={setCoats} min={1} max={5} />
              </div>
              <div>
                <FieldLabel htmlFor="waste">Waste Buffer</FieldLabel>
                <NumInput id="waste" value={wasteBuffer} onChange={setWasteBuffer} suffix="%" min={0} max={50} />
              </div>
            </div>
          </Card>
          <Card>
            <SectionTitle>Coverage & Price</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel htmlFor="cov">Coverage per Can</FieldLabel>
                <NumInput id="cov" value={coveragePerCan} onChange={setCoveragePerCan} suffix="sq ft" min={1} />
              </div>
              <div>
                <FieldLabel htmlFor="price" hint="optional">Price per Can</FieldLabel>
                <NumInput id="price" value={pricePerCan} onChange={setPricePerCan} prefix="$" min={0} />
              </div>
            </div>
          </Card>
        </div>

        <div className="sticky top-24">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-blue-600 to-teal-700 px-6 py-7 text-center">
              <p className="text-blue-100 text-sm mb-1">Cans / Rolls Needed</p>
              <p className="text-white text-6xl font-extrabold">{cansNeeded}</p>
              <p className="text-blue-100 text-sm mt-1">including {wasteBuffer}% waste buffer</p>
            </div>
            <div className="px-4 py-4">
              <ResultRow label="Total wall area" value={`${wallArea.toFixed(0)} sq ft`} />
              <ResultRow label="Area to paint (all coats)" value={`${(wallArea * coats).toFixed(0)} sq ft`} />
              <ResultRow label="Paint required" value={`${paintNeeded.toFixed(2)} cans`} />
              <ResultRow label="Rounded up" value={`${cansNeeded} cans`} highlight />
              {totalCost && <ResultRow label="Estimated cost" value={`$${totalCost.toFixed(2)}`} highlight />}
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
