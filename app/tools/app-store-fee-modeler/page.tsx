"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, Select, ResultCard, ResultRow } from "@/components/ui";

// Typical VAT/GST rates that Apple deducts from the retail price BEFORE calculating their commission.
// Note: In the US, sales tax is added on top of the price, so it doesn't reduce developer proceeds.
const COUNTRY_TAXES = [
  { value: "0", label: "United States (Sales Tax added on top)" },
  { value: "0.20", label: "United Kingdom (20% VAT)" },
  { value: "0.19", label: "Germany (19% VAT)" },
  { value: "0.20", label: "France (20% VAT)" },
  { value: "0.22", label: "Italy (22% VAT)" },
  { value: "0.10", label: "Australia (10% GST)" },
  { value: "0.10", label: "Japan (10% Consumption Tax)" },
  { value: "0.05", label: "Canada (5% GST - Varies by Province)" },
  { value: "0.15", label: "New Zealand (15% GST)" },
];

export default function AppStoreFeeModeler() {
  const [price, setPrice] = useState(9.99);
  const [taxRate, setTaxRate] = useState("0.20");
  const [isSmallBiz, setIsSmallBiz] = useState(true);
  const [isYearTwoSub, setIsYearTwoSub] = useState(false);

  const math = useMemo(() => {
    const rate = parseFloat(taxRate);
    
    // Apple deducts VAT/GST first.
    // If a user pays $9.99 in the UK (20% VAT), the actual math is: 9.99 = Net * 1.20
    const netRevenue = price / (1 + rate);
    const taxAmount = price - netRevenue;

    // Apple takes their cut from the Net Revenue (Pre-Tax amount)
    let appleCommissionRate = 0.30; // 30% default
    if (isSmallBiz || isYearTwoSub) {
      appleCommissionRate = 0.15; // 15% Small Biz or Year 2+ Subscription
    }

    const appleCut = netRevenue * appleCommissionRate;
    const developerTake = netRevenue - appleCut;

    return {
      taxAmount,
      netRevenue,
      appleCommissionRate,
      appleCut,
      developerTake,
      effectiveTakeRate: (developerTake / price) * 100
    };
  }, [price, taxRate, isSmallBiz, isYearTwoSub]);

  return (
    <ToolLayout
      toolNum={75} category="🛠️ Business & Operations"
      title="App Store" titleHighlight="Fee Leakage Modeler"
      description="You charge $9.99, but how much actually hits your bank account? Apple deducts local country VAT/GST before taking their 15% or 30% cut. Calculate your exact true margin."
    >
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Pricing & Store Variables</SectionTitle>
            <div className="grid gap-5">
              <div>
                <FieldLabel htmlFor="price">App or In-App Purchase Price ($)</FieldLabel>
                <NumInput id="price" value={price} onChange={setPrice} min={0.99} step={0.50} />
              </div>
              
              <div>
                <FieldLabel htmlFor="tax">Buyer's Country (VAT/GST Region)</FieldLabel>
                <Select id="tax" value={taxRate} onChange={setTaxRate} options={COUNTRY_TAXES} />
                <p className="text-xs text-slate-500 mt-1">In most of the world, App Store prices must include tax. Apple deducts this tax before calculating their commission.</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <FieldLabel>Commission Rate Rules</FieldLabel>
                <div className="space-y-3 mt-2">
                  <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={isSmallBiz} 
                      onChange={(e) => setIsSmallBiz(e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500" 
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Enrolled in App Store Small Business Program?</p>
                      <p className="text-xs text-slate-500 leading-tight mt-0.5">Reduces base commission from 30% to 15% for developers earning &lt; $1M/year.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={isYearTwoSub} 
                      onChange={(e) => setIsYearTwoSub(e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500" 
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Is this a Subscription past its first year?</p>
                      <p className="text-xs text-slate-500 leading-tight mt-0.5">Apple drops the cut to 15% for subscribers retained longer than 365 days.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-8 text-center rounded-t-2xl">
              <p className="text-slate-500 text-sm font-medium mb-1">Your True Take-Home</p>
              <p className="text-white text-5xl font-black tabular-nums tracking-tight">
                ${math.developerTake.toFixed(2)}
              </p>
              <p className="text-slate-500 text-sm mt-2 font-semibold">
                {math.effectiveTakeRate.toFixed(1)}% of the $ {price.toFixed(2)} list price
              </p>
            </div>
            
            <div className="px-4 py-4 space-y-2 bg-white rounded-b-2xl font-mono text-sm border-2 border-t-0 border-slate-200">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-sans">Customer Pays:</span>
                <span className="font-bold text-slate-800">${price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1 text-rose-600">
                <span className="font-sans">— Gov VAT/GST:</span>
                <span>-${math.taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-dashed border-slate-300 my-1"></div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-sans">Net Revenue:</span>
                <span className="font-bold text-slate-800">${math.netRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1 text-rose-600">
                <span className="font-sans">— Apple Cut ({(math.appleCommissionRate * 100).toFixed(0)}%):</span>
                <span>-${math.appleCut.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-slate-800 my-1"></div>
              <div className="flex justify-between items-center py-2 text-lg">
                <span className="text-emerald-700 font-bold font-sans">You Keep:</span>
                <span className="font-black text-emerald-700">${math.developerTake.toFixed(2)}</span>
              </div>
            </div>
          </ResultCard>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 leading-relaxed">
            <strong>Did you know?</strong> By default, Apple calculates their 30% cut on the pre-tax amount, not the list price. This mathematically favors the developer slightly compared to taxing the gross revenue!
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
