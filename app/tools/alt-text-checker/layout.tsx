import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "alt-text-checker";
const CAT_SLUG = "content-social";
const CAT_LABEL = "Content & Social";
const title = "Alt-Text Quality Checker — Is Your Image Alt Text Actually Useful?";
const description = "Check whether your image alt text is descriptive, useful, and accessibility-compliant. Get specific feedback on what makes alt text effective vs. decorative filler.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "What makes image alt text actually useful, not just present?", a: "Useful alt text conveys the same information a sighted user gets from the image in context. Bad alt text: 'photo.jpg' or 'image of person'. Good alt text: 'A woman in a red hard hat reviewing blueprints at a construction site.' The test: if someone hears the alt text read aloud and then looks at the image, do they feel they already understood it?" },
  { q: "When should I use empty alt text (alt='') on an image?", a: "For purely decorative images that add no information (icons used as decoration, background textures, stock photos that are only visual filler), use alt='' (empty string). Screen readers skip images with empty alt attributes, which is actually the correct behavior — it avoids forcing users to hear 'decorative star icon' 20 times per page." },
  { q: "How long should alt text be?", a: "WCAG guidelines don't specify a maximum, but the practical convention is under 125 characters — roughly a sentence. Screen readers often pause after 125 characters. For complex images (charts, infographics), use alt text for a brief description and provide a longer text description in the page content or a linked text alternative." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "DeveloperApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
