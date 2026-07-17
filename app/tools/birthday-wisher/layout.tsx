import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "birthday-wisher";
const CAT_SLUG = "interactive-fun";
const CAT_LABEL = "Interactive Fun";
const title = "Free Online Birthday Card Generator — Create & Share Instantly, No Account";
const description = "Generate a personalized, animated birthday card with a custom message and share the link. No account, no watermarks, no tracking. Works on any device.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do I create and share a personalized birthday card instantly?", a: "Enter the recipient's name, your message, choose an animation style, and click Generate. The tool creates a unique shareable link that opens directly to the personalized card — no recipient account needed, no app to download. Just copy the link and send it in any chat, email, or social platform." },
  { q: "Is this free? Are there watermarks on the card?", a: "Yes, completely free, and no watermarks. Unlike many e-card services that gate sharing behind an account or subscription, this generator is fully functional with no signup required and no branding overlay on the generated card." },
  { q: "How is the shared card link generated?", a: "The card's content (name, message, animation selection) is encoded into the URL itself using URL-safe encoding. When the recipient clicks the link, the card is rendered entirely in their browser from the URL parameters — no server is involved, no data is stored, and the card appears instantly." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "EntertainmentApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
