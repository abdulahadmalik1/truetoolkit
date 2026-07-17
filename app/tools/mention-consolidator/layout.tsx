import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "mention-consolidator";
const CAT_SLUG = "content-social";
const CAT_LABEL = "Content & Social";
const title = "Find Untagged Brand Mentions Free — Cross-Platform Boolean Query Builder";
const description = "Generate advanced boolean search queries to find mentions of your name, brand, or content across platforms without paying for a social listening tool. Free, instant.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How can I find mentions of my content without paying for social listening tools?", a: "Build boolean search queries using each platform's native advanced search. For example, on Twitter/X: '\"your brand name\" -from:yourhandle' finds mentions that don't use your @handle. Combine with Google site:reddit.com, site:twitter.com search operators. This tool generates the exact query strings for each platform based on your brand name and common misspellings." },
  { q: "What's the difference between tagged and untagged mentions?", a: "A tagged mention uses your @handle or #hashtag, which triggers a platform notification. An untagged mention is when someone writes about you by name without the @ — you get no notification, so you never see it. Studies consistently show that 50–75% of online brand mentions are untagged, meaning most of the conversation about you is invisible without active search." },
  { q: "Which platforms have the best native search for finding untagged mentions?", a: "Twitter/X Advanced Search (search.twitter.com) is the most powerful: it supports exact phrase matching, exclusions, date ranges, and minimum engagement filters. Reddit's search (with site:reddit.com in Google) finds subreddit discussions. LinkedIn search is the weakest for external monitoring. TikTok and Instagram's native search is improving but still limited compared to Google indexing." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "SocialNetworkingApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
