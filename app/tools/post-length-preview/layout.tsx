import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "post-length-preview";
const CAT_SLUG = "content-social";
const CAT_LABEL = "Content & Social";
const title = "Social Media Post Length Checker — Preview Where Your Post Gets Cut Off";
const description = "See exactly how your post looks and where it's truncated on Twitter/X, LinkedIn, Instagram, Facebook, and Threads before you publish. Live character count preview.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How long can a post be before it gets cut off on each platform?", a: "Twitter/X: 280 characters displayed, 25,000 for Premium subscribers (long-form). LinkedIn: 700 characters before 'see more' on feed posts; 3,000 characters max. Instagram: 2,200 characters; only first ~125 visible without tap. Facebook: 63,206 characters; first ~477 show before truncation in feed. Threads: 500 characters." },
  { q: "Does character count include emojis and links?", a: "Emojis count as 2 characters on Twitter/X (they use UTF-16 surrogate pairs). Links on Twitter/X are automatically shortened to 23 characters regardless of original length. LinkedIn and Instagram count characters as you see them. Always use a platform-specific counter rather than your text editor's word count." },
  { q: "Does front-loading content before the cut-off point improve engagement?", a: "Yes significantly. Studies by LinkedIn and content marketing researchers show that content appearing before the 'see more' truncation drives 40–60% lower click-through to expand. Place your key insight, question, or hook in the first 100–150 characters — everything after is secondary." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "SocialNetworkingApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
