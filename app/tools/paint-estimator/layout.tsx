import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "paint-estimator";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";

const title = "Paint Calculator — How Much Paint Do You Need for a Room?";
const description =
  "Calculate exact gallons of paint needed for any room. Enter wall dimensions, number of coats, and doors/windows to subtract. Prevents over- or under-buying.";

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: `${SITE}/tools/${slug}` },
  openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  { q: "How much paint do I need for a room of a given square footage?", a: "One gallon of paint typically covers 350–400 sq ft with a single coat on a smooth, previously painted surface. For new drywall or dark colors, expect 300 sq ft per gallon. Always calculate your total paintable wall area (perimeter × wall height, minus doors and windows), multiply by number of coats, and divide by 350 to get gallons needed." },
  { q: "How do I calculate wall area for a room with doors and windows?", a: "Calculate total wall area first: (room perimeter × ceiling height). Then subtract unpainted areas: a standard interior door is about 20 sq ft, a standard window about 15 sq ft. This calculator handles all subtractions automatically." },
  { q: "Should I buy extra paint? How much buffer is standard?", a: "Yes — add 10% for waste, touch-ups, and coverage variance. So if you calculate 1.8 gallons needed, buy 2 gallons. Keep leftover paint sealed for touch-ups. For accent walls or complex colors, you cannot always return opened cans, so buy close to your calculated amount." },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
