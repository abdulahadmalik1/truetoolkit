"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, ResultCard, ResultHeadline, ResultRow, Disclaimer, CopyButton, AddButton, RemoveButton, InfoBadge } from "@/components/ui";

type Invoice = { id: number; amount: number; days: number };

export default function InvoiceCashRunway() {
  const [cashBuffer, setCashBuffer] = useState(2000);
  const [monthlyBurn, setMonthlyBurn] = useState(3000);
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 1, amount: 1500, days: 14 },
    { id: 2, amount: 2000, days: 45 },
  ]);

  const addInvoice = () => {
    setInvoices([...invoices, { id: Date.now(), amount: 1000, days: 30 }]);
  };

  const removeInvoice = (id: number) => {
    setInvoices(invoices.filter((inv) => inv.id !== id));
  };

  const updateInvoice = (id: number, field: keyof Invoice, value: number) => {
    setInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, [field]: value } : inv)));
  };

  // Calculations
  const dailyBurn = monthlyBurn / 30;
  const initialRunwayDays = dailyBurn > 0 ? cashBuffer / dailyBurn : 0;
  
  const sortedInvoices = [...invoices].sort((a, b) => a.days - b.days);
  let currentCash = cashBuffer;
  let lowestCash = currentCash;
  let hitsZeroAtDay = -1;
  let cashflowGap = 0;

  let previousDays = 0;
  sortedInvoices.forEach((inv) => {
    const daysPassed = inv.days - previousDays;
    currentCash -= daysPassed * dailyBurn;
    
    if (currentCash < lowestCash) lowestCash = currentCash;
    if (currentCash < 0 && hitsZeroAtDay === -1) {
      // Calculate exact day we hit zero
      hitsZeroAtDay = previousDays + (currentCash + daysPassed * dailyBurn) / dailyBurn;
      cashflowGap = Math.abs(currentCash);
    }
    
    currentCash += inv.amount;
    previousDays = inv.days;
  });

  const totalCashAvailable = cashBuffer + invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalRunwayDays = dailyBurn > 0 ? totalCashAvailable / dailyBurn : 0;
  const totalRunwayMonths = totalRunwayDays / 30;

  const getCopyText = () => {
    return `Invoice Cash-Runway:\nTotal Runway: ${totalRunwayDays.toFixed(0)} days (${totalRunwayMonths.toFixed(1)} months)\nCashflow Gap: ${hitsZeroAtDay !== -1 ? `Danger! Will hit $0 in ${hitsZeroAtDay.toFixed(0)} days` : 'Safe. No cash flow gaps.'}`;
  };

  return (
    <ToolLayout
      toolNum={48} category="💰 Money & Freelance"
      title="Invoice Cash-Runway" titleHighlight="Calculator"
      description="See how many days of runway you actually have based on which pending invoices are likely to pay on time, and spot cash flow gaps before they happen."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Current Finances</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="cash">Current Bank Balance</FieldLabel>
                <NumInput id="cash" value={cashBuffer} onChange={setCashBuffer} prefix="$" min={0} step={100} />
              </div>
              <div>
                <FieldLabel htmlFor="burn">Monthly Burn Rate (Expenses)</FieldLabel>
                <NumInput id="burn" value={monthlyBurn} onChange={setMonthlyBurn} prefix="$" min={1} step={100} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>Pending Invoices</SectionTitle>
              <AddButton onClick={addInvoice} label="Add Invoice" />
            </div>
            
            <div className="space-y-3">
              {invoices.map((inv, idx) => (
                <div key={inv.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Amount</FieldLabel>
                      <NumInput id={`inv-amt-${inv.id}`} value={inv.amount} onChange={(v) => updateInvoice(inv.id, "amount", v)} prefix="$" min={0} step={50} />
                    </div>
                    <div>
                      <FieldLabel>Days until paid</FieldLabel>
                      <NumInput id={`inv-days-${inv.id}`} value={inv.days} onChange={(v) => updateInvoice(inv.id, "days", v)} suffix="days" min={1} step={1} />
                    </div>
                  </div>
                  <div className="pt-6">
                    <RemoveButton onClick={() => removeInvoice(inv.id)} />
                  </div>
                </div>
              ))}
              {invoices.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No pending invoices. You are surviving solely on your cash buffer.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <ResultHeadline label="Total Cash Runway" value={`${totalRunwayDays.toFixed(0)} days`} sub={`~${totalRunwayMonths.toFixed(1)} months of expenses`} />
            
            <div className="px-4 py-4 space-y-3">
              {hitsZeroAtDay !== -1 ? (
                <InfoBadge color="red">
                  <strong>🚨 Cashflow Gap Detected!</strong><br />
                  You will run out of money in roughly {hitsZeroAtDay.toFixed(0)} days, before your later invoices clear. You need an extra ${cashflowGap.toFixed(0)} to bridge the gap.
                </InfoBadge>
              ) : (
                <InfoBadge color="green">
                  <strong>✅ Safe Cashflow</strong><br />
                  Your current cash buffer is enough to float you until your pending invoices are paid.
                </InfoBadge>
              )}
              
              <div className="pt-2">
                <ResultRow label="Buffer without invoices" value={`${initialRunwayDays.toFixed(0)} days`} />
                <ResultRow label="Total Value of Invoices" value={`$${(totalCashAvailable - cashBuffer).toLocaleString()}`} />
                <ResultRow label="Daily Burn Rate" value={`$${dailyBurn.toFixed(0)}/day`} />
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
