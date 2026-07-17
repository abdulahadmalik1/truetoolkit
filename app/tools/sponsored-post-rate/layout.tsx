import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "sponsored-post-rate";
const CAT_SLUG = "content-social";
const CAT_LABEL = "Content & Social";
const title = "Influencer Sponsored Post Rate Calculator — Fair Rate from Engagement, Not Followers";
const description = "Calculate a fair sponsored post rate based on your actual engagement rate, not vanity follower count. See your estimated CPM, CPE, and recommended floor price.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do you calculate a fair sponsored post rate from engagement, not just followers?", a: "Industry standard: CPE (Cost Per Engagement) method. Base Rate = (Average Post Engagements × CPE Benchmark) where CPE benchmarks vary by platform: Instagram $0.10–$0.50 per engagement, TikTok $0.04–$0.08, YouTube $0.05–$0.30. Alternatively, use CPM: (Average Impressions ÷ 1,000) × CPM Rate ($10–$50 for niche audiences). An account with 10,000 followers but 8% engagement outperforms one with 100,000 followers at 0.5% engagement." },
  { q: "What's considered a good engagement rate on Instagram and TikTok?", a: "Instagram: 1–3% is average, 3–6% is good, 6%+ is excellent for accounts over 10K followers. Nano accounts (1K–10K) naturally see higher rates of 5–10%. TikTok engagement can be much higher due to the For You Page algorithm — 4–8% is average, with viral content exceeding 20%. Engagement rate declines as follower count grows." },
  { q: "Should I charge more for exclusive content rights or usage rights?", a: "Yes — usage rights are a separate line item from creation. If a brand wants to repurpose your content as paid ads (whitelisting), that typically costs an additional 50–100% of your creation fee per month of usage. Exclusivity in your niche (not working with competitors for 30–90 days) is another premium that typically adds 25–50% to the base rate." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
