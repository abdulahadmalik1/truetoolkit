"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle } from "@/components/ui";

const PLATFORMS = [
  { id: "twitter", name: "Twitter/X", limit: 280, limitThread: 25000, color: "#1d9bf0", icon: "𝕏" },
  { id: "linkedin", name: "LinkedIn", limit: 3000, limitThread: 3000, color: "#0077b5", icon: "in" },
  { id: "instagram", name: "Instagram", limit: 2200, limitThread: 2200, color: "#e1306c", icon: "📷" },
  { id: "facebook", name: "Facebook", limit: 63206, limitThread: 63206, color: "#1877f2", icon: "f" },
  { id: "tiktok", name: "TikTok", limit: 2200, limitThread: 2200, color: "#ff0050", icon: "♪" },
  { id: "youtube", name: "YouTube (desc)", limit: 5000, limitThread: 5000, color: "#ff0000", icon: "▶" },
  { id: "whatsapp", name: "WhatsApp Status", limit: 700, limitThread: 700, color: "#25d366", icon: "💬" },
  { id: "bluesky", name: "Bluesky", limit: 300, limitThread: 300, color: "#0085ff", icon: "🦋" },
];

export default function PostLengthPreview() {
  const [text, setText] = useState("");

  const chars = text.length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  return (
    <ToolLayout toolNum={19} category="📱 Content & Social" title="Post Length" titleHighlight="Previewer"
      description="Paste your post and see exactly how it fits across every major platform — before you hit publish."
    >
      <div className="space-y-5">
        <Card>
          <SectionTitle>Your Post</SectionTitle>
          <textarea
            value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Paste or write your post here..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500 resize-y"
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>{chars.toLocaleString()} characters · {words.toLocaleString()} words</span>
            <button onClick={() => setText("")} className="text-slate-500 hover:text-red-400 transition-colors">Clear</button>
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLATFORMS.map((p) => {
            const over = chars > p.limit;
            const pct = Math.min(100, (chars / p.limit) * 100);
            return (
              <div key={p.id} className="bg-white shadow-sm border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-slate-900"
                      style={{ backgroundColor: p.color }}>{p.icon}</span>
                    <span className="text-sm font-medium text-slate-900">{p.name}</span>
                  </div>
                  <span className={`text-xs font-bold tabular-nums ${over ? "text-red-400" : "text-emerald-400"}`}>
                    {chars}/{p.limit}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: over ? "#ef4444" : p.color }} />
                </div>
                <p className={`text-xs mt-1.5 ${over ? "text-red-400" : "text-slate-500"}`}>
                  {over ? `${chars - p.limit} chars over limit` : `${p.limit - chars} chars remaining`}
                </p>
              </div>
            );
          })}
        </div>

        {chars > 0 && (
          <Card>
            <SectionTitle>Quick Summary</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <span key={p.id} className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                  chars <= p.limit
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}>
                  {chars <= p.limit ? "✓" : "✗"} {p.name}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
