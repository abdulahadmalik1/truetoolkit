import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "one-more-year-calculator";
const CAT_SLUG = "life-existential-math";
const CAT_LABEL = "Life & Existential Math";
// Keywords: "one more year syndrome calculator", "FIRE movement one more year calculator".
// "One more year syndrome" is a documented phenomenon in the FIRE community where someone
// who has technically enough to retire keeps working "one more year" due to risk aversion.
// The calculator shows the exact cost of each additional year in terms of: lost leisure
// years, % portfolio growth at different SWR, and opportunity cost.
const title = "One-More-Year Syndrome Detector — True Cost of Delaying Retirement";
const description = "Calculate exactly what each additional year of work costs in leisure years, income beyond your number, and how much your portfolio grows per extra year worked.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "What is 'one more year syndrome' in retirement planning?", a: "One More Year (OMY) syndrome describes the pattern of people who have already reached their financial independence number continuing to work for additional safety margin — then repeating this annually. It's driven by loss aversion (fear of running out of money) and identity (work = purpose). Each additional year provides diminishing risk reduction while consuming a disproportionate amount of remaining healthy life years." },
  { q: "How much does one extra year of work actually change my retirement security?", a: "At a typical safe withdrawal rate (3.5–4%), one additional year of work: adds approximately 20–30× your annual savings to the portfolio, reduces your withdrawal period by 1 year, and increases your SWR safety margin by roughly 0.1–0.2 percentage points. Whether this marginal safety is worth one year of your finite healthy life is a personal calculation — this tool shows you the numbers explicitly." },
  { q: "At what point does working longer actually not improve retirement security?", a: "Research by ERN (Early Retirement Now) on CAPE-based SWR suggests that once your portfolio covers 25–30× annual expenses (3.3–4% SWR), additional years of work provide very small incremental security. The sequence-of-returns risk that drives retirement failure is largely insensitive to starting 1–2 years earlier vs. later, but is very sensitive to withdrawal rate." },
  { q: "Is it rational to want 'one more year' of safety?", a: "To a point, yes — rational risk aversion is healthy. The syndrome becomes irrational when: you have clearly exceeded any reasonable safety threshold, the additional year produces less than 0.2% SWR improvement, or you are consistently trading healthy life years for financial margin you'll never need. This calculator helps you see where on that spectrum your specific situation falls." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
