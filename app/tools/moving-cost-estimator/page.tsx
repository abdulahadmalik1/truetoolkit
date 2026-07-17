"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, TextInput, ResultCard, ResultHeadline, ResultRow, Disclaimer, CopyButton } from "@/components/ui";

export default function MovingCostEstimator() {
  const [currency, setCurrency] = useState("$");

  // Expenses
  const [movers, setMovers] = useState(400);
  const [packing, setPacking] = useState(80);
  const [deposit, setDeposit] = useState(1500);
  const [rent, setRent] = useState(1500);
  const [cleaning, setCleaning] = useState(150);
  const [damages, setDamages] = useState(100);
  const [utilities, setUtilities] = useState(75);
  const [food, setFood] = useState(50);

  // Calculations
  const sunkCosts = movers + packing + cleaning + damages + utilities + food;
  const recoverableOrStandard = deposit + rent;
  const totalCashNeeded = sunkCosts + recoverableOrStandard;

  const getCopyText = () => {
    return `Moving Day Cost Estimate:\nTotal Cash Needed: ${currency}${totalCashNeeded.toLocaleString()}\nSunk/Lost Costs: ${currency}${sunkCosts.toLocaleString()}\nDeposit & 1st Month: ${currency}${recoverableOrStandard.toLocaleString()}`;
  };

  return (
    <ToolLayout
      toolNum={52} category="🛠️ Everyday Practical"
      title="Moving Day True-Cost" titleHighlight="Estimator"
      description="Add up every hidden relocation cost people forget until the bill arrives, so you know exactly how much cash you actually need on moving day."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <SectionTitle>Logistics & Labor</SectionTitle>
              <div className="w-24">
                <TextInput id="currency" value={currency} onChange={setCurrency} placeholder="$" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="movers">Movers or Truck Rental</FieldLabel>
                <NumInput id="movers" value={movers} onChange={setMovers} prefix={currency} min={0} step={50} />
              </div>
              <div>
                <FieldLabel htmlFor="packing">Boxes & Tape</FieldLabel>
                <NumInput id="packing" value={packing} onChange={setPacking} prefix={currency} min={0} step={10} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>The New Place</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="deposit">Security Deposit</FieldLabel>
                <NumInput id="deposit" value={deposit} onChange={setDeposit} prefix={currency} min={0} step={100} />
              </div>
              <div>
                <FieldLabel htmlFor="rent">First Month's Rent</FieldLabel>
                <NumInput id="rent" value={rent} onChange={setRent} prefix={currency} min={0} step={100} />
              </div>
              <div>
                <FieldLabel htmlFor="utilities">Utility Setup / Activation</FieldLabel>
                <NumInput id="utilities" value={utilities} onChange={setUtilities} prefix={currency} min={0} step={10} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Hidden Costs</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="cleaning">Move-out Cleaning Fee</FieldLabel>
                <NumInput id="cleaning" value={cleaning} onChange={setCleaning} prefix={currency} min={0} step={20} />
              </div>
              <div>
                <FieldLabel htmlFor="damages" hint="(budget for replacements)">Broken Items / Take-out</FieldLabel>
                <NumInput id="damages" value={damages} onChange={setDamages} prefix={currency} min={0} step={20} />
              </div>
              <div>
                <FieldLabel htmlFor="food">Moving Day Food/Travel</FieldLabel>
                <NumInput id="food" value={food} onChange={setFood} prefix={currency} min={0} step={10} />
              </div>
            </div>
          </Card>

          <Disclaimer>Your Security Deposit and First Month's Rent are required cash, but they aren't "lost" money like moving trucks and pizza. This calculator separates the "sunk costs" from the "standard rent" costs.</Disclaimer>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <ResultHeadline label="Total Cash Needed" value={`${currency}${totalCashNeeded.toLocaleString()}`} />
            
            <div className="px-4 py-4 space-y-1">
              <ResultRow label="Sunk / Moving Costs" value={`${currency}${sunkCosts.toLocaleString()}`} highlight />
              <ResultRow label="Deposit & Rent" value={`${currency}${recoverableOrStandard.toLocaleString()}`} />
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cost Breakdown</p>
                <ResultRow label="Labor & Packing" value={`${currency}${(movers + packing).toLocaleString()}`} />
                <ResultRow label="Hidden Fees & Food" value={`${currency}${(cleaning + damages + utilities + food).toLocaleString()}`} />
              </div>
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
