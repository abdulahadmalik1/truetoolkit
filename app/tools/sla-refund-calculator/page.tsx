"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, Select, ResultCard, ResultRow, TextInput } from "@/components/ui";

const SLA_TIERS = [
  { value: "compute", label: "Standard Cloud Compute (99.99%)" },
  { value: "storage", label: "Standard Cloud Storage (99.9%)" },
];

export default function SLARefundCalculator() {
  const [provider, setProvider] = useState("AWS / GCP Compute");
  const [slaType, setSlaType] = useState("compute");
  const [monthlyBill, setMonthlyBill] = useState(15000);
  const [daysInMonth, setDaysInMonth] = useState(30);
  
  const [downHours, setDownHours] = useState(1);
  const [downMinutes, setDownMinutes] = useState(45);

  const math = useMemo(() => {
    const totalDowntimeMins = (downHours * 60) + downMinutes;
    const totalMonthMins = daysInMonth * 24 * 60;
    
    // Prevent negative uptime
    const validDowntimeMins = Math.min(totalDowntimeMins, totalMonthMins);
    
    const uptimeMins = totalMonthMins - validDowntimeMins;
    const uptimePercent = (uptimeMins / totalMonthMins) * 100;

    let creditPercentage = 0;

    // SLA Tier Logic based on standard AWS/GCP SLA
    if (slaType === "compute") {
      // 99.99% Commitment
      if (uptimePercent < 95.0) creditPercentage = 100;
      else if (uptimePercent < 99.0) creditPercentage = 25;
      else if (uptimePercent < 99.99) creditPercentage = 10;
    } else {
      // 99.9% Commitment (Storage usually has a lower bar)
      if (uptimePercent < 95.0) creditPercentage = 100;
      else if (uptimePercent < 99.0) creditPercentage = 25;
      else if (uptimePercent < 99.9) creditPercentage = 10;
    }

    const creditAmount = monthlyBill * (creditPercentage / 100);

    // Exact threshold for 99.99% in minutes for a 30 day month:
    // 30 * 24 * 60 = 43200 mins. 0.01% of 43200 = 4.32 mins.
    const threshold9999 = totalMonthMins * 0.0001;
    const threshold9900 = totalMonthMins * 0.01;
    const threshold9500 = totalMonthMins * 0.05;

    return {
      totalMonthMins,
      totalDowntimeMins: validDowntimeMins,
      uptimePercent,
      creditPercentage,
      creditAmount,
      threshold9999,
      threshold9900,
      threshold9500
    };
  }, [slaType, monthlyBill, daysInMonth, downHours, downMinutes]);

  const claimTemplate = `Hello Billing Support,

I am writing to request an SLA Service Credit for ${provider}.
During this billing cycle (${daysInMonth} days), our resources experienced ${math.totalDowntimeMins} minutes of downtime.

Total Minutes in Month: ${math.totalMonthMins.toLocaleString()}
Downtime Minutes: ${math.totalDowntimeMins}
Actual Monthly Uptime Percentage: ${math.uptimePercent.toFixed(4)}%

Under the standard ${slaType === "compute" ? "99.99%" : "99.9%"} SLA, an uptime of ${math.uptimePercent.toFixed(4)}% entitles us to a ${math.creditPercentage}% service credit against our monthly bill.

Monthly Bill: $${monthlyBill.toLocaleString(undefined, {minimumFractionDigits:2})}
Requested Credit: $${math.creditAmount.toLocaleString(undefined, {minimumFractionDigits:2})}

Please apply this credit to our next invoice.

Thank you.`;

  return (
    <ToolLayout
      toolNum={74} category="🛠️ Business & Operations"
      title="Server Downtime" titleHighlight="SLA Refund Calculator"
      description="Cloud providers guarantee 99.99% uptime, but they won't automatically refund you when they fail. Input your exact downtime to see exactly how much Service Credit they mathematically owe you."
    >
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Invoice & SLA Details</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="prov">Service / Provider</FieldLabel>
                <TextInput id="prov" value={provider} onChange={setProvider} placeholder="e.g. AWS EC2" />
              </div>
              <div>
                <FieldLabel htmlFor="sla">Target SLA Tier</FieldLabel>
                <Select id="sla" value={slaType} onChange={setSlaType} options={SLA_TIERS} />
              </div>
              <div>
                <FieldLabel htmlFor="bill">Monthly Bill Amount ($)</FieldLabel>
                <NumInput id="bill" value={monthlyBill} onChange={setMonthlyBill} min={0} />
              </div>
              <div>
                <FieldLabel htmlFor="days">Days in Billing Month</FieldLabel>
                <Select id="days" value={daysInMonth.toString()} onChange={(v) => setDaysInMonth(parseInt(v))} options={[
                  {value: "28", label: "28 Days"}, {value: "29", label: "29 Days"}, {value: "30", label: "30 Days"}, {value: "31", label: "31 Days"}
                ]} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Actual Downtime Logged</SectionTitle>
            <p className="text-sm text-slate-600 mb-4">Check your monitoring tool (Datadog, Pingdom) for the exact duration your service was unreachable.</p>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <FieldLabel htmlFor="dh">Downtime (Hours)</FieldLabel>
                <NumInput id="dh" value={downHours} onChange={setDownHours} min={0} />
              </div>
              <div className="flex-1">
                <FieldLabel htmlFor="dm">Downtime (Minutes)</FieldLabel>
                <NumInput id="dm" value={downMinutes} onChange={setDownMinutes} min={0} max={59} />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-600">
              <div className="flex justify-between mb-1">
                <span>0.01% downtime allowance:</span>
                <span className="font-bold">{math.threshold9999.toFixed(1)} mins</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>1.00% downtime allowance:</span>
                <span className="font-bold">{math.threshold9900.toFixed(1)} mins</span>
              </div>
              <div className="flex justify-between">
                <span>5.00% downtime allowance:</span>
                <span className="font-bold">{math.threshold9500.toFixed(1)} mins</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className={`bg-gradient-to-br px-6 py-8 text-center rounded-t-2xl ${math.creditPercentage > 0 ? 'from-emerald-600 to-green-700' : 'from-slate-700 to-slate-800'}`}>
              <p className="text-white/80 text-sm font-medium mb-1">Owed Service Credit</p>
              <p className="text-white text-5xl font-black tabular-nums tracking-tight">
                ${math.creditAmount.toFixed(2)}
              </p>
              <p className="text-white/80 text-sm mt-2 font-semibold">
                {math.uptimePercent.toFixed(4)}% Uptime ({math.creditPercentage}% Refund Tier)
              </p>
            </div>
            <div className="px-4 py-4 space-y-1 bg-white rounded-b-2xl">
              <ResultRow label="Total Month Minutes" value={math.totalMonthMins.toLocaleString()} />
              <ResultRow label="Total Downtime Mins" value={<span className="text-rose-600 font-bold">{math.totalDowntimeMins.toLocaleString()}</span>} />
            </div>
          </ResultCard>

          {math.creditPercentage > 0 ? (
            <div className="bg-white border-2 border-emerald-500 rounded-xl shadow-lg overflow-hidden">
              <div className="bg-emerald-500 text-white px-4 py-2 font-bold flex justify-between items-center text-sm">
                <span>Support Claim Template</span>
                <button onClick={() => { navigator.clipboard.writeText(claimTemplate); alert("Copied!"); }} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors">
                  Copy
                </button>
              </div>
              <div className="p-4 bg-emerald-50 whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed border-t border-emerald-200 h-64 overflow-y-auto">
                {claimTemplate}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 text-center">
              Your uptime of {math.uptimePercent.toFixed(4)}% did not fall below the {slaType === "compute" ? "99.99%" : "99.9%"} threshold. You are not owed a refund.
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
