"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, ResultCard, ResultHeadline, ResultRow, Disclaimer, CopyButton } from "@/components/ui";

export default function NotificationCost() {
  const [hourlyRate, setHourlyRate] = useState(50);
  const [dailyPings, setDailyPings] = useState(30);
  const [minsLost, setMinsLost] = useState(15);
  const [workDays, setWorkDays] = useState(5);

  // Calculations
  const hoursLostPerDay = (dailyPings * minsLost) / 60;
  const hoursLostPerWeek = hoursLostPerDay * workDays;
  const hoursLostPerYear = hoursLostPerWeek * 50; // assuming 50 work weeks
  
  const costPerDay = hoursLostPerDay * hourlyRate;
  const costPerWeek = hoursLostPerWeek * hourlyRate;
  const costPerYear = hoursLostPerYear * hourlyRate;

  const getCopyText = () => {
    return `Notification Interruption Cost:\nLosing ${hoursLostPerWeek.toFixed(1)} hours/week to Slack & emails.\nAnnual Cost of Distractions: $${costPerYear.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
  };

  return (
    <ToolLayout
      toolNum={49} category="⏱️ Time & Remote Work"
      title="Notification Interruption Cost" titleHighlight="Calculator"
      description="Turn your daily pings and Slack messages into the real hours of focus they're quietly costing you and your employer."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>The Cost of Your Time</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="rate">Your Hourly Rate</FieldLabel>
                <NumInput id="rate" value={hourlyRate} onChange={setHourlyRate} prefix="$" min={1} step={5} />
              </div>
              <div>
                <FieldLabel htmlFor="workdays">Work Days per Week</FieldLabel>
                <NumInput id="workdays" value={workDays} onChange={setWorkDays} suffix="days" min={1} max={7} step={1} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>The Distractions</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="pings">Interruptions per Day</FieldLabel>
                <p className="text-xs text-slate-500 mb-2">Think of every Slack message, email notification, or "quick question" that pulls you away.</p>
                <NumInput id="pings" value={dailyPings} onChange={setDailyPings} min={0} step={5} />
              </div>
              <div>
                <FieldLabel htmlFor="mins">Minutes to Refocus</FieldLabel>
                <p className="text-xs text-slate-500 mb-2">Studies show it takes an average of 15 to 23 minutes to return to deep work after a distraction.</p>
                <NumInput id="mins" value={minsLost} onChange={setMinsLost} suffix="min" min={1} max={60} step={1} />
              </div>
            </div>
          </Card>


        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <ResultHeadline label="Annual Cost of Distractions" value={`$${costPerYear.toLocaleString(undefined, {maximumFractionDigits: 0})}`} sub={`~${hoursLostPerYear.toFixed(0)} hours lost per year`} />
            
            <div className="px-4 py-4 space-y-1">
              <ResultRow label="Time lost daily" value={`${hoursLostPerDay.toFixed(1)} hrs`} />
              <ResultRow label="Time lost weekly" value={`${hoursLostPerWeek.toFixed(1)} hrs`} highlight />
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Financial Cost</p>
                <ResultRow label="Lost per day" value={`$${costPerDay.toLocaleString(undefined, {maximumFractionDigits: 0})}`} />
                <ResultRow label="Lost per week" value={`$${costPerWeek.toLocaleString(undefined, {maximumFractionDigits: 0})}`} />
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
