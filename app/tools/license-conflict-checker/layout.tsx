import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "license-conflict-checker";
const CAT_SLUG = "business-operations";
const CAT_LABEL = "Business & Operations";
// Research: GPL-2.0 and Apache 2.0 are INCOMPATIBLE (FSF guidance). GPL-3.0 and
// Apache 2.0 are compatible. AGPL-3.0 is the strongest copyleft — even SaaS use
// triggers source sharing. MIT and Apache 2.0 are permissive and compatible with
// almost everything. MPL-2.0 is weak copyleft — file-level, not project-level.
const title = "Open-Source License Conflict Checker — GPL vs MIT vs Apache Compatibility";
const description = "Select your project license and dependency licenses to instantly check for GPL, AGPL, MIT, and Apache 2.0 compatibility conflicts. Free, runs entirely in browser.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "Are GPL-2.0 and Apache 2.0 licenses compatible?", a: "No — GPL-2.0 and Apache 2.0 are incompatible. The FSF explicitly states this: the Apache 2.0 license has additional requirements (notably the patent retaliation clause) that conflict with GPL-2.0's terms. You cannot include Apache 2.0 licensed code in a GPL-2.0 project without license violation. GPL-3.0 + Apache 2.0 are compatible." },
  { q: "What is the 'viral' or 'copyleft' effect in GPL licenses?", a: "GPL and AGPL licenses are 'copyleft' — when you combine them with other code in a distributed work, the entire combined work must also be released under GPL/AGPL. This is the 'viral' effect. MIT and Apache 2.0 are permissive — you can incorporate them into proprietary software without this requirement. LGPL is a weaker copyleft that applies at the library boundary." },
  { q: "How is AGPL different from GPL?", a: "AGPL-3.0 adds the 'network clause': if you deploy AGPL-licensed software as a service over a network (SaaS), you must make the source code available to users, even if you never distribute the software as a binary. GPL only triggers source sharing on distribution. For SaaS businesses, AGPL is the strongest copyleft and typically incompatible with proprietary code." },
  { q: "Can I use MIT-licensed code in a commercial proprietary product?", a: "Yes — MIT and Apache 2.0 are the most permissive licenses and allow use in proprietary, commercial products without restriction. You must keep the copyright notice, but you are not required to release your own code as open source. This is why most popular npm packages use MIT." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "DeveloperApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
