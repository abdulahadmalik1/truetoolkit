"use client";
import { useState, useEffect } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, ResultCard } from "@/components/ui";

export default function CoolingOffDelay() {
  const [draft, setDraft] = useState("");
  const [lockedMessage, setLockedMessage] = useState("");
  const [lockMinutes, setLockMinutes] = useState(15);
  
  const [unlockTime, setUnlockTime] = useState<number | null>(null);
  const [timeLeftMs, setTimeLeftMs] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (unlockTime !== null) {
      interval = setInterval(() => {
        const now = Date.now();
        if (now >= unlockTime) {
          setUnlockTime(null);
          setTimeLeftMs(0);
        } else {
          setTimeLeftMs(unlockTime - now);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [unlockTime]);

  const handleLock = () => {
    if (!draft.trim()) return;
    setLockedMessage(draft);
    setDraft("");
    setUnlockTime(Date.now() + lockMinutes * 60000);
  };

  const handleDiscard = () => {
    setLockedMessage("");
    setDraft("");
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ToolLayout
      toolNum={72} category="📱 Content & Social"
      title="Cooling-Off" titleHighlight="Send Delay"
      description="Don't send that angry text yet. Type it here, set a timeout, and lock it in the vault. You physically will not be able to copy or send the text until the timer hits zero, giving you time to cool off."
    >
      <div className="max-w-2xl mx-auto space-y-8">
        
        {unlockTime !== null ? (
          <Card>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl animate-pulse">🔒</div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">Message Locked</h2>
              <p className="text-slate-500 mb-8">Take a walk. Drink some water. You cannot access your message until the timer expires.</p>
              
              <div className="bg-slate-900 rounded-2xl p-8 inline-block shadow-2xl">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-2">Time Remaining</p>
                <p className="text-6xl font-black text-white font-mono tracking-tight tabular-nums">
                  {formatTime(timeLeftMs)}
                </p>
              </div>
            </div>
          </Card>
        ) : lockedMessage ? (
          <Card>
            <div className="text-center py-8 border-b border-slate-200 mb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔓</div>
              <h2 className="text-3xl font-black text-slate-800">Vault Unlocked</h2>
              <p className="text-slate-500 mt-2">The cooling-off period is over. Do you still want to send this?</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 text-slate-800 whitespace-pre-wrap font-serif text-lg leading-relaxed">
              {lockedMessage}
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <button 
                onClick={handleDiscard}
                className="w-full bg-white border-2 border-slate-200 hover:border-red-500 hover:text-red-600 text-slate-600 font-bold py-4 rounded-xl transition-colors"
              >
                No, Delete It Forever
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(lockedMessage);
                  alert("Copied to clipboard. You can paste it now.");
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Yes, Copy to Clipboard
              </button>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="mb-6">
              <SectionTitle>Draft Your Message</SectionTitle>
              <textarea 
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type your frustrated message here..."
                className="w-full h-64 px-4 py-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-lg outline-none focus:border-rose-500 resize-none"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-end bg-rose-50 p-6 rounded-xl border border-rose-100">
              <div className="flex-1 w-full">
                <FieldLabel htmlFor="mins">Cooling-Off Period (Minutes)</FieldLabel>
                <NumInput id="mins" value={lockMinutes} onChange={setLockMinutes} min={1} max={1440} />
              </div>
              <button 
                onClick={handleLock}
                disabled={!draft.trim()}
                className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-10 rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Lock Message in Vault
              </button>
            </div>
          </Card>
        )}

      </div>
    </ToolLayout>
  );
}
