import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "reply-time-generator";
const CAT_SLUG = "time-remote-work";
const CAT_LABEL = "Time & Remote Work";

const title = "Async Reply-Time Expectation Generator — Remote Team Response Norms";
const description =
  "Generate a clear, written async communication charter for your remote team. Set channel-specific response-time expectations and eliminate the 'always-on' anxiety.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/tools/${slug}` },
  openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  {
    q: "What's a reasonable async reply-time expectation for remote teams?",
    a: "Industry norms vary by channel urgency: Slack/IM: 2–4 hours during work hours. Email: within 24 hours, same business day. Project management tools (Asana, Linear): 24–48 hours. Nothing outside work hours unless explicitly marked urgent. The key is that norms must be *written down* and agreed upon — assumed expectations cause the most remote team friction.",
  },
  {
    q: "How do async response norms reduce burnout on remote teams?",
    a: "Without explicit norms, people check Slack constantly out of anxiety about missing something urgent. Research by Harvard Business Review found that knowledge workers check email/Slack on average every 6 minutes. Explicit norms grant permission to batch communications and protect focus time, measurably reducing stress.",
  },
  {
    q: "Should urgent messages have a different channel than non-urgent ones?",
    a: "Yes — this is a core principle of asynchronous-first culture. Define one channel for true emergencies (production down, immediate action required) with an expectation of 15–30 minute response. Everything else uses channels with longer SLAs. This prevents 'urgency inflation' where everything feels like an emergency.",
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
