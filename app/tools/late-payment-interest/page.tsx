"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, ResultCard, ResultRow, CopyButton, Disclaimer } from "@/components/ui";

export default function LatePaymentInterest() {
  const [invoiceAmount, setInvoiceAmount] = useState(5000);
  const [dueDate, setDueDate] = useState("2024-06-01");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [annualRate, setAnnualRate] = useState(8);

  const due = new Date(dueDate);
  const payment = new Date(paymentDate);
  const daysLate = Math.max(0, Math.floor((payment.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
  const interest = invoiceAmount * (annualRate / 100 / 365) * daysLate;
  const totalDue = invoiceAmount + interest;

  const wording = `Dear [Client],\n\nThis is a reminder that invoice #[XXX] for ${invoiceAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })} was due on ${dueDate} and remains unpaid as of ${paymentDate} (${daysLate} days overdue).\n\nPer our agreed terms, a late payment fee of ${interest.toLocaleString("en-US", { style: "currency", currency: "USD" })} has been applied at an annual rate of ${annualRate}%.\n\nTotal amount now due: ${totalDue.toLocaleString("en-US", { style: "currency", currency: "USD" })}\n\nPlease arrange payment at your earliest convenience.\n\nBest regards,\n[Your Name]`;

  return (
    <ToolLayout
      toolNum={36} category="💰 Money & Freelance"
      title="Late Payment Interest" titleHighlight="Calculator"
      description="Calculate the interest you can fairly charge on an overdue invoice, and get suggested wording for your reminder."
    >
      <div className="grid md:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-5">
          <Card>
            <SectionTitle>Invoice Details</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="inv">Invoice Amount</FieldLabel>
                <NumInput id="inv" value={invoiceAmount} onChange={setInvoiceAmount} prefix="$" min={0} step={100} />
              </div>
              <div>
                <FieldLabel htmlFor="due">Due Date</FieldLabel>
                <input id="due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <FieldLabel htmlFor="pay">Payment / Today's Date</FieldLabel>
                <input id="pay" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <FieldLabel htmlFor="rate">Annual Interest Rate</FieldLabel>
                <NumInput id="rate" value={annualRate} onChange={setAnnualRate} suffix="%" min={0} max={100} step={0.5} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Suggested Invoice Reminder Wording</SectionTitle>
            <textarea readOnly value={wording} rows={10}
              className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-slate-800/40 text-slate-700 text-sm outline-none resize-none" />
            <button onClick={() => navigator.clipboard.writeText(wording)}
              className="mt-2 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 hover:text-slate-900 transition-all border border-slate-300">
              📋 Copy wording
            </button>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className={`bg-gradient-to-br ${daysLate > 0 ? "from-red-700 to-rose-800" : "from-emerald-700 to-teal-800"} px-6 py-7 text-center`}>
              <p className="text-white/80 text-sm mb-1">{daysLate > 0 ? `${daysLate} days overdue` : "Not yet overdue"}</p>
              <p className="text-white text-4xl font-extrabold tabular-nums">${interest.toFixed(2)}</p>
              <p className="text-white/70 text-sm mt-1">interest accrued</p>
            </div>
            <div className="px-4 py-4">
              <ResultRow label="Invoice Amount" value={`$${invoiceAmount.toLocaleString()}`} />
              <ResultRow label="Interest Accrued" value={`$${interest.toFixed(2)}`} />
              <ResultRow label="Total Now Due" value={`$${totalDue.toFixed(2)}`} highlight />
              <ResultRow label="Days Overdue" value={`${daysLate}`} />
              <ResultRow label="Daily Rate" value={`$${(invoiceAmount * annualRate / 100 / 365).toFixed(2)}/day`} />
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
