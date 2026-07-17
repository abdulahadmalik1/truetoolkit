import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "moving-cost-estimator";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";
const title = "Moving Day True-Cost Estimator — Budget for Every Hidden Moving Expense";
const description = "Calculate the complete cost of your move including movers, truck rental, packing supplies, utility setup fees, and the hidden expenses people always forget.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "What hidden costs do people forget when budgeting for a move?", a: "The most commonly forgotten moving expenses: utility connection/transfer fees ($50–$200 per utility), parking permits for moving trucks ($50–$150), professional cleaning of old residence ($150–$400), temporary storage if move dates don't align ($100–$300/month), replacing items too heavy to move vs. cost to transport, and the new home's immediate repair or setup needs." },
  { q: "How much does a local move typically cost with professional movers?", a: "Local moves (under 50 miles) with professional movers typically run $800–$2,500 for a 1–2 bedroom home, and $1,500–$4,000 for a 3+ bedroom home. Variables include floor count (stairs add $50–$100/flight), furniture complexity, distance within city, and weekday vs. weekend pricing." },
  { q: "Is it cheaper to rent a truck or hire movers?", a: "Truck rental is cheaper in direct cost ($200–$600 for a local move) but requires your own labor. When you factor in helpers (friends or hired labor), your time, fuel, and the risk of damaged items, professional movers often win on total value — especially for heavy furniture, long distances, or high-value items." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
