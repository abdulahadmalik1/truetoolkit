import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "warranty-tracker";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";
const title = "Warranty & Return-Window Tracker — Never Miss a Return Deadline";
const description = "Track return windows and warranty expiry dates for all your purchases. Get a clear countdown so you never discover a product is faulty the day after the window closes.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do I track return deadlines before they expire?", a: "Enter the purchase date and the store's return window (e.g., 30 days, 90 days). The calculator gives you the exact return-by date. Most people lose return windows because they remember 'I have 30 days' but forget the exact purchase date. This tracker shows the real calendar date and a countdown." },
  { q: "What's the difference between a return window and a manufacturer warranty?", a: "A return window is the store's policy — typically 14–90 days — during which you can return a product regardless of reason. A manufacturer warranty is separate, typically 1–2 years, and only covers defects in materials or workmanship. They run simultaneously from purchase date but have different terms." },
  { q: "Does an extended warranty or credit card protection overlap with the manufacturer warranty?", a: "Usually yes. Many premium credit cards (Visa Signature, American Express) automatically extend the manufacturer warranty by 1 year at no cost. This is a free benefit many cardholders don't realize they have. Check your card benefits before purchasing a paid extended warranty — you may already be covered." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
