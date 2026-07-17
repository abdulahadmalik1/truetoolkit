import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "rent-vs-buy";
const CAT_SLUG = "money-freelance";
const CAT_LABEL = "Money & Freelance";

// Keywords: "rent vs buy calculator" — this is a highly competitive space (Zillow,
// NYT, NerdWallet all have versions). The unique angle here is break-even horizon
// — the number of years until buying becomes cheaper than renting. Research shows
// the average US break-even is 5–7 years but varies enormously by market.
// Also, critics of most rent-vs-buy calculators note they undercount homeownership
// costs (maintenance 1-2% of home value/yr, transaction costs 6-10% when selling).
// LSI: "rent vs buy break even point", "is buying cheaper than renting calculator",
// "how long to stay in a house to make buying worth it".

const title = "Rent vs Buy Break-Even Calculator — Find the Exact Crossover Year";
const description =
  "Calculate the exact year when buying a home becomes cheaper than renting. Includes mortgage interest, maintenance, opportunity cost, and property taxes.";

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
    q: "At what point does buying become cheaper than renting?",
    a: "The break-even point — the year when cumulative buying costs drop below cumulative renting costs — depends heavily on your local market, mortgage rate, and how much you'd earn investing the down payment instead. In most US markets with a 7% mortgage rate as of 2024, the break-even is 7–12 years. In high-price coastal markets, it can exceed 20 years.",
  },
  {
    q: "What hidden costs do most rent vs buy calculators miss?",
    a: "Annual maintenance and repairs (typically 1–2% of home value per year), homeowner's insurance, HOA fees, property tax, and selling transaction costs (5–6% agent commissions plus closing costs). These can add $15,000–$25,000/year to the real cost of homeownership on a median-priced home.",
  },
  {
    q: "Does the opportunity cost of a down payment count in the calculation?",
    a: "Yes, and this is often the most underappreciated factor. A $80,000 down payment invested in a broad market index fund averaging 7–10% annually could grow to $157,000–$207,000 over 10 years. That growth is forfeited when you commit the capital to a home purchase.",
  },
  {
    q: "Is renting always 'throwing money away'?",
    a: "No — this is a myth. Rent buys you a place to live, flexibility, no maintenance responsibility, and the ability to invest the difference between your rent and the full cost of homeownership. Whether buying or renting is better financially depends entirely on your specific numbers, timeline, and local market.",
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
