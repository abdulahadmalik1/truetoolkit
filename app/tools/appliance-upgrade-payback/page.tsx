"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, TextInput, ResultCard, ResultHeadline, ResultRow, Disclaimer, CopyButton, InfoBadge } from "@/components/ui";

export default function ApplianceUpgradePayback() {
  const [currency, setCurrency] = useState("$");
  
  const [newPrice, setNewPrice] = useState(1200);
  const [oldMonthly, setOldMonthly] = useState(80);
  const [newMonthly, setNewMonthly] = useState(30);

  // Calculations
  const monthlySavings = oldMonthly - newMonthly;
  const annualSavings = monthlySavings * 12;
  
  const paybackMonths = monthlySavings > 0 ? newPrice / monthlySavings : 0;
  const paybackYears = paybackMonths / 12;

  const getCopyText = () => {
    if (monthlySavings <= 0) return `Appliance Upgrade Payback:\nIt never pays for itself! The new appliance costs the same or more to run.`;
    return `Appliance Upgrade Payback:\nNew Appliance Price: ${currency}${newPrice}\nMonthly Savings: ${currency}${monthlySavings}\nPays for itself in: ${paybackMonths.toFixed(1)} months (${paybackYears.toFixed(1)} years).`;
  };

  return (
    <ToolLayout
      toolNum={53} category="🛠️ Everyday Practical"
      title="Appliance Upgrade Payback" titleHighlight="Calculator"
      description="Find out exactly how many months until a pricier, energy-efficient appliance actually pays for itself in electricity savings."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <SectionTitle>The Investment</SectionTitle>
              <div className="w-24">
                <TextInput id="currency" value={currency} onChange={setCurrency} placeholder="$" />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="price">Price of New Appliance</FieldLabel>
              <p className="text-xs text-slate-500 mb-2">Include tax and installation costs.</p>
              <NumInput id="price" value={newPrice} onChange={setNewPrice} prefix={currency} min={0} step={50} />
            </div>
          </Card>

          <Card>
            <SectionTitle>Monthly Running Cost</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="old">Current Appliance Cost</FieldLabel>
                <NumInput id="old" value={oldMonthly} onChange={setOldMonthly} prefix={currency} suffix="/mo" min={0} step={5} />
              </div>
              <div>
                <FieldLabel htmlFor="new">New Appliance Cost</FieldLabel>
                <NumInput id="new" value={newMonthly} onChange={setNewMonthly} prefix={currency} suffix="/mo" min={0} step={5} />
              </div>
            </div>
          </Card>

          <Disclaimer>This assumes electricity prices stay flat. If energy prices rise, your new appliance will pay for itself even faster! (You can use the 'Appliance Electricity Cost' tool to estimate these monthly costs).</Disclaimer>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            {monthlySavings > 0 ? (
              <>
                <ResultHeadline label="Pays For Itself In" value={`${paybackMonths.toFixed(1)} months`} sub={`Or ${paybackYears.toFixed(1)} years`} />
                <div className="px-4 py-4 space-y-3">
                  <InfoBadge color="green">
                    <strong>Smart Investment!</strong><br />
                    After {paybackMonths.toFixed(0)} months, this appliance will effectively generate ${monthlySavings.toFixed(0)} in pure savings every month.
                  </InfoBadge>
                  <div className="pt-2 border-t border-slate-200 mt-4">
                    <ResultRow label="Monthly Savings" value={`${currency}${monthlySavings.toLocaleString()}`} highlight />
                    <ResultRow label="Annual Savings" value={`${currency}${annualSavings.toLocaleString()}`} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <ResultHeadline label="Pays For Itself In" value="Never" sub="Running costs are higher or equal" />
                <div className="px-4 py-4 space-y-3">
                  <InfoBadge color="red">
                    <strong>Bad Investment!</strong><br />
                    The new appliance costs more to run than your old one. You will never recoup the purchase price through utility savings.
                  </InfoBadge>
                  <div className="pt-2 border-t border-slate-200 mt-4">
                    <ResultRow label="Monthly Loss" value={`${currency}${Math.abs(monthlySavings).toLocaleString()}`} highlight />
                  </div>
                </div>
              </>
            )}
            
            <div className="px-4 pb-4">
              <CopyButton getText={getCopyText} />
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
