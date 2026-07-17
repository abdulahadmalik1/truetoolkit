import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "luggage-balancer";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";
const title = "Luggage Weight Balancer — Avoid Airline Overweight Fees Before You Fly";
const description = "Enter the weight of each bag and your airline's limit. The calculator shows exactly which items to move between bags to avoid overweight charges.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do I redistribute luggage weight to avoid airline overweight fees?", a: "Weigh all bags first. Identify which are over the limit (typically 50 lbs / 23 kg for checked, 22 lbs / 10 kg for carry-on depending on airline). Move the heaviest items from over-limit bags to under-limit bags, prioritizing dense, non-fragile items like shoes and books. This calculator shows the optimal transfer to bring all bags under their limits." },
  { q: "How much do airlines charge for overweight baggage?", a: "Major US airlines (United, Delta, American) typically charge $100–$200 for bags weighing 51–70 lbs, and $200+ for bags over 70 lbs. International carriers vary. A 3-pound overage that costs $2 at a pharmacy scale to identify can save $100–$200 at the check-in counter." },
  { q: "Is there a trick to weigh luggage without a luggage scale?", a: "Stand on a bathroom scale and note your weight. Then hold the bag and stand on the scale again. The difference is the bag's weight. This works within ±1–2 lbs, which is accurate enough to avoid the extreme overweight fees that kick in at 51 lbs and 71 lbs." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "TravelApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
