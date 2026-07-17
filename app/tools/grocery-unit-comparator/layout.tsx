import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "grocery-unit-comparator";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";
const title = "Grocery Unit-Price Comparator — Which Pack Size is Actually Cheaper?";
const description = "Compare the true cost per 100g, per oz, or per unit across different pack sizes of any grocery item. Stop assuming 'bigger is cheaper' — verify it instantly.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do I know which pack size is actually cheaper per unit?", a: "Divide the total price by the quantity in the standard unit you want to compare (per gram, per oz, per ml, per tablet). The item with the lower price-per-unit is the better deal regardless of which size package is physically bigger. Many grocery stores print unit price on shelf labels, but often in different units — this calculator standardizes them for direct comparison." },
  { q: "Is the biggest pack size always the best value?", a: "No — this is a common supermarket illusion called 'bulk pricing bias'. Stores regularly price mid-size packs at better unit prices than large packs, especially during promotions. Studies from Which? (UK) and Consumer Reports (US) consistently find that the 'value size' is not always cheapest per unit. Always calculate." },
  { q: "Does this calculator work for comparing different brands, not just sizes?", a: "Yes — enter any product's price and quantity, regardless of brand. You can compare a 500g store-brand cereal at $2.49 against a 750g name-brand at $4.19, and immediately see which costs less per 100g." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "ShoppingApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
