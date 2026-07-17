import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "password-checker";
const CAT_SLUG = "content-social";
const CAT_LABEL = "Content & Social";
const title = "Password Weakness Explainer — Why Is My Password Weak? (Specific Reasons)";
const description = "Don't just get a score — find out exactly why your password is weak. This tool explains each specific weakness with clear reasoning. No password is ever sent to a server.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "What specifically makes a password weak, beyond a generic score?", a: "Specific weaknesses: (1) Length under 12 characters — every additional character multiplies the search space exponentially. (2) Dictionary words — even with substitutions (p@ssw0rd), these are in attacker wordlists. (3) Predictable patterns: sequential numbers (123), keyboard walks (qwerty), repeated characters. (4) Personal information (birth years, names) that can be guessed from public data. (5) Reuse across sites — a breach of one site exposes all others." },
  { q: "How long would it take a computer to crack my password?", a: "This depends entirely on the attack method and hardware. A modern GPU can test billions of simple passwords per second in an offline attack. An 8-character password with letters, numbers, and symbols has about 218 trillion combinations — which sounds huge but can be cracked in hours with specialized hardware. A 16-character random passphrase is estimated to take billions of years with current technology." },
  { q: "Is my password safe to enter in this tool?", a: "Yes — this tool analyzes your password entirely in your browser. It is never transmitted to any server, never stored, and never logged. You can verify this by disconnecting from the internet before typing and seeing that the analysis still works in real time." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "SecurityApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
