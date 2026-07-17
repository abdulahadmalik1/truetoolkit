import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "warranty-vault";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";
const title = "Warranty Vault & Expiry Calculator — Exactly When Does Your Warranty Expire?";
const description = "Calculate the exact expiry date of any product warranty. Store purchase date, warranty length, and receipt details — all saved locally in your browser, never on a server.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do I calculate exactly when a product's warranty expires?", a: "Warranty Expiry Date = Purchase Date + Warranty Length. For a TV purchased on March 15, 2024 with a 1-year warranty: expiry is March 15, 2025. For a 2-year warranty starting from the date of manufacture (not purchase), you need the manufacture date, which is often on the back label or serial number decode." },
  { q: "Does a warranty start from purchase date or manufacture date?", a: "For most consumer electronics and appliances, the warranty period starts from the original purchase date. Some manufacturers use the manufacture date, which is usually earlier — meaning your effective coverage may be shorter than the stated 1-year warranty if the product sat in a warehouse for months before purchase. Always check your specific warranty document." },
  { q: "Is my receipt data safe to store in this tool?", a: "Yes — this tool stores all your warranty data in your browser's localStorage, which means the data never leaves your device and is never sent to any server. It's accessible only from your current browser. For long-term storage, we recommend also keeping a photo of the receipt in a secure cloud folder." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
