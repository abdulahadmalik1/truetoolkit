"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, NumInput, ResultCard } from "@/components/ui";

type EventItem = {
  id: string;
  name: string;
  durationMinutes: number;
  gapAfterMinutes: number;
  isAnchor: boolean;
  anchorTime?: string; // "HH:MM"
};

const DEFAULT_EVENTS: EventItem[] = [
  { id: "1", name: "Venue Open / Vendor Load-in", durationMinutes: 60, gapAfterMinutes: 0, isAnchor: false },
  { id: "2", name: "Florist & Decor Setup", durationMinutes: 120, gapAfterMinutes: 30, isAnchor: false },
  { id: "3", name: "First Look Photography", durationMinutes: 45, gapAfterMinutes: 15, isAnchor: false },
  { id: "4", name: "Ceremony Begins", durationMinutes: 45, gapAfterMinutes: 15, isAnchor: true, anchorTime: "17:00" },
  { id: "5", name: "Cocktail Hour", durationMinutes: 60, gapAfterMinutes: 0, isAnchor: false },
  { id: "6", name: "Reception Dinner Begins", durationMinutes: 120, gapAfterMinutes: 0, isAnchor: false },
];

export default function WeddingVendorTimeline() {
  const [events, setEvents] = useState<EventItem[]>(DEFAULT_EVENTS);

  const setAnchor = (id: string) => {
    setEvents(events.map(e => ({
      ...e,
      isAnchor: e.id === id,
      anchorTime: e.id === id ? (e.anchorTime || "12:00") : undefined
    })));
  };

  const updateEvent = (id: string, field: keyof EventItem, value: any) => {
    setEvents(events.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addEvent = () => {
    setEvents([...events, { id: Math.random().toString(), name: "New Event", durationMinutes: 30, gapAfterMinutes: 0, isAnchor: false }]);
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const cascadeTimeline = useMemo(() => {
    const anchorIdx = events.findIndex(e => e.isAnchor);
    if (anchorIdx === -1) return [];

    const anchorEvent = events[anchorIdx];
    const [anchorH, anchorM] = (anchorEvent.anchorTime || "00:00").split(":").map(Number);
    
    // We will build an array of { id, start, end } with Date objects (using today's date)
    const baseDate = new Date();
    baseDate.setHours(anchorH, anchorM, 0, 0);

    const calculated: { id: string; start: Date; end: Date }[] = [];

    // 1. Set the anchor
    const anchorStart = new Date(baseDate);
    const anchorEnd = new Date(baseDate.getTime() + anchorEvent.durationMinutes * 60000);
    calculated[anchorIdx] = { id: anchorEvent.id, start: anchorStart, end: anchorEnd };

    // 2. Cascade backward
    for (let i = anchorIdx - 1; i >= 0; i--) {
      const e = events[i];
      const nextStart = calculated[i + 1].start;
      const end = new Date(nextStart.getTime() - e.gapAfterMinutes * 60000);
      const start = new Date(end.getTime() - e.durationMinutes * 60000);
      calculated[i] = { id: e.id, start, end };
    }

    // 3. Cascade forward
    for (let i = anchorIdx + 1; i < events.length; i++) {
      const prevE = events[i - 1];
      const prevEnd = calculated[i - 1].end;
      const start = new Date(prevEnd.getTime() + prevE.gapAfterMinutes * 60000);
      const end = new Date(start.getTime() + events[i].durationMinutes * 60000);
      calculated[i] = { id: events[i].id, start, end };
    }

    return calculated;
  }, [events]);

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <ToolLayout
      toolNum={64} category="🛠️ Business & Operations"
      title="Wedding Vendor" titleHighlight="Cascade Timeline"
      description="Stop updating 40 people in a group text when a delay happens. Lock one anchor event (like the Ceremony), and any changes will instantly recalculate everyone else's exact arrival and setup times downstream."
    >
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <SectionTitle>Event Sequence</SectionTitle>
              <button onClick={addEvent} className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                + Add Event
              </button>
            </div>

            <div className="space-y-4">
              {events.map((ev, idx) => (
                <div key={ev.id} className={`p-4 rounded-xl border-2 transition-colors ${ev.isAnchor ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">{idx + 1}</span>
                      <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-slate-700">
                        <input 
                          type="radio" 
                          checked={ev.isAnchor} 
                          onChange={() => setAnchor(ev.id)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                        />
                        Lock as Anchor
                      </label>
                    </div>
                    {events.length > 1 && (
                      <button onClick={() => removeEvent(ev.id)} className="text-slate-500 hover:text-red-500 font-bold px-2">✕</button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-5">
                      <FieldLabel htmlFor={`name-${ev.id}`}>Event Name</FieldLabel>
                      <TextInput id={`name-${ev.id}`} value={ev.name} onChange={(v) => updateEvent(ev.id, 'name', v)} />
                    </div>
                    
                    {ev.isAnchor ? (
                      <div className="sm:col-span-4">
                        <FieldLabel htmlFor={`time-${ev.id}`}>Locked Start Time</FieldLabel>
                        <input 
                          type="time" id={`time-${ev.id}`}
                          value={ev.anchorTime} 
                          onChange={(e) => updateEvent(ev.id, 'anchorTime', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-blue-400 bg-white text-blue-900 font-bold outline-none focus:border-blue-600"
                        />
                      </div>
                    ) : (
                      <div className="sm:col-span-4 opacity-50 bg-slate-100 rounded-xl px-3 py-2.5 border border-transparent text-sm flex items-center justify-center font-mono">
                        Auto-calculated
                      </div>
                    )}

                    <div className="sm:col-span-3">
                      <FieldLabel htmlFor={`dur-${ev.id}`}>Duration (m)</FieldLabel>
                      <NumInput id={`dur-${ev.id}`} value={ev.durationMinutes} onChange={(v) => updateEvent(ev.id, 'durationMinutes', v)} min={0} />
                    </div>
                  </div>

                  {idx < events.length - 1 && (
                    <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center gap-3">
                      <span className="text-sm text-slate-500">Wait gap before next event:</span>
                      <div className="w-24">
                        <NumInput id={`gap-${ev.id}`} value={ev.gapAfterMinutes} onChange={(v) => updateEvent(ev.id, 'gapAfterMinutes', v)} min={0} suffix="m" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-indigo-700 to-blue-800 px-6 py-6 rounded-t-2xl">
              <h3 className="text-white font-bold text-lg mb-1">Master Vendor Timeline</h3>
              <p className="text-indigo-200 text-sm">Print or share this live schedule.</p>
            </div>
            
            <div className="px-4 py-2 bg-white rounded-b-2xl max-h-[60vh] overflow-y-auto">
              <div className="relative border-l-2 border-slate-200 ml-4 py-4 space-y-6">
                {cascadeTimeline.map((calc, idx) => {
                  const ev = events[idx];
                  return (
                    <div key={calc.id} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${ev.isAnchor ? 'bg-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.3)]' : 'bg-slate-300'}`}></div>
                      <div className="flex justify-between items-start mb-1">
                        <p className={`font-bold ${ev.isAnchor ? 'text-blue-700' : 'text-slate-800'}`}>
                          {ev.name} {ev.isAnchor && "🔒"}
                        </p>
                      </div>
                      <div className="text-sm font-mono font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded inline-block border border-slate-200">
                        {formatTime(calc.start)} – {formatTime(calc.end)}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Duration: {ev.durationMinutes}m</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </ResultCard>
          <div className="text-center print:hidden">
            <button onClick={() => window.print()} className="bg-slate-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-105">
              Print Timeline
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
