import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "hobby-cost-rationalizer";
const CAT_SLUG = "life-existential-math";
const CAT_LABEL = "Life & Existential Math";
const title = "Hobby Cost Rationalizer — Is Your Hobby Worth What It Costs per Hour of Joy?";
const description = "Calculate your hobby's true cost per hour of enjoyment and compare it to other leisure alternatives. Find out if your $800 camera gear is actually cheaper than dinner out.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do you calculate whether a hobby is worth its cost?", a: "Cost Per Hour of Enjoyment = (Total Annual Hobby Cost ÷ Annual Hours of Active Enjoyment). Annual hobby cost includes gear amortized over expected lifespan, consumables, memberships, and travel. If your $1,200/year hobby gives you 200 hours of genuine enjoyment, that's $6/hour — comparable to a streaming subscription. If it only gives you 20 hours, that's $60/hour — more expensive per hour than most entertainment alternatives." },
  { q: "What's a reasonable cost-per-hour benchmark for hobbies?", a: "For context: cinema costs about $15/hour. Streaming services cost $0.50–$1.50/hour (if you actually watch). A weekly fitness class averages $8–20/hour. Dining out entertainment component: $30–100/hour. Golf: $30–80/hour. Reading physical books: $1–3/hour. There's no 'too expensive' per se — it depends on what value you get and what alternatives you'd otherwise choose." },
  { q: "Should 'skill building' count when evaluating a hobby's value?", a: "Yes — many hobbies compound in value over time. Learning to cook, play an instrument, or speak a language accrues transferable skills beyond the immediate enjoyment. When evaluating these hobbies, the cost-per-hour calculation understates value because it ignores skill development, social connections formed, and long-term satisfaction that increases as skill grows." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "LifestyleApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
