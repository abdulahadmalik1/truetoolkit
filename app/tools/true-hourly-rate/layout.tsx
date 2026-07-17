import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "true-hourly-rate";
const CAT_SLUG = "money-freelance";
const CAT_LABEL = "Money & Freelance";

// Keywords researched: "true hourly rate calculator" — high intent, transactional.
// Searchers are freelancers who suspect they're underpricing because they ignore
// unbillable admin hours and self-employment taxes. Competing pages: Clockify,
// Upwork blog, freelancehourlyrate.com. Our differentiator: instant, no signup,
// browser-only. LSI: "freelance rate calculator", "billable vs non-billable hours",
// "self-employment tax calculator freelancer".

const title = "True Hourly Rate Calculator for Freelancers (Free, Instant)";
const description =
  "Find out what you actually earn per hour after taxes, unbillable admin time, and expenses. Free true hourly rate calculator — no signup, runs in your browser.";

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
    q: "How is my true hourly rate different from my quoted rate?",
    a: "Your quoted rate is the gross price you charge clients. Your true hourly rate is what you actually take home after deducting self-employment taxes (roughly 15.3% in the US on top of income tax), business expenses like software and insurance, and dividing by your *total* working hours — including unbillable time spent on emails, invoicing, and business development.",
  },
  {
    q: "What counts as an unbillable hour for a freelancer?",
    a: "Any hour you work that no client pays for — answering emails, writing proposals, onboarding new clients, doing your bookkeeping, attending unpaid discovery calls, and marketing yourself. For most freelancers, unbillable hours represent 30–50% of their working week.",
  },
  {
    q: "How much should I raise my rate to account for self-employment taxes?",
    a: "US freelancers pay both the employer and employee halves of FICA (Social Security + Medicare), which together total 15.3% on net self-employment income, on top of regular income tax. A practical rule of thumb is to add at least 25–35% to your baseline break-even rate just to cover this tax gap.",
  },
  {
    q: "Can my true hourly rate be lower than my minimum wage equivalent?",
    a: "Yes — this is surprisingly common. A freelancer charging $60/hr who works 15 unbillable admin hours per 25 billable hours, pays 28% effective taxes, and has $500/month in business expenses can end up with an effective take-home rate below $25/hr.",
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
