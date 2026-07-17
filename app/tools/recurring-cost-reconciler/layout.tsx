import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "recurring-cost-reconciler";
const CAT_SLUG = "content-social";
const CAT_LABEL = "Content & Social";
const title = "Recurring Group Expense Tracker — Who Owes What Over Time?";
const description = "Track ongoing shared costs (rent, utilities, streaming, groceries) with running balances. Instantly see who's subsidizing the group and who's behind on their share.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do you track ongoing shared costs, not just one-time split bills?", a: "One-time bill splitters handle a single event. Recurring cost trackers maintain a running ledger: each person's cumulative payments vs. their cumulative fair share. The balance tells you who is 'up' (has overpaid and is owed money) and who is 'behind' (has underpaid and owes money). This is essential for shared housing or long-term collaborative expenses." },
  { q: "What's the most common source of conflict in shared housing finances?", a: "Asymmetric payment of variable costs: one person consistently pays for groceries, another for internet, another for cleaning supplies. Without a ledger, it's impossible to tell if these are roughly equal over time. Tracking every expense with a running balance removes the need to argue from memory and makes the math undeniable." },
  { q: "Does this calculator store financial data between sessions?", a: "Data entered here is held in your browser session only — it is not sent to any server or stored in a database. For persistent tracking over weeks and months, we recommend bookmarking the page and adding entries per session, or exporting your ledger summary for external record-keeping." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
