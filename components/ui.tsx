"use client";
import React from "react";

export function AdSlot({
  type,
  className = "",
}: {
  type: "banner" | "sidebar" | "content";
  className?: string;
}) {
  const styles = {
    banner: "w-full max-w-[728px] mx-auto min-h-[50px] sm:min-h-[90px] bg-slate-900/40 border border-slate-200/60 rounded-xl flex flex-col items-center justify-center text-[10px] text-slate-500 uppercase tracking-widest my-6",
    sidebar: "w-full max-w-[300px] mx-auto min-h-[250px] bg-slate-900/40 border border-slate-200/60 rounded-xl flex flex-col items-center justify-center text-[10px] text-slate-500 uppercase tracking-widest my-4",
    content: "w-full min-h-[100px] bg-slate-900/40 border border-slate-200/60 rounded-xl flex flex-col items-center justify-center text-[10px] text-slate-500 uppercase tracking-widest my-6",
  };

  return (
    <div className={`${styles[type]} ${className}`} aria-hidden="true">
      <span className="opacity-60 mb-0.5">Advertisement</span>
      <div className="text-[9px] opacity-40">Placeholder Slot</div>
    </div>
  );
}

export function ToolLayout({
  toolNum,
  category,
  title,
  titleHighlight,
  description,
  children,
}: {
  toolNum: number;
  category: string;
  title: string;
  titleHighlight?: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-lg font-bold text-slate-900 tracking-tight hover:text-blue-400 transition-colors h-11 flex items-center">
            HandyTools<span className="text-blue-400">Hub</span>
          </a>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-4 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            {title}{" "}
            {titleHighlight && (
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {titleHighlight}
              </span>
            )}
          </h1>
          <p className="text-slate-600 text-base max-w-2xl">{description}</p>
        </div>
        {children}
      </main>
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white shadow-sm border border-slate-200 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
      {children}
    </h2>
  );
}

export function FieldLabel({ htmlFor, children, hint }: { htmlFor?: string; children: React.ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-2">
      {children}
      {hint && <span className="ml-1.5 text-xs text-slate-500 font-normal">{hint}</span>}
    </label>
  );
}

export function TextInput({
  id, value, onChange, placeholder, prefix, suffix, type = "text",
}: {
  id: string; value: string | number; onChange: (v: string) => void;
  placeholder?: string; prefix?: string; suffix?: string; type?: string;
}) {
  return (
    <div className="flex min-w-0 h-12 rounded-xl overflow-hidden border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/40 transition-all shadow-sm">
      {prefix && <span className="flex items-center px-4 bg-slate-50 border-r border-slate-200 text-slate-500 text-sm select-none whitespace-nowrap">{prefix}</span>}
      <input
        id={id} type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-4 bg-transparent text-slate-900 text-sm outline-none min-w-0 h-full"
      />
      {suffix && <span className="flex items-center px-4 bg-slate-50 border-l border-slate-200 text-slate-500 text-sm select-none whitespace-nowrap">{suffix}</span>}
    </div>
  );
}

export function NumInput({
  id, value, onChange, min = 0, max, step = 1, prefix, suffix, placeholder,
}: {
  id: string; value: number | string; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; prefix?: string; suffix?: string; placeholder?: string;
}) {
  return (
    <div className="flex min-w-0 h-12 rounded-xl overflow-hidden border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/40 transition-all shadow-sm">
      {prefix && <span className="flex items-center px-4 bg-slate-50 border-r border-slate-200 text-slate-500 text-sm select-none whitespace-nowrap">{prefix}</span>}
      <input
        id={id} type="number" min={min} max={max} step={step} value={value} placeholder={placeholder}
        onChange={(e) => { const v = parseFloat(e.target.value); onChange(isNaN(v) ? 0 : v); }}
        className="flex-1 px-4 bg-transparent text-slate-900 text-sm outline-none min-w-0 h-full"
      />
      {suffix && <span className="flex items-center px-4 bg-slate-50 border-l border-slate-200 text-slate-500 text-sm select-none whitespace-nowrap">{suffix}</span>}
    </div>
  );
}

export function Select({
  id, value, onChange, options,
}: {
  id: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative h-12">
      <select
        id={id} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full h-full px-4 rounded-xl border border-slate-300 bg-white shadow-sm text-slate-900 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all appearance-none cursor-pointer"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
        ▼
      </div>
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none py-2.5">
      <button
        type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className="relative w-12 h-7 rounded-full transition-colors flex items-center px-1 bg-slate-200 border border-slate-300 focus:outline-none"
        style={{ backgroundColor: checked ? "#2563eb" : "#334155" }}
      >
        <span className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
}

export function Slider({
  id, value, onChange, min, max, step = 1, label, suffix = "",
}: {
  id: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; label: string; suffix?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-semibold text-blue-400 tabular-nums">{value}{suffix}</span>
      </div>
      <div className="h-11 flex items-center">
        <input
          id={id} type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full cursor-pointer"
          style={{ background: `linear-gradient(to right,#3b82f6 0%,#3b82f6 ${pct}%,#1e2540 ${pct}%,#1e2540 100%)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>{min}</span><span>{max}</span></div>
    </div>
  );
}

export function ResultCard({ children, gradient }: { children: React.ReactNode; gradient?: boolean }) {
  return (
    <div className={`rounded-2xl overflow-hidden border border-slate-300 shadow-xl shadow-black/30 ${gradient ? "bg-gradient-to-b from-white to-slate-50" : "bg-white"}`}>
      {children}
    </div>
  );
}

export function ResultHeadline({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-cyan-700 px-6 py-7 text-center">
      <p className="text-blue-100 text-sm font-medium mb-1">{label}</p>
      <p className="text-white text-4xl font-extrabold tabular-nums tracking-tight">{value}</p>
      {sub && <p className="text-blue-100 text-sm mt-1">{sub}</p>}
    </div>
  );
}

export function ResultRow({ label, value, highlight, sub }: { label: string; value: string | React.ReactNode; highlight?: boolean; sub?: string }) {
  return (
    <div className={`flex justify-between items-start py-3.5 border-b border-slate-200 last:border-0 ${highlight ? "bg-blue-50 -mx-4 px-4 rounded-lg" : ""}`}>
      <div>
        <span className="text-sm text-slate-600">{label}</span>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <span className={`text-sm font-semibold tabular-nums ${highlight ? "text-blue-700 text-base" : "text-slate-900"}`}>{value}</span>
    </div>
  );
}

export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-400 text-xs leading-relaxed">
      ⚠️ {children}
    </div>
  );
}

export function CopyButton({ getText }: { getText: () => string }) {
  const [done, setDone] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(getText()).then(() => { setDone(true); setTimeout(() => setDone(false), 2000); });
  };
  return (
    <button onClick={copy} className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 hover:text-slate-900 transition-all border border-slate-300 hover:border-slate-400 flex items-center justify-center">
      {done ? "✅ Copied!" : "📋 Copy result"}
    </button>
  );
}

export function AddButton({ onClick, label = "Add row" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors py-3 px-1">
      <span className="text-lg leading-none">+</span> {label}
    </button>
  );
}

export function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-slate-400 hover:text-red-400 transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Remove">
      ✕
    </button>
  );
}

export function SegmentedControl({
  value, onChange, options,
}: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div className="flex rounded-xl border border-slate-200 bg-slate-100/50 overflow-hidden p-1 gap-1 h-12">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={`flex-1 rounded-lg text-sm font-medium transition-all ${value === o.value ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-900"}`}
        >{o.label}</button>
      ))}
    </div>
  );
}

export function InfoBadge({ color, children }: { color: "green" | "red" | "yellow" | "blue"; children: React.ReactNode }) {
  const map = {
    green: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    red: "bg-red-500/10 border-red-500/30 text-red-400",
    yellow: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    blue: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  };
  return <div className={`p-4 rounded-xl border text-sm ${map[color]}`}>{children}</div>;
}

export function SeoContent({
  content,
  faqs,
  relatedTools
}: {
  content: string;
  faqs: { q: string, a: string }[];
  relatedTools: { slug: string, name: string }[];
}) {
  return (
    <div className="mt-16 border-t border-slate-200 pt-16">
      <div className="prose prose-slate prose-lg max-w-none text-slate-700">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      
      {faqs && faqs.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {relatedTools && relatedTools.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((t) => (
              <a
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col"
              >
                <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {t.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
