import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "notification-cost";
const CAT_SLUG = "time-remote-work";
const CAT_LABEL = "Time & Remote Work";

// Keywords: "cost of interruptions at work calculator", "how much do notifications cost".
// Research: Takes 15-25 min to regain full focus after an interruption (UC Irvine study).
// Average knowledge worker gets 56+ interruptions per day. This is a genuinely under-served
// keyword — most content is blog posts, almost no interactive tools exist. LSI:
// "notification distraction cost calculator", "how many hours do interruptions cost per day",
// "deep work vs shallow work time calculator".

const title = "Notification Interruption Cost Calculator — Hours Lost to Distractions";
const description =
  "Enter how many daily notifications you get and your hourly rate. See the exact hours of focus lost per day and the annual financial cost of notification culture.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/tools/${slug}` },
  openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  {
    q: "How many hours of focus do daily notifications actually cost?",
    a: "Research from UC Irvine (Gloria Mark) found it takes an average of 23 minutes and 15 seconds to fully regain concentration after an interruption. If you receive just 10 interruptions per day, that's 3.87 hours of recovery time — meaning even a seemingly manageable number of notifications can consume half a workday.",
  },
  {
    q: "How is the financial cost of interruptions calculated?",
    a: "The formula is: (Number of Daily Interruptions × Minutes to Regain Focus ÷ 60) × Your Hourly Rate × Annual Workdays. For a $50/hour knowledge worker with 20 daily interruptions and 20-minute recovery time: 20 × (20/60) × $50 × 250 = $83,333 in lost productive value per year.",
  },
  {
    q: "Does turning off notifications actually improve productivity?",
    a: "Yes, substantially. Studies consistently show that batching communication checks to 2–4 times per day — rather than responding to each notification as it arrives — can recover 1–3 hours of deep focus daily. For teams, implementing 'notification-free hours' produces measurable gains in output quality.",
  },
  {
    q: "Not all notifications are equal — some are urgent. How do I account for that?",
    a: "This calculator lets you input the percentage of notifications that require immediate action (true urgencies). The remainder are the 'false urgency' notifications — the ones that feel urgent but aren't — and those are what drive the focus recovery cost. Most knowledge workers find less than 10% of their notifications require same-minute responses.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name: title, description, applicationCategory: "ProductivityApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
      { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
