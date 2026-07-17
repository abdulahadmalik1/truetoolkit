import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "subscription-tracker";
const CAT_SLUG = "money-freelance";
const CAT_LABEL = "Money & Freelance";

// Keywords researched: "subscription tracker", "find forgotten subscriptions", "stop subscription creep".
// Search intent: people who know they're overpaying but don't know by how much.
// They want a tracker, not tips. Key distinction from competing apps (Rocket Money,
// Bobby, Tilla): those require bank account linking. Our tool is instant, private,
// no data leaves the browser. LSI: "subscription audit", "monthly recurring charges",
// "cancel unused subscriptions calculator".

const title = "Subscription Creep Tracker — See Your True Monthly Bill";
const description =
  "Add every subscription you pay for and instantly see your real monthly and annual total. Find what to cancel. Free, browser-only, no account needed.";

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
    q: "How much does the average person waste on unused subscriptions?",
    a: "Multiple studies from 2023–2024 found that US consumers underestimate their total subscription spend by $100–$200 per month on average. Research by C+R Research found consumers believe they spend around $86/month on subscriptions but the actual average is over $219/month.",
  },
  {
    q: "Why do subscriptions feel cheaper than they really are?",
    a: "Subscription pricing exploits a cognitive bias: small monthly amounts ($9.99, $14.99) feel trivial individually, but stagger across 10–15 services and they add up to thousands per year. Annualizing each charge defeats this 'micro-pricing' effect and makes the true cost visible.",
  },
  {
    q: "What's the fastest way to find all my active subscriptions?",
    a: "The most reliable method is to export 90 days of credit card and bank statements and filter for recurring vendor names. Also check: Apple ID Settings > Subscriptions, Google Play > Payments & Subscriptions, and search your inbox for 'renewal', 'receipt', and 'invoice'.",
  },
  {
    q: "Is it safe to enter my subscription data here?",
    a: "Yes — this calculator runs entirely in your browser. Your data is never transmitted to any server. Nothing is stored. You can even disconnect from the internet before entering your subscriptions if you want full confirmation.",
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
