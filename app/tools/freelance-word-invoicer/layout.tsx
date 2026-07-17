import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "freelance-word-invoicer";
const CAT_SLUG = "money-freelance";
const CAT_LABEL = "Money & Freelance";

// Keywords: "word count invoice generator", "invoice by word count translator".
// Primary users: translators, copywriters, technical writers, content mills.
// The core pain: word count tools exist (Word, Google Docs), invoice tools exist,
// but nothing combines both to generate an invoice from pasted text in one step.
// The word count method itself is specific: strip whitespace, split on spaces,
// handle edge cases (hyphenated words, contractions). LSI: "translator word count
// billing calculator", "per word rate invoice generator", "how to invoice for word count".

const title = "Word-Count Auto-Invoicer — Invoice Generator from Pasted Text";
const description =
  "Paste any text or upload a .txt file to instantly count words and generate a ready-to-print invoice at your per-word rate. Built for translators and copywriters.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/tools/${slug}` },
  openGraph: {
    title,
    description,
    url: `${SITE}/tools/${slug}`,
    type: "website",
    siteName: "TrueToolkit",
  },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  {
    q: "How do translators and writers invoice accurately by word count?",
    a: "The standard method is to count words in the source or target text (conventions vary by profession and client), multiply by the agreed per-word rate, and add any rush or specialization fees. For translators, source word count is most common since you're pricing the work before it's done. This calculator counts the target (delivered) text deterministically.",
  },
  {
    q: "What counts as a 'word' for billing purposes?",
    a: "Industry standard: any string of characters separated by whitespace. Numbers, hyphenated compounds, and contractions each count as one word. Headers, captions, and footnotes should be included unless your contract specifies otherwise. This calculator uses the same method as Microsoft Word's word counter.",
  },
  {
    q: "How is per-word rate different from per-hour billing?",
    a: "Per-word billing incentivizes efficiency (the faster you work, the better your effective rate) and makes the invoice transparent to the client — they can verify the word count themselves. Per-hour billing rewards slowness and requires client trust. Many experienced translators and copywriters prefer per-word billing for this reason.",
  },
  {
    q: "Can I add a rush fee or specialization surcharge to the per-word invoice?",
    a: "Yes — this calculator allows you to add a percentage markup on top of the base per-word calculation. A 25–50% rush surcharge is industry-standard for work delivered in less than 24 hours, and a 20–30% technical/legal surcharge is common for specialized domain content.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: title,
        description,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: `${SITE}/tools/${slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` },
          { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
