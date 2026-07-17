"use client";
import { useState, useEffect } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, NumInput, ResultCard, ResultRow } from "@/components/ui";

const NUM_WORDS: Record<string, number> = {
  thirty: 30, sixty: 60, ninety: 90, forty: 40, fifteen: 15, twenty: 20
};

export default function NoticePeriodExtractor() {
  const [renewalDate, setRenewalDate] = useState("");
  const [clauseText, setClauseText] = useState("");
  
  const [parsedDays, setParsedDays] = useState<number | null>(null);
  const [manualDays, setManualDays] = useState<number>(30);

  useEffect(() => {
    if (!clauseText.trim()) {
      setParsedDays(null);
      return;
    }
    
    const text = clauseText.toLowerCase();
    let foundDays = null;

    // Look for "X days"
    const dayMatch = text.match(/(\d+)\s+days/);
    if (dayMatch) foundDays = parseInt(dayMatch[1]);
    
    // Look for word-based days "thirty days"
    if (!foundDays) {
      for (const [word, num] of Object.entries(NUM_WORDS)) {
        if (text.includes(`${word} days`)) {
          foundDays = num;
          break;
        }
      }
    }

    // Look for "X months" (approximate to 30 days per month)
    if (!foundDays) {
      const monthMatch = text.match(/(\d+)\s+months/);
      if (monthMatch) foundDays = parseInt(monthMatch[1]) * 30;
    }

    setParsedDays(foundDays);
  }, [clauseText]);

  const activeDays = parsedDays !== null ? parsedDays : manualDays;
  
  let deadlineDate = null;
  let daysLeft = null;
  if (renewalDate) {
    const d = new Date(renewalDate);
    d.setDate(d.getDate() - activeDays);
    deadlineDate = d;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    daysLeft = Math.floor((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  return (
    <ToolLayout
      toolNum={60} category="🛠️ Everyday Practical"
      title="Notice-Period" titleHighlight="Deadline Extractor"
      description="Paste your lease or contract's auto-renewal clause. We'll parse the notice period and calculate the exact drop-dead date you must send your cancellation by."
    >
      <div className="grid md:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Contract Details</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="renewal">Official Renewal / End Date</FieldLabel>
                <input 
                  type="date" id="renewal" 
                  value={renewalDate} 
                  onChange={(e) => setRenewalDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" 
                />
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <FieldLabel htmlFor="clause">Paste Renewal Clause</FieldLabel>
                  {parsedDays !== null && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Extracted: {parsedDays} days
                    </span>
                  )}
                </div>
                <textarea 
                  id="clause"
                  value={clauseText}
                  onChange={(e) => setClauseText(e.target.value)}
                  placeholder="e.g., 'Tenant must provide written notice of intent to vacate at least sixty (60) days prior to the expiration of the term...'"
                  className="w-full h-32 px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {parsedDays === null && (
                <div className="pt-2 border-t border-slate-100">
                  <FieldLabel htmlFor="manualDays">Could not parse text. Enter Notice Days manually:</FieldLabel>
                  <NumInput id="manualDays" value={manualDays} onChange={setManualDays} min={0} step={1} suffix="days" />
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-rose-700 to-red-800 px-6 py-7 text-center rounded-t-2xl">
              <p className="text-rose-200 text-sm font-medium mb-1">Your True Cancellation Deadline</p>
              <p className="text-white text-3xl font-extrabold tabular-nums">
                {deadlineDate ? deadlineDate.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" }) : "Select date"}
              </p>
              {daysLeft !== null && (
                <p className={`text-sm mt-2 font-semibold ${daysLeft < 0 ? 'text-red-300' : daysLeft <= 14 ? 'text-amber-300' : 'text-rose-200'}`}>
                  {daysLeft < 0 ? `Missed by ${Math.abs(daysLeft)} days!` : daysLeft === 0 ? "Deadline is TODAY!" : `${daysLeft} days from today`}
                </p>
              )}
            </div>
            <div className="px-4 py-4 space-y-1 bg-white rounded-b-2xl">
              <ResultRow label="Contract Renewal Date" value={renewalDate ? new Date(renewalDate).toLocaleDateString() : "—"} />
              <ResultRow label="Required Notice Period" value={`${activeDays} days`} />
              <ResultRow label="Safety Buffer Recommended" value="Send 3 days before deadline" />
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
