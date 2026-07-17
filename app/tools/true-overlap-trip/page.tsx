"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, Select, ResultCard } from "@/components/ui";

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

// Natively parses a local date string (YYYY-MM-DDTHH:mm) into an exact UTC Date, respecting the specific timezone's DST rules.
function getExactUTC(localIsoStr: string, timeZone: string) {
    try {
      const assumedUTC = new Date(localIsoStr + "Z");
      if (isNaN(assumedUTC.getTime())) return null;

      const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone,
          year: 'numeric', month: 'numeric', day: 'numeric',
          hour: 'numeric', minute: 'numeric', second: 'numeric',
          hour12: false,
      });
      
      const parts = formatter.formatToParts(assumedUTC);
      const getP = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
      
      const targetLocal = Date.UTC(getP('year'), getP('month') - 1, getP('day'), getP('hour'), getP('minute'));
      const offsetMs = targetLocal - assumedUTC.getTime();
      
      return new Date(assumedUTC.getTime() - offsetMs);
    } catch {
      return null;
    }
}

type UserAvail = {
  id: string;
  name: string;
  tz: string;
  startStr: string; // YYYY-MM-DDTHH:mm
  endStr: string;   // YYYY-MM-DDTHH:mm
};

export default function TrueOverlapTrip() {
  const [baseTz, setBaseTz] = useState("America/New_York");
  
  const [users, setUsers] = useState<UserAvail[]>([
    { id: "1", name: "Alice", tz: "America/New_York", startStr: "2026-10-25T09:00", endStr: "2026-10-30T17:00" },
    { id: "2", name: "Bob", tz: "Europe/London", startStr: "2026-10-25T14:00", endStr: "2026-10-31T12:00" },
  ]);

  const addUser = () => setUsers([...users, { id: Math.random().toString(), name: "New Person", tz: "Europe/Berlin", startStr: "2026-10-25T09:00", endStr: "2026-10-30T17:00" }]);
  const updateUser = (id: string, key: keyof UserAvail, val: string) => setUsers(users.map(u => u.id === id ? { ...u, [key]: val } : u));
  const removeUser = (id: string) => setUsers(users.filter(u => u.id !== id));

  const overlap = useMemo(() => {
    if (users.length === 0) return null;

    let maxStart = -Infinity;
    let minEnd = Infinity;

    for (const u of users) {
      const startUtc = getExactUTC(u.startStr, u.tz);
      const endUtc = getExactUTC(u.endStr, u.tz);
      
      if (!startUtc || !endUtc) return null; // Invalid date
      
      if (startUtc.getTime() > maxStart) maxStart = startUtc.getTime();
      if (endUtc.getTime() < minEnd) minEnd = endUtc.getTime();
    }

    if (maxStart < minEnd) {
      return { start: new Date(maxStart), end: new Date(minEnd) };
    }
    return null; // No overlap
  }, [users]);

  const formatDate = (date: Date, tz: string) => {
    return date.toLocaleString('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
  };

  return (
    <ToolLayout
      toolNum={70} category="📱 Content & Social"
      title="True-Overlap" titleHighlight="Trip Scheduler"
      description="Planning a remote team retreat? Everyone inputs their availability in their own local time. We instantly compute the exact overlapping window, flawlessly handling DST offsets and international timezone math."
    >
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <SectionTitle>Team Availability</SectionTitle>
              <button onClick={addUser} className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                + Add Person
              </button>
            </div>
            
            <div className="space-y-6">
              {users.map((u, idx) => (
                <div key={u.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
                  {users.length > 1 && (
                    <button onClick={() => removeUser(u.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 font-bold px-2">✕</button>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <FieldLabel htmlFor={`n-${u.id}`}>Name</FieldLabel>
                      <TextInput id={`n-${u.id}`} value={u.name} onChange={(v) => updateUser(u.id, 'name', v)} />
                    </div>
                    <div>
                      <FieldLabel htmlFor={`tz-${u.id}`}>Their Local Timezone</FieldLabel>
                      <Select id={`tz-${u.id}`} value={u.tz} onChange={(v) => updateUser(u.id, 'tz', v)} options={TIMEZONES} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/60">
                    <div>
                      <FieldLabel htmlFor={`s-${u.id}`}>Earliest Start (Local)</FieldLabel>
                      <input 
                        type="datetime-local" id={`s-${u.id}`} 
                        value={u.startStr} 
                        onChange={(e) => updateUser(u.id, 'startStr', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor={`e-${u.id}`}>Latest End (Local)</FieldLabel>
                      <input 
                        type="datetime-local" id={`e-${u.id}`} 
                        value={u.endStr} 
                        onChange={(e) => updateUser(u.id, 'endStr', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-500" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <Card>
            <div className="mb-4">
              <FieldLabel htmlFor="viewTz">Show Overlap Results In:</FieldLabel>
              <Select id="viewTz" value={baseTz} onChange={setBaseTz} options={TIMEZONES} />
            </div>
          </Card>

          <ResultCard gradient>
            <div className={`bg-gradient-to-br px-6 py-8 text-center rounded-t-2xl ${overlap ? 'from-emerald-700 to-green-800' : 'from-rose-700 to-red-800'}`}>
              <p className="text-white/80 text-sm font-medium mb-2 uppercase tracking-wide">
                {overlap ? "Perfect Overlap Found" : "No Overlap"}
              </p>
              {overlap ? (
                <div className="space-y-3">
                  <div className="bg-black/20 rounded-xl py-3 px-4">
                    <p className="text-xs text-emerald-200 uppercase font-bold tracking-widest mb-1">Start</p>
                    <p className="text-lg font-bold text-white">{formatDate(overlap.start, baseTz)}</p>
                  </div>
                  <div className="bg-black/20 rounded-xl py-3 px-4">
                    <p className="text-xs text-emerald-200 uppercase font-bold tracking-widest mb-1">End</p>
                    <p className="text-lg font-bold text-white">{formatDate(overlap.end, baseTz)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-white font-bold">Everyone is free at completely different times.</p>
              )}
            </div>
            
            {overlap && (
              <div className="px-4 py-4 bg-white rounded-b-2xl">
                <p className="text-sm text-slate-600 text-center">
                  This window perfectly fits inside everyone's local availability, factoring in exact DST transitions.
                </p>
              </div>
            )}
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
