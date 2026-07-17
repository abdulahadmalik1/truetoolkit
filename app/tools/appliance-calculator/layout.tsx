import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "appliance-calculator";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";
const title = "Appliance Electricity Cost Calculator — Compare Running Costs of Any Two";
const description = "Calculate and compare the annual electricity cost of any two appliances. Enter wattage, hours of use per day, and your electricity rate (kWh) to see the difference.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do I compare the running cost of two appliances?", a: "Formula: Annual Cost = (Wattage ÷ 1,000) × Hours Used Per Day × 365 × Electricity Rate ($/kWh). Example: A 2,000W space heater used 4 hrs/day at $0.14/kWh costs (2 × 4 × 365 × 0.14) = $408.80/year. Compare this to a 200W heat pump using the same hours: $40.88/year — a $368 annual difference." },
  { q: "What is the average electricity rate (kWh price) in the US?", a: "As of 2024, the US average residential electricity rate is approximately $0.16/kWh, but this varies significantly by state. Hawaii is highest at ~$0.40/kWh. Idaho and Utah are lowest at ~$0.09–0.10/kWh. Always use your actual rate from your utility bill for precise calculations." },
  { q: "How do I find the wattage of my appliances?", a: "Check the label on the appliance itself (usually on the back or bottom), or look up the model number online. Appliances with heating elements (ovens, dryers, water heaters) typically use 1,000–5,000W. Small electronics (phone charger, LED bulb) use 5–15W. Energy Star certified appliances publish rated power consumption online." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
