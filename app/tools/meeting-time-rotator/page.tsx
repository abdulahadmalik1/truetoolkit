"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, AddButton, RemoveButton, ResultCard } from "@/components/ui";

interface Team { id: string; name: string; timezone: string; }
const TZ_LIST = ["UTC","Asia/Karachi","Asia/Kolkata","Asia/Dubai","Europe/London","Europe/Paris","America/New_York","America/Los_Angeles","Asia/Tokyo","Asia/Singapore","Australia/Sydney"];

function scoreSlot(hour: number): number {
  if (hour >= 8 && hour <= 18) return 0;
  if (hour >= 6 && hour <= 21) return 1;
  return 2;
}

export default function MeetingRotator() {
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "Karachi", timezone: "Asia/Karachi" },
    { id: "2", name: "London", timezone: "Europe/London" },
  ]);
  const [slots, setSlots] = useState(["09:00", "14:00", "18:00"]);
  const [occurrences, setOccurrences] = useState(6);

  const addTeam = () => setTeams((t) => [...t, { id: Date.now().toString(), name: "", timezone: "UTC" }]);
  const removeTeam = (id: string) => setTeams((t) => t.filter((r) => r.id !== id));
  const updateTeam = (id: string, f: keyof Team, v: string) => setTeams((t) => t.map((r) => r.id === id ? { ...r, [f]: v } : r));

  const schedule: { date: string; slot: string; localTimes: { team: string; time: string; score: number }[] }[] = [];
  const today = new Date();
  let slotIndex = 0;
  for (let i = 0; i < occurrences; i++) {
    const d = new Date(today); d.setDate(d.getDate() + i * 7);
    const slot = slots[slotIndex % slots.length];
    const [hStr, mStr] = slot.split(":");
    const baseDate = new Date(d);
    baseDate.setHours(parseInt(hStr), parseInt(mStr), 0, 0);
    const localTimes = teams.map((team) => {
      try {
        const localStr = baseDate.toLocaleTimeString("en-US", { timeZone: team.timezone, hour: "2-digit", minute: "2-digit", hour12: false });
        const localH = parseInt(localStr.split(":")[0]);
        return { team: team.name, time: localStr, score: scoreSlot(localH) };
      } catch { return { team: team.name, time: "N/A", score: 2 }; }
    });
    schedule.push({ date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }), slot, localTimes });
    slotIndex++;
  }

  return (
    <ToolLayout toolNum={8} category="⏱️ Time & Remote Work" title="Fair Meeting Time" titleHighlight="Rotator"
      description="Rotate meeting times across time zones so no single team is always stuck with an inconvenient slot."
    >
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          <Card>
            <SectionTitle>Teams & Timezones</SectionTitle>
            <div className="space-y-2">
              {teams.map((t) => (
                <div key={t.id} className="flex gap-2 items-center">
                  <input value={t.name} onChange={(e) => updateTeam(t.id, "name", e.target.value)} placeholder="Team name"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
                  <select value={t.timezone} onChange={(e) => updateTeam(t.id, "timezone", e.target.value)}
                    className="flex-1 px-2 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 text-sm outline-none focus:border-blue-500">
                    {TZ_LIST.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                  <RemoveButton onClick={() => removeTeam(t.id)} />
                </div>
              ))}
              <AddButton onClick={addTeam} label="Add team" />
            </div>
          </Card>

          <Card>
            <SectionTitle>Candidate Slots (UTC base)</SectionTitle>
            <div className="space-y-2">
              {slots.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="time" value={s} onChange={(e) => { const ns = [...slots]; ns[i] = e.target.value; setSlots(ns); }}
                    className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
                  {slots.length > 1 && <RemoveButton onClick={() => setSlots(slots.filter((_, j) => j !== i))} />}
                </div>
              ))}
              {slots.length < 3 && <AddButton onClick={() => setSlots([...slots, "10:00"])} label="Add slot" />}
            </div>
            <div className="mt-4">
              <FieldLabel htmlFor="occ">Occurrences to Schedule</FieldLabel>
              <NumInput id="occ" value={occurrences} onChange={setOccurrences} min={1} max={20} />
            </div>
          </Card>
        </div>

        <Card>
          <SectionTitle>Rotation Schedule</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-300">
                <th className="text-left py-2 pr-4 text-slate-600 font-medium">Date</th>
                <th className="text-left py-2 pr-4 text-slate-600 font-medium">Slot (UTC)</th>
                {teams.map((t) => <th key={t.id} className="text-left py-2 pr-4 text-slate-600 font-medium">{t.name}</th>)}
              </tr></thead>
              <tbody>
                {schedule.map((row, i) => (
                  <tr key={i} className="border-b border-slate-200 hover:bg-slate-800/30">
                    <td className="py-2 pr-4 text-slate-900">{row.date}</td>
                    <td className="py-2 pr-4 text-blue-400 font-mono">{row.slot}</td>
                    {row.localTimes.map((lt, j) => (
                      <td key={j} className={`py-2 pr-4 font-mono ${lt.score === 0 ? "text-emerald-400" : lt.score === 1 ? "text-amber-400" : "text-red-400"}`}>
                        {lt.time}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-slate-500">
            <span className="text-emerald-400">● 8am–6pm (good)</span>
            <span className="text-amber-400">● 6–8am / 6–9pm (OK)</span>
            <span className="text-red-400">● Outside hours (bad)</span>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
}
