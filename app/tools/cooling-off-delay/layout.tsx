import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "cooling-off-delay";
const CAT_SLUG = "content-social";
const CAT_LABEL = "Content & Social";
const title = "Cooling-Off Send Delay — Lock Your Angry Message Until a Timer Expires";
const description = "Write your message, set a delay (15 min to 24 hours), and the tool vaults it until the countdown ends. Physically prevents sending impulsive emails or texts.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How does a send-delay timer prevent regretted messages?", a: "By creating a mandatory 'cooling off' period between the emotional state that produces a reactive message and the physical act of sending it. Research in behavioral psychology shows that emotional states that feel permanent in the moment typically moderate significantly within 15–30 minutes. The timer creates the friction needed for this natural regulation to occur." },
  { q: "What should the minimum cooling-off period be for an angry professional email?", a: "For professional communication involving conflict, most executive coaches recommend a minimum of 4 hours and ideally sleeping on it overnight. For personal messages, 15–30 minutes is often enough for moderate frustration. This tool lets you choose based on how elevated your emotion level feels — the stronger the feeling, the longer the vault should be set." },
  { q: "Can I edit the message during the countdown?", a: "Yes — you can view and edit the vaulted message at any time during the countdown. You can also cancel the send entirely. The timer doesn't lock your editing ability, only the send action. This is by design: reflection often results in a refined, calmer version of the message rather than abandonment." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "ProductivityApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
