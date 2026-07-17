import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "true-overlap-trip";
const CAT_SLUG = "content-social";
const CAT_LABEL = "Content & Social";
const title = "Group Availability Scheduler — Find Exact Overlap Across Timezones";
const description = "Everyone enters their availability in their local time. This tool finds the exact overlapping window, accounting for DST offsets, for group trip or meeting planning.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do you find a meeting time that works across multiple timezones and DST?", a: "Convert all participants' availability to UTC first, then find the intersection. UTC is timezone-agnostic and DST-agnostic — it never changes. Each participant's local availability is converted to UTC based on their timezone offset *at the specific date in question* (accounting for whether DST is active on that date). The overlapping UTC window is then displayed in each person's local time." },
  { q: "Why does timezone scheduling fail even when using 'correct' timezones?", a: "Because DST offset changes happen on different dates in different countries. If Alice in New York and Bob in London both select '3pm local time' as available, their UTC overlap shifts by 1 hour during the 2-week gap when one country has changed clocks and the other hasn't. Only true UTC-based calculation prevents this error." },
  { q: "What's the best free tool for finding group availability across timezones?", a: "This calculator handles the timezone-safe overlap calculation. For ongoing scheduling, tools like World Time Buddy and Every Time Zone provide good visual overlaps. For formal meetings, Calendly and Doodle poll functionality covers most use cases — but none of them solve DST transition gaps as explicitly as manual UTC-based calculation." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "ProductivityApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
