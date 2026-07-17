"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, Select, ResultCard, ResultRow, Disclaimer } from "@/components/ui";

const PRORATION_BASES = [
  { value: "calendar", label: "Calendar days in month" },
  { value: "30", label: "Fixed 30-day month" },
  { value: "academic", label: "Academic days (user-defined)" },
];

export default function FeeRefund() {
  const [totalFee, setTotalFee] = useState(50000);
  const [paidFor, setPaidFor] = useState<"month" | "quarter" | "semester" | "year">("month");
  const [prorationBase, setProrationBase] = useState("calendar");
  const [withdrawalDate, setWithdrawalDate] = useState(new Date().toISOString().split("T")[0]);
  const [periodStart, setPeriodStart] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]);
  const [academicDays, setAcademicDays] = useState(25);
  const [daysAttended, setDaysAttended] = useState(10);
  const [adminFee, setAdminFee] = useState(2000);

  const paidPeriodDays = (() => {
    const s = new Date(periodStart);
    const dur = { month: 1, quarter: 3, semester: 6, year: 12 }[paidFor];
    const e = new Date(s); e.setMonth(e.getMonth() + dur); e.setDate(e.getDate() - 1);
    return Math.ceil((e.getTime() - s.getTime()) / 86400000) + 1;
  })();

  const withdrawal = new Date(withdrawalDate);
  const start = new Date(periodStart);
  const daysUsed = Math.max(0, Math.ceil((withdrawal.getTime() - start.getTime()) / 86400000));

  const baseDays = prorationBase === "calendar" ? paidPeriodDays : prorationBase === "30" ? 30 : academicDays;
  const usedDays = prorationBase === "academic" ? daysAttended : daysUsed;

  const usedFraction = baseDays > 0 ? Math.min(1, usedDays / baseDays) : 0;
  const usedAmount = totalFee * usedFraction;
  const refundBeforeAdmin = Math.max(0, totalFee - usedAmount);
  const refundAfterAdmin = Math.max(0, refundBeforeAdmin - adminFee);

  return (
    <ToolLayout toolNum={38} category="🛠️ Everyday Practical" title="Tuition Fee" titleHighlight="Refund Proration Calculator"
      description="Calculate how much fee should be refunded if a student withdraws mid-term, based on days attended."
    >
      <div className="grid md:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-5">
          <Card>
            <SectionTitle>Fee & Period</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="fee">Total Fee Paid</FieldLabel>
                <NumInput id="fee" value={totalFee} onChange={setTotalFee} prefix="PKR" min={0} step={1000} />
              </div>
              <div>
                <FieldLabel>Fee Period</FieldLabel>
                <div className="flex gap-2 flex-wrap">
                  {(["month", "quarter", "semester", "year"] as const).map((p) => (
                    <button key={p} onClick={() => setPaidFor(p)}
                      className={`px-3 py-2 rounded-xl text-sm border transition-all capitalize ${paidFor === p ? "bg-blue-600 border-blue-500 text-slate-900" : "bg-slate-100 border-slate-300 text-slate-600"}`}
                    >{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="ps">Period Start Date</FieldLabel>
                <input id="ps" type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <FieldLabel htmlFor="wd">Withdrawal / Last Attendance Date</FieldLabel>
                <input id="wd" type="date" value={withdrawalDate} onChange={(e) => setWithdrawalDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Proration Method</SectionTitle>
            <div className="space-y-3">
              <Select id="base" value={prorationBase} onChange={setProrationBase} options={PRORATION_BASES} />
              {prorationBase === "academic" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel htmlFor="ad">Total Academic Days</FieldLabel>
                    <NumInput id="ad" value={academicDays} onChange={setAcademicDays} suffix="days" min={1} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="da">Days Attended</FieldLabel>
                    <NumInput id="da" value={daysAttended} onChange={setDaysAttended} suffix="days" min={0} />
                  </div>
                </div>
              )}
              <div>
                <FieldLabel htmlFor="admin" hint="non-refundable admin / registration fee">Admin Fee to Deduct</FieldLabel>
                <NumInput id="admin" value={adminFee} onChange={setAdminFee} prefix="PKR" min={0} step={500} />
              </div>
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 px-6 py-7 text-center">
              <p className="text-blue-100 text-sm mb-1">Refund Due</p>
              <p className="text-white text-4xl font-extrabold tabular-nums">PKR {refundAfterAdmin.toFixed(0)}</p>
            </div>
            <div className="px-4 py-4">
              <ResultRow label="Total fee paid" value={`PKR ${totalFee.toLocaleString()}`} />
              <ResultRow label={`Days used (${usedDays} of ${baseDays})`} value={`${(usedFraction * 100).toFixed(1)}%`} />
              <ResultRow label="Fee used" value={`PKR ${usedAmount.toFixed(0)}`} />
              <ResultRow label="Gross refund" value={`PKR ${refundBeforeAdmin.toFixed(0)}`} highlight />
              <ResultRow label="Less admin fee" value={`−PKR ${adminFee.toLocaleString()}`} />
              <ResultRow label="Net refund" value={`PKR ${refundAfterAdmin.toFixed(0)}`} highlight />
            </div>
          </ResultCard>
          <Disclaimer>
            Proration method and refund policies vary by institution. This is an estimate — check your institution's official fee refund policy.
          </Disclaimer>
        </div>
      </div>
    </ToolLayout>
  );
}
