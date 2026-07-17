"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, ResultCard, ResultHeadline, ResultRow, Disclaimer, CopyButton } from "@/components/ui";

export default function LeaveForfeiture() {
  const [salary, setSalary] = useState(75000);
  const [workingDays, setWorkingDays] = useState(260);
  const [totalDays, setTotalDays] = useState(20);
  const [takenDays, setTakenDays] = useState(5);
  const [rollover, setRollover] = useState(5);

  // Calculations
  const dailyRate = workingDays > 0 ? salary / workingDays : 0;
  
  const unusedDays = Math.max(0, totalDays - takenDays);
  const forfeitedDays = Math.max(0, unusedDays - rollover);
  
  const cashValueLost = forfeitedDays * dailyRate;
  const cashValueSaved = Math.min(unusedDays, rollover) * dailyRate;

  const getCopyText = () => {
    return `Unused Leave Forfeiture:\nI'm about to lose ${forfeitedDays} days of PTO.\nThat is equivalent to $${cashValueLost.toLocaleString(undefined, {maximumFractionDigits: 0})} in unpaid work!`;
  };

  return (
    <ToolLayout
      toolNum={50} category="⏱️ Time & Remote Work"
      title="Unused Leave Forfeiture" titleHighlight="Calculator"
      description="See the literal cash value of the PTO days you're about to lose to a strict 'use it or lose it' corporate policy."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Your Salary & Leave Policy</SectionTitle>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel htmlFor="salary">Annual Salary</FieldLabel>
                  <NumInput id="salary" value={salary} onChange={setSalary} prefix="$" min={0} step={1000} />
                </div>
                <div>
                  <FieldLabel htmlFor="workingDays" hint="(typically 260)">Working Days per Year</FieldLabel>
                  <NumInput id="workingDays" value={workingDays} onChange={setWorkingDays} min={1} step={1} />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <FieldLabel htmlFor="total">Total PTO Days</FieldLabel>
                  <NumInput id="total" value={totalDays} onChange={setTotalDays} min={0} step={1} />
                </div>
                <div>
                  <FieldLabel htmlFor="taken">Days Taken</FieldLabel>
                  <NumInput id="taken" value={takenDays} onChange={setTakenDays} min={0} step={1} />
                </div>
                <div>
                  <FieldLabel htmlFor="rollover">Max Rollover</FieldLabel>
                  <NumInput id="rollover" value={rollover} onChange={setRollover} min={0} step={1} />
                </div>
              </div>
            </div>
          </Card>


        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <ResultHeadline label="Cash Value Forfeited" value={`$${cashValueLost.toLocaleString(undefined, {maximumFractionDigits: 0})}`} sub={`You are losing ${forfeitedDays} days`} />
            
            <div className="px-4 py-4 space-y-1">
              <ResultRow label="Total Unused Days" value={`${unusedDays}`} />
              <ResultRow label="Days safely rolling over" value={`${Math.min(unusedDays, rollover)}`} />
              <ResultRow label="Days forfeited forever" value={`${forfeitedDays}`} highlight />
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Financial Breakdown</p>
                <ResultRow label="Your Daily Rate" value={`$${dailyRate.toLocaleString(undefined, {maximumFractionDigits: 0})}`} sub={`Based on ${workingDays} work days`} />
                <ResultRow label="Value of Rollover Days" value={`$${cashValueSaved.toLocaleString(undefined, {maximumFractionDigits: 0})}`} />
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
