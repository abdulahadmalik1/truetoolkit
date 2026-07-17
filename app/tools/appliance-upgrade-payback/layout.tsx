import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "appliance-upgrade-payback";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";
const title = "Appliance Upgrade Payback Calculator — Months to Break Even on Energy Savings";
const description = "Find exactly how many months until an energy-efficient appliance pays for itself through lower electricity bills. Compare old vs. new running costs instantly.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How long until an energy-efficient appliance pays for itself?", a: "Payback Period (months) = (New Appliance Cost − Any Rebates) ÷ Monthly Savings. Monthly savings = (Old Appliance Monthly Cost − New Appliance Monthly Cost). Example: A $1,200 heat pump water heater costs $900 after rebates. It saves $45/month vs. a resistance electric heater. Payback = $900 ÷ $45 = 20 months." },
  { q: "Are Energy Star appliances worth the premium price?", a: "Energy Star certified appliances typically use 10–50% less energy than standard models. For high-usage appliances (refrigerators, HVAC, water heaters), the payback period is often 2–5 years, and the appliance lifespan is 10–20 years — meaning 7–18 years of pure savings. For low-usage appliances (dishwashers, TVs), the payback is longer and savings less significant." },
  { q: "What government rebates are available for appliance upgrades?", a: "The US Inflation Reduction Act (2022) provides rebates up to $840 for heat pump clothes dryers and dishwashers, up to $1,750 for heat pump water heaters, and up to $8,000 for heat pump HVAC systems, income-dependent. Many states offer additional utility company rebates. Check EnergyStar.gov and your state's energy office for current programs." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
