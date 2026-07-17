"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, TextInput, Select, ResultCard, ResultHeadline, ResultRow, Disclaimer, CopyButton } from "@/components/ui";

export default function ApplianceCalculator() {
  const [currency, setCurrency] = useState("$");
  const [elecPrice, setElecPrice] = useState(0.15);

  const [nameA, setNameA] = useState("");
  const [powerA, setPowerA] = useState(150);
  const [unitA, setUnitA] = useState("W");
  const [qtyA, setQtyA] = useState(1);
  const [hoursA, setHoursA] = useState(24);
  const [daysA, setDaysA] = useState(30);

  const [nameB, setNameB] = useState("");
  const [powerB, setPowerB] = useState(100);
  const [unitB, setUnitB] = useState("W");
  const [qtyB, setQtyB] = useState(1);
  const [hoursB, setHoursB] = useState(4);
  const [daysB, setDaysB] = useState(30);

  const wattsA = unitA === 'kW' ? powerA * 1000 : powerA;
  const totalWattsA = wattsA * qtyA;
  const kwhA = (totalWattsA * hoursA * daysA) / 1000;
  const costA = kwhA * elecPrice;

  const wattsB = unitB === 'kW' ? powerB * 1000 : powerB;
  const totalWattsB = wattsB * qtyB;
  const kwhB = (totalWattsB * hoursB * daysB) / 1000;
  const costB = kwhB * elecPrice;

  const diffKwh = Math.abs(kwhA - kwhB);
  const diffCost = Math.abs(costA - costB);

  const hourlyKwhA = totalWattsA / 1000;
  const hourlyKwhB = totalWattsB / 1000;

  const hoursA_eq_B = hourlyKwhB > 0 ? hourlyKwhA / hourlyKwhB : 0;
  const hoursB_eq_A = hourlyKwhA > 0 ? hourlyKwhB / hourlyKwhA : 0;
  const qtyA_eq_B = wattsB > 0 ? wattsA / wattsB : 0;

  const swapAppliances = () => {
    const tempName = nameA; setNameA(nameB); setNameB(tempName);
    const tempPower = powerA; setPowerA(powerB); setPowerB(tempPower);
    const tempUnit = unitA; setUnitA(unitB); setUnitB(tempUnit);
    const tempQty = qtyA; setQtyA(qtyB); setQtyB(tempQty);
    const tempHours = hoursA; setHoursA(hoursB); setHoursB(tempHours);
    const tempDays = daysA; setDaysA(daysB); setDaysB(tempDays);
  };

  const getCopyText = () => {
    return `Electricity Cost Comparison:\n${nameA || 'Fridge'}: ${currency}${costA.toFixed(2)}\n${nameB || 'TV'}: ${currency}${costB.toFixed(2)}\nDifference: ${currency}${diffCost.toFixed(2)}`;
  };

  return (
    <ToolLayout
      toolNum={46} category="🛠️ Everyday Practical"
      title="Appliance Electricity Cost & Comparison" titleHighlight="Calculator"
      description="Compare the electricity consumption and running cost of any two appliances. Calculate energy usage, operating cost, and equivalent power instantly."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Electricity Details</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="currency">Currency Symbol</FieldLabel>
                <TextInput id="currency" value={currency} onChange={setCurrency} />
              </div>
              <div>
                <FieldLabel htmlFor="elecPrice">Price per kWh</FieldLabel>
                <NumInput id="elecPrice" value={elecPrice} onChange={setElecPrice} prefix={currency} min={0} step={0.01} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>Compare Appliances</SectionTitle>
              <button onClick={swapAppliances} className="text-sm font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                <span>🔄</span> Swap
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Appliance A */}
              <div className="space-y-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <h3 className="font-semibold text-slate-800">{nameA || 'Fridge'}</h3>
                <div>
                  <FieldLabel htmlFor="nameA">Appliance Name</FieldLabel>
                  <TextInput id="nameA" value={nameA} onChange={setNameA} placeholder="e.g. Fridge" />
                </div>
                <div className="grid grid-cols-[1fr_90px] gap-2">
                  <div>
                    <FieldLabel htmlFor="powerA">Power</FieldLabel>
                    <NumInput id="powerA" value={powerA} onChange={setPowerA} min={0} step={1} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="unitA">Unit</FieldLabel>
                    <Select id="unitA" value={unitA} onChange={setUnitA} options={[{value: "W", label: "W"}, {value: "kW", label: "kW"}]} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FieldLabel htmlFor="qtyA">Quantity</FieldLabel>
                    <NumInput id="qtyA" value={qtyA} onChange={setQtyA} min={1} step={1} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="hoursA">Hrs/Day</FieldLabel>
                    <NumInput id="hoursA" value={hoursA} onChange={setHoursA} min={0} max={24} step={1} />
                  </div>
                </div>
                <div>
                  <FieldLabel htmlFor="daysA">Days Used</FieldLabel>
                  <NumInput id="daysA" value={daysA} onChange={setDaysA} min={1} step={1} />
                </div>
              </div>

              {/* Appliance B */}
              <div className="space-y-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <h3 className="font-semibold text-slate-800">{nameB || 'TV'}</h3>
                <div>
                  <FieldLabel htmlFor="nameB">Appliance Name</FieldLabel>
                  <TextInput id="nameB" value={nameB} onChange={setNameB} placeholder="e.g. TV" />
                </div>
                <div className="grid grid-cols-[1fr_90px] gap-2">
                  <div>
                    <FieldLabel htmlFor="powerB">Power</FieldLabel>
                    <NumInput id="powerB" value={powerB} onChange={setPowerB} min={0} step={1} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="unitB">Unit</FieldLabel>
                    <Select id="unitB" value={unitB} onChange={setUnitB} options={[{value: "W", label: "W"}, {value: "kW", label: "kW"}]} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FieldLabel htmlFor="qtyB">Quantity</FieldLabel>
                    <NumInput id="qtyB" value={qtyB} onChange={setQtyB} min={1} step={1} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="hoursB">Hrs/Day</FieldLabel>
                    <NumInput id="hoursB" value={hoursB} onChange={setHoursB} min={0} max={24} step={1} />
                  </div>
                </div>
                <div>
                  <FieldLabel htmlFor="daysB">Days Used</FieldLabel>
                  <NumInput id="daysB" value={daysB} onChange={setDaysB} min={1} step={1} />
                </div>
              </div>
            </div>
          </Card>
          
          <Card>
            <SectionTitle>Equivalencies</SectionTitle>
            <div className="space-y-3">
              <ResultRow label={`1 hour of ${nameA || 'Fridge'}`} value={`= ${hoursA_eq_B > 0 ? hoursA_eq_B.toFixed(2) : 'N/A'} hours`} sub={`of ${nameB || 'TV'}`} />
              <ResultRow label={`1 hour of ${nameB || 'TV'}`} value={`= ${hoursB_eq_A > 0 ? hoursB_eq_A.toFixed(2) : 'N/A'} hours`} sub={`of ${nameA || 'Fridge'}`} />
              <ResultRow label={`1 ${nameA || 'Fridge'} power`} value={`= ${qtyA_eq_B > 0 ? qtyA_eq_B.toFixed(2) : 'N/A'} units`} sub={`of ${nameB || 'TV'}`} />
            </div>
          </Card>


        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <ResultHeadline label="Highest Running Cost" value={`${currency}${Math.max(costA, costB).toFixed(2)}`} sub={costA > costB ? (nameA || 'Fridge') : costB > costA ? (nameB || 'TV') : 'Costs are equal'} />
            
            <div className="px-4 py-4 space-y-1">
              <ResultRow label={nameA || 'Fridge'} value={`${currency}${costA.toFixed(2)}`} sub={`${kwhA.toFixed(2)} kWh | ${totalWattsA.toLocaleString()} W`} highlight={costA > costB} />
              <ResultRow label={nameB || 'TV'} value={`${currency}${costB.toFixed(2)}`} sub={`${kwhB.toFixed(2)} kWh | ${totalWattsB.toLocaleString()} W`} highlight={costB > costA} />
              <ResultRow label="Difference in Cost" value={`${currency}${diffCost.toFixed(2)}`} />
              <ResultRow label="Difference in Energy" value={`${diffKwh.toFixed(2)} kWh`} />
            </div>
            <div className="px-4 pb-4 mt-2">
              <CopyButton getText={getCopyText} />
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
