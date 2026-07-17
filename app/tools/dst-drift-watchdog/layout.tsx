import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "dst-drift-watchdog";
const CAT_SLUG = "time-remote-work";
const CAT_LABEL = "Time & Remote Work";

// Keywords: "daylight saving time meeting checker", "DST timezone meeting shift checker".
// This is a genuine niche pain point — recurring meetings on calendar apps silently
// shift by 1 hour when DST transitions happen on different dates in different countries
// (e.g., US changes 2 weeks before EU). Active complaint threads on Microsoft/Slipstick
// forums confirm real user pain. No dedicated tool exists for this. LSI: "why does my
// recurring meeting shift after daylight saving", "DST meeting time discrepancy checker",
// "recurring meeting timezone DST problem".

const title = "DST Drift Watchdog — Find Meetings That Silently Shift After DST";
const description =
  "Detect which weeks your recurring meetings will silently shift by 1 hour because the US and EU change clocks on different dates. No more surprise 5 AM call times.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/tools/${slug}` },
  openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  {
    q: "Why do recurring meetings shift by an hour after daylight saving changes?",
    a: "Because the US and most of Europe change their clocks on different dates — the US changes on the second Sunday of March and first Sunday of November, while the EU changes on the last Sunday of March and October. During the 2–3 week gap between transitions, any recurring meeting bridging those two zones will appear 1 hour earlier or later than expected for one side.",
  },
  {
    q: "Which timezone pairs are most likely to cause DST drift problems?",
    a: "The US–Europe pair is the most common: during the gap weeks in March and October, a New York–London recurring meeting shifts by 1 hour for 2 weeks per year. Australia is particularly complex — it's in the Southern Hemisphere and changes clocks in October and April, causing year-round potential drift with Northern Hemisphere meeting partners.",
  },
  {
    q: "Does this problem happen in calendar apps like Outlook or Google Calendar?",
    a: "Yes, and it's a known bug that generates active complaint threads on Microsoft support forums and Slipstick.com. The apps store meeting times in UTC but display them in local timezone — when a participant's timezone transitions and the other's hasn't yet, the displayed local time shifts relative to what was agreed. There is no native fix in most calendar apps.",
  },
  {
    q: "How can I prevent DST drift from affecting my recurring meetings?",
    a: "The most reliable workaround is to set recurring meetings to occur at a UTC time (displayed in meeting notes) rather than relying on local timezone display. Alternatively, use this tool to identify which specific weeks will be affected, and manually rebook those single instances at the original agreed local time.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name: title, description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
      { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
