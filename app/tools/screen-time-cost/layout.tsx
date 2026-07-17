import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "screen-time-cost";
const CAT_SLUG = "time-remote-work";
const CAT_LABEL = "Time & Remote Work";

const title = "Screen Time Cost Converter — Turn Daily Phone Time into Dollars";
const description =
  "Convert your daily screen time into lost earnings, weeks of life, and opportunity cost. See what your 4 hours/day on your phone actually costs you per year.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/tools/${slug}` },
  openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  {
    q: "How much money does my daily screen time actually represent?",
    a: "Multiply your daily recreational screen hours by your hourly earning potential, then by 365 days. Someone who spends 3 hours/day on social media and earns $30/hour is forfeiting $32,850 per year in potential productive time. Even at a conservative $15/hour equivalent, that's over $16,000 annually.",
  },
  {
    q: "Is screen time worth the time it consumes?",
    a: "This calculator doesn't answer that — only you can. But assigning a dollar value forces deliberateness. If you'd pay $32,000 for a year of social media entertainment, keep scrolling. Most people realize when they see the number that the exchange rate doesn't feel right.",
  },
  {
    q: "What's the average daily screen time for adults in 2024?",
    a: "According to data from multiple analytics firms, the average US adult spends approximately 7+ hours per day on screens, of which roughly 4–5 hours is recreational phone use (social media, streaming, gaming). This figure has increased every year since 2019.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name: title, description, applicationCategory: "LifestyleApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
      { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
