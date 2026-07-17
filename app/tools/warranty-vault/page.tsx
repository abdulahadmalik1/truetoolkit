"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, Select, ResultCard, ResultRow } from "@/components/ui";

const BRANDS = [
  { value: "1", label: "Apple (1 Year)" },
  { value: "2", label: "Dyson (2 Years)" },
  { value: "1_samsung", label: "Samsung Electronics (1 Year)" },
  { value: "3_lg", label: "LG Major Appliances (3 Years)" },
  { value: "5_sony", label: "Sony Pro (5 Years)" },
  { value: "custom", label: "Custom Warranty Length" },
];

export default function WarrantyVault() {
  const [itemName, setItemName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [brand, setBrand] = useState("1");
  const [customYears, setCustomYears] = useState("1");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const activeYears = brand === "custom" ? parseFloat(customYears) : parseFloat(brand.split("_")[0]);
  
  let expiryDate = null;
  let daysLeft = null;
  if (purchaseDate && !isNaN(activeYears)) {
    const d = new Date(purchaseDate);
    d.setFullYear(d.getFullYear() + activeYears);
    expiryDate = d;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    daysLeft = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  return (
    <ToolLayout
      toolNum={62} category="🛠️ Everyday Practical"
      title="Warranty Vault &" titleHighlight="Expiry Math"
      description="Calculate the exact day your warranty expires based on known manufacturer lengths, and keep the receipt securely attached in your local browser for easy claims."
    >
      <div className="grid md:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Item Details</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="itemName">Item Name</FieldLabel>
                <TextInput id="itemName" value={itemName} onChange={setItemName} placeholder="e.g. MacBook Pro M3" />
              </div>
              
              <div>
                <FieldLabel htmlFor="purchaseDate">Date of Purchase</FieldLabel>
                <input 
                  type="date" id="purchaseDate" 
                  value={purchaseDate} 
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <FieldLabel htmlFor="brand">Manufacturer / Warranty Length</FieldLabel>
                <Select id="brand" value={brand} onChange={setBrand} options={BRANDS} />
              </div>

              {brand === "custom" && (
                <div>
                  <FieldLabel htmlFor="customYears">Custom Warranty (Years)</FieldLabel>
                  <TextInput id="customYears" value={customYears} onChange={setCustomYears} placeholder="e.g. 1.5" />
                </div>
              )}
            </div>
          </Card>

          <Card>
            <SectionTitle>Attach Receipt (Local Only)</SectionTitle>
            <p className="text-xs text-slate-500 mb-3">
              Images are processed instantly in your browser and never uploaded to any server. Perfect for privacy.
            </p>
            <input 
              type="file" accept="image/*" 
              onChange={handleImageUpload}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imagePreview && (
              <div className="mt-4 border rounded-xl overflow-hidden bg-slate-100 p-2">
                <img src={imagePreview} alt="Receipt Preview" className="max-h-64 object-contain mx-auto" />
              </div>
            )}
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-purple-700 to-fuchsia-800 px-6 py-7 text-center rounded-t-2xl">
              <p className="text-purple-200 text-sm font-medium mb-1">Exact Expiry Date</p>
              <p className="text-white text-3xl font-extrabold tabular-nums">
                {expiryDate ? expiryDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
              </p>
              {daysLeft !== null && (
                <div className={`mt-3 inline-block px-3 py-1 rounded-full text-sm font-bold ${
                  daysLeft < 0 ? "bg-red-500/20 text-red-200" :
                  daysLeft <= 30 ? "bg-amber-500/20 text-amber-200" :
                  "bg-emerald-500/20 text-emerald-200"
                }`}>
                  {daysLeft < 0 ? `Expired ${Math.abs(daysLeft)} days ago` : daysLeft === 0 ? "Expires TODAY" : `Valid for ${daysLeft} more days`}
                </div>
              )}
            </div>
            
            <div className="px-4 py-4 space-y-2 bg-white rounded-b-2xl">
              <ResultRow label="Item" value={itemName || "Unnamed Item"} />
              <ResultRow label="Purchase Date" value={purchaseDate ? new Date(purchaseDate).toLocaleDateString() : "—"} />
              <ResultRow label="Term" value={`${activeYears} Year${activeYears === 1 ? '' : 's'}`} />
              <ResultRow label="Receipt Attached" value={imagePreview ? "Yes ✓" : "No ✕"} />
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
