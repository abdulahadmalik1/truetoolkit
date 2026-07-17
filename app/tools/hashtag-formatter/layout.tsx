import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "hashtag-formatter";
const CAT_SLUG = "content-social";
const CAT_LABEL = "Content & Social";
const title = "CamelCase Hashtag Formatter — Make Hashtags Readable for Screen Readers";
const description = "Convert hashtags to CamelCase format (#BlackLivesMatter, not #blacklivesmatter) so screen readers and humans can read them correctly. Instant, free formatter.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "Why should hashtags use CamelCase for accessibility?", a: "Screen readers for the visually impaired read lowercase hashtags as single garbled words: '#blacklivesmatter' becomes 'blacklivesmatter' read as one word. CamelCase allows the screen reader's text-to-speech engine to detect word boundaries and pronounce each word correctly: '#BlackLivesMatter' is read as 'Black Lives Matter'. This is an WCAG accessibility best practice." },
  { q: "Does CamelCase actually matter for social media algorithms?", a: "No — social platforms treat #BlackLivesMatter and #blacklivesmatter as the same hashtag for discovery purposes. CamelCase is purely a readability and accessibility improvement. It has zero negative impact on reach and significantly improves the experience for the estimated 7.6 million screen reader users worldwide." },
  { q: "Is this tool useful for long multi-word hashtags specifically?", a: "Yes — the benefit of CamelCase scales with the length and ambiguity of the hashtag. #susanalbumparty vs #SusanAlbumParty is a famous case where lowercase created a completely unintended reading. Any hashtag with 3+ words, or words that could be misread together, strongly benefits from CamelCase formatting." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "SocialNetworkingApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
