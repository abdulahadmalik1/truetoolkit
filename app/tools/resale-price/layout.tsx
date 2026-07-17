import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "resale-price";
const CAT_SLUG = "money-freelance";
const CAT_LABEL = "Money & Freelance";

// Keywords: "fair resale price calculator", "used item resale value estimator".
// People want this when selling on eBay/Facebook Marketplace and don't know what
// to ask. Also used by buyers checking if a listed price is fair. The standard
// approach: depreciated value = original price × (1 - depreciation rate)^years,
// adjusted by condition multiplier. Electronics depreciate fast (30-40%/yr),
// furniture slowly (5-10%/yr). LSI: "how to price used items for sale",
// "second hand item value calculator", "depreciation calculator for used goods".

const title = "Used-Item Fair Resale Price Estimator — Depreciation Calculator";
const description =
  "Calculate a fair asking price for any used item based on original price, age, category, and condition. Avoid underpricing or overpricing on resale marketplaces.";

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
    q: "How is fair resale value calculated based on age and condition?",
    a: "The standard method is straight-line or declining-balance depreciation. Declining-balance is more realistic: Resale Value = Original Price × (1 − Depreciation Rate)^Years Owned. Electronics typically depreciate 30–40% per year, appliances 10–15%, furniture 5–10%, and collectibles may appreciate. Condition then modifies this by ±10–30%.",
  },
  {
    q: "What depreciation rate should I use for electronics vs furniture?",
    a: "Electronics (phones, laptops, cameras) depreciate roughly 30–40% per year in the first few years. Furniture and tools depreciate 5–15% per year. Cars use a well-documented curve: roughly 20% in year 1 and 10-15% each following year. This calculator uses category-appropriate default rates.",
  },
  {
    q: "Why should I price below the new retail price even if the item is barely used?",
    a: "Because buyers on resale markets already account for the inconvenience of buying used: no return policy, no warranty, unknown history, and the effort of pickup/shipping. A 'like new' item at 70–80% of retail is typically the ceiling before buyers just buy new. Beyond 2 years old, 50–60% of retail is often the maximum achievable.",
  },
  {
    q: "Does original purchase price matter if I paid full retail vs. on sale?",
    a: "For calculating depreciation, use the original retail price (MSRP), not what you personally paid. Buyers compare your listing price to what they'd pay for the same item new — not to what you spent. If you got it on sale, that's your gain, not a reason to price differently.",
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
        applicationCategory: "UtilitiesApplication",
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
