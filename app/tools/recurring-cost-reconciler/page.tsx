"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, NumInput, Select, ResultCard, ResultRow } from "@/components/ui";

type LogEntry = { id: string; date: string; memberId: string; amount: number };

export default function RecurringCostReconciler() {
  const [subName, setSubName] = useState("Spotify Family Plan");
  const [cycleCost, setCycleCost] = useState(16.99);
  const [cycleType, setCycleType] = useState("Monthly");
  
  // Set start date to exactly 5 months ago for a good default demo
  const defaultStart = new Date();
  defaultStart.setMonth(defaultStart.getMonth() - 5);
  const [startDate, setStartDate] = useState(defaultStart.toISOString().split("T")[0]);

  const [members, setMembers] = useState(["Alice (Me)", "Bob", "Charlie", "David"]);
  const [newMember, setNewMember] = useState("");

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "1", date: defaultStart.toISOString().split("T")[0], memberId: "Alice (Me)", amount: 16.99 },
    { id: "2", date: defaultStart.toISOString().split("T")[0], memberId: "Bob", amount: 16.99 },
    { id: "3", date: defaultStart.toISOString().split("T")[0], memberId: "Charlie", amount: 50.00 }, // paid ahead
    // David hasn't paid anything
  ]);

  const addMember = () => {
    if (newMember.trim() && !members.includes(newMember.trim())) {
      setMembers([...members, newMember.trim()]);
      setNewMember("");
    }
  };

  const removeMember = (m: string) => {
    setMembers(members.filter(x => x !== m));
    setLogs(logs.filter(l => l.memberId !== m));
  };

  const addLog = () => setLogs([...logs, { id: Math.random().toString(), date: new Date().toISOString().split("T")[0], memberId: members[0], amount: 10 }]);
  const updateLog = (id: string, key: keyof LogEntry, val: any) => setLogs(logs.map(l => l.id === id ? { ...l, [key]: val } : l));
  const removeLog = (id: string) => setLogs(logs.filter(l => l.id !== id));

  const math = useMemo(() => {
    if (members.length === 0) return null;

    // Calculate elapsed cycles
    const start = new Date(startDate);
    const today = new Date();
    let elapsedCycles = 0;

    if (cycleType === "Monthly") {
      elapsedCycles = (today.getFullYear() - start.getFullYear()) * 12 + (today.getMonth() - start.getMonth()) + 1; // +1 to include the current active cycle
    } else if (cycleType === "Weekly") {
      elapsedCycles = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
    } else {
      elapsedCycles = (today.getFullYear() - start.getFullYear()) + 1;
    }

    if (elapsedCycles < 1) elapsedCycles = 1;

    const totalGroupCost = elapsedCycles * cycleCost;
    const perPersonExpected = totalGroupCost / members.length;
    const costPerPersonPerCycle = cycleCost / members.length;

    const balances = members.map(m => {
      const totalPaid = logs.filter(l => l.memberId === m).reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
      const balance = totalPaid - perPersonExpected; // Negative means they owe
      const cyclesBehind = balance < 0 ? Math.ceil(Math.abs(balance) / costPerPersonPerCycle) : 0;
      
      return { member: m, totalPaid, balance, cyclesBehind };
    });

    // Sort by balance (who owes most first)
    balances.sort((a, b) => a.balance - b.balance);

    return { elapsedCycles, perPersonExpected, costPerPersonPerCycle, balances };
  }, [startDate, cycleCost, cycleType, members, logs]);

  return (
    <ToolLayout
      toolNum={69} category="📱 Content & Social"
      title="Recurring-Cost" titleHighlight="Reconciler"
      description="Splitwise is for one-off dinners. This is for infinite group subscriptions and fantasy leagues. It computes exactly how many cycles have passed and mathematically flags who is silently riding on the group's dime."
    >
      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Subscription Details</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="subName">Group Fund / Subscription Name</FieldLabel>
                <TextInput id="subName" value={subName} onChange={setSubName} />
              </div>
              <div>
                <FieldLabel htmlFor="start">Start Date</FieldLabel>
                <input 
                  type="date" id="start" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-blue-500" 
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <FieldLabel htmlFor="cost">Total Cost</FieldLabel>
                  <NumInput id="cost" value={cycleCost} onChange={setCycleCost} min={0} step={0.01} />
                </div>
                <div className="w-28">
                  <FieldLabel htmlFor="cycle">Per</FieldLabel>
                  <Select id="cycle" value={cycleType} onChange={setCycleType} options={[
                    {value: "Weekly", label: "Week"},
                    {value: "Monthly", label: "Month"},
                    {value: "Yearly", label: "Year"}
                  ]} />
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <FieldLabel>Group Members</FieldLabel>
              <div className="flex flex-wrap gap-2 mb-3">
                {members.map(m => (
                  <span key={m} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-700">
                    {m}
                    {members.length > 1 && (
                      <button onClick={() => removeMember(m)} className="text-slate-500 hover:text-red-500 ml-1 font-bold">✕</button>
                    )}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-sm">
                <TextInput id="newMem" value={newMember} onChange={setNewMember} placeholder="New member name..." />
                <button onClick={addMember} className="px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">Add</button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <SectionTitle>Payment Ledger</SectionTitle>
              <button onClick={addLog} className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
                + Log Payment
              </button>
            </div>
            
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2 items-end p-3 bg-slate-50 border border-slate-200 rounded-xl relative group">
                  <div className="w-[110px]">
                    <FieldLabel htmlFor={`d-${log.id}`}>Date</FieldLabel>
                    <input 
                      type="date" id={`d-${log.id}`} 
                      value={log.date} 
                      onChange={(e) => updateLog(log.id, 'date', e.target.value)}
                      className="w-full px-2 py-2.5 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div className="flex-1">
                    <FieldLabel htmlFor={`m-${log.id}`}>Who Paid?</FieldLabel>
                    <Select id={`m-${log.id}`} value={log.memberId} onChange={(v) => updateLog(log.id, 'memberId', v)} options={members.map(m => ({value: m, label: m}))} />
                  </div>
                  <div className="w-28">
                    <FieldLabel htmlFor={`a-${log.id}`}>Amount ($)</FieldLabel>
                    <NumInput id={`a-${log.id}`} value={log.amount} onChange={(v) => updateLog(log.id, 'amount', v)} min={0} step={0.01} />
                  </div>
                  <button onClick={() => removeLog(log.id)} className="w-10 h-[42px] mb-[2px] flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-red-500 rounded-xl transition-colors">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-indigo-800 to-purple-900 px-6 py-6 text-center rounded-t-2xl">
              <h3 className="text-white font-bold text-lg mb-1">{subName}</h3>
              <p className="text-indigo-200 text-sm">
                Active for <strong>{math?.elapsedCycles} {cycleType.toLowerCase()} cycles</strong>
              </p>
              <div className="mt-3 inline-block bg-white/10 rounded-lg px-4 py-2 border border-white/20">
                <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider mb-0.5">Fair Share To Date</p>
                <p className="text-xl font-black text-white">${math?.perPersonExpected.toFixed(2)} / person</p>
              </div>
            </div>
            
            <div className="px-4 py-4 space-y-3 bg-white rounded-b-2xl">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Member Balances</h4>
              
              {math?.balances.map(b => (
                <div key={b.member} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div>
                    <p className="font-bold text-slate-800">{b.member}</p>
                    <p className="text-xs text-slate-500">Paid so far: ${b.totalPaid.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    {b.balance < 0 ? (
                      <>
                        <p className="text-rose-600 font-black">Owes ${Math.abs(b.balance).toFixed(2)}</p>
                        <p className="text-[10px] uppercase font-bold text-rose-400 mt-0.5 tracking-wide">{b.cyclesBehind} cycle{b.cyclesBehind===1?'':'s'} behind</p>
                      </>
                    ) : (
                      <>
                        <p className="text-emerald-600 font-black">Ahead +${b.balance.toFixed(2)}</p>
                        <p className="text-[10px] uppercase font-bold text-emerald-400 mt-0.5 tracking-wide">Paid up</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ResultCard>
          
          <div className="text-center">
            <button onClick={() => {
              const oweText = math?.balances.filter(b => b.balance < 0).map(b => `${b.member} owes $${Math.abs(b.balance).toFixed(2)}`).join("\n");
              alert(`Clipboard Copy (Simulation):\n\n${subName} Update:\n${oweText}\n\nPlease catch up!`);
            }} className="text-sm font-semibold text-blue-600 hover:underline">
              Copy Overage Report to Clipboard
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
