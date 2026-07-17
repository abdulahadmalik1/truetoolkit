"use client";
import { useState, useEffect, useRef } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, Disclaimer } from "@/components/ui";

export default function LifeInWeeks() {
  const [birthdate, setBirthdate] = useState("1996-01-01");
  const [lifeExpectancy, setLifeExpectancy] = useState(80);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const today = new Date();
  const birth = new Date(birthdate);
  const totalWeeks = Math.floor(lifeExpectancy * 52.18);
  const weeksLived = Math.floor((today.getTime() - birth.getTime()) / (7 * 24 * 60 * 60 * 1000));
  const weeksRemaining = Math.max(0, totalWeeks - weeksLived);
  const pctLived = Math.min(100, (weeksLived / totalWeeks) * 100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cols = 52;
    const rows = Math.ceil(totalWeeks / cols);
    const cell = 8;
    const gap = 2;
    const W = cols * (cell + gap);
    const H = rows * (cell + gap);
    canvas.width = W;
    canvas.height = H;

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < totalWeeks; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * (cell + gap);
      const y = row * (cell + gap);

      // Decade markers
      const decadeWeek = Math.floor(i / (52 * 10)) * (52 * 10);
      const isDecade = i === decadeWeek && i > 0;

      if (i < weeksLived) {
        ctx.fillStyle = i === weeksLived - 1 ? "#f97316" : "#3b82f6";
      } else {
        ctx.fillStyle = "#1e2540";
      }
      ctx.beginPath();
      ctx.roundRect(x, y, cell, cell, 1.5);
      ctx.fill();
    }
  }, [birthdate, lifeExpectancy, weeksLived, totalWeeks]);

  return (
    <ToolLayout toolNum={12} category="⏱️ Time & Remote Work" title="Life in Weeks" titleHighlight="Visualizer"
      description="A visual grid of every week of your life — lived and remaining. A motivational perspective on time."
    >
      <div className="space-y-6">


        <div className="grid md:grid-cols-2 gap-5">
          <Card>
            <SectionTitle>Your Details</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="bd">Birthdate</FieldLabel>
                <input id="bd" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <FieldLabel htmlFor="le" hint="planning assumption only — not a prediction">Life Expectancy</FieldLabel>
                <NumInput id="le" value={lifeExpectancy} onChange={setLifeExpectancy} suffix="years" min={1} max={120} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Your Numbers</SectionTitle>
            <div className="space-y-3">
              {[
                { label: "Weeks lived", value: weeksLived.toLocaleString(), color: "text-blue-400" },
                { label: "Weeks remaining", value: weeksRemaining.toLocaleString(), color: "text-slate-700" },
                { label: "Total weeks", value: totalWeeks.toLocaleString(), color: "text-slate-600" },
                { label: "Life lived", value: `${pctLived.toFixed(1)}%`, color: "text-orange-400" },
              ].map((r) => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-sm text-slate-600">{r.label}</span>
                  <span className={`text-sm font-bold tabular-nums ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full" style={{ width: `${pctLived}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-1.5 text-right">🟠 = current week</p>
            </div>
          </Card>
        </div>

        <Card>
          <SectionTitle>Your Life Grid (each cell = 1 week, 🔵 = lived, 🔵 orange = now, ◻ = remaining)</SectionTitle>
          <div className="overflow-x-auto">
            <canvas ref={canvasRef} className="block" style={{ maxWidth: "100%", imageRendering: "pixelated" }} />
          </div>
        </Card>


      </div>
    </ToolLayout>
  );
}
