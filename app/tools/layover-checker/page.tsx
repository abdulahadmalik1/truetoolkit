"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, Select, ResultCard, ResultRow } from "@/components/ui";

const TZ_LIST = ["UTC","Asia/Karachi","Asia/Kolkata","Asia/Dubai","Europe/London","Europe/Paris","Europe/Amsterdam","America/New_York","America/Los_Angeles","Asia/Tokyo","Asia/Singapore","Australia/Sydney"];

function parseLocalTime(dateStr: string, timeStr: string, timezone: string): Date {
  // Create a "local" datetime string and use Intl to interpret in the target TZ
  const dtStr = `${dateStr}T${timeStr}:00`;
  const d = new Date(dtStr);
  // Convert from local to UTC by finding the offset
  try {
    const localOffset = new Date(dtStr).getTimezoneOffset() * 60000;
    // Get TZ offset
    const testDate = new Date(dtStr);
    const tzStr = testDate.toLocaleString("en-US", { timeZone: timezone, timeZoneName: "shortOffset" });
    const match = tzStr.match(/GMT([+-]\d+(?::\d+)?)/);
    let tzOffset = 0;
    if (match) {
      const parts = match[1].split(":");
      tzOffset = (parseInt(parts[0]) * 60 + (parts[1] ? parseInt(parts[1]) * Math.sign(parseInt(parts[0])) : 0)) * 60000;
    }
    return new Date(d.getTime() - localOffset - tzOffset);
  } catch {
    return d;
  }
}

export default function LayoverChecker() {
  const [arrivalDate, setArrivalDate] = useState(new Date().toISOString().split("T")[0]);
  const [arrivalTime, setArrivalTime] = useState("14:30");
  const [arrivalTz, setArrivalTz] = useState("Europe/London");
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split("T")[0]);
  const [departureTime, setDepartureTime] = useState("17:00");
  const [departureTz, setDepartureTz] = useState("Europe/London");
  const [minBuffer, setMinBuffer] = useState(90); // minutes recommended minimum

  const arrivalUTC = parseLocalTime(arrivalDate, arrivalTime, arrivalTz);
  const departureUTC = parseLocalTime(departureDate, departureTime, departureTz);
  const layoverMs = departureUTC.getTime() - arrivalUTC.getTime();
  const layoverMins = Math.round(layoverMs / 60000);
  const layoverHours = Math.floor(Math.abs(layoverMins) / 60);
  const layoverRemMins = Math.abs(layoverMins) % 60;

  const isNegative = layoverMins < 0;
  const isSafe = layoverMins >= minBuffer;
  const isTight = layoverMins >= 0 && layoverMins < minBuffer;

  const tzOptions = TZ_LIST.map((t) => ({ value: t, label: t }));

  return (
    <ToolLayout toolNum={32} category="🛠️ Everyday Practical" title="Flight Layover" titleHighlight="Buffer Checker"
      description="Enter your flight arrival and departure times to check if your layover is long enough."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-5">
          <Card>
            <SectionTitle>🛬 Arriving Flight</SectionTitle>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Date</label>
                  <input type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Arrival Time</label>
                  <input type="time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Airport Timezone</label>
                <Select id="atz" value={arrivalTz} onChange={setArrivalTz} options={tzOptions} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>🛫 Departing Flight</SectionTitle>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Date</label>
                  <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Departure Time</label>
                  <input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Airport Timezone</label>
                <Select id="dtz" value={departureTz} onChange={setDepartureTz} options={tzOptions} />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Minimum Buffer You Need (mins)</label>
                <input type="range" min={30} max={240} value={minBuffer} onChange={(e) => setMinBuffer(Number(e.target.value))}
                  className="w-full" />
                <div className="flex justify-between text-xs text-slate-500"><span>30 min</span><span className="font-bold text-blue-400">{minBuffer} min</span><span>4 hrs</span></div>
              </div>
            </div>
          </Card>
        </div>

        <div className="sticky top-24">
          <ResultCard gradient>
            <div className={`px-6 py-7 text-center bg-gradient-to-br ${isNegative ? "from-red-700 to-rose-800" : isSafe ? "from-emerald-700 to-teal-800" : "from-amber-700 to-orange-800"}`}>
              <p className="text-white/70 text-sm mb-1">Your layover</p>
              <p className="text-white text-4xl font-extrabold tabular-nums">
                {isNegative ? "—" : `${layoverHours}h ${layoverRemMins}m`}
              </p>
              <p className="text-white/80 text-sm mt-2 font-semibold">
                {isNegative ? "❌ Impossible — departure before arrival" : isSafe ? "✅ Comfortable" : "⚠️ Tight layover"}
              </p>
            </div>
            <div className="px-4 py-4">
              {!isNegative && (
                <>
                  <ResultRow label="Layover duration" value={`${layoverHours}h ${layoverRemMins}m (${layoverMins} mins)`} />
                  <ResultRow label="Your minimum buffer" value={`${minBuffer} mins`} />
                  <ResultRow label="Spare time" value={isSafe ? `${layoverMins - minBuffer} mins` : "Insufficient"} highlight={isSafe} />
                </>
              )}
              <div className="mt-3 text-xs text-slate-500">
                <p>Typical recommendations:</p>
                <p>Domestic: 45-60 min · International: 90-120 min · First-time: 2-3 hrs</p>
              </div>
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
