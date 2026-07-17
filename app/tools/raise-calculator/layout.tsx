import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "raise-calculator";
const CAT_SLUG = "money-freelance";
const CAT_LABEL = "Money & Freelance";

// Keywords: "raise calculator after tax" — strong informational-to-transactional intent.
// People google this after receiving an offer and wanting to know their real net gain.
// Key insight from research: progressive tax systems mean the raise is taxed at the
// *marginal* rate, not the effective rate — many people confuse these. Also, a raise
// below inflation is a pay cut in real terms. LSI: "how much will I get from a raise
// after taxes", "salary increase take home pay calculator", "is my raise worth it after inflation".

const title = "Raise & Promotion Real-Impact Calculator — After Tax & Inflation";
const description =
  "See what a raise is actually worth after marginal tax and current inflation. Enter your salary and raise percentage to get your true monthly take-home gain.";

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
    q: "Why does a raise feel smaller than the percentage promised?",
    a: "Because raises are quoted in gross, but you live on net. Your raise is taxed at your marginal income tax rate — the highest bracket you're in — not your effective (average) rate. If you're in the 22% federal bracket and pay 6% state tax, 28 cents of every extra dollar goes straight to taxes before you see it.",
  },
  {
    q: "Can getting a raise actually push me into a worse financial position?",
    a: "No — this is a common myth. Progressive tax systems only tax the income that falls *within* each bracket at that bracket's rate. Getting a raise will always increase your total net take-home pay, though the marginal dollar gained will be smaller than it appears.",
  },
  {
    q: "How does inflation affect whether my raise is a real raise?",
    a: "If your salary rises by 5% but the inflation rate (or your personal inflation rate) is 6%, your purchasing power has actually decreased. You need your raise to at least match your actual cost-of-living increase — only the amount above inflation is a genuine improvement in your standard of living.",
  },
  {
    q: "What's a simple way to estimate my net raise after federal tax?",
    a: "Multiply the gross raise amount by (1 - your marginal tax rate). If you earn $80K and your raise is $5,000, and your marginal federal rate is 22%, you keep approximately $5,000 × 0.78 = $3,900 before state taxes. Divide by 12 for the monthly impact: about $325/month in additional net pay.",
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
