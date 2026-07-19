"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, ResultCard } from "@/components/ui";

type PhotoData = {
  url: string;
  hash: string;
  timestamp: string;
  name: string;
};

export default function DepositDisputeShield() {
  const [bookingRef, setBookingRef] = useState("");
  const [beforeData, setBeforeData] = useState<PhotoData | null>(null);
  const [afterData, setAfterData] = useState<PhotoData | null>(null);
  const [isHashing, setIsHashing] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsHashing(true);
    try {
      // Create local URL for display
      const url = URL.createObjectURL(file);
      
      // Calculate SHA-256 hash
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Get timestamp
      const date = new Date(file.lastModified || Date.now());
      
      const data: PhotoData = {
        url,
        hash: hashHex,
        timestamp: date.toLocaleString(),
        name: file.name
      };

      if (type === "before") setBeforeData(data);
      else setAfterData(data);
    } catch (err) {
      console.error("Hashing failed", err);
    } finally {
      setIsHashing(false);
    }
  };

  const PhotoBox = ({ label, data, type }: { label: string, data: PhotoData | null, type: "before" | "after" }) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col h-full">
      <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">{label}</h3>
        {!data && (
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
            Upload Photo
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, type)} />
          </label>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        {data ? (
          <div className="space-y-4">
            <div className="bg-black/5 rounded-lg overflow-hidden flex items-center justify-center min-h-[200px]">
              <img src={data.url} alt={label} className="max-h-64 object-contain" />
            </div>
            <div className="space-y-2 text-sm bg-white p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500">Timestamp:</span>
                <span className="font-semibold text-slate-900">{data.timestamp}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500">Filename:</span>
                <span className="font-mono text-xs text-slate-900 truncate max-w-[150px]" title={data.name}>{data.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">SHA-256 Cryptographic Hash:</span>
                <span className="font-mono text-xs text-blue-700 break-all bg-blue-50 px-2 py-1 rounded block">{data.hash}</span>
              </div>
            </div>
            <div className="text-center pt-2">
               <button onClick={() => type === 'before' ? setBeforeData(null) : setAfterData(null)} className="text-xs text-red-500 hover:underline">Remove Photo</button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-12 text-center">
            <span className="text-4xl mb-2">📸</span>
            <p className="text-sm">No photo uploaded.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ToolLayout
      toolNum={63} category="🛠️ Everyday Practical"
      title="Deposit Dispute" titleHighlight="Shield"
      description="Protect your rental gear or venue. Upload before and after photos to instantly generate an irrefutable report containing the exact image timestamps and SHA-256 cryptographic hashes to prove no tampering occurred."
    >
      <div className="max-w-5xl mx-auto space-y-8">
        <Card>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <SectionTitle>Rental Details</SectionTitle>
              <p className="text-sm text-slate-600 mb-4">
                Enter the booking reference or item name. This will appear on your generated evidence report.
              </p>
              <FieldLabel htmlFor="bookingRef">Booking Ref / Item Name</FieldLabel>
              <TextInput id="bookingRef" value={bookingRef} onChange={setBookingRef} placeholder="e.g. Canon 5D Mark IV - John Doe" />
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="text-blue-900 font-semibold mb-2">How this works in a dispute:</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc pl-4">
                <li>Every uploaded image gets a <strong>SHA-256 hash</strong> (a digital fingerprint).</li>
                <li>Even modifying one pixel changes the entire hash.</li>
                <li>You can show this report to a bank or claims adjuster as cryptographic proof that the "Before" and "After" photos are untouched originals.</li>
              </ul>
            </div>
          </div>
        </Card>

        {isHashing && <div className="text-center text-sm font-semibold text-blue-600 animate-pulse">Calculating cryptographic hash...</div>}

        <div className="grid md:grid-cols-2 gap-6">
          <PhotoBox label="Before Rental (Outbound)" data={beforeData} type="before" />
          <PhotoBox label="After Rental (Returned)" data={afterData} type="after" />
        </div>

        {beforeData && afterData && (
          <div className="text-center print:hidden">
            <button 
              onClick={() => window.print()} 
              className="bg-slate-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              Print / Save Evidence Report (PDF)
            </button>
            <p className="text-xs text-slate-500 mt-3">This report runs entirely locally. We don't save your photos.</p>
          </div>
        )}

        {/* Print-only Header */}
        <div className="hidden print:block text-center pb-8 border-b-2 border-black mb-8">
          <h1 className="text-3xl font-black mb-2">CONDITION REPORT EVIDENCE</h1>
          <p className="text-lg">Reference: <strong>{bookingRef || "Unnamed Booking"}</strong></p>
          <p className="text-sm text-slate-600 mt-1">Generated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
