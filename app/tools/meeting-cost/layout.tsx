import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "meeting-cost";
const CAT_SLUG = "money-freelance";
const CAT_LABEL = "Money & Freelance";

// Keywords researched: "meeting cost calculator" has clear tool-intent (meetingcostcal.com
// exists as a whole dedicated domain). The actual formula is well established:
// (Attendees × Avg Hourly Rate) × Duration. Research shows real cost is 2-3x the
// face-value salary math when you include 15–25 min re-focus time per person per
// interruption (cited by focusmo.app, recaploop.com). Key differentiator: exposing
// the *annualized* cost of recurring meetings. LSI: "cost of meetings per year",
// "how much do meetings cost companies", "meeting ROI calculator".

const title = "Meeting Cost Calculator — Real Dollar Cost of Any Meeting";
const description =
  "Enter attendee count, average salary, and meeting length to instantly calculate what any meeting costs in payroll. See the annual cost of recurring syncs.";

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
    q: "How do you calculate the real cost of a meeting?",
    a: "The baseline formula is: (Number of Attendees × Average Hourly Rate) × Meeting Duration in hours. For a 'fully loaded' cost that includes employer taxes and benefits overhead, multiply by 1.3–1.4×. For a truly realistic figure, add 15–25 minutes of refocus time per attendee — research consistently shows it takes that long to return to deep work after any interruption.",
  },
  {
    q: "Are meeting costs really that significant for a company?",
    a: "Yes. A single recurring 30-minute weekly meeting with 8 engineers earning $120K/year costs roughly $9,200 per year in raw payroll — before accounting for context-switching loss. Companies running 10–20 such recurring syncs are spending $100K+ annually on meetings that could often be replaced by an async update.",
  },
  {
    q: "Should I include only salary or also benefits and overhead?",
    a: "For the most accurate cost, include fully-loaded labor costs. Benefits, payroll taxes, and overhead typically add 25–40% on top of base salary. So an employee at $100K/year actually costs the company approximately $125K–$140K total. Divide by 2,080 working hours to get a realistic hourly burden rate.",
  },
  {
    q: "What's the annual cost of a daily standup with 10 people?",
    a: "If those 10 people average $80K/year ($38.46/hr), a 15-minute standup costs $96.15 per session. Running daily on 250 working days, that's $24,038 per year — just for a standup. Add context-switching recovery and the real cost likely exceeds $35,000.",
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
