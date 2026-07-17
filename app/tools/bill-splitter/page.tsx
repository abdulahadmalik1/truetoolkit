"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, AddButton, RemoveButton } from "@/components/ui";

interface Person { id: string; name: string; }
interface Item { id: string; name: string; price: number; assignees: string[]; }

export default function BillSplitter() {
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "Alice" }, { id: "2", name: "Bob" },
  ]);
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "Burger", price: 12, assignees: ["1"] },
    { id: "2", name: "Shared appetizer", price: 20, assignees: ["1", "2"] },
  ]);
  const [taxMode, setTaxMode] = useState<"amount" | "percent">("percent");
  const [taxValue, setTaxValue] = useState(10);
  const [tipMode, setTipMode] = useState<"amount" | "percent">("percent");
  const [tipValue, setTipValue] = useState(15);
  const [newName, setNewName] = useState("");

  const addPerson = () => {
    if (!newName.trim()) return;
    setPeople((p) => [...p, { id: Date.now().toString(), name: newName.trim() }]);
    setNewName("");
  };
  const removePerson = (id: string) => {
    setPeople((p) => p.filter((r) => r.id !== id));
    setItems((items) => items.map((item) => ({ ...item, assignees: item.assignees.filter((a) => a !== id) })));
  };
  const addItem = () => setItems((i) => [...i, { id: Date.now().toString(), name: "", price: 0, assignees: [] }]);
  const removeItem = (id: string) => setItems((i) => i.filter((r) => r.id !== id));
  const updateItem = (id: string, f: keyof Item, v: string | number | string[]) =>
    setItems((i) => i.map((r) => r.id === id ? { ...r, [f]: v } : r));
  const toggleAssignee = (itemId: string, personId: string) => {
    setItems((i) => i.map((r) => {
      if (r.id !== itemId) return r;
      const has = r.assignees.includes(personId);
      return { ...r, assignees: has ? r.assignees.filter((a) => a !== personId) : [...r.assignees, personId] };
    }));
  };

  const totals = useMemo(() => {
    const subtotals: Record<string, number> = {};
    people.forEach((p) => (subtotals[p.id] = 0));
    let grandSubtotal = 0;

    items.forEach((item) => {
      if (item.assignees.length === 0) return;
      const share = item.price / item.assignees.length;
      item.assignees.forEach((pid) => { subtotals[pid] = (subtotals[pid] || 0) + share; });
      grandSubtotal += item.price;
    });

    const taxTotal = taxMode === "percent" ? grandSubtotal * (taxValue / 100) : taxValue;
    const tipTotal = tipMode === "percent" ? grandSubtotal * (tipValue / 100) : tipValue;

    const finalTotals: Record<string, number> = {};
    people.forEach((p) => {
      const ratio = grandSubtotal > 0 ? subtotals[p.id] / grandSubtotal : 0;
      finalTotals[p.id] = subtotals[p.id] + taxTotal * ratio + tipTotal * ratio;
    });

    return { subtotals, finalTotals, grandSubtotal, taxTotal, tipTotal };
  }, [people, items, taxMode, taxValue, tipMode, tipValue]);

  const grandTotal = Object.values(totals.finalTotals).reduce((a, b) => a + b, 0);

  return (
    <ToolLayout toolNum={13} category="🛠️ Everyday Practical" title="Itemized Bill" titleHighlight="Splitter"
      description="Split by exactly what each person ordered — tax and tip split proportionally to each person's subtotal."
    >
      <div className="space-y-6">
        <Card>
          <SectionTitle>People</SectionTitle>
          <div className="flex flex-wrap gap-2 mb-3">
            {people.map((p) => (
              <span key={p.id} className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-700 text-sm px-3 py-1.5 rounded-full">
                {p.name}
                <button onClick={() => removePerson(p.id)} className="text-blue-400/60 hover:text-red-400 ml-0.5">✕</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Add person name"
              onKeyDown={(e) => e.key === "Enter" && addPerson()}
              className="flex-1 px-3 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500 min-h-[44px]" />
            <button onClick={addPerson} className="px-5 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 text-sm font-medium transition-all flex items-center justify-center">Add</button>
          </div>
        </Card>

        <Card>
          <SectionTitle>Items & Assignments</SectionTitle>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-300">
                <div className="flex flex-col sm:flex-row gap-2 mb-2 items-stretch sm:items-center">
                  <input value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} placeholder="Item name"
                    className="flex-1 px-3 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500 min-h-[44px]" />
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 sm:w-28">
                      <NumInput id={`p-${item.id}`} value={item.price} onChange={(v) => updateItem(item.id, "price", v)} prefix="$" min={0} step={0.01} />
                    </div>
                    <RemoveButton onClick={() => removeItem(item.id)} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {people.map((p) => (
                    <button key={p.id} onClick={() => toggleAssignee(item.id, p.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${item.assignees.includes(p.id) ? "bg-blue-600 border-blue-500 text-slate-900" : "bg-slate-200 border-slate-300 text-slate-600 hover:text-slate-900"}`}>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <AddButton onClick={addItem} label="Add item" />
          </div>
        </Card>

        <Card>
          <SectionTitle>Tax & Tip</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Tax", mode: taxMode, setMode: setTaxMode, value: taxValue, setValue: setTaxValue },
              { label: "Tip / Service", mode: tipMode, setMode: setTipMode, value: tipValue, setValue: setTipValue },
            ].map(({ label, mode, setMode, value, setValue }) => (
              <div key={label}>
                <div className="flex gap-2 mb-2">
                  <span className="text-sm text-slate-700">{label}:</span>
                  {(["percent", "amount"] as const).map((m) => (
                    <button key={m} onClick={() => setMode(m)}
                      className={`px-2 py-0.5 rounded text-xs border transition-all ${mode === m ? "bg-blue-600 border-blue-500 text-slate-900" : "bg-slate-100 border-slate-300 text-slate-600"}`}
                    >{m === "percent" ? "%" : "$"}</button>
                  ))}
                </div>
                <NumInput id={`${label}-val`} value={value} onChange={setValue} suffix={mode === "percent" ? "%" : "$"} min={0} step={0.5} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Each Person Owes</SectionTitle>
          <div className="space-y-2">
            {people.map((p) => (
              <div key={p.id} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                <div>
                  <span className="text-slate-900 font-medium">{p.name}</span>
                  <span className="text-slate-500 text-xs ml-2">subtotal: ${totals.subtotals[p.id]?.toFixed(2) ?? "0.00"}</span>
                </div>
                <span className="text-blue-400 font-bold text-lg tabular-nums">${totals.finalTotals[p.id]?.toFixed(2) ?? "0.00"}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-1">
              <span className="text-slate-600 text-sm">Grand Total (check)</span>
              <span className="text-slate-900 font-bold">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
}
