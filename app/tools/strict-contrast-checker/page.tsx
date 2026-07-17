"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, ResultCard } from "@/components/ui";

function hexToRgb(hex: string) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  if (c.length !== 6) throw new Error("Invalid hex");
  const num = parseInt(c, 16);
  if (isNaN(num)) throw new Error("Invalid hex");
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(hex1: string, hex2: string) {
  try {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const lightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (lightest + 0.05) / (darkest + 0.05);
  } catch {
    return null;
  }
}

export default function StrictContrastChecker() {
  const [fg, setFg] = useState("#FFFFFF");
  const [bg, setBg] = useState("#3B82F6");

  const ratio = useMemo(() => getContrast(fg, bg), [fg, bg]);

  const passes = useMemo(() => {
    if (ratio === null) return null;
    return {
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3.0,
      aaaNormal: ratio >= 7.0,
      aaaLarge: ratio >= 4.5
    };
  }, [ratio]);

  const renderStatus = (pass: boolean) => {
    return pass ? (
      <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">Pass</span>
    ) : (
      <span className="bg-rose-100 text-rose-800 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">Fail</span>
    );
  };

  return (
    <ToolLayout
      toolNum={78} category="🛠️ Developer Tools"
      title="Strict WCAG" titleHighlight="Contrast Math"
      description="Don't just guess if a color 'looks okay'. Calculate the exact WCAG 2.1 Relative Luminance ratio to ensure strict accessibility compliance before shipping."
    >
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Color Inputs</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <FieldLabel htmlFor="fg">Foreground (Text) Hex</FieldLabel>
                <div className="flex gap-2">
                  <div className="w-12 h-[42px] rounded border border-slate-300 shadow-inner shrink-0" style={{ backgroundColor: fg }}></div>
                  <TextInput id="fg" value={fg} onChange={setFg} placeholder="#FFFFFF" />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="bg">Background Hex</FieldLabel>
                <div className="flex gap-2">
                  <div className="w-12 h-[42px] rounded border border-slate-300 shadow-inner shrink-0" style={{ backgroundColor: bg }}></div>
                  <TextInput id="bg" value={bg} onChange={setBg} placeholder="#000000" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Live Preview Simulator</SectionTitle>
            <div 
              className="p-8 rounded-xl border border-slate-200 mt-4 transition-colors"
              style={{ backgroundColor: bg, color: fg }}
            >
              <h2 className="text-3xl font-bold mb-4">Large Text Preview</h2>
              <p className="text-base leading-relaxed">
                This is normal text (typically 14px or 16px). You must ensure it passes the stricter 4.5:1 ratio for AA compliance. Large text (above) only needs a 3.0:1 ratio.
              </p>
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className={`bg-gradient-to-br px-6 py-8 text-center rounded-t-2xl ${
              ratio === null ? 'from-slate-700 to-slate-800' :
              ratio >= 4.5 ? 'from-emerald-600 to-green-700' : 
              ratio >= 3.0 ? 'from-amber-500 to-orange-600' : 
              'from-rose-700 to-red-800'
            }`}>
              <p className="text-white/80 text-sm font-medium mb-1">Contrast Ratio</p>
              <p className="text-white text-6xl font-black tabular-nums tracking-tight">
                {ratio !== null ? `${ratio.toFixed(2)}` : "ERR"}
              </p>
            </div>
            
            <div className="px-4 py-6 bg-white rounded-b-2xl space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">AA Level (Standard)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">Normal Text (4.5:1)</span>
                    {passes && renderStatus(passes.aaNormal)}
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">Large Text (3.0:1)</span>
                    {passes && renderStatus(passes.aaLarge)}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">AAA Level (Strict)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">Normal Text (7.0:1)</span>
                    {passes && renderStatus(passes.aaaNormal)}
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">Large Text (4.5:1)</span>
                    {passes && renderStatus(passes.aaaLarge)}
                  </div>
                </div>
              </div>
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
