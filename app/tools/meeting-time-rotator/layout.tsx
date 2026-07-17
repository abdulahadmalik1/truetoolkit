import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "meeting-time-rotator";
const CAT_SLUG = "time-remote-work";
const CAT_LABEL = "Time & Remote Work";

const title = "Fair Meeting Time Rotator — Rotate Timezones Equitably";
const description =
  "Stop scheduling meetings that always force the same person to join at 5 AM. This tool rotates meeting burden fairly across every timezone on your team. Free, instant.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/tools/${slug}` },
  openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  {
    q: "How do you fairly rotate meeting times across timezones?",
    a: "Assign a 'pain score' to each meeting time for each participant based on how far outside their standard work hours (9–5 local) it falls. Over a rotation cycle, every participant should accumulate the same total pain score. This tool calculates the rotation schedule to mathematically equalize the inconvenience across the team.",
  },
  {
    q: "What's a 'fair' meeting time for a team spanning 3+ timezones?",
    a: "When the timezone spread exceeds 8–9 hours, there is no single 'fair' time — every option is painful for someone. The only equitable solution is rotation: cycle through morning for timezone A one week, morning for timezone B the next. This way everyone shares the early/late burden equally over a month.",
  },
  {
    q: "Is there a golden rule for how often to rotate meeting times?",
    a: "Most remote-first teams rotate on a weekly or bi-weekly basis. Monthly rotation is the minimum — if you go longer, the same people endure months of early mornings before relief comes. Weekly is ideal for teams with very different timezone offsets.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name: title, description, applicationCategory: "ProductivityApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
      { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
