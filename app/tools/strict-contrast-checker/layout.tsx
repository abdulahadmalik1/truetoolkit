import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "strict-contrast-checker";
const CAT_SLUG = "business-operations";
const CAT_LABEL = "Business & Operations";
// Keywords: "WCAG contrast checker", "color contrast accessibility calculator".
// Research: WCAG 2.1 AA requires 4.5:1 for normal text, 3:1 for large text.
// WCAG 2.1 AAA requires 7:1 for normal text. APCA (proposed WCAG 3.0) uses a
// perceptual model based on human visual system rather than simple ratio math.
// Key differentiator: most contrast checkers only show pass/fail. Ours shows
// the actual formula, the exact ratio needed, and why APCA changes things.
const title = "WCAG Contrast Ratio Calculator — AA, AAA & APCA All in One Tool";
const description = "Calculate the exact WCAG 2.1 contrast ratio for any two hex colors. Check AA and AAA compliance for body text, large text, and UI components. Free, instant.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "What WCAG contrast ratio do I actually need for normal body text?", a: "WCAG 2.1 Level AA (the legal standard in most jurisdictions for ADA, EN 301 549, and similar regulations): minimum 4.5:1 for text under 18pt (or under 14pt bold). Level AAA (enhanced, not legally required but recommended): minimum 7:1. For large text (18pt+ or 14pt+ bold): AA requires 3:1, AAA requires 4.5:1. For UI components and focus indicators: AA requires 3:1 against adjacent colors." },
  { q: "How is the WCAG contrast ratio actually calculated?", a: "Formula: Contrast Ratio = (L1 + 0.05) ÷ (L2 + 0.05), where L1 is the relative luminance of the lighter color and L2 is the relative luminance of the darker color. Relative luminance linearizes the sRGB channel values and weights them by human visual sensitivity: 0.2126×R + 0.7152×G + 0.0722×B. The 0.05 offset prevents division by zero for pure black." },
  { q: "What is APCA and how is it different from WCAG 2.x contrast ratios?", a: "APCA (Advanced Perceptual Contrast Algorithm) is proposed for WCAG 3.0 and uses a perceptual model that accounts for font size, weight, and the actual human visual system's response — which the current 4.5:1 ratio doesn't do. A pair of colors that passes WCAG 2.1 AA might fail APCA for small light text, and vice versa. APCA is not yet a legal standard but represents the direction accessibility is moving." },
  { q: "Is 4.5:1 contrast ratio legally required in the US?", a: "The ADA (Americans with Disabilities Act) doesn't specify color contrast directly, but DOJ guidance and court interpretations have broadly adopted WCAG 2.1 Level AA as the expected standard for web accessibility compliance. WCAG 2.1 AA at 4.5:1 is also the explicit standard in the EU (EN 301 549), UK (PSBAR), and many other jurisdictions." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "DeveloperApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
