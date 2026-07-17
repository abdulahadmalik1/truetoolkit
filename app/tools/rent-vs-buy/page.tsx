"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, ResultCard, ResultRow, Disclaimer } from "@/components/ui";

export default function RentVsBuy() {
  const [homePrice, setHomePrice] = useState(10000000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [annualMortgageRate, setAnnualMortgageRate] = useState(22); // Pakistan bank rate ~22%
  const [mortgageYears, setMortgageYears] = useState(20);
  const [monthlyRent, setMonthlyRent] = useState(50000);
  const [annualRentIncrease, setAnnualRentIncrease] = useState(10);
  const [annualAppreciation, setAnnualAppreciation] = useState(8);
  const [maintenancePct, setMaintenancePct] = useState(1); // % of home value per year
  const [investmentReturn, setInvestmentReturn] = useState(12); // alternative if renting & investing

  const downPayment = homePrice * (downPaymentPct / 100);
  const loanAmount = homePrice - downPayment;
  const monthlyRate = annualMortgageRate / 100 / 12;
  const numPayments = mortgageYears * 12;

  const monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  const totalMortgagePaid = monthlyMortgage * numPayments + downPayment;
  const monthlyMaintenance = (homePrice * maintenancePct / 100) / 12;
  const totalBuyCost = totalMortgagePaid + monthlyMaintenance * numPayments;

  // Home value at end
  const futureHomeValue = homePrice * Math.pow(1 + annualAppreciation / 100, mortgageYears);
  const buyNetEquity = futureHomeValue - totalBuyCost;

  // Rent side: total rent paid over period
  let totalRentPaid = 0;
  let currentRent = monthlyRent;
  for (let year = 0; year < mortgageYears; year++) {
    totalRentPaid += currentRent * 12;
    currentRent *= 1 + annualRentIncrease / 100;
  }

  // If renter invests down payment at investmentReturn
  const investedDownPayment = downPayment * Math.pow(1 + investmentReturn / 100, mortgageYears);
  // And monthly savings (mortgage - rent when rent < mortgage)
  const monthlySavings = Math.max(0, monthlyMortgage + monthlyMaintenance - monthlyRent);
  // Future value of those savings
  const fvSavings = monthlySavings > 0 ? monthlySavings * ((Math.pow(1 + investmentReturn / 100 / 12, numPayments) - 1) / (investmentReturn / 100 / 12)) : 0;
  const rentNetWealth = investedDownPayment + fvSavings - totalRentPaid;

  const breakEven = buyNetEquity > rentNetWealth;

  return (
    <ToolLayout toolNum={33} category="🛠️ Everyday Practical" title="Rent vs Buy" titleHighlight="Break-Even Calculator"
      description="Should you rent or buy? Compare total costs and net wealth after your mortgage period."
    >
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          <Card>
            <SectionTitle>🏠 Buying</SectionTitle>
            <div className="space-y-3">
              <div>
                <FieldLabel htmlFor="hp">Home Price</FieldLabel>
                <NumInput id="hp" value={homePrice} onChange={setHomePrice} prefix="PKR" min={0} step={500000} />
              </div>
              <div>
                <FieldLabel htmlFor="dp">Down Payment</FieldLabel>
                <NumInput id="dp" value={downPaymentPct} onChange={setDownPaymentPct} suffix="%" min={0} max={100} />
              </div>
              <div>
                <FieldLabel htmlFor="mr">Annual Mortgage Rate</FieldLabel>
                <NumInput id="mr" value={annualMortgageRate} onChange={setAnnualMortgageRate} suffix="%" min={0} max={50} step={0.5} />
              </div>
              <div>
                <FieldLabel htmlFor="my">Mortgage Term</FieldLabel>
                <NumInput id="my" value={mortgageYears} onChange={setMortgageYears} suffix="years" min={1} max={30} />
              </div>
              <div>
                <FieldLabel htmlFor="app">Annual Home Appreciation</FieldLabel>
                <NumInput id="app" value={annualAppreciation} onChange={setAnnualAppreciation} suffix="%" step={0.5} />
              </div>
              <div>
                <FieldLabel htmlFor="mnt" hint="% of home value/year">Maintenance Cost</FieldLabel>
                <NumInput id="mnt" value={maintenancePct} onChange={setMaintenancePct} suffix="%" step={0.1} min={0} max={5} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>🏢 Renting</SectionTitle>
            <div className="space-y-3">
              <div>
                <FieldLabel htmlFor="rent">Monthly Rent (today)</FieldLabel>
                <NumInput id="rent" value={monthlyRent} onChange={setMonthlyRent} prefix="PKR" min={0} step={5000} />
              </div>
              <div>
                <FieldLabel htmlFor="ri">Annual Rent Increase</FieldLabel>
                <NumInput id="ri" value={annualRentIncrease} onChange={setAnnualRentIncrease} suffix="%" step={0.5} min={0} />
              </div>
              <div>
                <FieldLabel htmlFor="ir" hint="if investing down payment instead">Alternative Investment Return</FieldLabel>
                <NumInput id="ir" value={investmentReturn} onChange={setInvestmentReturn} suffix="%" step={0.5} min={0} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: "🏠 Buying", netWealth: buyNetEquity, totalCost: totalBuyCost, monthly: monthlyMortgage + monthlyMaintenance },
            { label: "🏢 Renting", netWealth: rentNetWealth, totalCost: totalRentPaid, monthly: monthlyRent },
          ].map((side, i) => (
            <ResultCard key={side.label} gradient>
              <div className={`px-5 py-5 text-center bg-gradient-to-br ${i === 0 ? "from-blue-700 to-blue-900" : "from-violet-700 to-violet-900"}`}>
                <p className="text-white/70 text-sm">{side.label}</p>
                <p className="text-3xl font-extrabold mt-1">PKR {Math.abs(side.netWealth).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p className="text-white/60 text-xs mt-1">projected net wealth / equity</p>
              </div>
              <div className="px-4 py-4">
                <ResultRow label="Total paid over period" value={`PKR ${side.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                <ResultRow label="Monthly" value={`PKR ${side.monthly.toFixed(0)}`} />
              </div>
            </ResultCard>
          ))}
        </div>

        <div className={`p-5 rounded-2xl border text-center ${breakEven ? "bg-blue-500/10 border-blue-500/30" : "bg-violet-500/10 border-violet-500/30"}`}>
          <p className="text-slate-900 text-lg font-bold mb-1">
            {breakEven ? "🏠 Buying appears ahead financially" : "🏢 Renting & investing appears ahead financially"}
          </p>
          <p className="text-slate-600 text-sm">after {mortgageYears} years under these assumptions</p>
        </div>

        <Disclaimer>
          This model uses simplified assumptions. Real outcomes depend on tax, legal costs, rental market fluctuations, and life circumstances. Not financial or real estate advice.
        </Disclaimer>
      </div>
    </ToolLayout>
  );
}
