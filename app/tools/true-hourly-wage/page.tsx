"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, ResultCard, ResultRow } from "@/components/ui";

export default function TrueHourlyWage() {
  const [salary, setSalary] = useState(85000);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  
  const [commuteMinutes, setCommuteMinutes] = useState(90); // Round trip
  const [commuteMiles, setCommuteMiles] = useState(30); // Round trip
  const [workDays, setWorkDays] = useState(240); // 5 days * 48 weeks
  
  const [irsRate, setIrsRate] = useState(0.67); // 2024 IRS Rate

  const math = useMemo(() => {
    // Standard Math
    const baseWorkingHours = hoursPerWeek * 52;
    const baseHourly = salary / baseWorkingHours;

    // True Cost Math
    const annualCommuteHours = (commuteMinutes * workDays) / 60;
    const totalTimeDedicated = baseWorkingHours + annualCommuteHours;

    const annualCommuteMiles = commuteMiles * workDays;
    const annualVehicleCost = annualCommuteMiles * irsRate;

    const netIncome = salary - annualVehicleCost;
    const trueHourly = netIncome / totalTimeDedicated;

    const percentageDrop = ((baseHourly - trueHourly) / baseHourly) * 100;

    return {
      baseHourly,
      baseWorkingHours,
      annualCommuteHours,
      totalTimeDedicated,
      annualCommuteMiles,
      annualVehicleCost,
      netIncome,
      trueHourly,
      percentageDrop
    };
  }, [salary, hoursPerWeek, commuteMinutes, commuteMiles, workDays, irsRate]);

  return (
    <ToolLayout
      toolNum={80} category="⏳ Life & Existential Math"
      title="True Hourly Wage" titleHighlight="Commute Depreciator"
      description="You don't make what you think you make. Calculate your exact actual hourly wage after backing out unpaid commute hours and the hidden IRS-calculated vehicle depreciation costs of driving to an office."
    >
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Your Office Job Details</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel htmlFor="sal">Annual Gross Salary ($)</FieldLabel>
                <NumInput id="sal" value={salary} onChange={setSalary} min={0} step={1000} />
              </div>
              <div>
                <FieldLabel htmlFor="hpw">Working Hours Per Week</FieldLabel>
                <NumInput id="hpw" value={hoursPerWeek} onChange={setHoursPerWeek} min={0} max={100} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>The Hidden Commute Tax</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel htmlFor="cmins">Daily Commute (Round-Trip Mins)</FieldLabel>
                <NumInput id="cmins" value={commuteMinutes} onChange={setCommuteMinutes} min={0} />
              </div>
              <div>
                <FieldLabel htmlFor="cmi">Daily Commute (Round-Trip Miles)</FieldLabel>
                <NumInput id="cmi" value={commuteMiles} onChange={setCommuteMiles} min={0} />
              </div>
              <div>
                <FieldLabel htmlFor="wdays">Office Days Per Year</FieldLabel>
                <NumInput id="wdays" value={workDays} onChange={setWorkDays} min={0} max={365} />
                <p className="text-xs text-slate-500 mt-1">Usually ~240 for a standard 5-day week.</p>
              </div>
              <div>
                <FieldLabel htmlFor="irs">Vehicle Cost per Mile ($)</FieldLabel>
                <NumInput id="irs" value={irsRate} onChange={setIrsRate} min={0} step={0.01} />
                <p className="text-xs text-slate-500 mt-1">Defaults to 2024 IRS Standard Rate ($0.67/mile) which factors in gas, wear, and depreciation.</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-rose-700 to-red-900 px-6 py-8 text-center rounded-t-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-2 py-1 rounded">
                -{math.percentageDrop.toFixed(1)}% Drop
              </div>
              <p className="text-white/80 text-sm font-medium mb-1">Your TRUE Hourly Wage</p>
              <p className="text-white text-6xl font-black tabular-nums tracking-tight">
                ${math.trueHourly.toFixed(2)}
              </p>
              <p className="text-white/80 text-sm mt-2 line-through decoration-rose-400">
                vs Nominal ${math.baseHourly.toFixed(2)} / hr
              </p>
            </div>
            
            <div className="px-4 py-4 space-y-1 bg-white rounded-b-2xl border-2 border-t-0 border-slate-200">
              <ResultRow label="Total Time Dedicated" value={`${math.totalTimeDedicated.toLocaleString()} hrs`} />
              <ResultRow label="Unpaid Commute Time" value={<span className="text-rose-600 font-bold">{math.annualCommuteHours.toLocaleString()} hrs</span>} />
              
              <div className="border-t border-dashed border-slate-200 my-2"></div>
              
              <ResultRow label="Gross Salary" value={`$${salary.toLocaleString()}`} />
              <ResultRow label="Vehicle Depreciation" value={<span className="text-rose-600 font-bold">-${math.annualVehicleCost.toLocaleString()}</span>} />
              
              <div className="border-t border-slate-800 my-2"></div>
              <ResultRow label="Net Take-Home" value={<span className="font-bold text-slate-800">${math.netIncome.toLocaleString()}</span>} />
            </div>
          </ResultCard>
          
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 leading-relaxed">
            Every hour you spend driving is an hour you dedicated to your employer for free. Every mile you drive is a direct withdrawal from your vehicle's resale value.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
