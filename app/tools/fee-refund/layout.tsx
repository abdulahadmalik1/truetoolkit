import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "fee-refund";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";
const title = "Tuition Fee Refund Proration Calculator — Withdrawal Refund Amount";
const description = "Calculate your exact prorated tuition refund after withdrawing from a course. Enter the semester dates and your withdrawal date to see what you're owed.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How is a prorated tuition refund calculated after withdrawal?", a: "Most institutions use a stepped refund schedule rather than true daily proration. A typical schedule: Withdraw before Day 1: 100% refund. Week 1: 80–100% refund. Week 2: 60–80% refund. Week 3: 40–60% refund. After Week 4: No refund. True proration divides refund by days: (Days Remaining in Semester ÷ Total Semester Days) × Tuition Paid." },
  { q: "Does financial aid get refunded when I withdraw from a course?", a: "This is complex and institution-specific. Title IV federal financial aid in the US follows the Return to Title IV (R2T4) formula, which calculates how much aid you 'earned' based on days attended. If you withdraw early, you may owe money back to the institution or directly to the federal government, separate from any tuition refund." },
  { q: "What's the difference between a course withdrawal and a complete university withdrawal?", a: "Withdrawing from a single course usually doesn't trigger refund calculations unless it drops you below full-time status. A complete withdrawal from all courses triggers the institution's formal refund policy. Always check with the registrar's office for your specific institution's rules before withdrawing." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "EducationApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
