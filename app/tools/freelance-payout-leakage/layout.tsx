import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "freelance-payout-leakage";
const CAT_SLUG = "money-freelance";
const CAT_LABEL = "Money & Freelance";

// Keywords: "freelance platform fees calculator", "Upwork Fiverr fees calculator",
// "how much do platform fees cost freelancers". This is a very specific tool for the
// growing gig economy. Upwork takes 10%, Fiverr takes 20%, plus payment processors,
// exchange rates, and withdrawal fees. Someone invoicing $5K may net $3.8K or less.
// No mainstream calculator covers the full stack: platform % + payment processor % +
// FX rate loss + withdrawal fee. LSI: "Upwork service fee calculator", "Fiverr net
// earnings calculator", "freelancer platform take rate comparison".

const title = "Freelance Payout Leakage Calculator — True Net After All Fees";
const description =
  "See exactly how much of your invoice reaches your bank account after Upwork, Fiverr, PayPal, Wise, and currency exchange fees are deducted. Free, instant calculator.";

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
    q: "How much do platform and currency conversion fees really cost freelancers?",
    a: "It varies by platform and withdrawal route, but the full stack is typically: Upwork takes 10% of earnings (reduced from the previous tiered structure). Fiverr takes 20%. PayPal typically charges 2.9% + fixed fee for withdrawals, plus a 2-4% FX conversion spread if converting currencies. Wise is lower at 0.3-1.5% for conversions. Combined, you can lose 15-30% between invoice and bank account.",
  },
  {
    q: "What's the difference between a platform's 'service fee' and a payment processing fee?",
    a: "The platform service fee (e.g., Upwork's 10%, Fiverr's 20%) is deducted before you can even withdraw your earnings. The payment processing fee is charged separately by the withdrawal method you choose — PayPal, Payoneer, Wise, or direct bank transfer — and each has its own fee structure.",
  },
  {
    q: "Does currency conversion really matter that much for freelancers?",
    a: "Yes, significantly. Mid-market exchange rates and bank/PayPal FX rates differ by 2–4% on average. On a $5,000 payment converted from USD to GBP or EUR, that gap costs you $100–$200 per transaction. Over a year of frequent international payments, this can add up to thousands.",
  },
  {
    q: "Which freelance platform has the lowest effective take rate?",
    a: "Direct bank-to-bank payments (no platform) are cheapest — 0% platform fee, minimal transaction costs. Among major platforms, Upwork's 10% flat rate (post-2023 restructure) is generally more competitive than Fiverr's 20% flat rate. For payment withdrawal, Wise consistently offers the best FX rates for international transfers.",
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
