import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "debt-payoff";
const CAT_SLUG = "money-freelance";
const CAT_LABEL = "Money & Freelance";

// Keywords: "debt snowball vs avalanche calculator" — strong tool intent from people
// actively in debt repayment mode. Experian, Ramsey Solutions, NerdWallet all compete
// here. Our angle: side-by-side comparison with real payoff date, no login, instant.
// Research shows 3 user types: motivated planner (wants a date), math vs emotion
// debater (wants the dollar difference), and overwhelmed debtor (wants to simplify).
// LSI: "debt payoff calculator extra payment", "debt free date calculator",
// "snowball method calculator multiple debts".

const title = "Debt Snowball vs Avalanche Calculator — Side-by-Side Payoff";
const description =
  "Compare debt snowball and avalanche strategies side by side. See exact payoff dates and total interest saved for your specific debts. Free, instant, no signup.";

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
    q: "Which pays off debt faster, the snowball or avalanche method?",
    a: "Mathematically, the Debt Avalanche method (targeting the highest interest rate first) always results in paying less total interest and becoming debt-free sooner. The gap between the two methods widens the more high-interest debt you carry.",
  },
  {
    q: "Why do people recommend the snowball method if avalanche is mathematically better?",
    a: "Because math doesn't drive behavior — psychology does. The Snowball method delivers quick wins by eliminating small balances first, which research shows dramatically improves adherence for many people. A plan that isn't followed delivers zero real-world savings; the 'best' method is the one you'll actually stick to.",
  },
  {
    q: "What happens to my monthly payment when I pay off a debt?",
    a: "You 'roll' it forward. Under both methods, when a debt reaches zero, the amount you were paying toward it is added to the minimum payment of the next target debt. This creates a payment 'snowball' (or 'avalanche') that accelerates your payoff velocity dramatically over time.",
  },
  {
    q: "How much does a $100/month extra payment actually matter?",
    a: "On a $10,000 credit card balance at 20% APR with a $200 minimum, adding $100/month extra reduces your payoff time from roughly 10 years down to under 4 years, and saves approximately $6,000 in total interest. The earlier you add extra payments, the more the interest savings compound.",
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
