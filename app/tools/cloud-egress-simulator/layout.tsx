import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "cloud-egress-simulator";
const CAT_SLUG = "business-operations";
const CAT_LABEL = "Business & Operations";
// Research: AWS egress tiered: $0.09/GB first 10TB, $0.085/GB 10-50TB, $0.07/GB 50-150TB.
// GCP similar tier structure. Cloudflare R2: $0.00/GB egress, making it the undisputed
// winner for high-egress workloads. The hidden costs: cross-AZ transfer within AWS adds
// $0.01/GB each way — often invisible until billing arrives.
const title = "Cloud Egress Cost Simulator — Compare AWS vs GCP vs Cloudflare Data Transfer";
const description = "Estimate monthly data transfer fees across AWS, GCP, and Cloudflare for your traffic volume. See the exact cost difference and which provider is cheapest for egress.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "What is cloud egress cost and why is it so significant?", a: "Cloud egress cost is the fee charged when data leaves a cloud provider's network — to the internet, to another region, or to another cloud. Unlike ingress (inbound data, usually free), egress is typically charged per gigabyte. At scale, egress costs become one of the largest cloud line items. A company serving 100TB of data monthly at AWS standard rates pays approximately $9,000 in egress fees alone." },
  { q: "How much does AWS charge for data transfer out to the internet?", a: "AWS egress to internet pricing (2024): $0.09/GB for the first 10TB/month, $0.085/GB for the next 40TB, $0.07/GB for the next 100TB, $0.05/GB beyond 150TB. The first 100GB per month is free. These rates apply per account, not per service, and are aggregated across all regions." },
  { q: "Why is Cloudflare R2 so much cheaper for egress?", a: "Cloudflare charges $0.00/GB for egress from R2 storage (their S3-compatible object storage). They can offer this because their business model is based on network services (DDoS, CDN), not compute and storage. For high-egress workloads — serving large files, videos, or large datasets publicly — R2 vs S3 can represent tens of thousands of dollars per year in savings." },
  { q: "What's cross-AZ data transfer and why does it appear on my AWS bill?", a: "Moving data between EC2 instances in different Availability Zones (even within the same AWS Region) costs $0.01/GB each way. This charge is generated automatically by common architectures: multi-AZ databases with read replicas, microservices in different AZs calling each other, ELB traffic routing. It's invisible in architecture diagrams but shows up in billing reports as unexpected charges." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
