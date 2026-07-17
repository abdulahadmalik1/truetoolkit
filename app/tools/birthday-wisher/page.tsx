"use client";
import { useState, useEffect, useRef } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, NumInput, Select, Toggle, ResultCard } from "@/components/ui";

const VIBES = [
  { id: "cosmic", label: "✨ Cosmic Twilight", bg: "from-[#080711] via-[#120c24] to-[#050409]", text: "text-purple-300", accent: "bg-purple-600", particle: "✨" },
  { id: "romance", label: "🌹 Romantic Rose", bg: "from-[#1a0b12] via-[#2c0e18] to-[#120509]", text: "text-rose-300", accent: "bg-rose-600", particle: "❤️" },
  { id: "neon", label: "⚡ Retro Cyberpunk", bg: "from-[#030712] via-[#111827] to-[#1e1b4b]", text: "text-cyan-400", accent: "bg-cyan-500", particle: "⭐" },
  { id: "luxury", label: "👑 Golden Majesty", bg: "from-[#0f0f10] via-[#1c1917] to-[#0c0a09]", text: "text-amber-200", accent: "bg-amber-500", particle: "✨" },
  { id: "festive", label: "🎈 Balloon Party", bg: "from-[#0f172a] via-[#1e293b] to-[#0f172a]", text: "text-blue-700", accent: "bg-blue-600", particle: "🎈" },
];

const PRESETS = [
  { relation: "friend", message: "To a fantastic friend who brings so much joy and light into my life! Wishing you a year ahead filled with happiness, adventure, and success." },
  { relation: "partner", message: "Happy Birthday to the love of my life. Every day with you is a gift, and I am so grateful for all the beautiful memories we share. Here's to many more!" },
  { relation: "family", message: "Wishing the best birthday to a wonderful family member. Thank you for always being my anchor and support. Have a day as amazing as you are!" },
  { relation: "colleague", message: "Happy Birthday! Wishing you a fantastic day and a successful, productive year ahead. It's a true pleasure working with you." },
];

// Synth Happy Birthday using Web Audio API
function playChime(note: number, type: "sine" | "triangle" | "square" = "triangle") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(note, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch (e) {
    console.error(e);
  }
}

// Play simple Happy Birthday arpeggio sequence
function playCelebrationMusic() {
  const notes = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63]; // C4, C4, D4, C4, F4, E4
  const times = [0, 250, 500, 750, 1000, 1500];
  notes.forEach((note, index) => {
    setTimeout(() => {
      playChime(note, "sine");
    }, times[index]);
  });
}

export default function BirthdayWisher() {
  const [name, setName] = useState("Alex");
  const [age, setAge] = useState(25);
  const [showAge, setShowAge] = useState(true);
  const [relation, setRelation] = useState("friend");
  const [message, setMessage] = useState(PRESETS[0].message);
  const [vibe, setVibe] = useState("cosmic");
  const [musicEnabled, setMusicEnabled] = useState(true);
  
  // Interactive preview state
  const [isPreview, setIsPreview] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const [giftOpened, setGiftOpened] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);
  const [shareUrl, setShareUrl] = useState("");

  // Update preset message when relation changes
  const handleRelationChange = (newRel: string) => {
    setRelation(newRel);
    const found = PRESETS.find((p) => p.relation === newRel);
    if (found) setMessage(found.message);
  };

  // Generate random particles for animation
  useEffect(() => {
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 + 100, // start below screen
      size: Math.random() * 20 + 10,
      delay: Math.random() * 8,
    }));
    setParticles(newParticles);
  }, [isPreview]);

  // Generate shareable link
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      params.set("name", name);
      if (showAge) params.set("age", String(age));
      params.set("vibe", vibe);
      params.set("msg", message);
      params.set("play", "true");
      setShareUrl(`${window.location.origin}${window.location.pathname}?${params.toString()}`);
    }
  }, [name, age, showAge, vibe, message]);

  // Parse shareable link on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("play") === "true") {
        setName(params.get("name") || "Alex");
        if (params.get("age")) {
          setAge(Number(params.get("age")));
          setShowAge(true);
        } else {
          setShowAge(false);
        }
        setVibe(params.get("vibe") || "cosmic");
        setMessage(params.get("msg") || "");
        setIsPreview(true);
      }
    }
  }, []);

  const activeVibe = VIBES.find((v) => v.id === vibe) || VIBES[0];

  const handleBlowCandles = () => {
    setCandlesLit(false);
    if (musicEnabled) {
      playCelebrationMusic();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {isPreview ? (
        /* Full Immersive View for Recipient */
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b ${activeVibe.bg} overflow-hidden`}>
          {/* Twinkling Particles / Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
              <span
                key={p.id}
                className="absolute text-xl animate-float opacity-75"
                style={{
                  left: `${p.x}%`,
                  bottom: `-10%`,
                  fontSize: `${p.size}px`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: "12s",
                }}
              >
                {activeVibe.particle}
              </span>
            ))}
          </div>

          <div className="max-w-xl w-full text-center z-10 space-y-8 animate-fade-in">
            {/* Headline Birthday Wish */}
            <div>
              <p className="text-sm font-semibold tracking-widest text-slate-600 uppercase">HAPPY BIRTHDAY</p>
              <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight mt-2 ${activeVibe.text}`}>
                {name}!
              </h1>
              {showAge && (
                <p className="text-lg text-slate-600 mt-2 font-medium">Cheers to your {age}th trip around the sun! 🥂</p>
              )}
            </div>

            {/* Interactive Candle Section */}
            <div className="flex flex-col items-center gap-4 bg-slate-900/40 backdrop-blur border border-slate-200 rounded-3xl p-6 shadow-2xl">
              <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
                {candlesLit ? "🕯️ Make a wish & tap to blow out the candle!" : "🎉 Wish sent to the stars!"}
              </p>
              <div className="relative h-32 flex items-end justify-center">
                {/* Cake base */}
                <div className="w-28 h-8 bg-amber-800 border-t-4 border-amber-600 rounded-lg shadow flex items-center justify-center text-xs font-bold text-amber-900">
                  CAKE
                </div>
                {/* Candle */}
                <div className="absolute bottom-8 w-3 h-14 bg-blue-400 rounded-t flex justify-center">
                  <div className="w-1 h-3 bg-slate-600 -mt-2 rounded" />
                  {/* Flame */}
                  {candlesLit && (
                    <button
                      onClick={handleBlowCandles}
                      className="absolute -top-6 w-5 h-7 bg-amber-500 rounded-full animate-pulse cursor-pointer outline-none filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] focus:scale-110 active:scale-90 transition-transform"
                      style={{
                        clipPath: "polygon(50% 0%, 100% 70%, 75% 100%, 25% 100%, 0% 70%)"
                      }}
                      aria-label="Blow out candle"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Surprise Gift Box */}
            <div className="flex flex-col items-center">
              {!giftOpened ? (
                <button
                  onClick={() => { setGiftOpened(true); if (musicEnabled) playChime(523.25, "sine"); }}
                  className="px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl font-bold shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all text-slate-900 flex items-center gap-2 animate-bounce"
                >
                  🎁 Tap to open your surprise!
                </button>
              ) : (
                <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-slate-200 text-left space-y-4 max-w-md mx-auto shadow-2xl relative animate-scale-up">
                  <span className="absolute -top-3 -right-3 text-3xl">💝</span>
                  <h3 className={`text-lg font-bold ${activeVibe.text}`}>A message for you:</h3>
                  <p className="text-slate-700 leading-relaxed text-sm md:text-base font-medium italic">
                    &quot;{message}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Back to builder option */}
            <div className="pt-8">
              <button
                onClick={() => setIsPreview(false)}
                className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors"
              >
                Create your own birthday card ✏️
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Designer/Configure Mode */
        <ToolLayout
          toolNum={45}
          category="🎉 Interactive Fun"
          title="Interactive Birthday Wisher"
          titleHighlight="& Card Generator"
          description="Create a premium, customizable, interactive birthday card with virtual candles to blow out, surprise gift box, sound effects, and floating particles. Send the generated link to your loved ones!"
        >
          <div className="grid md:grid-cols-[1fr_360px] gap-8 items-start">
            {/* Configuration Panel */}
            <div className="space-y-6">
              <Card>
                <SectionTitle>Recipient Details</SectionTitle>
                <div className="space-y-4">
                  <div>
                    <FieldLabel htmlFor="rec-name">Recipient's Name</FieldLabel>
                    <TextInput id="rec-name" value={name} onChange={setName} placeholder="e.g. Sara" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <FieldLabel htmlFor="rec-age">Age (optional)</FieldLabel>
                      <Toggle checked={showAge} onChange={setShowAge} label="Display Age" />
                    </div>
                    {showAge && (
                      <NumInput id="rec-age" value={age} onChange={setAge} min={1} max={120} />
                    )}
                  </div>
                  <div>
                    <FieldLabel htmlFor="relation">Relation (Presets)</FieldLabel>
                    <Select
                      id="relation"
                      value={relation}
                      onChange={handleRelationChange}
                      options={[
                        { value: "friend", label: "Friend" },
                        { value: "partner", label: "Partner" },
                        { value: "family", label: "Family" },
                        { value: "colleague", label: "Colleague / Work" },
                      ]}
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <SectionTitle>Custom Wishes / Message</SectionTitle>
                <div className="space-y-3">
                  <FieldLabel htmlFor="msg">Birthday Message</FieldLabel>
                  <textarea
                    id="msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a custom birthday message..."
                    rows={5}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500 resize-y"
                  />
                </div>
              </Card>

              <Card>
                <SectionTitle>Theme & Mood</SectionTitle>
                <div className="space-y-4">
                  <div>
                    <FieldLabel htmlFor="vibe">Vibe Theme</FieldLabel>
                    <Select
                      id="vibe"
                      value={vibe}
                      onChange={setVibe}
                      options={VIBES.map((v) => ({ value: v.id, label: v.label }))}
                    />
                  </div>
                  <Toggle checked={musicEnabled} onChange={setMusicEnabled} label="Enable Chime Sound Effects" />
                </div>
              </Card>
            </div>

            {/* Sharing & Preview Panel */}
            <div className="sticky top-24 space-y-4">
              <ResultCard gradient>
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 px-6 py-6 text-center">
                  <p className="text-blue-100 text-sm mb-1">Your Card is Ready</p>
                  <p className="text-xs text-blue-100 opacity-80 mt-1">Design: {activeVibe.label}</p>
                </div>
                <div className="p-5 space-y-3">
                  <button
                    onClick={() => {
                      setCandlesLit(true);
                      setGiftOpened(false);
                      setIsPreview(true);
                    }}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
                  >
                    👁️ Preview Full Interactive Card
                  </button>

                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-600 mb-1.5">Share Link</p>
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-800/40 text-slate-700 text-xs font-mono outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      alert("Shareable link copied to clipboard!");
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 hover:text-slate-900 transition-all border border-slate-300"
                  >
                    📋 Copy Share Link
                  </button>
                </div>
              </ResultCard>
            </div>
          </div>
        </ToolLayout>
      )}
    </div>
  );
}
