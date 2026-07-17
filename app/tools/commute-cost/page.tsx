"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, Toggle, ResultCard, ResultRow } from "@/components/ui";

export default function CommuteCost() {
  const [mode, setMode] = useState<"drive" | "transit">("drive");
  const [unit, setUnit] = useState<"km" | "miles">("km");
  const [distance, setDistance] = useState(20);
  const [tripsPerWeek, setTripsPerWeek] = useState(10);
  const [fuelPrice, setFuelPrice] = useState(0.3);
  const [efficiency, setEfficiency] = useState(12);
  const [transitFare, setTransitFare] = useState(100);
  const [parking, setParking] = useState(0);
  const [commuteTime, setCommuteTime] = useState(45);

  const distKm = unit === "miles" ? distance * 1.60934 : distance;
  const fuelPerTrip = mode === "drive" ? (distKm / efficiency) * fuelPrice : 0;
  const costPerTrip = (mode === "drive" ? fuelPerTrip : transitFare) + parking;
  const monthlyTrips = tripsPerWeek * 4.33;
  const monthlyCost = costPerTrip * monthlyTrips;
  const annualCost = monthlyCost * 12;
  const annualHours = (commuteTime * tripsPerWeek * 52) / 60;
  const fullDays = annualHours / 24;

  return (
    <ToolLayout
      toolNum={7} category="💰 Money & Freelance"
      title="Commute Cost &" titleHighlight="Time Reality Check"
      description="The true monthly and annual cost of your commute — including how many days of your life it takes."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-5">
          <Card>
            <SectionTitle>Mode & Units</SectionTitle>
            <div className="flex gap-3 flex-wrap">
              {(["drive", "transit"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${mode === m ? "bg-blue-600 border-blue-500 text-slate-900" : "bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900"}`}
                >{m === "drive" ? "🚗 Drive" : "🚌 Transit"}</button>
              ))}
              {(["km", "miles"] as const).map((u) => (
                <button key={u} onClick={() => setUnit(u)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${unit === u ? "bg-slate-200 border-slate-300 text-slate-900" : "bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900"}`}
                >{u}</button>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle>Distance & Trips</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="dist">One-Way Distance ({unit})</FieldLabel>
                <NumInput id="dist" value={distance} onChange={setDistance} suffix={unit} min={0} step={0.5} />
              </div>
              <div>
                <FieldLabel htmlFor="trips">Round Trips per Week</FieldLabel>
                <NumInput id="trips" value={tripsPerWeek} onChange={setTripsPerWeek} min={1} max={14} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>{mode === "drive" ? "Fuel Costs" : "Transit Fare"}</SectionTitle>
            <div className="space-y-4">
              {mode === "drive" ? (
                <>
                  <div>
                    <FieldLabel htmlFor="fuel">Fuel Price per Liter</FieldLabel>
                    <NumInput id="fuel" value={fuelPrice} onChange={setFuelPrice} prefix="$" step={0.01} min={0} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="eff">Vehicle Fuel Efficiency</FieldLabel>
                    <NumInput id="eff" value={efficiency} onChange={setEfficiency} suffix="km/L" min={1} step={0.5} />
                  </div>
                </>
              ) : (
                <div>
                  <FieldLabel htmlFor="fare">One-Way Transit Fare</FieldLabel>
                  <NumInput id="fare" value={transitFare} onChange={setTransitFare} prefix="PKR" min={0} step={5} />
                </div>
              )}
              <div>
                <FieldLabel htmlFor="park" hint="optional">Daily Parking Cost</FieldLabel>
                <NumInput id="park" value={parking} onChange={setParking} prefix="$" min={0} step={1} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Time</SectionTitle>
            <div>
              <FieldLabel htmlFor="time">One-Way Commute Time</FieldLabel>
              <NumInput id="time" value={commuteTime} onChange={setCommuteTime} suffix="minutes" min={1} max={300} />
            </div>
          </Card>
        </div>

        <div className="sticky top-24">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-blue-600 to-cyan-700 px-6 py-7 text-center">
              <p className="text-blue-100 text-sm mb-1">Monthly Commute Cost</p>
              <p className="text-white text-4xl font-extrabold tabular-nums">${monthlyCost.toFixed(2)}</p>
            </div>
            <div className="px-4 py-4">
              <ResultRow label="Cost per trip" value={`$${costPerTrip.toFixed(2)}`} />
              <ResultRow label="Annual cost" value={`$${annualCost.toFixed(0)}`} highlight />
              <ResultRow label="Annual hours commuting" value={`${annualHours.toFixed(0)} hrs`} />
              <ResultRow label="= Full days per year" value={`${fullDays.toFixed(1)} days`} highlight />
              <ResultRow label="Round trips/week" value={`${tripsPerWeek}`} />
            </div>
            <div className="px-4 pb-4">
              <div className="text-xs text-slate-500 text-center">That's {fullDays.toFixed(1)} full days of your life per year spent commuting</div>
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
