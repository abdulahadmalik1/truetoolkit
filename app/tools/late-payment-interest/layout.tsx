import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "late-payment-interest";
const CAT_SLUG = "money-freelance";
const CAT_LABEL = "Money & Freelance";

// Keywords: "late payment interest calculator invoice", "freelance late payment interest".
// Research confirmed clear legal differences: UK has the Late Payment of Commercial
// Debts Act 1998 giving 8% + Bank of England base rate *automatically*. US requires
// a contract clause — no contract = relying on state statutory rates (5-12%/year).
// Most freelancers don't know they have this right in the UK, or that their US contract
// must include a clause. This is high educational value + tool value. LSI: "invoice
// overdue interest calculator", "statutory interest on late invoice UK", "how to charge
// interest on unpaid invoices".

const title = "Freelance Late-Payment Interest Calculator — Overdue Invoice Interest";
const description =
  "Calculate the exact interest owed on an overdue client invoice. Supports UK statutory rate (8% + BoE base) and custom rates for US freelancers. Free, instant.";

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
    q: "Can freelancers legally charge interest on late invoices?",
    a: "Yes, in most jurisdictions. In the UK, under the Late Payment of Commercial Debts (Interest) Act 1998, you automatically have the right to charge 8% plus the Bank of England base rate on unpaid B2B invoices — no contract clause needed. In the US, your right to charge interest depends on having a late payment clause in your signed contract; without one, you may be limited to your state's statutory interest rate.",
  },
  {
    q: "What is the formula for calculating late payment interest?",
    a: "The standard formula is: (Invoice Amount × Annual Interest Rate × Days Overdue) ÷ 365. For a $5,000 invoice 60 days overdue at 1.5% per month (18% annual), the calculation is: ($5,000 × 0.18 × 60) ÷ 365 = $147.95 in interest.",
  },
  {
    q: "What interest rate should I charge on late invoices?",
    a: "UK freelancers should use the statutory rate: 8% + current BoE base rate. US freelancers commonly use 1.5% per month (18% annually), which is a widely accepted standard. Always ensure your rate doesn't exceed your state's usury laws. Whatever rate you choose, it must be in writing in your contract before the work begins.",
  },
  {
    q: "Can I add fixed compensation fees on top of interest in the UK?",
    a: "Yes. In addition to statutory interest, UK law allows you to claim a fixed compensation amount per invoice: £40 for invoices under £1,000, £70 for £1,000–£9,999.99, and £100 for invoices of £10,000 or more.",
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
