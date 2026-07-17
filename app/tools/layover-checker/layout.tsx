import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "layover-checker";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";
const title = "Flight Layover Buffer Checker — Is Your Connection Time Safe Enough?";
const description = "Enter your layover time, airport, and terminal transfer type to find out if your connection is realistically safe — or if you're at serious risk of missing it.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How much layover time is actually safe for a connecting flight?", a: "Minimum safe layover depends entirely on the airport and connection type: Same-terminal domestic in a small airport: 45 minutes. Different terminals or concourses domestic: 60–90 minutes. International to domestic (clearing customs + immigration): 2–3 hours minimum. Different airports (city connections): at least 3 hours plus transit time. These are minimums for healthy travelers — add 30 minutes if you're traveling with kids or luggage that needs rechecking." },
  { q: "What's the minimum connection time airlines enforce (MCT)?", a: "Each airline publishes a Minimum Connection Time (MCT) per airport — the shortest layover they'll sell as a valid connection. But MCT is the technical minimum for an aircraft to make it work in ideal conditions. A 45-minute MCT at a major hub like O'Hare or JFK is not a comfortable connection for most passengers — it's the absolute floor." },
  { q: "What happens if I miss my connection? Does the airline help?", a: "If you booked both flights on one ticket (single PNR), the airline is obligated to rebook you on the next available flight at no extra charge, and may provide meal vouchers for delays over 2–3 hours. If you booked two separate tickets, you are on your own — no automatic rebooking and potentially no refund for the missed second flight." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "TravelApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
