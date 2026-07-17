"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, CopyButton } from "@/components/ui";

function toCamelCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function toHashtag(text: string): string {
  const cleaned = text.replace(/[^a-zA-Z0-9\s\u0600-\u06FF\u0080-\uFFFF]/g, " ").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const camel = words.map(toCamelCase).join("");
  return `#${camel}`;
}

function processInput(raw: string): string[] {
  return raw.split(/[\n,]+/).map((h) => h.trim()).filter(Boolean).map(toHashtag);
}

export default function HashtagFormatter() {
  const [input, setInput] = useState("world cup 2024\nreal madrid vs barcelona\npakistan super league");
  const results = processInput(input);

  return (
    <ToolLayout toolNum={21} category="📱 Content & Social" title="Hashtag CamelCase" titleHighlight="Formatter"
      description="Auto-format multi-word hashtags into readable CamelCase — for accessibility and readability. Screen readers can then read each word separately."
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <Card>
          <SectionTitle>Enter phrases (one per line, or comma-separated)</SectionTitle>
          <textarea
            value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={"world cup 2024\npakistan super league\nreal madrid"}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500 resize-y font-mono"
          />
        </Card>

        {results.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>Formatted Hashtags</SectionTitle>
              <CopyButton getText={() => results.join(" ")} />
            </div>
            <div className="flex flex-wrap gap-2">
              {results.map((h, i) => (
                <button key={i} onClick={() => navigator.clipboard.writeText(h)}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 text-sm hover:bg-blue-500/20 transition-all font-mono" title="Click to copy">
                  {h}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">Click any hashtag to copy individually.</p>
          </Card>
        )}

        <Card>
          <SectionTitle>Why CamelCase Hashtags?</SectionTitle>
          <div className="space-y-2 text-sm text-slate-600">
            <p>❌ <code className="text-slate-700">#worldcup2024</code> — screen readers may say "worldcup two thousand twenty four"</p>
            <p>✅ <code className="text-slate-700">#WorldCup2024</code> — screen readers say "World Cup 2024" — far more intelligible</p>
            <p className="text-xs text-slate-500 mt-3">CamelCase hashtags are now a standard accessibility best practice on Twitter/X, LinkedIn, and Instagram.</p>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
}
