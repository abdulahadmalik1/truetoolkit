import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "sla-refund-calculator";
const CAT_SLUG = "business-operations";
const CAT_LABEL = "Business & Operations";
// Research: SLA credits are NOT automatic — you must file a claim within 30-60 days.
// Formula: Uptime% = (Total minutes - Downtime minutes) / Total minutes × 100.
// Credit tiers: <99.9% = 10%, <99.0% = 25-30%, <95% = 50-100%.
// Key audience: devops engineers and CTOs filing post-incident credit claims.
const title = "Cloud SLA Refund Calculator — AWS & GCP Downtime Credit Estimator";
const description = "Calculate your SLA credit for cloud downtime. Enter your AWS/GCP monthly spend and downtime duration to see which credit tier you qualify for and how to claim it.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do I calculate my SLA credit after cloud downtime?", a: "Step 1: Calculate Monthly Uptime %: (Total minutes in month − Minutes unavailable) ÷ Total minutes × 100. Step 2: Find your credit tier in the provider's SLA document (typically 10% for <99.9%, 25–30% for <99.0%, 50%+ for <95%). Step 3: Calculate Credit = Monthly Spend on Affected Service × Credit Percentage. Note: credits apply only to the specific affected service in the specific affected region, not your entire bill." },
  { q: "Do cloud SLA credits happen automatically or do I have to claim them?", a: "You must actively claim them. AWS requires a credit request via AWS Support within 30 days of the incident. GCP requires a request via GCP Support within 30 days. Credits are not applied automatically. Many customers simply forget to file and lose hundreds or thousands in valid credits." },
  { q: "Do SLA credits cover my lost revenue from the downtime?", a: "No — SLA credits are purely a refund of a portion of your infrastructure fees. They do not compensate for lost revenue, lost productivity, customer churn, or any consequential business damages. SLA credits are contractual remedies, not indemnification for business impact." },
  { q: "What's the minimum downtime that qualifies for an AWS SLA credit?", a: "For EC2, downtime must exceed 5 continuous minutes for a single instance. The overall monthly uptime must fall below 99.99% (for multi-AZ) or 99.5% (for single-AZ) in the relevant region and service combination. Very short outages under 5 minutes typically don't qualify even if they caused significant business impact." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
