import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "prescription-refill-sync";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";
const title = "Prescription Refill Sync Calculator — Consolidate All Refills Into One Trip";
const description = "Find the single best day to request all your prescription refills at once. Enter each medication's supply length to see where they converge for a one-trip pickup.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How can I sync multiple prescription refills into one pharmacy trip?", a: "Find the least common multiple of your medications' refill cycles, or more practically: identify which prescription will run out soonest, refill it slightly early, then ask your pharmacist to synchronize remaining medications to that same date. Pharmacy sync programs (offered by most major chains) do exactly this automatically." },
  { q: "Will my insurance cover an early refill to sync medications?", a: "Most insurance plans allow refills when you're 75–80% through your current supply (i.e., 22–24 days into a 30-day supply). For syncing purposes, this means you can typically fill prescriptions 5–8 days early without coverage issues. Controlled substances have stricter rules — consult your pharmacist." },
  { q: "Does my pharmacy offer a medication synchronization program?", a: "Yes — CVS, Walgreens, Rite Aid, and most independent pharmacies offer 'med sync' or 'synchrony' programs at no extra cost. You enroll, and the pharmacy proactively contacts you once a month before your pickup date to confirm all medications and prepare them together. This also reduces missed doses." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "HealthApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
