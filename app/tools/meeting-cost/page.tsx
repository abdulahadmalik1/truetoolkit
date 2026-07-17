"use client";
import { useState, useRef, useCallback } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, Select, Toggle, ResultCard, ResultRow, Disclaimer, SeoContent } from "@/components/ui";

function calcMeeting(attendees: number, salary: number, isHourly: boolean, durationMin: number) {
  const hourlyRate = isHourly ? salary : salary / (52 * 40);
  const cost = attendees * hourlyRate * (durationMin / 60);
  const weeklyAnnual = cost * 52;
  const monthlyAnnual = cost * 12;
  return { cost, hourlyRate, weeklyAnnual, monthlyAnnual };
}

export default function MeetingCost() {
  const [attendees, setAttendees] = useState(8);
  const [salary, setSalary] = useState(75000);
  const [isHourly, setIsHourly] = useState(false);
  const [duration, setDuration] = useState(60);
  const [recurrence, setRecurrence] = useState("none");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloaded, setDownloaded] = useState(false);

  const r = calcMeeting(attendees, salary, isHourly, duration);

  const generateCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 800; canvas.height = 420;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 800, 420);
    grad.addColorStop(0, "#0f172a"); grad.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 800, 420);

    // Border
    ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 798, 418);

    // Logo
    ctx.font = "bold 18px sans-serif"; ctx.fillStyle = "#94a3b8";
    ctx.fillText("TrueToolkit.com", 40, 45);

    // Title
    ctx.font = "bold 26px sans-serif"; ctx.fillStyle = "#f1f5f9";
    ctx.fillText("Meeting Cost Calculator", 40, 90);

    // Big number
    ctx.font = "bold 80px sans-serif"; ctx.fillStyle = "#3b82f6";
    ctx.fillText(`$${r.cost.toFixed(2)}`, 40, 210);

    // Details
    ctx.font = "20px sans-serif"; ctx.fillStyle = "#94a3b8";
    ctx.fillText(`${attendees} attendees × ${duration} min @ $${r.hourlyRate.toFixed(0)}/hr`, 40, 260);

    if (recurrence === "weekly") {
      ctx.font = "18px sans-serif"; ctx.fillStyle = "#60a5fa";
      ctx.fillText(`If weekly: $${r.weeklyAnnual.toFixed(0)}/year`, 40, 300);
    }

    // Footer
    ctx.font = "14px sans-serif"; ctx.fillStyle = "#475569";
    ctx.fillText("Generated at TrueToolkit.com — free calculator tools", 40, 390);
  }, [attendees, duration, r, recurrence]);

  const downloadCard = () => {
    generateCard();
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "meeting-cost.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    }, 100);
  };

  return (
    <ToolLayout
      toolNum={3} category="💰 Money & Freelance"
      title="Meeting Cost" titleHighlight="Calculator"
      description="Calculate the real dollar cost of a meeting by combining the estimated hourly wages of all attendees."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-5">
          <Card>
            <SectionTitle>Meeting Details</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="attendees">Number of Attendees</FieldLabel>
                <NumInput id="attendees" value={attendees} onChange={setAttendees} min={1} max={500} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <FieldLabel htmlFor="salary">{isHourly ? "Hourly Rate per Person" : "Average Annual Salary per Person"}</FieldLabel>
                  <Toggle checked={isHourly} onChange={setIsHourly} label={isHourly ? "Hourly" : "Annual"} />
                </div>
                <NumInput id="salary" value={salary} onChange={setSalary} prefix="$" min={0} step={isHourly ? 1 : 5000} />
              </div>
              <div>
                <FieldLabel htmlFor="duration">Meeting Duration</FieldLabel>
                <NumInput id="duration" value={duration} onChange={setDuration} suffix="minutes" min={5} max={480} step={5} />
              </div>
              <div>
                <FieldLabel htmlFor="recurrence">Recurrence (optional)</FieldLabel>
                <Select id="recurrence" value={recurrence} onChange={setRecurrence} options={[
                  { value: "none", label: "One-off" },
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                ]} />
              </div>
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <ResultHeadline label="This meeting costs" value={`$${r.cost.toFixed(2)}`} sub={`${attendees} people × ${duration} min`} />
            <div className="px-4 py-4">
              {recurrence === "weekly" && <ResultRow label="If weekly → annual cost" value={`$${r.weeklyAnnual.toFixed(0)}/yr`} highlight />}
              {recurrence === "monthly" && <ResultRow label="If monthly → annual cost" value={`$${r.monthlyAnnual.toFixed(0)}/yr`} highlight />}
              <ResultRow label="Hourly rate used" value={`$${r.hourlyRate.toFixed(2)}/hr`} />
              <ResultRow label="Cost per attendee" value={`$${(r.cost / attendees).toFixed(2)}`} />
            </div>
            <div className="px-4 pb-4 space-y-2">
              <button onClick={downloadCard} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 text-sm font-medium transition-all">
                {downloaded ? "✅ Downloaded!" : "📥 Download share card (PNG)"}
              </button>
            </div>
          </ResultCard>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

    </ToolLayout>
  );
}

function ResultHeadline({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-cyan-700 px-6 py-7 text-center">
      <p className="text-blue-100 text-sm font-medium mb-1">{label}</p>
      <p className="text-white text-4xl font-extrabold tabular-nums tracking-tight">{value}</p>
      {sub && <p className="text-blue-100 text-sm mt-1">{sub}</p>}
    </div>
  );
}
