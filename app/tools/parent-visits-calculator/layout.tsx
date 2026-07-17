import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "parent-visits-calculator";
const CAT_SLUG = "life-existential-math";
const CAT_LABEL = "Life & Existential Math";
// Keywords: "how many times will I see my parents before they die" — emotionally resonant,
// memento mori search that people find surprisingly comforting rather than depressing.
// Popularized by Tim Urban (Wait But Why). Also: "remaining visits with parents calculator".
// Core math: if parents are 65 and you see them 2x/year, with ~20 years expected remaining
// life, you have ~40 visits left.
const title = "Remaining Parent Visits Calculator — How Many Times Will You See Them?";
const description = "A stark math check: enter your parents' age, your visit frequency, and life expectancy to calculate the exact number of visits you likely have left with them.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do you calculate remaining parent visits realistically?", a: "Formula: Remaining Visits = (Life Expectancy − Current Parent Age) × Visits Per Year. Adjustments: multiply by a mobility discount factor for years when parents may be too unwell to host visits (typically years 85+). Example: Parent age 68, life expectancy 87, visiting 3 times/year = 19 remaining years × 3 = 57 visits. But accounting for reduced mobility in final 3 years: approximately 48 meaningful visits remain." },
  { q: "Is calculating this morbid or is there value in knowing?", a: "Psychologists who study mortality salience (the awareness of death's inevitability) find that confronting finite time tends to increase appreciation and deliberate action rather than causing despair. Knowing you have 40 visits left makes each visit feel more significant. Most people who run this calculation report feeling motivated to visit more frequently and be more present during visits." },
  { q: "How should I adjust the calculation for parents with health conditions?", a: "Reduce the effective life expectancy to your realistic estimate based on their health conditions. You can also apply a 'quality of visit discount' — for instance, if a parent has advancing dementia, you might count years 5+ of the remaining period as 50% quality-adjusted. The goal isn't a precise number; it's the realization that the number is finite and probably smaller than your gut feeling." },
  { q: "What does this calculation suggest I should do differently?", a: "The most common response among people who run this calculation: increase visit frequency (even by one additional visit per year can add meaningful total time), focus on phone/video contact in between visits, and shift from passive to active visits — doing shared activities rather than just catching up in a living room." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "LifestyleApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
