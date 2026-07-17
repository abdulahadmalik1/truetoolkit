import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "deposit-dispute-shield";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";
const title = "Deposit Dispute Shield — Cryptographic Proof of Rental Condition Photos";
const description = "Generate SHA-256 hashes of your move-in photos to create tamper-proof evidence that proves your rental's condition photos haven't been altered. 100% in-browser.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do I prove a rental's condition wasn't caused by me?", a: "Generate cryptographic hash values (SHA-256) of your move-in photos immediately after taking them, before uploading anywhere. A SHA-256 hash is a unique 64-character fingerprint of a file's exact content — if the file is altered even by one pixel, the hash changes completely. Submit the hash report alongside your move-in photos to your landlord in writing on day 1." },
  { q: "What is a SHA-256 hash and why does it matter for rental disputes?", a: "A SHA-256 hash is a cryptographic one-way function that converts any file into a unique 64-character string. If you later need to prove a photo is unmodified, you run the same hash function and compare results. An identical hash = unmodified file. This is admissible in many small claims court proceedings as evidence of file integrity." },
  { q: "Does this tool upload my photos anywhere?", a: "No — all hashing happens entirely in your browser using the Web Crypto API. Your photos are processed locally and the raw image data never leaves your device. The resulting hash report contains only the hash values and file metadata — nothing that can reconstruct your photos." },
  { q: "What else should I do on move-in day to protect my security deposit?", a: "In addition to timestamped photos with hash verification: (1) Complete the landlord's move-in inspection form in detail, (2) Email your photos and completed form to the landlord within 24 hours to create a timestamped record, (3) Get the landlord's email acknowledgment, (4) Keep originals of all photos in at least two locations." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
