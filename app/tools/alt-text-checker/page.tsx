"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, CopyButton } from "@/components/ui";

const PATTERNS = [
  { id: "vague", label: "Too vague", regex: /^(image|photo|picture|photo\d*|img\d*|screenshot)$/i, message: 'Alt text like "image" or "photo" provides no useful info to screen reader users.' },
  { id: "redundant", label: "Redundant phrase", regex: /^(image of|photo of|picture of|graphic of|screenshot of|this is|an image|a photo)/i, message: "Avoid starting alt text with 'image of' or 'photo of' — screen readers already announce the element as an image." },
  { id: "extension", label: "File extension", regex: /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i, message: "Alt text should not contain the file extension." },
  { id: "too_long", label: "May be too long", check: (s: string) => s.length > 150, message: "Alt text over 150 characters can be overwhelming for screen reader users. Consider trimming or moving detail to visible text." },
  { id: "all_caps", label: "All caps", check: (s: string) => s.toUpperCase() === s && s.length > 3 && /[A-Z]/.test(s), message: "Screen readers may spell out all-caps text letter-by-letter." },
  { id: "emoji_only", label: "Emojis only", check: (s: string) => /^[\p{Emoji}\s]+$/u.test(s.trim()) && s.trim().length > 0, message: "Emojis as alt text can work for decorative items but are poor for informative images." },
];

const SUGGESTIONS = [
  "Describe what you see, not what the image is",
  "Include relevant text visible in the image",
  "For charts: describe the trend, not just 'a chart'",
  "For product images: include colour, style, and key features",
  "For infographics: summarise the key takeaway",
];

function getScore(text: string): { score: number; grade: string; color: string } {
  if (!text.trim()) return { score: 0, grade: "—", color: "text-slate-500" };
  let penalty = 0;
  PATTERNS.forEach((p) => {
    const hit = p.regex ? p.regex.test(text.trim()) : p.check!(text.trim());
    if (hit) penalty++;
  });
  const len = text.trim().length;
  if (len < 5) penalty += 2;
  else if (len < 10) penalty++;

  const score = Math.max(0, 100 - penalty * 20);
  if (score >= 80) return { score, grade: "Good", color: "text-emerald-400" };
  if (score >= 50) return { score, grade: "OK", color: "text-amber-400" };
  return { score, grade: "Poor", color: "text-red-400" };
}

export default function AltTextChecker() {
  const [altText, setAltText] = useState("");

  const issues = PATTERNS.filter((p) => {
    if (!altText.trim()) return false;
    return p.regex ? p.regex.test(altText.trim()) : p.check!(altText.trim());
  });

  const { score, grade, color } = getScore(altText);

  return (
    <ToolLayout toolNum={20} category="📱 Content & Social" title="Alt-Text Quality" titleHighlight="Checker"
      description="Paste your image alt text to get an instant quality score, detected issues, and improvement tips."
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <Card>
          <SectionTitle>Your Alt Text</SectionTitle>
          <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)}
            placeholder='e.g. "Two people reviewing documents at a laptop in an office"'
            className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>{altText.length} characters</span>
            <span className={`font-bold ${color}`}>{grade} {score > 0 ? `(${score}/100)` : ""}</span>
          </div>
          {altText.trim().length > 0 && (
            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${score}%`, backgroundColor: score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444" }} />
            </div>
          )}
        </Card>

        {issues.length > 0 && (
          <Card>
            <SectionTitle>Issues Found</SectionTitle>
            <div className="space-y-2">
              {issues.map((issue) => (
                <div key={issue.id} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
                  <span className="font-semibold">{issue.label}:</span> {issue.message}
                </div>
              ))}
            </div>
          </Card>
        )}

        {altText.trim().length > 0 && issues.length === 0 && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm text-center">
            ✅ No obvious issues found! Looks like good alt text.
          </div>
        )}

        <Card>
          <SectionTitle>Best Practices</SectionTitle>
          <ul className="space-y-2">
            {SUGGESTIONS.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-blue-400 mt-0.5">→</span> {s}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionTitle>Quick Examples</SectionTitle>
          <div className="space-y-3">
            {[
              { label: "❌ Bad", text: "image.jpg", reason: "File name only" },
              { label: "⚠️ Weak", text: "photo of dogs", reason: "Starts with 'photo of'" },
              { label: "✅ Good", text: "Three golden retriever puppies playing in autumn leaves in a park", reason: "Descriptive, natural, under 100 chars" },
            ].map((ex) => (
              <div key={ex.label}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-slate-600">{ex.label}</span>
                  <span className="text-xs text-slate-400">— {ex.reason}</span>
                </div>
                <code className="text-xs bg-slate-100 border border-slate-300 rounded px-2 py-1 text-slate-700 block">{ex.text}</code>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
}
