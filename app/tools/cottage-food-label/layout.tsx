import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "cottage-food-label";
const CAT_SLUG = "business-operations";
const CAT_LABEL = "Business & Operations";
const title = "Cottage Food Nutrition Label Generator — FDA-Compliant, No AI Guessing";
const description = "Generate a nutrition facts label for homemade food products using deterministic USDA ingredient data. Required for cottage food businesses in most US states.";
export const metadata: Metadata = { title, description, alternates: { canonical: `${SITE}/tools/${slug}` }, openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" }, twitter: { card: "summary_large_image", title, description } };
const faqs = [
  { q: "How do I generate a compliant nutrition label for a homemade food product?", a: "FDA requires Nutrition Facts panels on most packaged food including cottage food sold commercially. You need: serving size, calories, total fat, saturated fat, trans fat, cholesterol, sodium, total carbohydrates, dietary fiber, total sugars, added sugars, protein, and Vitamin D, Calcium, Iron, Potassium. This calculator uses USDA FoodData Central nutritional values to compute these from your ingredient list and batch size." },
  { q: "Do cottage food producers legally need a nutrition label?", a: "Requirements vary by state and annual revenue. Many US states exempt cottage food producers below a revenue threshold (typically $25K–$75K/year) from full FDA labeling compliance. However, most states still require at minimum: product name, producer name and address, ingredients list, allergens, and net weight. Check your specific state's cottage food laws — this tool helps with the nutrition panel portion." },
  { q: "What's the difference between an FDA-compliant label and an AI-estimated one?", a: "AI-estimated labels use language model prediction, which can be significantly wrong for unusual ingredients or non-standard proportions. This tool uses deterministic lookup tables from USDA FoodData Central — the same database the FDA itself uses — to calculate nutrition values mathematically from your exact ingredient quantities. This is legally defensible in a way that AI estimation is not." },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
