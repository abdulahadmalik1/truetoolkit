import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "focus-session-ticker";
const CAT_SLUG = "time-remote-work";
const CAT_LABEL = "Time & Remote Work";

const title = "Focus Session Value Ticker — Watch Your Deep Work Earn in Real Time";
const description =
  "Set your hourly rate and watch a live dollar counter tick up every second you stay focused. Gamify your deep work sessions and feel the cost of distractions.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/tools/${slug}` },
  openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  {
    q: "How do you put a dollar value on a focus session?",
    a: "Divide your effective hourly rate by 3,600 to get a per-second rate. For a $75/hour freelancer, each second of focused work earns $0.0208, each minute $1.25, and each Pomodoro-style 25-minute block $31.25. Watching this tick in real time makes abstract 'time is money' advice viscerally concrete.",
  },
  {
    q: "Can gamifying deep work actually improve productivity?",
    a: "Research on behavioral economics suggests that real-time feedback loops (like a dollar counter) increase task engagement. The key mechanism: instead of measuring effort in abstract 'hours worked', you see concrete accumulated value, which activates the same reward circuitry as earning money.",
  },
  {
    q: "How does a notification interrupt my focus session value?",
    a: "Every time you break focus, you don't just lose the minutes spent on the distraction — you lose the 15–25 minutes of context-rebuilding afterward. On a $75/hour rate, one notification that causes a 20-minute recovery costs you $25. This calculator's related tool, Notification Cost Calculator, quantifies exactly this loss.",
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
