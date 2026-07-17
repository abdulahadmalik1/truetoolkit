import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "invoice-cash-runway";
const CAT_SLUG = "money-freelance";
const CAT_LABEL = "Money & Freelance";

// Keywords: "invoice runway calculator freelancer", "how long will my money last freelancer".
// This is a real pain point especially for freelancers with lumpy income. The insight:
// outstanding invoices are not the same as cash — a 60-day payment term invoice is
// different from a 14-day one. The runway calculation must weight by probability of
// on-time payment and days remaining. Very niche but high-value tool.
// LSI: "freelancer cash flow calculator", "outstanding invoice tracker",
// "how many days until invoice gets paid calculator".

const title = "Invoice Cash-Runway Calculator — Days of Runway from Pending Invoices";
const description =
  "See how many days of business runway your outstanding invoices cover, weighted by payment probability and days remaining on each invoice term. Free, instant.";

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
    q: "How do I know how many days of runway my pending invoices give me?",
    a: "Calculate your daily operating expense burn rate (monthly costs ÷ 30). Then for each outstanding invoice, estimate its expected payment date based on terms (Net 30, Net 60, etc.) and your client's payment history. Sum the invoice amounts weighted by payment probability, then divide total expected cash by daily burn rate.",
  },
  {
    q: "What's the difference between outstanding invoices and actual cash runway?",
    a: "Outstanding invoices are promises, not cash. A $10,000 Net-60 invoice from a slow-paying client may never arrive when expected — or may partially arrive. Actual cash runway is your bank balance. Invoice-weighted runway is the expected future cash from outstanding invoices, which is less certain but essential to plan for.",
  },
  {
    q: "What payment probability should I assign to each invoice?",
    a: "Use payment history as your guide. A client who always pays on time gets 95%. A new client with no history gets 80%. A chronic late payer gets 60-70%. An invoice that's already 30+ days past due drops to 50% or lower. These aren't arbitrary — they reflect real freelancer cash flow risk.",
  },
  {
    q: "How much runway should a freelancer maintain at all times?",
    a: "Most financial advisors recommend 3–6 months of business expenses as a cash buffer for freelancers with variable income. This calculator helps you see whether your pending invoices + bank balance meet that threshold, or whether you need to proactively chase more work or offer early payment discounts to speed up cash flow.",
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
