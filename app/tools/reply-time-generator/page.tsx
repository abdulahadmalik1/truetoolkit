"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, Select, CopyButton } from "@/components/ui";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const TZ_LIST = ["UTC","Asia/Karachi","Asia/Kolkata","Asia/Dubai","Europe/London","Europe/Paris","America/New_York","America/Los_Angeles","Asia/Tokyo","Australia/Sydney"];
const WINDOWS = ["a few hours","within 1 business day","within 48 hours","within 2 business days"];

function generateText(days: string[], startTime: string, endTime: string, timezone: string, window: string, formal: boolean): string {
  const daysStr = days.length === 5 && !days.includes("Sat") && !days.includes("Sun")
    ? "Monday–Friday"
    : days.join(", ");
  const tzAbbr = (() => {
    try {
      return new Date().toLocaleTimeString("en-US", { timeZone: timezone, timeZoneName: "short" }).split(" ").pop() ?? timezone;
    } catch { return timezone; }
  })();

  if (formal) {
    return `My working hours are ${startTime}–${endTime} ${tzAbbr}, ${daysStr}. I aim to respond to all messages ${window}. Emails received outside of these hours will be responded to on the next working day.`;
  } else {
    return `Hey! I'm usually around ${startTime}–${endTime} ${tzAbbr} on ${daysStr}. I'll get back to you ${window}. If you message outside those hours, I'll catch it the next day 👍`;
  }
}

export default function ReplyTimeGenerator() {
  const [selectedDays, setSelectedDays] = useState(["Mon","Tue","Wed","Thu","Fri"]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [timezone, setTimezone] = useState("Asia/Karachi");
  const [replyWindow, setReplyWindow] = useState(WINDOWS[1]);

  const toggleDay = (d: string) => setSelectedDays((s) => s.includes(d) ? s.filter((x) => x !== d) : [...s, d]);
  const formal = generateText(selectedDays, startTime, endTime, timezone, replyWindow, true);
  const casual = generateText(selectedDays, startTime, endTime, timezone, replyWindow, false);

  return (
    <ToolLayout toolNum={9} category="⏱️ Time & Remote Work" title="Reply-Time Expectation" titleHighlight="Generator"
      description="Generate a ready-to-paste 'expect a reply within X' line for your email signature or Slack status."
    >
      <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-start">
        <div className="space-y-5">
          <Card>
            <SectionTitle>Working Days</SectionTitle>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map((d) => (
                <button key={d} onClick={() => toggleDay(d)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${selectedDays.includes(d) ? "bg-blue-600 border-blue-500 text-slate-900" : "bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900"}`}
                >{d}</button>
              ))}
            </div>
          </Card>
          <Card>
            <SectionTitle>Working Hours & Timezone</SectionTitle>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-slate-600 mb-1 block">From</label>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-600 mb-1 block">To</label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-600 mb-1 block">Timezone</label>
                <Select id="tz" value={timezone} onChange={setTimezone} options={TZ_LIST.map((t) => ({ value: t, label: t }))} />
              </div>
              <div>
                <label className="text-xs text-slate-600 mb-1 block">Typical Reply Window</label>
                <Select id="win" value={replyWindow} onChange={setReplyWindow} options={WINDOWS.map((w) => ({ value: w, label: w }))} />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {[{ label: "Formal", text: formal }, { label: "Casual", text: casual }].map(({ label, text }) => (
            <Card key={label}>
              <div className="flex justify-between items-center mb-3">
                <SectionTitle>{label} Version</SectionTitle>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-700 text-sm leading-relaxed mb-3">
                {text}
              </div>
              <CopyButton getText={() => text} />
            </Card>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
