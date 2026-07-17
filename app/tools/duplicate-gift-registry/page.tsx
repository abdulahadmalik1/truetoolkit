"use client";
import { useState, useEffect } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, ResultCard } from "@/components/ui";

type GiftItem = {
  id: string;
  name: string;
  link: string;
};

export default function DuplicateGiftRegistry() {
  const [items, setItems] = useState<GiftItem[]>([
    { id: "1", name: "Dyson V8 Vacuum", link: "https://amazon.com/..." },
    { id: "2", name: "KitchenAid Stand Mixer", link: "https://target.com/..." },
  ]);
  const [registryName, setRegistryName] = useState("Our Wedding Registry");
  
  const [isBuyerMode, setIsBuyerMode] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [claimedItem, setClaimedItem] = useState<GiftItem | null>(null);

  // On Mount, check if there's a hash (Buyer Mode)
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#r=")) {
        const payload = decodeURIComponent(hash.substring(3));
        const data = JSON.parse(atob(payload));
        if (data.n && data.i) {
          setRegistryName(data.n);
          setItems(data.i);
          setIsBuyerMode(true);
        }
      }
    } catch (e) {
      console.error("Failed to parse registry link");
    }
  }, []);

  const addItem = () => setItems([...items, { id: Math.random().toString(), name: "", link: "" }]);
  const updateItem = (id: string, key: keyof GiftItem, val: string) => setItems(items.map(i => i.id === id ? { ...i, [key]: val } : i));
  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const generateLink = () => {
    const validItems = items.filter(i => i.name.trim() !== "");
    const payload = btoa(JSON.stringify({ n: registryName, i: validItems }));
    const url = `${window.location.origin}${window.location.pathname}#r=${encodeURIComponent(payload)}`;
    setShareLink(url);
  };

  const claimItem = (item: GiftItem) => {
    // Remove the claimed item to ensure the NEXT person never sees it
    const newItems = items.filter(i => i.id !== item.id);
    const payload = btoa(JSON.stringify({ n: registryName, i: newItems }));
    const nextUrl = `${window.location.origin}${window.location.pathname}#r=${encodeURIComponent(payload)}`;
    
    setClaimedItem(item);
    setShareLink(nextUrl);
    setItems(newItems);
  };

  const resetToCreator = () => {
    window.location.hash = "";
    setIsBuyerMode(false);
    setClaimedItem(null);
    setShareLink("");
    setItems([{ id: "1", name: "", link: "" }]);
  };

  if (isBuyerMode) {
    return (
      <ToolLayout
        toolNum={71} category="📱 Content & Social"
        title="Blind" titleHighlight="Gift Registry"
        description="A P2P sequential gift registry. Claim an item, and it's wiped from the list before you pass the link to the next person. No one knows what you bought."
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <div className="text-center mb-8 border-b border-slate-200 pb-6">
              <p className="text-sm uppercase font-bold text-slate-400 tracking-wider mb-1">You are viewing</p>
              <h2 className="text-3xl font-black">{registryName}</h2>
              <p className="text-slate-600 mt-2">Pick a gift to claim. It will be permanently removed from the list for the next person.</p>
            </div>

            {claimedItem ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                <h3 className="text-2xl font-bold mb-2">You claimed: {claimedItem.name}</h3>
                <p className="text-slate-600 mb-8">Now, copy the updated link below and send it to the group chat or the next buyer. They will not see your gift on the list!</p>
                
                <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200 break-all mb-4">
                  <p className="text-xs font-mono text-slate-500 select-all">{shareLink}</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(shareLink); alert("Copied updated link!"); }} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-105">
                  Copy Updated Link
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 font-bold text-xl">
                    Wow, everything has been claimed!
                  </div>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div>
                        <p className="font-bold text-lg text-slate-800">{item.name}</p>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline">View Item →</a>
                        )}
                      </div>
                      <button onClick={() => claimItem(item)} className="bg-slate-900 hover:bg-black text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Claim Gift
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
          
          <div className="text-center">
            <button onClick={resetToCreator} className="text-slate-400 text-sm hover:underline">Create my own registry</button>
          </div>
        </div>
      </ToolLayout>
    );
  }

  // Creator Mode
  return (
    <ToolLayout
      toolNum={71} category="📱 Content & Social"
      title="Blind" titleHighlight="Gift Registry"
      description="Create a completely serverless, stateless gift registry. When someone claims a gift, the tool generates a new link for them to pass on that mathematically omits their purchase. No duplicates, total privacy."
    >
      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Create Your Registry</SectionTitle>
            <div className="mb-6">
              <FieldLabel htmlFor="n">Registry Title</FieldLabel>
              <TextInput id="n" value={registryName} onChange={setRegistryName} placeholder="e.g. Baby Shower Wishlist" />
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700">Gift Ideas</h3>
              <button onClick={addItem} className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                + Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl relative">
                  {items.length > 1 && (
                    <button onClick={() => removeItem(item.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 font-bold px-2">✕</button>
                  )}
                  <div className="grid gap-3 mr-8">
                    <div>
                      <FieldLabel htmlFor={`name-${item.id}`}>Gift Name</FieldLabel>
                      <TextInput id={`name-${item.id}`} value={item.name} onChange={(v) => updateItem(item.id, 'name', v)} placeholder="e.g. Espresso Machine" />
                    </div>
                    <div>
                      <FieldLabel htmlFor={`link-${item.id}`}>Store Link (Optional)</FieldLabel>
                      <TextInput id={`link-${item.id}`} value={item.link} onChange={(v) => updateItem(item.id, 'link', v)} placeholder="https://" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 px-6 py-8 text-center rounded-t-2xl">
              <h3 className="text-white font-bold text-xl mb-2">Generate P2P Link</h3>
              <p className="text-indigo-100 text-sm">
                This encodes your wishlist into the URL itself. No backend required.
              </p>
            </div>
            
            <div className="px-4 py-6 bg-white rounded-b-2xl text-center space-y-4">
              <button onClick={generateLink} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-105">
                Generate Share Link
              </button>
              
              {shareLink && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Your Secret Link</p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-3 break-all text-left">
                    <p className="text-xs font-mono text-slate-600 h-16 overflow-y-auto">{shareLink}</p>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(shareLink); alert("Copied!"); }} className="text-sm font-semibold text-blue-600 hover:underline">
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </ResultCard>
          
          {shareLink && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 leading-relaxed text-center">
              Send this link to the first buyer. Once they claim a gift, they will be given a <strong>new link</strong> to pass to the next person with their gift mathematically erased.
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
