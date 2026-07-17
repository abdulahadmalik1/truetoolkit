import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "gift-splitter";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";
const title = "Group Gift Contribution Splitter — Fair Split When Budgets Differ";
const description = "Split a group gift cost fairly when different people can contribute different amounts. Set a minimum, let people volunteer their share, and balance the rest.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do you split a group gift fairly when people can afford different amounts?", a: "Collect voluntary pledges from each contributor. People who can contribute more volunteer a higher amount; people with tighter budgets pledge what they can. Remaining balance after pledges is then split equally among those who haven't yet pledged or who opted for 'even split'. This approach avoids the awkwardness of assigning amounts while ensuring the gift gets fully funded." },
  { q: "What's the most socially comfortable way to collect group gift money?", a: "The most friction-free approach: one person collects all payments digitally (Venmo, PayPal, bank transfer) so no cash changes hands. Set a deadline 1 week before you need to purchase. Send reminders at 3 days and 1 day before the deadline. Avoid public shaming in group chats for non-payers — a private message is more effective." },
  { q: "Should the gift organizer pay a different amount for coordinating?", a: "Some groups give the organizer a discount (paying slightly less) as compensation for the administrative work. Others split equally. If coordinating involved significant effort — researching the gift, managing payments, organizing wrapping — a 10–20% discount for the organizer is a common and fair convention." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
