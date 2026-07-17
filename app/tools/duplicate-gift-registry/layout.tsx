import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "duplicate-gift-registry";
const CAT_SLUG = "content-social";
const CAT_LABEL = "Content & Social";
const title = "Blind Duplicate-Proof Gift Registry — No Account, No Duplicates Guaranteed";
const description = "Create a gift registry link where each claimed gift is removed from the list shown to the next person. No account needed. Works by cryptographic state in the URL.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do you stop two people from buying the same gift off-registry?", a: "This tool encodes the list of unclaimed gifts directly into the shareable URL. When someone claims a gift, the URL they share forward contains the updated list with that item removed. Each recipient sees only unclaimed gifts. No account or server required — the state lives in the URL itself." },
  { q: "Why would someone use this instead of an Amazon or Target registry?", a: "Retail registries force the gift-giver to buy from that specific retailer, and the recipient must trust the retailer with their address. This tool is retailer-agnostic — list any gift from any source. It's particularly useful for cash contribution requests, experiences, or items from small businesses where a formal registry isn't possible." },
  { q: "Is there a limit to how many people can use the shared link?", a: "No. Each person who clicks the link sees the current unclaimed list, claims one or more items, and then shares the updated link with the next person. The 'registry' is just the URL's encoded state — it works for any number of participants without any server or account." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "SocialNetworkingApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
