import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "scope-creep-ledger";
const CAT_SLUG = "money-freelance";
const CAT_LABEL = "Money & Freelance";

// Keywords: "scope creep calculator freelance", "how to track scope creep with freelance client".
// Research showed the core need: proving scope creep with data, not feelings. The
// key metric that makes scope creep undeniable: showing that the client's "quick
// additions" have dropped the effective hourly rate from $100/hr to $40/hr. Clients
// can argue with feelings; they cannot argue with a rate erosion chart.
// The formula: Effective Rate = Total Project Fee / Actual Hours Logged.
// LSI: "scope creep tracker for freelancers", "freelance change order calculator",
// "how to charge for out-of-scope work".

const title = "Scope-Creep Ledger — Track & Quantify Out-of-Scope Work";
const description =
  "Log hours against your original SOW and watch your effective hourly rate erode in real time. Generate a change-order report to prove scope creep with numbers.";

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
    q: "How do I prove scope creep to a client with numbers, not just a feeling?",
    a: "Track every hour worked against the deliverables in your original Scope of Work (SOW). Calculate your Effective Hourly Rate: Total Project Fee ÷ Total Hours Logged. When that rate drops below your minimum acceptable rate, you have a mathematically undeniable case for a change order. A client can argue with your feelings, but not with an effective rate of $32/hr when you quoted $85/hr.",
  },
  {
    q: "What is the formula for tracking scope creep?",
    a: "The key formula is: Out-of-Scope Hours = Total Hours Logged − Original Estimated Hours. The financial impact is: Lost Revenue = Out-of-Scope Hours × Your Hourly Rate. This ledger tracks both automatically as you log time, and shows the cumulative dollar value of the work you've given away.",
  },
  {
    q: "Should I charge for every single small request that wasn't in the original scope?",
    a: "Not necessarily — minor requests that take 5 minutes are often worth absorbing for client goodwill. But anything over 30 minutes deserves a formal change order. The key is documentation: even if you choose not to charge for small additions, log them. The pattern of accumulated 'small' requests often reveals surprising totals over a project.",
  },
  {
    q: "What's a change order and when should I send one?",
    a: "A change order is a written amendment to your original contract that specifies new deliverables, additional cost, and timeline impact. Send one whenever a client requests something not explicitly covered in the original SOW. Framing: 'I'd love to add this — it falls outside the original brief, so I've drafted a change order for your review before I begin.'",
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
        applicationCategory: "BusinessApplication",
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
