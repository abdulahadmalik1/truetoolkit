"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, Select, ResultCard, ResultRow } from "@/components/ui";

const TIMEZONES = [
  { value: "America/New_York", label: "US Eastern (New York)" },
  { value: "America/Chicago", label: "US Central (Chicago)" },
  { value: "America/Denver", label: "US Mountain (Denver)" },
  { value: "America/Los_Angeles", label: "US Pacific (Los Angeles)" },
  { value: "Europe/London", label: "UK (London)" },
  { value: "Europe/Berlin", label: "Central Europe (Berlin/Paris)" },
  { value: "Asia/Dubai", label: "UAE (Dubai)" },
  { value: "Asia/Kolkata", label: "India (Kolkata)" },
  { value: "Asia/Karachi", label: "Pakistan (Karachi)" },
  { value: "Asia/Tokyo", label: "Japan (Tokyo)" },
  { value: "Australia/Sydney", label: "Australia (Sydney)" },
  { value: "Pacific/Auckland", label: "New Zealand (Auckland)" },
  { value: "UTC", label: "Coordinated Universal Time (UTC)" }
];

export default function DSTDriftWatchdog() {
  const [baseTZ, setBaseTZ] = useState("America/New_York");
  const [targetTZ, setTargetTZ] = useState("Europe/London");

  const driftPeriods = useMemo(() => {
    const periods = [];
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const getDiffMinutes = (date: Date) => {
        const d1 = new Date(date.toLocaleString('en-US', { timeZone: baseTZ }));
        const d2 = new Date(date.toLocaleString('en-US', { timeZone: targetTZ }));
        return (d2.getTime() - d1.getTime()) / 60000;
    };

    const baseDiff = getDiffMinutes(today);
    let currentDriftStart: Date | null = null;
    let currentDriftDiff: number | null = null;

    for (let i = 1; i <= 365; i++) {
        const checkDate = new Date(today.getTime());
        checkDate.setDate(today.getDate() + i);
        const diff = getDiffMinutes(checkDate);

        if (diff !== baseDiff) {
            if (!currentDriftStart) {
                currentDriftStart = new Date(checkDate.getTime());
                currentDriftDiff = diff;
            } else if (diff !== currentDriftDiff) {
                 const end = new Date(checkDate.getTime());
                 end.setDate(end.getDate() - 1);
                 periods.push({
                     start: new Date(currentDriftStart.getTime()),
                     end,
                     diff: (currentDriftDiff ?? 0) - baseDiff
                 });
                 currentDriftStart = new Date(checkDate.getTime());
                 currentDriftDiff = diff;
            }
        } else {
            if (currentDriftStart) {
                const end = new Date(checkDate.getTime());
                end.setDate(end.getDate() - 1);
                periods.push({
                    start: new Date(currentDriftStart.getTime()),
                    end,
                    diff: (currentDriftDiff ?? 0) - baseDiff
                });
                currentDriftStart = null;
            }
        }
    }

    if (currentDriftStart) {
        const end = new Date(today.getTime());
        end.setDate(today.getDate() + 365);
        periods.push({
            start: new Date(currentDriftStart.getTime()),
            end,
            diff: (currentDriftDiff ?? 0) - baseDiff
        });
    }

    return periods;
  }, [baseTZ, targetTZ]);

  const formatDiff = (minutes: number) => {
    const hours = Math.abs(minutes) / 60;
    const dir = minutes > 0 ? "ahead" : "behind";
    return `${hours} hour${hours === 1 ? '' : 's'} ${dir} of current schedule`;
  };

  return (
    <ToolLayout
      toolNum={59} category="⏱️ Time & Remote Work"
      title="DST Drift" titleHighlight="Watchdog"
      description="Select two time zones. Find out exactly which weeks of the year your recurring meetings will silently shift by an hour because the two locations change Daylight Saving Time on different dates."
    >
      <div className="grid md:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Time Zones</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="baseTZ">Your Location (Base)</FieldLabel>
                <Select id="baseTZ" value={baseTZ} onChange={setBaseTZ} options={TIMEZONES} />
              </div>
              <div className="pt-2">
                <FieldLabel htmlFor="targetTZ">Partner / Client Location</FieldLabel>
                <Select id="targetTZ" value={targetTZ} onChange={setTargetTZ} options={TIMEZONES} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>How This Works</SectionTitle>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              The US and Europe enter and exit Daylight Saving Time on different weeks. For example, the US springs forward in early March, while the UK waits until late March. 
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              During those "drift weeks", your daily 10:00 AM NY to London sync will suddenly jump to 9:00 AM or 11:00 AM for someone. This tool calculates exactly when those drift windows occur over the next 365 days so you can plan around them.
            </p>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-indigo-700 to-blue-800 px-6 py-7 text-center rounded-t-2xl">
              <p className="text-indigo-200 text-sm font-medium mb-1">Over the next 365 days...</p>
              <p className="text-white text-4xl font-extrabold tabular-nums">
                {driftPeriods.length}
              </p>
              <p className="text-indigo-200 text-sm mt-1">DST Drift Windows Detected</p>
            </div>
            <div className="px-4 py-4 space-y-3 bg-white rounded-b-2xl">
              {driftPeriods.length === 0 ? (
                <div className="text-center py-6">
                  <span className="text-4xl block mb-2">✅</span>
                  <p className="text-slate-800 font-medium">No schedule drifts!</p>
                  <p className="text-slate-500 text-sm mt-1">These two time zones stay perfectly aligned year-round.</p>
                </div>
              ) : (
                driftPeriods.map((p, idx) => (
                  <div key={idx} className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-amber-900 font-bold mb-1">
                      {p.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {p.end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <p className="text-amber-700 text-sm">
                      Meeting will shift <strong className="font-semibold">{formatDiff(p.diff)}</strong> from the partner's perspective.
                    </p>
                  </div>
                ))
              )}
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
