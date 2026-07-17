"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, ResultCard, ResultRow } from "@/components/ui";

export default function OneMoreYearCalculator() {
  const [portfolio, setPortfolio] = useState(1200000);
  const [annualSpending, setAnnualSpending] = useState(48000);
  const [annualSavings, setAnnualSavings] = useState(30000);
  const [expectedReturn, setExpectedReturn] = useState(5.0); // Real return (inflation-adjusted)

  const math = useMemo(() => {
    const currentSwr = (annualSpending / portfolio) * 100;
    
    // Growth from markets (inflation-adjusted)
    const investmentGrowth = portfolio * (expectedReturn / 100);
    
    // Total portfolio after 1 more year of working
    const futurePortfolio = portfolio + investmentGrowth + annualSavings;
    
    const futureSwr = (annualSpending / futurePortfolio) * 100;
    
    const swrDrop = currentSwr - futureSwr;
    
    // The "Double Whammy" of One More Year:
    // 1. You added to the pile (Savings + Growth)
    // 2. You didn't withdraw your spending for that year (which you would have if you retired)
    const totalNetWorthSwing = investmentGrowth + annualSavings + annualSpending;

    return {
      currentSwr,
      futurePortfolio,
      futureSwr,
      swrDrop,
      investmentGrowth,
      totalNetWorthSwing
    };
  }, [portfolio, annualSpending, annualSavings, expectedReturn]);

  return (
    <ToolLayout
      toolNum={81} category="⏳ Life & Existential Math"
      title="One More Year" titleHighlight="Syndrome Calculator"
      description="Terrified to pull the plug and retire? Calculate exactly how much working just 'one more year' mathematically shifts your Safe Withdrawal Rate, turning financial anxiety into hard numbers."
    >
      <div className="grid lg:grid-cols-[1fr_450px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Your Current State</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <FieldLabel htmlFor="port">Current Portfolio ($)</FieldLabel>
                <NumInput id="port" value={portfolio} onChange={setPortfolio} min={0} step={10000} />
              </div>
              <div>
                <FieldLabel htmlFor="spend">Target Annual Spending ($)</FieldLabel>
                <NumInput id="spend" value={annualSpending} onChange={setAnnualSpending} min={0} step={1000} />
                <p className="text-xs text-slate-500 mt-1">How much you plan to withdraw each year in retirement.</p>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>The "One More Year" Variables</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <FieldLabel htmlFor="save">Savings Added Next Year ($)</FieldLabel>
                <NumInput id="save" value={annualSavings} onChange={setAnnualSavings} min={0} step={1000} />
                <p className="text-xs text-slate-500 mt-1">How much of your salary you'll invest if you keep working.</p>
              </div>
              <div>
                <FieldLabel htmlFor="ret">Expected Real Return (%)</FieldLabel>
                <NumInput id="ret" value={expectedReturn} onChange={setExpectedReturn} min={-20} max={20} step={0.5} />
                <p className="text-xs text-slate-500 mt-1">Inflation-adjusted market growth (historically ~5-7%).</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-emerald-700 to-green-900 px-6 py-8 text-center rounded-t-2xl">
              <p className="text-white/80 text-sm font-medium mb-1">New Safe Withdrawal Rate</p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-emerald-300 text-3xl font-bold line-through decoration-emerald-500/50">
                  {math.currentSwr.toFixed(2)}%
                </p>
                <span className="text-white">→</span>
                <p className="text-white text-6xl font-black tabular-nums tracking-tight">
                  {math.futureSwr.toFixed(2)}%
                </p>
              </div>
              <p className="text-white/80 text-sm mt-3 font-semibold bg-white/10 inline-block px-3 py-1 rounded-full">
                A drop of {math.swrDrop.toFixed(2)}%
              </p>
            </div>
            
            <div className="px-4 py-4 space-y-1 bg-white rounded-b-2xl border-2 border-t-0 border-slate-200">
              <ResultRow label="Starting Portfolio" value={`$${portfolio.toLocaleString()}`} />
              <ResultRow label="+ Market Growth" value={`+$${math.investmentGrowth.toLocaleString()}`} />
              <ResultRow label="+ Additional Savings" value={`+$${annualSavings.toLocaleString()}`} />
              <div className="border-t border-slate-800 my-2"></div>
              <ResultRow label="New Portfolio Value" value={`$${math.futurePortfolio.toLocaleString()}`} />
            </div>
          </ResultCard>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800">The "Triple Whammy":</span> By working one more year, you increase your portfolio by <span className="font-bold text-emerald-600">${math.totalNetWorthSwing.toLocaleString()}</span> compared to retiring today. (Growth + Savings + Not withdrawing your spending).<br/><br/>
            If your new SWR is below 4.0%, you have mathematical permission to quit.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
