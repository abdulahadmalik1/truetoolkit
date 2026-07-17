"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { tools, categories, getCategoryLabel, getCategorySlug } from "@/lib/tools";

const SITE_URL = "https://truetoolkit.com";

export default function Home() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredTools = useMemo(() => {
    if (!normalizedQuery) return tools;
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(normalizedQuery) ||
        t.description.toLowerCase().includes(normalizedQuery) ||
        t.category.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TrueToolkit",
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TrueToolkit",
    "url": SITE_URL,
    "logo": `${SITE_URL}/icon.png`,
    "description": "63 free, instant, client-side calculators for money, time, and everyday practical needs."
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      {/* Hero */}
      <header className="relative overflow-hidden border-b border-slate-200">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%,rgba(59,99,247,.4) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(99,59,247,.3) 0%,transparent 50%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 mb-4">
            HandyTools
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Hub
            </span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-4">
            {tools.length} instant, privacy-respecting calculators for money, remote work, and everyday life. 
          </p>
          <p className="text-slate-500 font-medium text-sm">
            Zero sign-up required · Runs entirely in your browser · No data ever leaves your device
          </p>
        </div>
      </header>

      {/* Search + category jump nav */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-5 space-y-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${tools.length} tools…`}
            aria-label="Search tools"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
          />
          <nav aria-label="Jump to category" className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const { icon, label } = getCategoryLabel(cat);
              const slug = getCategorySlug(cat);
              return (
                <Link
                  key={cat}
                  href={`/category/${slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-500/50 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                  <span aria-hidden>{icon}</span>
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-14">
        {normalizedQuery && (
          <p className="text-sm text-slate-500" role="status" aria-live="polite">
            Showing {filteredTools.length} tools matching "{query}"
          </p>
        )}

        {filteredTools.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl bg-white">
            <p className="text-slate-900 font-medium mb-1">
              No tool matches "{query}" yet.
            </p>
            <p className="text-slate-500 text-sm mb-4">
              Try a shorter search, or clear it to see all {tools.length} tools.
            </p>
            <button
              onClick={() => setQuery("")}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : (
          categories.map((cat, idx) => {
            const catTools = filteredTools.filter((t) => t.category === cat);
            if (catTools.length === 0) return null;
            
            // If searching, show all matches. If not, show only first 3 and a "view more" link.
            const isSearching = normalizedQuery.length > 0;
            const displayTools = isSearching ? catTools : catTools.slice(0, 3);
            const { icon, label } = getCategoryLabel(cat);
            const slug = getCategorySlug(cat);

            return (
              <section key={cat} id={`category-${idx}`} className="scroll-mt-32">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <h2 className="text-xl font-bold text-slate-900">
                      {label}
                    </h2>
                  </div>
                  {!isSearching && catTools.length > 3 && (
                    <Link href={`/category/${slug}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      View all {catTools.length} →
                    </Link>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="group flex items-start gap-3 p-5 rounded-2xl bg-white shadow-sm border border-slate-200 hover:border-blue-500/50 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                          {tool.name}
                        </p>
                        <p className="text-sm text-slate-500 leading-relaxed mt-2">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                {!isSearching && catTools.length > 3 && (
                  <div className="mt-4 sm:hidden">
                    <Link href={`/category/${slug}`} className="block w-full text-center py-3 rounded-xl bg-blue-50 text-blue-700 font-medium text-sm">
                      View all {catTools.length} {label} tools
                    </Link>
                  </div>
                )}
              </section>
            );
          })
        )}
      </main>

      <footer className="border-t border-slate-200 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center text-xs text-slate-400">
          TrueToolkit.com — All {tools.length} tools run entirely in your
          browser. Zero data collection.
        </div>
      </footer>
    </div>
  );
}