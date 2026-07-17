import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "food-safety-countdown";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";
const title = "Fridge Food Safety Countdown — How Long Are Leftovers Safe to Eat?";
const description = "Track how long your leftovers and fridge items are safe to eat. Based on USDA food safety timelines. Set a cook date and get an exact expiry time.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How long is it actually safe to keep leftovers in the fridge?", a: "According to USDA guidelines: cooked meat and poultry 3–4 days, cooked fish 3–4 days, cooked pasta and rice 3–5 days, cooked vegetables 3–4 days, soups and stews 3–4 days. The '3–4 day' rule applies to most cooked foods regardless of how they look or smell — bacterial growth can occur without visible or olfactory signs." },
  { q: "Why does food stored at the right temperature still go bad?", a: "Refrigerators at 40°F or below slow bacterial growth significantly but don't stop it entirely. Pathogens like Listeria can grow slowly even at refrigerator temperatures. For foods held at room temperature for over 2 hours (the 'danger zone' is 40°F–140°F), those hours count against the total safe storage window." },
  { q: "Is the 'sniff test' reliable for determining if food is safe?", a: "No — and this is one of the most dangerous food safety myths. Many pathogens that cause foodborne illness (like Salmonella, E. coli, and Listeria) produce no detectable odor, color change, or texture change. Food can be dangerous before it smells off. Use dates, not your nose." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "FoodAndDrinkApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
