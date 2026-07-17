"use client";
import { useState } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, NumInput, TextInput, Select, ResultCard, ResultHeadline, ResultRow, Disclaimer, CopyButton } from "@/components/ui";

export default function SponsoredPostRate() {
  const [currency, setCurrency] = useState("$");
  const [views, setViews] = useState(50000);
  const [platform, setPlatform] = useState("youtube");
  const [niche, setNiche] = useState("lifestyle");

  const platforms = [
    { value: "youtube", label: "YouTube (Long form)" },
    { value: "reels", label: "Instagram Reels" },
    { value: "tiktok", label: "TikTok" },
    { value: "shorts", label: "YouTube Shorts" },
  ];

  const niches = [
    { value: "finance", label: "Finance / Business (High)" },
    { value: "tech", label: "Tech / Software (Med-High)" },
    { value: "lifestyle", label: "Lifestyle / Vlogs (Standard)" },
    { value: "comedy", label: "Comedy / Skits (Broad)" },
  ];

  // Base Dedicated CPM rates (dollars per 1000 views)
  const baseCpm = {
    youtube: 25,
    reels: 12,
    tiktok: 6,
    shorts: 5,
  };

  // Niche Multipliers
  const nicheMult = {
    finance: 2.5,
    tech: 1.5,
    lifestyle: 1.0,
    comedy: 0.7,
  };

  // Calculations
  const currentCpm = baseCpm[platform as keyof typeof baseCpm] * nicheMult[niche as keyof typeof nicheMult];
  const dedicatedRate = (views / 1000) * currentCpm;
  const shoutoutRate = dedicatedRate * 0.4; // Usually 40-50% of a dedicated video

  const getCopyText = () => {
    return `Sponsored Post Rate Estimate:\nPlatform: ${platforms.find(p=>p.value===platform)?.label}\nAvg Views: ${views.toLocaleString()}\nDedicated Video: ${currency}${dedicatedRate.toLocaleString(undefined, {maximumFractionDigits:0})}\n30s Shoutout: ${currency}${shoutoutRate.toLocaleString(undefined, {maximumFractionDigits:0})}`;
  };

  return (
    <ToolLayout
      toolNum={55} category="📱 Content & Social"
      title="Sponsored Post Rate Fairness" titleHighlight="Calculator"
      description="Get a fair ballpark sponsorship rate based on your real average views, platform, and niche — not just your vanity follower count."
    >
      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <SectionTitle>Your Metrics</SectionTitle>
              <div className="w-24">
                <TextInput id="currency" value={currency} onChange={setCurrency} placeholder="$" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="views">Average Views per Video</FieldLabel>
                <p className="text-xs text-slate-500 mb-2">Look at your last 5-10 videos and ignore any viral outliers.</p>
                <NumInput id="views" value={views} onChange={setViews} min={100} step={1000} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Platform & Audience</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="platform">Platform</FieldLabel>
                <Select id="platform" value={platform} onChange={setPlatform} options={platforms} />
              </div>
              <div>
                <FieldLabel htmlFor="niche">Your Niche</FieldLabel>
                <Select id="niche" value={niche} onChange={setNiche} options={niches} />
              </div>
            </div>
          </Card>

          <Disclaimer>These numbers are a benchmark based on industry CPM averages. You should also adjust for production costs (e.g. if you need to hire an editor or buy props) and usage rights (if the brand wants to run your video as an ad).</Disclaimer>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <ResultHeadline label="Dedicated Video Rate" value={`${currency}${dedicatedRate.toLocaleString(undefined, {maximumFractionDigits: 0})}`} sub="Full video centered on the brand" />
            
            <div className="px-4 py-4 space-y-1">
              <ResultRow label="30s Shoutout / Integration" value={`${currency}${shoutoutRate.toLocaleString(undefined, {maximumFractionDigits: 0})}`} highlight />
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Behind the math</p>
                <ResultRow label="Effective CPM" value={`${currency}${currentCpm.toFixed(2)}`} sub="Cost per 1,000 views" />
                <ResultRow label="Est. Views" value={views.toLocaleString()} />
              </div>
            </div>
            <div className="px-4 pb-4">
              <CopyButton getText={getCopyText} />
            </div>
          </ResultCard>
        </div>
      </div>
    </ToolLayout>
  );
}
