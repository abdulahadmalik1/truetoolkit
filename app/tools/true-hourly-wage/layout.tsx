import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "true-hourly-wage";
const CAT_SLUG = "life-existential-math";
const CAT_LABEL = "Life & Existential Math";
// Different from true-hourly-rate (which is for freelancers). This is for salaried
// employees — "Your Money or Your Life" framework by Vicki Robin/Joe Dominguez.
// Real hourly wage = Net income ÷ Life hours exchanged (commute, work clothes,
// decompression, job-required spending). Most salaried workers' true hourly wage
// is 30-50% below their headline hourly equivalent.
const title = "True Hourly Wage Calculator — What an Hour of Your Life Is Actually Worth";
const description = "Based on 'Your Money or Your Life': calculate your real hourly wage by dividing net income by all life-hours devoted to your job, including commute and decompression.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How is the true hourly wage different from the nominal hourly equivalent?", a: "Nominal hourly equivalent is your annual salary ÷ 2,080 hours. True hourly wage (from the 'Your Money or Your Life' methodology) divides net take-home pay by *all* hours devoted to your job: actual hours worked + commute + work-related errands + decompression time + job-related expenses converted to hours. Most workers find their true hourly wage is 30–50% below the nominal figure." },
  { q: "What counts as 'job-devoted hours' beyond the actual work?", a: "Include: commute time each way, preparation time (work clothes, grooming required only for work), decompression time after work (time spent 'recovering' from job stress before you can meaningfully engage with life), time doing job-related tasks after hours (email, research), and extra sleep needed due to work demands. These are all hours your job 'costs' you that wouldn't exist without the job." },
  { q: "What's the point of calculating this number?", a: "It converts every purchasing decision into a question of life energy: 'This $150 dinner costs X hours of my life at my true hourly wage — is it worth it?' At $15/true hour, a $150 dinner costs 10 hours of life. At $50/true hour, it costs 3 hours. The number makes trade-offs concrete and personal, which changes spending decisions more effectively than abstract budgeting." },
  { q: "How do I use this to evaluate a job offer?", a: "Calculate the true hourly wage for your current job AND the new offer. A job offering 20% more salary but with a 2-hour daily commute (4 hours round trip, 4× your current commute) may actually have a lower true hourly wage once all life hours are accounted for. This calculator makes that comparison explicit." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
