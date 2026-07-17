"use client";

import { useState, useCallback } from "react";
import {
  calcTrueHourlyRate,
  type TrueHourlyRateInputs,
  type TrueHourlyRateResult,
} from "@/lib/tools/trueHourlyRate";

// ─── Shared UI primitives ──────────────────────────────────────────────────

function Label({
  children,
  htmlFor,
  hint,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-slate-700 mb-1"
    >
      {children}
      {hint && (
        <span className="ml-1.5 text-xs text-slate-500 font-normal">
          {hint}
        </span>
      )}
    </label>
  );
}

function NumberInput({
  id,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  prefix,
  suffix,
  placeholder,
}: {
  id: string;
  value: number | string;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-slate-300 bg-slate-50 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500/50 transition-all">
      {prefix && (
        <span className="flex items-center px-3 bg-slate-100 text-slate-600 text-sm select-none">
          {prefix}
        </span>
      )}
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (!isNaN(v)) onChange(v);
          else if (e.target.value === "") onChange(0);
        }}
        className="flex-1 px-3 py-2.5 bg-transparent text-slate-900 text-sm outline-none min-w-0"
      />
      {suffix && (
        <span className="flex items-center px-3 bg-slate-100 text-slate-600 text-sm select-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

function SliderInput({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
}: {
  id: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <span className="text-sm font-semibold text-brand-400 tabular-nums">
          {value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{
          background: `linear-gradient(to right, #3b63f7 0%, #3b63f7 ${
            ((value - min) / (max - min)) * 100
          }%, #1e2540 ${((value - min) / (max - min)) * 100}%, #1e2540 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function ResultRow({
  label,
  value,
  highlight,
  subtext,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  subtext?: string;
}) {
  return (
    <div
      className={`flex justify-between items-start py-3 border-b border-slate-200 last:border-0 ${
        highlight ? "bg-brand-50 -mx-4 px-4 rounded-lg" : ""
      }`}
    >
      <div>
        <span className="text-sm text-slate-600">{label}</span>
        {subtext && (
          <p className="text-xs text-slate-400 mt-0.5">{subtext}</p>
        )}
      </div>
      <span
        className={`text-sm font-semibold tabular-nums ${
          highlight ? "text-brand-700 text-base" : "text-slate-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Tool #1 main component ────────────────────────────────────────────────

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "PKR", symbol: "₨" },
  { code: "GBP", symbol: "£" },
  { code: "EUR", symbol: "€" },
  { code: "AED", symbol: "د.إ" },
];

export default function TrueHourlyRateCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [desiredTakeHome, setDesiredTakeHome] = useState(60000);
  const [workingWeeks, setWorkingWeeks] = useState(48);
  const [billableHours, setBillableHours] = useState(25);
  const [unpaidHours, setUnpaidHours] = useState(10);
  const [annualExpenses, setAnnualExpenses] = useState(5000);
  const [taxBuffer, setTaxBuffer] = useState(25);
  const [showComparison, setShowComparison] = useState(false);
  const [currentRate, setCurrentRate] = useState(50);
  const [copyDone, setCopyDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sym = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "$";

  const fmt = useCallback(
    (n: number) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n),
    [currency]
  );

  let result: TrueHourlyRateResult | null = null;
  try {
    setError; // silence lint
    result = calcTrueHourlyRate({
      desiredTakeHome,
      workingWeeks,
      billableHoursPerWeek: billableHours,
      unpaidHoursPerWeek: unpaidHours,
      annualExpenses,
      taxBuffer: taxBuffer / 100,
      currentRate: showComparison ? currentRate : undefined,
    } as TrueHourlyRateInputs);
  } catch (e: unknown) {
    // result remains null — shown as error
    void e;
  }

  const handleCopy = () => {
    if (!result) return;
    const text = [
      `True Hourly Rate Calculator — TrueToolkit.com`,
      ``,
      `Target Take-Home: ${fmt(desiredTakeHome)}`,
      `Annual Expenses: ${fmt(annualExpenses)}`,
      `Tax/Savings Buffer: ${taxBuffer}%`,
      `Working Weeks/Year: ${workingWeeks}`,
      `Billable Hrs/Week: ${billableHours}`,
      `Unpaid Hrs/Week: ${unpaidHours}`,
      ``,
      `--- Results ---`,
      `You need to charge: ${fmt(result.trueHourlyRate)}/hr`,
      `Required Gross Income: ${fmt(result.requiredGrossIncome)}`,
      `Billable Hours/Year: ${result.billableHoursPerYear}`,
      `Total Hours Worked/Year: ${result.totalHoursPerYear}`,
      `Effective Rate (all hrs): ${fmt(result.effectiveRateIncludingUnpaid)}/hr`,
      ...(result.rateGap !== undefined
        ? [
            ``,
            `Compared to current rate of ${fmt(currentRate)}/hr:`,
            result.isUndercharging
              ? `⚠️ You are undercharging by ${fmt(result.rateGap)}/hr`
              : `✅ You are charging ${fmt(Math.abs(result.rateGap))}/hr above the minimum needed`,
          ]
        : []),
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a
            href="/"
            className="text-lg font-bold text-slate-900 tracking-tight hover:text-brand-400 transition-colors"
          >
            HandyTools<span className="text-brand-400">Hub</span>
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            True Hourly Rate{" "}
            <span className="bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl">
            Find out exactly what you need to charge per hour to hit your
            take-home goal — after accounting for unpaid admin time, expenses,
            and taxes.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_380px] gap-8 items-start">
          {/* ── Inputs ── */}
          <div className="space-y-6">
            {/* Currency */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
                Currency
              </h2>
              <div className="flex gap-2 flex-wrap">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                      currency === c.code
                        ? "bg-brand-600 border-brand-500 text-slate-900 shadow-lg shadow-brand-500/20"
                        : "bg-slate-100 border-slate-300 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {c.symbol} {c.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Income & Expenses */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Income & Expenses
              </h2>

              <div>
                <Label htmlFor="take-home">
                  Desired Annual Take-Home Income
                </Label>
                <NumberInput
                  id="take-home"
                  value={desiredTakeHome}
                  onChange={setDesiredTakeHome}
                  prefix={sym}
                  min={0}
                  step={1000}
                />
              </div>

              <div>
                <Label
                  htmlFor="expenses"
                  hint="software, tools, co-working, equipment, etc."
                >
                  Annual Business Expenses
                </Label>
                <NumberInput
                  id="expenses"
                  value={annualExpenses}
                  onChange={setAnnualExpenses}
                  prefix={sym}
                  min={0}
                  step={500}
                />
              </div>

              <div>
                <Label
                  htmlFor="tax-buffer"
                  hint="set-aside for tax + personal savings"
                >
                  Tax / Savings Buffer
                </Label>
                <NumberInput
                  id="tax-buffer"
                  value={taxBuffer}
                  onChange={setTaxBuffer}
                  suffix="%"
                  min={0}
                  max={99}
                  step={1}
                />
              </div>
            </div>

            {/* Time */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5 space-y-5">
              <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Time
              </h2>

              <SliderInput
                id="working-weeks"
                label="Working Weeks per Year"
                value={workingWeeks}
                onChange={setWorkingWeeks}
                min={10}
                max={52}
              />

              <SliderInput
                id="billable-hours"
                label="Billable Hours per Week"
                value={billableHours}
                onChange={setBillableHours}
                min={1}
                max={60}
              />

              <SliderInput
                id="unpaid-hours"
                label="Unpaid Hours per Week"
                value={unpaidHours}
                onChange={setUnpaidHours}
                min={0}
                max={40}
              />
              <p className="text-xs text-slate-500">
                Unpaid hours = admin, pitching, emails, accounting — real work
                you do but can&apos;t bill for.
              </p>
            </div>

            {/* Optional comparison */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Rate Comparison (Optional)
                </h2>
                <button
                  onClick={() => setShowComparison((s) => !s)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    showComparison ? "bg-brand-600" : "bg-slate-200"
                  }`}
                  aria-pressed={showComparison}
                  aria-label="Toggle rate comparison"
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      showComparison ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {showComparison && (
                <div>
                  <Label htmlFor="current-rate">
                    What you&apos;re currently charging
                  </Label>
                  <NumberInput
                    id="current-rate"
                    value={currentRate}
                    onChange={setCurrentRate}
                    prefix={`${sym}/hr`}
                    min={0}
                    step={1}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Results card ── */}
          <div className="sticky top-24">
            {result ? (
              <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-300 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                {/* Headline */}
                <div className="bg-gradient-to-br from-brand-600 to-blue-700 px-6 py-8 text-center">
                  <p className="text-brand-200 text-sm font-medium mb-1">
                    You need to charge
                  </p>
                  <p className="text-white text-5xl font-extrabold tabular-nums tracking-tight">
                    {fmt(result.trueHourlyRate)}
                  </p>
                  <p className="text-brand-200 text-base font-medium mt-1">
                    per hour
                  </p>
                </div>

                {/* Breakdown */}
                <div className="px-4 py-4">
                  <ResultRow
                    label="Required Gross Income"
                    value={fmt(result.requiredGrossIncome)}
                    subtext="before tax & buffer"
                  />
                  <ResultRow
                    label="Billable Hours / Year"
                    value={`${result.billableHoursPerYear.toLocaleString()} hrs`}
                  />
                  <ResultRow
                    label="Total Hours Worked / Year"
                    value={`${result.totalHoursPerYear.toLocaleString()} hrs`}
                    subtext="billable + unpaid"
                  />
                  <ResultRow
                    label="Effective Rate (all hours)"
                    value={`${fmt(result.effectiveRateIncludingUnpaid)}/hr`}
                    highlight
                    subtext="what you earn per hour actually worked"
                  />
                </div>

                {/* Rate comparison */}
                {result.rateGap !== undefined && (
                  <div
                    className={`mx-4 mb-4 rounded-xl p-4 border ${
                      result.isUndercharging
                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    }`}
                  >
                    <p className="text-sm font-semibold mb-0.5">
                      {result.isUndercharging
                        ? "⚠️ You're undercharging"
                        : "✅ You're above the minimum"}
                    </p>
                    <p className="text-xs opacity-80">
                      {result.isUndercharging
                        ? `Raise your rate by at least ${fmt(result.rateGap)}/hr`
                        : `${fmt(Math.abs(result.rateGap))}/hr above your minimum needed rate`}
                    </p>
                  </div>
                )}

                {/* Copy button */}
                <div className="px-4 pb-5">
                  <button
                    onClick={handleCopy}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 hover:text-slate-900 transition-all border border-slate-300 hover:border-slate-400"
                  >
                    {copyDone ? "✅ Copied!" : "📋 Copy result as text"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">🧮</div>
                <p className="text-slate-500 text-sm">
                  Fill in your details to see your true hourly rate.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
