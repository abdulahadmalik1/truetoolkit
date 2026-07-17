import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "commute-cost";
const CAT_SLUG = "money-freelance";
const CAT_LABEL = "Money & Freelance";

// Keywords: "commute cost calculator" has solid tool intent. Research shows most people
// only calculate fuel and ignore depreciation, parking, tolls, and the time cost.
// Commuters underestimate their true annual commute cost by 40-60% per research.
// Key angle: time as money — 10hrs/week commuting at $40/hr equivalent = $20K/year
// in time cost alone. LSI: "annual commute cost calculator", "commuting cost per year",
// "is my commute worth it calculator".

const title = "Commute Cost Calculator — Full Annual Cost Including Time & Wear";
const description =
  "Calculate the true annual cost of your commute: fuel, vehicle depreciation, parking, tolls, and the dollar value of your time. Free commute cost calculator.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/tools/${slug}` },
  openGraph: {
    title,
    description,
    url: `${SITE}/tools/${slug}`,
    type: "website",
    siteName: "TrueToolkit",
  },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  {
    q: "What does my commute actually cost per year in total?",
    a: "Most commuters only calculate fuel, but the real formula is: (Daily Fuel Cost + Daily Wear & Depreciation at ~$0.21/mile + Daily Parking/Tolls) × Annual Commute Days. Add the time cost by multiplying your daily commute hours by a fraction of your hourly wage. A 30-mile round-trip commute 250 days/year commonly totals $8,000–$15,000 all-in.",
  },
  {
    q: "How do I calculate vehicle depreciation per mile?",
    a: "The IRS standard mileage rate (currently around 67 cents/mile for 2024) already bundles fuel, depreciation, and maintenance into a single per-mile cost. You can use this for a quick estimate, or break it out: AAA estimates depreciation alone adds $0.10–$0.20 per mile depending on vehicle type.",
  },
  {
    q: "Should I count my commute time as a financial cost?",
    a: "Yes, and many financial advisors argue it's the largest hidden cost. Time spent commuting cannot be spent earning money, resting, or improving your skills. A 1-hour daily commute equals 250 hours per year — valued at even $30/hour, that's $7,500 in 'opportunity time' that doesn't appear on any receipt.",
  },
  {
    q: "How much would one work-from-home day per week save me?",
    a: "Working from home just one day per week reduces your annual commute cost by approximately 20%. For someone spending $10,000/year on commuting, that's a $2,000 annual saving — equivalent to a modest raise. Two WFH days per week saves 40%, or $4,000.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: title,
        description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: `${SITE}/tools/${slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` },
          { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
