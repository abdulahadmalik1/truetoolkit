"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, NumInput, Select, ResultCard, ResultRow } from "@/components/ui";

type LogEntry = {
  id: string;
  date: string;
  desc: string;
  type: "Initial Work" | "Revision";
  hours: number;
  revisionRound: number; // 0 if Initial Work, 1+ if Revision
};

export default function ScopeCreepLedger() {
  const [sowHours, setSowHours] = useState(40);
  const [sowRevisions, setSowRevisions] = useState(2);
  const [hourlyRate, setHourlyRate] = useState(75);

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "1", date: new Date().toISOString().split("T")[0], desc: "Homepage Design (V1)", type: "Initial Work", hours: 15, revisionRound: 0 },
    { id: "2", date: new Date().toISOString().split("T")[0], desc: "About Page Design", type: "Initial Work", hours: 26, revisionRound: 0 },
    { id: "3", date: new Date().toISOString().split("T")[0], desc: "Client Feedback - Round 1", type: "Revision", hours: 4, revisionRound: 1 },
    { id: "4", date: new Date().toISOString().split("T")[0], desc: "Client Feedback - Round 2", type: "Revision", hours: 3, revisionRound: 2 },
    { id: "5", date: new Date().toISOString().split("T")[0], desc: "Client Feedback - Round 3 (Unplanned)", type: "Revision", hours: 5, revisionRound: 3 },
  ]);

  const addLog = () => setLogs([...logs, { id: Math.random().toString(), date: new Date().toISOString().split("T")[0], desc: "", type: "Initial Work", hours: 1, revisionRound: 0 }]);
  const updateLog = (id: string, key: keyof LogEntry, val: any) => setLogs(logs.map(l => l.id === id ? { ...l, [key]: val } : l));
  const removeLog = (id: string) => setLogs(logs.filter(l => l.id !== id));

  const math = useMemo(() => {
    let initialHours = 0;
    let revisionHours = 0;
    let maxRoundSeen = 0;
    let overageRevisionHours = 0;

    logs.forEach(log => {
      const h = Number(log.hours) || 0;
      if (log.type === "Initial Work") {
        initialHours += h;
      } else {
        revisionHours += h;
        if (log.revisionRound > maxRoundSeen) maxRoundSeen = log.revisionRound;
        if (log.revisionRound > sowRevisions) {
          overageRevisionHours += h;
        }
      }
    });

    const baseOverageHours = Math.max(0, initialHours - sowHours);
    const totalOverageHours = baseOverageHours + overageRevisionHours;
    const overageRounds = Math.max(0, maxRoundSeen - sowRevisions);
    
    const unbilledValue = totalOverageHours * hourlyRate;

    return {
      initialHours,
      revisionHours,
      baseOverageHours,
      overageRounds,
      overageRevisionHours,
      totalOverageHours,
      unbilledValue
    };
  }, [logs, sowHours, sowRevisions, hourlyRate]);

  return (
    <ToolLayout
      toolNum={68} category="💰 Money & Freelance"
      title="Scope-Creep" titleHighlight="Ledger"
      description="Stop working for free. Log your actual hours and revision rounds against the signed SOW, and instantly see the exact mathematical dollar value of your client's scope creep."
    >
      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Signed SOW Limits</SectionTitle>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <FieldLabel htmlFor="sowH">Allocated Base Hours</FieldLabel>
                <NumInput id="sowH" value={sowHours} onChange={setSowHours} min={1} />
              </div>
              <div>
                <FieldLabel htmlFor="sowR">Included Revisions</FieldLabel>
                <NumInput id="sowR" value={sowRevisions} onChange={setSowRevisions} min={0} />
              </div>
              <div>
                <FieldLabel htmlFor="rate">Overage Rate ($/hr)</FieldLabel>
                <NumInput id="rate" value={hourlyRate} onChange={setHourlyRate} min={0} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <SectionTitle>Actual Work Log</SectionTitle>
              <button onClick={addLog} className="text-sm font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors">
                + Add Time Entry
              </button>
            </div>
            
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="grid grid-cols-12 gap-2 items-end p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="col-span-3">
                    <FieldLabel htmlFor={`date-${log.id}`}>Date</FieldLabel>
                    <input 
                      type="date" id={`date-${log.id}`} 
                      value={log.date} 
                      onChange={(e) => updateLog(log.id, 'date', e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div className="col-span-4">
                    <FieldLabel htmlFor={`desc-${log.id}`}>Task Description</FieldLabel>
                    <TextInput id={`desc-${log.id}`} value={log.desc} onChange={(v) => updateLog(log.id, 'desc', v)} />
                  </div>
                  <div className="col-span-3">
                    <FieldLabel htmlFor={`type-${log.id}`}>Type</FieldLabel>
                    <Select id={`type-${log.id}`} value={log.type} onChange={(v) => {
                      updateLog(log.id, 'type', v);
                      if (v === 'Initial Work') updateLog(log.id, 'revisionRound', 0);
                      else if (log.revisionRound === 0) updateLog(log.id, 'revisionRound', 1);
                    }} options={[
                      { value: "Initial Work", label: "Initial Work" },
                      { value: "Revision", label: "Revision" }
                    ]} />
                  </div>
                  <div className="col-span-2 relative">
                    <FieldLabel htmlFor={`h-${log.id}`}>Hours</FieldLabel>
                    <NumInput id={`h-${log.id}`} value={log.hours} onChange={(v) => updateLog(log.id, 'hours', v)} min={0.25} step={0.25} />
                    
                    {logs.length > 1 && (
                      <button onClick={() => removeLog(log.id)} className="absolute -right-1 -top-6 text-slate-500 hover:text-red-500 text-lg font-bold px-1">
                        ✕
                      </button>
                    )}
                  </div>

                  {log.type === "Revision" && (
                    <div className="col-span-12 mt-2 pt-2 border-t border-slate-200 flex items-center gap-3">
                      <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Which Revision Round is this?</span>
                      <div className="w-24">
                        <NumInput id={`r-${log.id}`} value={log.revisionRound} onChange={(v) => updateLog(log.id, 'revisionRound', v)} min={1} step={1} />
                      </div>
                      {log.revisionRound > sowRevisions && (
                        <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded font-bold ml-auto">⚠️ Out of Scope</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className={`bg-gradient-to-br px-6 py-8 text-center rounded-t-2xl ${math.unbilledValue > 0 ? 'from-rose-700 to-red-800' : 'from-slate-700 to-slate-800'}`}>
              <p className="text-white/80 text-sm font-medium mb-1">Unbilled Scope Creep Value</p>
              <p className="text-white text-5xl font-black tabular-nums tracking-tight">
                ${math.unbilledValue.toFixed(2)}
              </p>
              <p className="text-white/80 text-sm mt-2 font-semibold">{math.totalOverageHours} hours over budget</p>
            </div>
            <div className="px-4 py-4 space-y-2 bg-white rounded-b-2xl">
              <ResultRow label="SOW Base Hours Used" value={`${math.initialHours} / ${sowHours} hrs`} />
              {math.baseOverageHours > 0 && (
                <ResultRow label="Base Scope Overage" value={<span className="text-rose-600 font-bold">+{math.baseOverageHours} hrs</span>} />
              )}
              
              <div className="border-t border-slate-100 my-2 pt-2"></div>
              
              <ResultRow label="Extra Revision Rounds" value={math.overageRounds > 0 ? <span className="text-rose-600 font-bold">{math.overageRounds} rounds</span> : "0 rounds"} />
              {math.overageRevisionHours > 0 && (
                <ResultRow label="Revision Scope Overage" value={<span className="text-rose-600 font-bold">+{math.overageRevisionHours} hrs</span>} />
              )}
            </div>
          </ResultCard>

          {math.unbilledValue > 0 && (
             <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-800 leading-relaxed">
               <strong>Stop!</strong> Your client has exceeded the signed SOW by <strong>{math.totalOverageHours} hours</strong>. You are effectively working for free. Send them this report and ask for a change order before doing any more work.
             </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
