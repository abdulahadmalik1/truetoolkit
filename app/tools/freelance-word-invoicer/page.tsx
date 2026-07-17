"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, NumInput, ResultCard } from "@/components/ui";

export default function FreelanceWordInvoicer() {
  const [clientName, setClientName] = useState("");
  const [languagePair, setLanguagePair] = useState("English → Spanish");
  const [ratePerWord, setRatePerWord] = useState(0.12);
  const [rushFee, setRushFee] = useState(0);
  
  const [sourceText, setSourceText] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setSourceText(evt.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const invoiceData = useMemo(() => {
    // Exact word count math: split by whitespace, filter out empty strings and pure punctuation
    const words = sourceText
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0 && /[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF]/.test(w));
    
    const count = words.length;
    const baseAmount = count * ratePerWord;
    const surchargeAmount = baseAmount * (rushFee / 100);
    const total = baseAmount + surchargeAmount;

    return {
      count,
      baseAmount,
      surchargeAmount,
      total
    };
  }, [sourceText, ratePerWord, rushFee]);

  return (
    <ToolLayout
      toolNum={67} category="💰 Money & Freelance"
      title="Word-Count" titleHighlight="Auto-Invoicer"
      description="Stop doing manual word-count math. Paste your translation text or upload a file. We'll count the exact words deterministically and generate a ready-to-print invoice based on your per-word rate."
    >
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-6 min-w-0">
          <Card>
            <SectionTitle>Invoice & Rate Settings</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="clientName">Client Name / Project Ref</FieldLabel>
                <TextInput id="clientName" value={clientName} onChange={setClientName} placeholder="e.g. Acme Corp - Annual Report" />
              </div>
              <div>
                <FieldLabel htmlFor="lang">Language Pair</FieldLabel>
                <TextInput id="lang" value={languagePair} onChange={setLanguagePair} />
              </div>
              <div className="flex gap-3 min-w-0">
                <div className="flex-1 min-w-0">
                  <FieldLabel htmlFor="rate">Rate per Word ($)</FieldLabel>
                  <NumInput id="rate" value={ratePerWord} onChange={setRatePerWord} min={0.01} step={0.01} />
                </div>
                <div className="w-24 shrink-0">
                  <FieldLabel htmlFor="rush">Rush Fee (%)</FieldLabel>
                  <NumInput id="rush" value={rushFee} onChange={setRushFee} min={0} step={1} />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <SectionTitle>Source Text</SectionTitle>
              <label className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer shrink-0">
                Upload .txt file
                <input type="file" accept=".txt,.md" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            
            <textarea 
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Paste the translated text here..."
              className="w-full h-64 px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500 resize-none font-mono"
            />
          </Card>
        </div>

        <div className="sticky top-24 space-y-4 min-w-0">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-8 text-center h-full">
              <p className="text-slate-400 text-sm font-medium mb-1">Total Invoice Amount</p>
              <p className="text-white text-5xl font-black tabular-nums tracking-tight">
                ${invoiceData.total.toFixed(2)}
              </p>
              <p className="text-slate-400 text-sm mt-2 font-semibold">Exact count: {invoiceData.count.toLocaleString()} words</p>
            </div>
          </ResultCard>

          {/* Printable Invoice Block */}
          <div className="bg-white border-2 border-black p-6 shadow-xl print:shadow-none print:border-0 print:p-0 font-sans">
            <h1 className="text-3xl font-black mb-1 uppercase">Invoice</h1>
            <p className="text-sm text-slate-600 font-bold mb-6">Date: {new Date().toLocaleDateString()}</p>
            
            <div className="mb-6 pb-6 border-b-2 border-black">
              <p className="text-xs uppercase text-slate-500 font-bold mb-1">Billed To</p>
              <p className="text-lg font-bold">{clientName || "Unnamed Client"}</p>
              <p className="text-sm">{languagePair}</p>
            </div>

            <table className="w-full text-left text-sm mb-6">
              <thead>
                <tr className="border-b border-black">
                  <th className="pb-2 font-bold uppercase text-xs">Description</th>
                  <th className="pb-2 font-bold uppercase text-xs text-right">Words</th>
                  <th className="pb-2 font-bold uppercase text-xs text-right">Rate</th>
                  <th className="pb-2 font-bold uppercase text-xs text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-3">Translation ({languagePair})</td>
                  <td className="py-3 text-right font-mono">{invoiceData.count.toLocaleString()}</td>
                  <td className="py-3 text-right font-mono">${ratePerWord.toFixed(3)}</td>
                  <td className="py-3 text-right font-mono font-bold">${invoiceData.baseAmount.toFixed(2)}</td>
                </tr>
                {rushFee > 0 && (
                  <tr className="border-b border-slate-200">
                    <td className="py-3 text-amber-700">Rush Surcharge ({rushFee}%)</td>
                    <td className="py-3 text-right">—</td>
                    <td className="py-3 text-right">—</td>
                    <td className="py-3 text-right font-mono font-bold text-amber-700">${invoiceData.surchargeAmount.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-between items-end pt-2">
              <p className="text-xs text-slate-500 max-w-[200px]">Word counts calculated deterministically excluding pure punctuation tokens.</p>
              <div className="text-right">
                <p className="text-xs uppercase font-bold text-slate-500 mb-1">Total Due</p>
                <p className="text-3xl font-black">${invoiceData.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="text-center print:hidden mt-4">
            <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-105">
              Print / Save PDF Invoice
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
