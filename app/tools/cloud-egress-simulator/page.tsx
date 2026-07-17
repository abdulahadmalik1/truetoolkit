"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, ResultCard } from "@/components/ui";

export default function CloudEgressSimulator() {
  const [internetTb, setInternetTb] = useState(15);
  const [interRegionTb, setInterRegionTb] = useState(5);

  const math = useMemo(() => {
    // 1 TB = 1024 GB for cloud billing
    const internetGb = internetTb * 1024;
    const regionGb = interRegionTb * 1024;

    // AWS EC2 Egress
    let awsInternetCost = 0;
    let awsRemaining = internetGb;
    
    // First 100 GB Free
    const awsTier1 = Math.min(awsRemaining, 100);
    awsRemaining -= awsTier1;
    
    // Next 9.9 TB (10,140 GB) @ $0.09
    const awsTier2 = Math.min(awsRemaining, 9900);
    awsInternetCost += awsTier2 * 0.09;
    awsRemaining -= awsTier2;

    // Next 40 TB (40,960 GB) @ $0.085
    const awsTier3 = Math.min(awsRemaining, 40960);
    awsInternetCost += awsTier3 * 0.085;
    awsRemaining -= awsTier3;

    // Next 100 TB @ $0.070
    awsInternetCost += Math.max(0, awsRemaining) * 0.070;

    const awsRegionCost = regionGb * 0.02; // Roughly $0.02/GB inter-region
    const awsTotal = awsInternetCost + awsRegionCost;

    // GCP Compute Egress (Premium Tier NA)
    let gcpInternetCost = 0;
    let gcpRemaining = internetGb;

    // First 200 GB Free
    const gcpTier1 = Math.min(gcpRemaining, 200);
    gcpRemaining -= gcpTier1;

    // Next 9.8 TB @ $0.085
    const gcpTier2 = Math.min(gcpRemaining, 9800);
    gcpInternetCost += gcpTier2 * 0.085;
    gcpRemaining -= gcpTier2;

    // Remaining @ $0.065
    gcpInternetCost += Math.max(0, gcpRemaining) * 0.065;

    const gcpRegionCost = regionGb * 0.01; // Roughly $0.01/GB inter-region
    const gcpTotal = gcpInternetCost + gcpRegionCost;

    // Cloudflare R2 / Backblaze B2 (Bandwidth Alliance)
    // Egress is famously $0.
    const cfInternetCost = 0;
    const cfRegionCost = 0;
    const cfTotal = 0;

    return {
      aws: { internet: awsInternetCost, region: awsRegionCost, total: awsTotal },
      gcp: { internet: gcpInternetCost, region: gcpRegionCost, total: gcpTotal },
      cf: { internet: cfInternetCost, region: cfRegionCost, total: cfTotal }
    };
  }, [internetTb, interRegionTb]);

  return (
    <ToolLayout
      toolNum={76} category="🛠️ Business & Operations"
      title="Cloud Egress" titleHighlight="Cost Simulator"
      description="Compute and storage are cheap. Getting your data OUT is what kills you. Input your exact monthly bandwidth to see the mathematical egress penalties levied by the big three providers."
    >
      <div className="grid lg:grid-cols-[1fr_450px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Monthly Traffic Volume</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <FieldLabel htmlFor="itb">Internet Egress (TB/month)</FieldLabel>
                <NumInput id="itb" value={internetTb} onChange={setInternetTb} min={0} step={0.5} />
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">Traffic leaving the cloud entirely and going to your users over the public internet.</p>
              </div>
              <div>
                <FieldLabel htmlFor="rtb">Inter-Region Egress (TB/month)</FieldLabel>
                <NumInput id="rtb" value={interRegionTb} onChange={setInterRegionTb} min={0} step={0.5} />
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">Traffic moving between cloud regions (e.g., US-East-1 to EU-West-1).</p>
              </div>
            </div>
          </Card>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 leading-relaxed">
            <strong>Note:</strong> Mathematical models are based on standard 2024 North America/Europe public pricing tiers. Cloud providers use 1 TB = 1,024 GB for billing calculations.
          </div>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-6 rounded-t-2xl">
              <h3 className="text-white font-bold text-lg">Egress Invoice Comparison</h3>
              <p className="text-slate-400 text-sm mt-1">Exact calculation based on tiered pricing</p>
            </div>
            
            <div className="bg-white p-4 rounded-b-2xl space-y-4">
              
              {/* AWS */}
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
                  <h4 className="font-black text-slate-800 text-lg">Amazon Web Services</h4>
                  <span className="font-black text-xl text-rose-600">${math.aws.total.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                </div>
                <div className="text-sm space-y-1 font-mono text-slate-600">
                  <div className="flex justify-between">
                    <span>Internet Egress:</span>
                    <span>${math.aws.internet.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inter-Region:</span>
                    <span>${math.aws.region.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                  </div>
                </div>
              </div>

              {/* GCP */}
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
                  <h4 className="font-black text-slate-800 text-lg">Google Cloud (GCP)</h4>
                  <span className="font-black text-xl text-rose-600">${math.gcp.total.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                </div>
                <div className="text-sm space-y-1 font-mono text-slate-600">
                  <div className="flex justify-between">
                    <span>Internet Egress:</span>
                    <span>${math.gcp.internet.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inter-Region:</span>
                    <span>${math.gcp.region.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                  </div>
                </div>
              </div>

              {/* Cloudflare / B2 */}
              <div className="border-2 border-emerald-500 rounded-xl p-4 bg-emerald-50 shadow-inner">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-emerald-200">
                  <h4 className="font-black text-emerald-900 text-lg">Cloudflare R2</h4>
                  <span className="font-black text-xl text-emerald-600">${math.cf.total.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                </div>
                <div className="text-sm space-y-1 font-mono text-emerald-800">
                  <div className="flex justify-between">
                    <span>Internet Egress:</span>
                    <span>$0 (Free)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inter-Region:</span>
                    <span>$0 (Free)</span>
                  </div>
                </div>
              </div>

            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
