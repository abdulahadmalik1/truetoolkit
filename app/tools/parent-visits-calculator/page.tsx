"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, ResultCard, ResultRow } from "@/components/ui";

export default function ParentVisitsCalculator() {
  const [parentAge, setParentAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(82);
  const [visitsPerYear, setVisitsPerYear] = useState(2);
  const [daysPerVisit, setDaysPerVisit] = useState(3);
  const [yearsLivedTogether, setYearsLivedTogether] = useState(18);

  const math = useMemo(() => {
    const yearsLeft = Math.max(0, lifeExpectancy - parentAge);
    const totalVisitsLeft = yearsLeft * visitsPerYear;
    const totalDaysLeft = totalVisitsLeft * daysPerVisit;

    const childhoodDays = yearsLivedTogether * 365;
    const totalLifetimeDays = childhoodDays + totalDaysLeft;
    
    let percentageRemaining = 0;
    let percentageUsed = 100;

    if (totalLifetimeDays > 0) {
      percentageRemaining = (totalDaysLeft / totalLifetimeDays) * 100;
      percentageUsed = 100 - percentageRemaining;
    }

    // Generate grid dots for visual impact. Max 500 dots to not crash DOM.
    const dotCount = Math.min(totalVisitsLeft, 500);

    return {
      yearsLeft,
      totalVisitsLeft,
      totalDaysLeft,
      percentageUsed,
      percentageRemaining,
      dotCount,
      childhoodDays
    };
  }, [parentAge, lifeExpectancy, visitsPerYear, daysPerVisit, yearsLivedTogether]);

  return (
    <ToolLayout
      toolNum={79} category="⏳ Life & Existential Math"
      title="Remaining" titleHighlight="Parent Visits"
      description="A stark mathematical reality check. Input how often you see your parents to calculate exactly how many physical visits you have left with them."
    >
      <div className="grid lg:grid-cols-[1fr_450px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Actuarial Variables</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <FieldLabel htmlFor="age">Parent's Current Age</FieldLabel>
                <NumInput id="age" value={parentAge} onChange={setParentAge} min={30} max={120} />
              </div>
              <div>
                <FieldLabel htmlFor="le">Life Expectancy Target</FieldLabel>
                <NumInput id="le" value={lifeExpectancy} onChange={setLifeExpectancy} min={50} max={120} />
                <p className="text-xs text-slate-500 mt-1">US average is ~79, but scales up if already older.</p>
              </div>
              <div>
                <FieldLabel htmlFor="visits">Visits Per Year</FieldLabel>
                <NumInput id="visits" value={visitsPerYear} onChange={setVisitsPerYear} min={0} step={1} />
                <p className="text-xs text-slate-500 mt-1">How many times a year do you see them in person?</p>
              </div>
              <div>
                <FieldLabel htmlFor="days">Days Per Visit</FieldLabel>
                <NumInput id="days" value={daysPerVisit} onChange={setDaysPerVisit} min={1} step={1} />
                <p className="text-xs text-slate-500 mt-1">Average length of each trip.</p>
              </div>
              <div className="sm:col-span-2 pt-4 border-t border-slate-100">
                <FieldLabel htmlFor="child">Years Lived in Same House</FieldLabel>
                <NumInput id="child" value={yearsLivedTogether} onChange={setYearsLivedTogether} min={0} max={30} />
                <p className="text-xs text-slate-500 mt-1">Usually 18 (childhood). We use this to calculate the percentage of total lifetime time already spent.</p>
              </div>
            </div>
          </Card>

          {math.totalVisitsLeft > 0 && (
            <Card>
              <SectionTitle>Visualizing Remaining Visits</SectionTitle>
              <p className="text-sm text-slate-600 mb-6">Each dot represents one remaining physical visit you will ever have with them.</p>
              
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: math.dotCount }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-slate-800 animate-pulse" style={{ animationDelay: `${(i % 10) * 0.1}s` }}></div>
                ))}
                {math.totalVisitsLeft > 500 && (
                  <div className="text-sm font-bold text-slate-400 mt-1">+ {math.totalVisitsLeft - 500} more</div>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className={`bg-gradient-to-br px-6 py-10 text-center rounded-t-2xl ${math.totalVisitsLeft < 10 ? 'from-rose-800 to-red-900' : 'from-slate-800 to-slate-900'}`}>
              <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-2">Total Remaining Visits</p>
              <p className="text-white text-7xl font-black tabular-nums tracking-tight mb-2">
                {math.totalVisitsLeft}
              </p>
              <p className="text-white/80 text-sm font-medium">
                spread across {math.yearsLeft} years
              </p>
            </div>
            
            <div className="px-4 py-6 bg-white rounded-b-2xl space-y-4 border-2 border-t-0 border-slate-200">
              
              <div className="text-center mb-6">
                <p className="text-4xl font-black text-rose-600 mb-1">{math.percentageUsed.toFixed(1)}%</p>
                <p className="text-sm font-bold text-slate-700 leading-snug">
                  of your in-person time with them has already been used up.
                </p>
              </div>

              <div className="space-y-1">
                <ResultRow label="Childhood Days Spent" value={math.childhoodDays.toLocaleString()} />
                <ResultRow label="Remaining Days Left" value={<span className="font-bold text-rose-600">{math.totalDaysLeft.toLocaleString()}</span>} />
              </div>
            </div>
          </ResultCard>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 leading-relaxed font-serif italic text-center">
            "When you look at the math, you aren't at the halfway point of your relationship. You are in the very tail end. Prioritize accordingly."
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
