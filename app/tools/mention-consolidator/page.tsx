"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, ResultCard } from "@/components/ui";

export default function MentionConsolidator() {
  const [brandName, setBrandName] = useState("Acme Corp");
  const [username, setUsername] = useState("acme_hq");
  const [website, setWebsite] = useState("acmecorp.com");

  const queries = useMemo(() => {
    const brand = brandName.trim() ? `"${brandName.trim()}"` : "";
    const site = website.trim() ? `"${website.trim()}"` : "";
    const user = username.trim() ? username.trim().replace("@", "") : "";

    const orClauses = [brand, site].filter(Boolean).join(" OR ");
    
    // Google: Search brand or site, exclude own site
    const googleQuery = `${orClauses}${site ? ` -site:${website.trim()}` : ""}`;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(googleQuery)}`;

    // Twitter: Search brand or site, exclude tweets from own account
    const twitterQuery = `${orClauses}${user ? ` -from:${user}` : ""}`;
    const twitterUrl = `https://twitter.com/search?q=${encodeURIComponent(twitterQuery)}&f=live`;

    // Reddit: Search brand or site
    const redditQuery = orClauses;
    const redditUrl = `https://www.reddit.com/search/?q=${encodeURIComponent(redditQuery)}&sort=new`;

    // Hacker News
    const hnQuery = orClauses;
    const hnUrl = `https://hn.algolia.com/?q=${encodeURIComponent(hnQuery)}&sort=byDate`;

    // YouTube
    const ytQuery = brandName.trim();
    const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ytQuery)}&sp=CAI%253D`; // CAI= sorts by upload date

    return [
      { platform: "Google (Web)", query: googleQuery, url: googleUrl, icon: "🌐", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
      { platform: "X / Twitter", query: twitterQuery, url: twitterUrl, icon: "🐦", color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-200" },
      { platform: "Reddit", query: redditQuery, url: redditUrl, icon: "🤖", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" },
      { platform: "Hacker News", query: hnQuery, url: hnUrl, icon: "📰", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
      { platform: "YouTube", query: ytQuery, url: ytUrl, icon: "▶️", color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
    ];
  }, [brandName, username, website]);

  return (
    <ToolLayout
      toolNum={73} category="📱 Content & Social"
      title="Cross-Platform" titleHighlight="Mention Consolidator"
      description="Don't pay $100/mo for a social listening API just to see who is talking about you. Enter your details, and we'll deterministically generate and execute advanced boolean queries across platforms to find untagged mentions."
    >
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Your Brand Identity</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="brand">Brand / Product Name</FieldLabel>
                <TextInput id="brand" value={brandName} onChange={setBrandName} placeholder="e.g. Acme Corp" />
                <p className="text-xs text-slate-500 mt-1">We will wrap this in exact-match quotes.</p>
              </div>
              <div>
                <FieldLabel htmlFor="site">Website Domain</FieldLabel>
                <TextInput id="site" value={website} onChange={setWebsite} placeholder="e.g. acmecorp.com" />
                <p className="text-xs text-slate-500 mt-1">To find links to your site.</p>
              </div>
              <div>
                <FieldLabel htmlFor="user">Main Social Handle</FieldLabel>
                <TextInput id="user" value={username} onChange={setUsername} placeholder="e.g. acme_hq" />
                <p className="text-xs text-slate-500 mt-1">To filter out your own posts.</p>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Generated Boolean Queries</SectionTitle>
            <p className="text-sm text-slate-600 mb-6">
              Review the exact mathematical search strings generated for each engine.
            </p>
            
            <div className="space-y-4">
              {queries.map(q => (
                <div key={q.platform} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{q.icon}</span>
                    <h3 className="font-bold text-slate-800">{q.platform}</h3>
                  </div>
                  <div className="bg-white border border-slate-300 p-2 rounded text-xs font-mono text-slate-700 break-all mb-3 select-all">
                    {q.query}
                  </div>
                  <a 
                    href={q.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`block w-full text-center py-2.5 rounded-lg font-bold transition-colors border ${q.color} ${q.bg} ${q.border} hover:bg-white`}
                  >
                    Execute Search ↗
                  </a>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          <ResultCard gradient>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 px-6 py-8 text-center rounded-t-2xl">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🕵️
              </div>
              <h3 className="text-white font-bold text-xl mb-2">One-Click Hunt</h3>
              <p className="text-indigo-100 text-sm">
                Open all 5 highly-targeted searches simultaneously in new tabs.
              </p>
            </div>
            
            <div className="px-4 py-6 bg-white rounded-b-2xl text-center">
              <button 
                onClick={() => {
                  if (window.confirm("This will open 5 new browser tabs. Continue?")) {
                    queries.forEach(q => window.open(q.url, '_blank'));
                  }
                }}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Launch All Tabs
              </button>
            </div>
          </ResultCard>
          
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 leading-relaxed">
            <strong>Pro Tip:</strong> Bookmark the "Launch All" button or the individual queries. They are permanently encoded URLs, meaning you can run your daily mention check with zero friction and zero subscription fees.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
