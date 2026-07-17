import { Metadata } from "next";
const SITE = "https://truetoolkit.com";
const slug = "recipe-scaler";
const CAT_SLUG = "everyday-practical";
const CAT_LABEL = "Everyday Practical";

const title = "Recipe Scaler with Pan-Size Adjustment — Scale Servings & Pan Sizes";
const description =
  "Scale any recipe up or down by servings AND adjust for different pan sizes. Correctly recalculates ingredient amounts for baking when switching pan dimensions.";

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: `${SITE}/tools/${slug}` },
  openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  { q: "How do you scale a recipe for a different pan size, not just servings?", a: "Calculate the area of both pans. For round pans: Area = π × radius². For rectangular: Area = length × width. Divide the new pan area by the original pan area to get the scaling factor. Multiply all ingredient quantities by this factor. For a 9-inch round (63.6 sq in) vs 8-inch round (50.3 sq in): scaling factor is 63.6 ÷ 50.3 = 1.265, so increase all ingredients by 26.5%." },
  { q: "Does baking time change when I scale a recipe or change pan size?", a: "Yes. Larger pans with shallower batter depth cook faster; smaller pans with deeper batter take longer. As a rough rule: for a 25% volume increase, add 5–10 minutes to baking time and monitor doneness early. For exact timing, a toothpick test or internal temperature reading is more reliable than time adjustment alone." },
  { q: "Which ingredients should NOT be scaled proportionally in baking?", a: "Leavening agents (baking powder, baking soda) should be scaled conservatively — doubling a recipe doesn't always mean doubling the leavener. Over-leavening causes collapse. Salt flavors also often need only 75% of the direct scale. Everything else (flour, butter, eggs, sugar) scales directly." },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "SoftwareApplication", name: title, description, applicationCategory: "FoodAndDrinkApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
  ]};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
