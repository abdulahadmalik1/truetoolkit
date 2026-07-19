"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, NumInput, ResultCard, ResultRow } from "@/components/ui";

type Med = { id: string; name: string; fillDate: string; daysSupply: number };

export default function PrescriptionRefillSync() {
  const [meds, setMeds] = useState<Med[]>([
    { id: "1", name: "Lisinopril", fillDate: new Date().toISOString().split("T")[0], daysSupply: 30 },
    { id: "2", name: "Atorvastatin", fillDate: new Date(Date.now() - 5*24*60*60*1000).toISOString().split("T")[0], daysSupply: 30 },
  ]);

  const addMed = () => setMeds([...meds, { id: Math.random().toString(), name: "", fillDate: new Date().toISOString().split("T")[0], daysSupply: 30 }]);
  const removeMed = (id: string) => setMeds(meds.filter(m => m.id !== id));
  
  const updateMed = (id: string, field: keyof Med, value: string | number) => {
    setMeds(meds.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const syncPlan = useMemo(() => {
    if (meds.length === 0) return null;

    const parsedMeds = meds.map(m => {
      const fill = new Date(m.fillDate);
      const runOut = new Date(fill.getTime() + m.daysSupply * 24 * 60 * 60 * 1000);
      return { ...m, runOut };
    });

    const validMeds = parsedMeds.filter(m => !isNaN(m.runOut.getTime()));
    if (validMeds.length === 0) return null;

    // Find the one that runs out first
    validMeds.sort((a, b) => a.runOut.getTime() - b.runOut.getTime());
    const earliestMed = validMeds[0];

    // Best trip date is 3 days before the earliest med runs out
    const optimalTripDate = new Date(earliestMed.runOut.getTime() - 3 * 24 * 60 * 60 * 1000);

    const analyzedMeds = validMeds.map(m => {
      const daysUntilRunOutFromTrip = (m.runOut.getTime() - optimalTripDate.getTime()) / (1000 * 60 * 60 * 24);
      let status = "Syncable";
      if (daysUntilRunOutFromTrip <= 3) status = "Urgent";
      else if (daysUntilRunOutFromTrip > 14) status = "Too Early (Wait)";
      
      return { ...m, daysUntilRunOutFromTrip, status };
    });

    return { optimalTripDate, analyzedMeds };
  }, [meds]);

  return (
    <ToolLayout
      toolNum={61} category="🛠️ Everyday Practical"
      title="Multi-Prescription" titleHighlight="Refill Sync"
      description="Stop making five separate pharmacy trips. We compute exact supply days across all your medications and find the single best overlap day to request all refills together."
    >
      <div className="grid md:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>Your Medications</SectionTitle>
              <button onClick={addMed} className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">
                + Add Med
              </button>
            </div>
            
            <div className="space-y-4">
              {meds.map((med, idx) => (
                <div key={med.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                  {meds.length > 1 && (
                    <button onClick={() => removeMed(med.id)} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-slate-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                      ✕
                    </button>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <FieldLabel htmlFor={`name-${med.id}`}>Medication Name</FieldLabel>
                      <TextInput id={`name-${med.id}`} value={med.name} onChange={(val) => updateMed(med.id, 'name', val)} placeholder="e.g. Lisinopril 10mg" />
                    </div>
                    <div>
                      <FieldLabel htmlFor={`fill-${med.id}`}>Last Fill Date</FieldLabel>
                      <input 
                        type="date" id={`fill-${med.id}`}
                        value={med.fillDate} 
                        onChange={(e) => updateMed(med.id, 'fillDate', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor={`days-${med.id}`}>Days Supply</FieldLabel>
                      <NumInput id={`days-${med.id}`} value={med.daysSupply} onChange={(val) => updateMed(med.id, 'daysSupply', val)} min={1} step={1} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 px-6 py-7 text-center rounded-t-2xl">
              <p className="text-blue-200 text-sm font-medium mb-1">Optimal Single Pharmacy Trip</p>
              <p className="text-white text-2xl md:text-3xl font-extrabold tabular-nums">
                {syncPlan ? syncPlan.optimalTripDate.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" }) : "—"}
              </p>
              <p className="text-blue-200 text-sm mt-2">
                (3 days before your first med runs out)
              </p>
            </div>
            
            <div className="px-4 py-4 space-y-3 bg-white rounded-b-2xl">
              {syncPlan?.analyzedMeds.map(m => (
                <div key={m.id} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-slate-800">{m.name || "Unnamed Med"}</p>
                    <p className="text-xs text-slate-500">Runs out: {m.runOut.toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    m.status === "Urgent" ? "bg-red-100 text-red-700" :
                    m.status === "Syncable" ? "bg-emerald-100 text-emerald-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
