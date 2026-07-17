import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "cost-per-use";
const CAT_SLUG = "money-freelance";
const CAT_LABEL = "Money & Freelance";

// Keywords: "cost per use calculator" — classic personal finance concept for
// justifying or rejecting purchases. Users are mid-decision: they have a specific
// item in mind and want a number to either justify or reject it. Very concrete intent.
// Competing content is mostly listicle-style blog posts about the CPU concept, not
// interactive tools. LSI: "cost per wear calculator", "price per use calculator",
// "how many uses to justify a purchase".

const title = "Cost-Per-Use Calculator — Is That Purchase Actually Worth It?";
const description =
  "Divide any purchase price by your expected uses to find the true cost per use. See how many uses break even vs. a cheaper alternative. Free, instant calculator.";

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
    q: "How many uses justify an expensive purchase?",
    a: "There's no universal answer — it depends on your comparison point. The goal is to calculate cost-per-use for the expensive item and compare it to a cheaper alternative's cost-per-use, or to a rental/subscription equivalent. If the premium item costs less per use than the budget version, the premium item is actually the better value.",
  },
  {
    q: "What is the cost-per-use formula?",
    a: "Cost Per Use = (Purchase Price − Expected Resale Value) ÷ Number of Times You'll Use It. Subtracting resale value is important for items like cameras, tools, or gym equipment that retain meaningful value. A $500 camera you'll sell for $200 after 300 uses only costs you $1.00 per use.",
  },
  {
    q: "How does this calculator help with clothes shopping specifically?",
    a: "The 'cost per wear' variant is one of the most popular applications. A $200 quality coat worn 150 times over 5 years costs $1.33 per wear — often much less than a $60 fast-fashion coat worn only 12 times before falling apart, which costs $5.00 per wear.",
  },
  {
    q: "Should I include maintenance costs in my calculation?",
    a: "Yes, for items with ongoing maintenance costs (cars, expensive appliances, gym equipment), adding those costs to the numerator gives a more accurate total. Formula becomes: (Purchase Price − Resale Value + Total Maintenance Costs) ÷ Number of Uses.",
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
