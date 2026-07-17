import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "leave-forfeiture";
const CAT_SLUG = "time-remote-work";
const CAT_LABEL = "Time & Remote Work";

// Keywords: "use it or lose it PTO calculator", "how much PTO am I losing".
// Many US states allow "use it or lose it" PTO — meaning unused days are forfeited
// at year end with zero cash payout. Other states require cash payout. This is highly
// state-specific and emotionally charged — people feel real loss when they see the
// number. LSI: "PTO forfeiture calculator", "unused vacation day value calculator",
// "how much is my PTO worth in dollars".

const title = "Unused Leave Forfeiture Calculator — Cash Value of PTO You're Losing";
const description =
  "Calculate the exact dollar value of unused PTO days you'll forfeit at year end. See your accrued leave in salary terms before the 'use it or lose it' deadline hits.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/tools/${slug}` },
  openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  {
    q: "How much money am I losing if I don't use my PTO?",
    a: "The formula is: (Annual Salary ÷ 52 weeks ÷ 5 days) × Number of Unused Days. For a $60,000/year employee with 8 unused days: ($60,000 ÷ 260 working days) × 8 = $1,846 in forfeited compensation. In states with 'use it or lose it' policies, this is pure loss — no payout, no rollover.",
  },
  {
    q: "Which US states require employers to pay out unused PTO?",
    a: "California, Colorado, Montana, and Nebraska require employers to pay out all accrued PTO upon termination. Most other states allow 'use it or lose it' policies as long as employees are clearly notified. Always check your specific state's Department of Labor for current rules — this varies.",
  },
  {
    q: "Can my employer actually take away accrued vacation days?",
    a: "In most US states, yes — if your employer has a written 'use it or lose it' policy that you acknowledged when hired. In California and a handful of other states, no — accrued PTO is treated as earned wages and cannot be forfeited. In the UK, accrued statutory leave (28 days/year) must generally be paid out upon termination.",
  },
  {
    q: "What's the most efficient way to use PTO strategically before year end?",
    a: "Bridge holidays — adding 1–2 PTO days around a public holiday turns it into a 4–5 day break. Long weekends are another efficient use. The goal is maximizing consecutive rest days per PTO day spent, which research shows provides greater recovery than scattered single days.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name: title, description, applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
      { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
