import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "wedding-vendor-timeline";
const CAT_SLUG = "business-operations";
const CAT_LABEL = "Business & Operations";
const title = "Wedding Vendor Cascade Timeline — Automatically Reschedule All Vendors";
const description = "Set your ceremony start time and each vendor's required lead time. When one event shifts, all subsequent vendor arrival times recalculate automatically in one click.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How does delaying one wedding event affect every other vendor's schedule?", a: "All downstream events must shift by the same delay. If the ceremony starts 30 minutes late, the cocktail hour starts 30 minutes late, caterers serve 30 minutes later, toasts happen 30 minutes later, and the reception end time pushes into overtime territory — potentially triggering venue overtime fees. Cascade planning makes this chain reaction visible before the day." },
  { q: "Which wedding vendor needs the most advance arrival time?", a: "Typically the caterer (2–4 hours before dinner service for setup and cooking), followed by hair and makeup (3–5 hours before ceremony depending on group size), photographers (at minimum 1.5 hours before first formal event), and florist (2–3 hours before ceremony). Band/DJ setup can require 2–3 hours if load-in is complex." },
  { q: "What happens if my venue has a strict end-time and the day runs late?", a: "Most venues charge overtime per hour (typically $500–$2,000/hour). If your cascade shows that a ceremony delay will push you past end-time, you have three options: negotiate venue overtime in advance at a fixed rate, tighten the schedule in other places (shorter cocktail hour, fewer toasts), or build a 15–30 minute buffer into the original schedule." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
