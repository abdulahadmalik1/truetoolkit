import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "personal-inflation-tracker";
const CAT_SLUG = "life-existential-math";
const CAT_LABEL = "Life & Existential Math";
// Research: Personal inflation rate = weighted average of category price changes
// using YOUR spending mix as weights, not the CPI basket. Salary negotiation angle:
// "My personal inflation rate is 7.3% this year based on my housing and grocery spend,
// while the CPI is 4.1% — so my 3% raise is actually a pay cut."
const title = "Personal Inflation Rate Calculator — Your Cost-of-Living vs Official CPI";
const description = "Calculate your own inflation rate from your actual spending categories. Find out how your real cost-of-living increase compares to the national CPI. Free, browser-only.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do I calculate my personal inflation rate?", a: "Step 1: List your spending categories (housing, groceries, transport, healthcare, etc.). Step 2: Calculate what percentage of your total budget each category represents. Step 3: Estimate the price increase you've personally experienced in each category this year. Step 4: Multiply each category's price increase by its budget weight, then sum all results. This is your personal weighted inflation rate — the rate that actually affects your purchasing power." },
  { q: "Why does my personal inflation rate feel higher than the CPI?", a: "The CPI is a national average across all household types. If you spend more than average on housing (which inflated 5–8% annually in 2022–2023), childcare, or healthcare, your personal rate is higher. Conversely, if you don't own a car and the national CPI is pushed by fuel prices, your rate may be lower. The CPI reflects nobody's exact experience." },
  { q: "How can I use my personal inflation rate in salary negotiations?", a: "Frame it as a data-driven argument: 'My cost of living has increased X% this year based on my specific expenditures, while the national CPI was Y%. A raise that doesn't match my actual cost-of-living increase represents a real-terms pay cut.' This is significantly more persuasive than simply asking for a raise or citing national CPI, because it's personalized and verifiable." },
  { q: "Which spending categories vary most from the CPI?", a: "Housing (shelter) is the most volatile and often diverges most from the CPI shelter index because the CPI uses 'owners' equivalent rent' which lags actual market rents significantly. Childcare and education often inflate faster than CPI. Food at home tracks CPI fairly closely. Healthcare premiums often inflate 5–8% annually, well above general CPI." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
