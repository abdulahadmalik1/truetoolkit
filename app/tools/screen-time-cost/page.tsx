"use client";
import { useState, useRef, useCallback } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, ResultCard, ResultRow } from "@/components/ui";

export default function ScreenTimeCost() {
  const [screenHours, setScreenHours] = useState(4);
  const [screenMins, setScreenMins] = useState(0);
  const [salary, setSalary] = useState(60000);
  const [age, setAge] = useState(28);
  const [lifeExpectancy, setLifeExpectancy] = useState(80);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloaded, setDownloaded] = useState(false);

  const totalHoursDaily = screenHours + screenMins / 60;
  const hourlyRate = salary / (52 * 40);
  const dailyEquiv = totalHoursDaily * hourlyRate;
  const weeklyEquiv = dailyEquiv * 7;
  const yearlyEquiv = dailyEquiv * 365;
  const yearsLeft = Math.max(0, lifeExpectancy - age);
  const lifetimeHours = totalHoursDaily * 365 * yearsLeft;
  const lifetimeDays = lifetimeHours / 24;

  const downloadCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 800; canvas.height = 420;
    const grad = ctx.createLinearGradient(0, 0, 800, 420);
    grad.addColorStop(0, "#0f172a"); grad.addColorStop(1, "#1e3a5f");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 800, 420);
    ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2; ctx.strokeRect(1, 1, 798, 418);
    ctx.font = "bold 18px sans-serif"; ctx.fillStyle = "#94a3b8"; ctx.fillText("TrueToolkit.com", 40, 45);
    ctx.font = "bold 26px sans-serif"; ctx.fillStyle = "#f1f5f9"; ctx.fillText("Screen Time Reality Check", 40, 90);
    ctx.font = "bold 70px sans-serif"; ctx.fillStyle = "#3b82f6"; ctx.fillText(`$${yearlyEquiv.toFixed(0)}/yr`, 40, 200);
    ctx.font = "22px sans-serif"; ctx.fillStyle = "#94a3b8"; ctx.fillText(`${totalHoursDaily.toFixed(1)} hrs/day screen time at $${hourlyRate.toFixed(0)}/hr`, 40, 255);
    ctx.font = "18px sans-serif"; ctx.fillStyle = "#f97316"; ctx.fillText(`Lifetime: ${lifetimeHours.toFixed(0)} hrs (${lifetimeDays.toFixed(0)} days) remaining at this rate`, 40, 295);
    ctx.font = "14px sans-serif"; ctx.fillStyle = "#475569"; ctx.fillText("Generated at TrueToolkit.com", 40, 390);
    const link = document.createElement("a"); link.download = "screen-time.png"; link.href = canvas.toDataURL("image/png"); link.click();
    setDownloaded(true); setTimeout(() => setDownloaded(false), 2000);
  }, [totalHoursDaily, hourlyRate, yearlyEquiv, lifetimeHours, lifetimeDays]);

  return (
    <ToolLayout toolNum={10} category="⏱️ Time & Remote Work" title="Screen Time" titleHighlight="Cost Converter"
      description="Convert your daily screen time into a money-equivalent and lifetime hours — make abstract time concrete."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-5">
          <Card>
            <SectionTitle>Daily Screen Time</SectionTitle>
            <div className="flex gap-4">
              <div className="flex-1">
                <FieldLabel htmlFor="sh">Hours</FieldLabel>
                <NumInput id="sh" value={screenHours} onChange={setScreenHours} min={0} max={24} suffix="hrs" />
              </div>
              <div className="flex-1">
                <FieldLabel htmlFor="sm">Minutes</FieldLabel>
                <NumInput id="sm" value={screenMins} onChange={setScreenMins} min={0} max={59} suffix="min" />
              </div>
            </div>
          </Card>
          <Card>
            <SectionTitle>Income</SectionTitle>
            <div>
              <FieldLabel htmlFor="sal">Annual Salary (used to derive hourly rate)</FieldLabel>
              <NumInput id="sal" value={salary} onChange={setSalary} prefix="$" step={5000} min={0} />
            </div>
          </Card>
          <Card>
            <SectionTitle>Life Planning</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="age">Your Current Age</FieldLabel>
                <NumInput id="age" value={age} onChange={setAge} min={1} max={100} />
              </div>
              <div>
                <FieldLabel htmlFor="life" hint="planning assumption only">Life Expectancy</FieldLabel>
                <NumInput id="life" value={lifeExpectancy} onChange={setLifeExpectancy} min={1} max={120} />
              </div>
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-7 text-center">
              <p className="text-blue-100 text-sm mb-1">Yearly money equivalent</p>
              <p className="text-white text-4xl font-extrabold tabular-nums">${yearlyEquiv.toFixed(0)}</p>
              <p className="text-blue-100 text-sm mt-1">at your hourly rate</p>
            </div>
            <div className="px-4 py-4">
              <ResultRow label="Hourly rate (derived)" value={`$${hourlyRate.toFixed(2)}/hr`} />
              <ResultRow label="Daily equivalent" value={`$${dailyEquiv.toFixed(2)}`} />
              <ResultRow label="Weekly equivalent" value={`$${weeklyEquiv.toFixed(2)}`} />
              <ResultRow label="Yearly equivalent" value={`$${yearlyEquiv.toFixed(0)}`} highlight />
              <ResultRow label="Lifetime hours at this rate" value={`${lifetimeHours.toFixed(0)} hrs`} />
              <ResultRow label="= Lifetime days" value={`${lifetimeDays.toFixed(0)} days`} highlight />
            </div>
            <div className="px-4 pb-4">
              <button onClick={downloadCard} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 text-sm font-medium transition-all">
                {downloaded ? "✅ Downloaded!" : "📥 Download stat card"}
              </button>
            </div>
          </ResultCard>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </ToolLayout>
  );
}
