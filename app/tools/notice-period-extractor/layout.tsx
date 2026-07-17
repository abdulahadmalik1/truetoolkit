import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "notice-period-extractor";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";
const title = "Notice-Period Deadline Calculator — When Must You Cancel to Avoid Auto-Renewal?";
const description = "Enter your contract's auto-renewal date and required notice period to calculate the exact deadline you must cancel by. Never miss a cancellation window again.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do I calculate the real deadline to cancel before auto-renewal?", a: "Find your contract's renewal date, then subtract the required notice period. If your annual gym membership renews on January 1st and requires 30-days notice, your cancellation deadline is December 2nd. Many contracts bury this: 'written notice must be received at least [X] days before the end of the current term' — that means they must RECEIVE it, not that you must send it." },
  { q: "What happens if I miss the notice period deadline?", a: "The contract automatically renews for another full term — typically 12 months. You're then legally bound to the entire new term, including cancellation fees if you try to exit early. Some consumer protection laws (FTC's negative option rule, EU consumer rights) provide relief, but enforcement requires effort. The safest move is to calendar the deadline the day you sign." },
  { q: "What's the difference between 'notice period' and 'cancellation window'?", a: "The notice period is how many days advance warning you must give. The cancellation window is the time after that when cancellation takes effect. A '30-day notice period with a cancellation window' means: send notice 30+ days before renewal, and your contract ends on the renewal date rather than immediately." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
