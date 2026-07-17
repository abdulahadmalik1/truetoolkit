import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "app-store-fee-modeler";
const CAT_SLUG = "business-operations";
const CAT_LABEL = "Business & Operations";
// Research: Apple takes 30% standard, 15% small business (<$1M/year, must enroll),
// subscriptions drop to 15% after 12 months. Google Play: 15% on first $1M/year for
// ALL developers, then 30% above $1M. Subscriptions: 15% from day 1 on Play.
// EU DMA complicates this with alternative payment options.
const title = "App Store Commission Modeler — True Net Revenue After Apple & Google Fees";
const description = "Model your real net revenue after Apple App Store (30% or 15%) and Google Play Store fees. Includes small business program, subscription year-2 drop, and withdrawals.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "What percentage does Apple actually take from App Store revenue?", a: "Standard rate: 30% for apps and one-time purchases. Reduced rates: 15% under the App Store Small Business Program (apps earning under $1M/year — you must actively enroll). Subscriptions: 30% in year 1, 15% from year 2 onward for continuous subscribers. In the EU under the Digital Markets Act (DMA), alternative payment processors are now possible but carry a Core Technology Fee." },
  { q: "How is Google Play's commission different from Apple's?", a: "Google Play applies 15% to the first $1M in annual earnings for ALL developers (not just small businesses), then 30% above $1M. For subscriptions, Google charges 15% from day 1 for all subscription durations — better than Apple's year-1 30% rate. This makes Google Play significantly more favorable for subscription-based apps in early growth." },
  { q: "If I earn $500,000/year on both stores, what do they each take?", a: "Apple (standard rate): $500,000 × 30% = $150,000 in fees, $350,000 net. Apple (Small Business Program, if enrolled): $500,000 × 15% = $75,000 in fees, $425,000 net. Google Play (all developers get 15% on first $1M): $500,000 × 15% = $75,000 in fees, $425,000 net. Google is definitively better at this revenue level regardless of program enrollment." },
  { q: "Should I build for Apple or Google if minimizing fees matters most?", a: "For revenue under $1M/year: Google Play is automatically 15% (vs 30% on Apple until you enroll in the Small Business Program). For subscription apps: Google is 15% from day 1 vs Apple's 30% for year 1. For revenue over $1M: both become 30%, leveling the playing field. Revenue level and app type (subscription vs one-time) are the key variables." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
