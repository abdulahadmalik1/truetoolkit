import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "farm-yield-ledger";
const CAT_SLUG = "business-operations";
const CAT_LABEL = "Business & Operations";
const title = "Small Farm Cost-Per-Yield Ledger — Breakeven Calculator for Lender Reports";
const description = "Calculate exact cost per unit yield for any crop or animal product. Generate a lender-ready financial snapshot showing breakeven price and margin per season.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do I calculate true cost-per-unit-yield for a lender or insurer?", a: "Total Production Cost ÷ Total Yield = Cost Per Unit. Total Production Cost must include: seed/livestock purchase, land cost (rent or imputed ownership cost), labor (including your own at a market rate), water and utilities, equipment depreciation, fertilizer/feed, insurance, and marketing/transport. Many small farm operators undercount by omitting their own labor and equipment depreciation." },
  { q: "What financial data do agricultural lenders typically require?", a: "Lenders for agricultural loans (USDA FSA loans, commercial ag loans) typically require: 3 years of production records, a current year cash flow projection, breakeven price per unit for primary crops/products, and a debt service coverage ratio showing income above debt payments. This ledger produces the breakeven and margin data needed for that analysis." },
  { q: "How should I account for equipment depreciation in farm cost calculations?", a: "Use straight-line depreciation: (Equipment Purchase Price − Salvage Value) ÷ Useful Life in Years = Annual Depreciation. Allocate to specific enterprises by hours or acres of use. A tractor used 60% on corn and 40% on soybeans allocates 60% of its annual depreciation cost to the corn enterprise's cost calculation." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
