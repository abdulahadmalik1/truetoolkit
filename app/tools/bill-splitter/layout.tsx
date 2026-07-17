import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "bill-splitter";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";

// Keywords: "itemized bill splitter" — the key differentiator from generic "bill splitter"
// apps is *itemized* splitting (person A had the steak, person B had salad).
// Generic even-split apps are everywhere; itemized is less common. LSI: "restaurant
// bill split by item calculator", "how to split a bill fairly", "bill split with tip calculator".

const title = "Itemized Bill Splitter — Split Any Bill Fairly by Who Had What";
const description =
  "Split a restaurant or shared bill fairly by assigning each item to each person. Add tip and tax automatically. Much fairer than dividing evenly when orders differ.";

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: `${SITE}/tools/${slug}` },
  openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  { q: "How do you split a restaurant bill fairly by item instead of evenly?", a: "List every item on the bill and assign it to the person who ordered it. Add shared items (like a shared appetizer or bottle of wine) split evenly among those who shared it. Then calculate the subtotal per person, add their proportional share of tax, and split tip based on their subtotal share. This is more work than dividing evenly, but eliminates the resentment of subsidizing a larger order." },
  { q: "Should tip be split evenly or proportionally?", a: "Proportionally is mathematically fairer — the person who ordered the $50 steak generates more work for the server than the person who ordered the $12 salad. Split the tip in proportion to each person's pre-tax subtotal, not evenly by head count." },
  { q: "What's the fairest way to handle a shared appetizer when splitting a bill?", a: "Divide the cost of shared items equally among everyone who partook. Be explicit about who's including themselves in shared items — a simple thumbs up from each person at the table before calculating resolves most ambiguity." },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
