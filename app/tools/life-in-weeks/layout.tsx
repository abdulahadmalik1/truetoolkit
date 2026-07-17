import { Metadata } from "next";

const SITE = "https://truetoolkit.com";
const slug = "life-in-weeks";
const CAT_SLUG = "time-remote-work";
const CAT_LABEL = "Time & Remote Work";

// Keywords: "life in weeks calculator" — popularized by Tim Urban's Wait But Why
// "Your Life in Weeks" post (one of the most-shared blog posts ever). A 90-year
// lifespan = 4,680 weeks. People search this after reading the original post and
// wanting to calculate their own remaining weeks. Strong emotional + informational
// intent. LSI: "how many weeks left in my life", "life weeks visualization calculator",
// "memento mori calculator".

const title = "Life-in-Weeks Visualizer — Your Entire Life as a Grid of Boxes";
const description =
  "Enter your birthdate to see a grid of every week of a 90-year life. Lived weeks are shaded. Remaining weeks are open. A stark, motivating perspective on finite time.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/tools/${slug}` },
  openGraph: { title, description, url: `${SITE}/tools/${slug}`, type: "website", siteName: "TrueToolkit" },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  {
    q: "What is the life-in-weeks visualization and why is it useful?",
    a: "Originally created by Tim Urban on Wait But Why, the visualization maps a 90-year human lifespan as a grid of 4,680 boxes — one per week. Shading in the weeks already lived makes the remaining weeks visible as a finite, countable resource. This turns an abstract concept ('I have plenty of time') into a concrete, urgent reality that many people find profoundly motivating.",
  },
  {
    q: "How many weeks does the average person live?",
    a: "A 90-year lifespan equals 4,680 weeks. The US average life expectancy is roughly 78 years (approximately 4,056 weeks). If you're 30, you've used about 1,560 weeks and have roughly 2,500 remaining — assuming average life expectancy. This calculator shows your specific count.",
  },
  {
    q: "Is this visualization depressing or motivating?",
    a: "Most people report it as motivating, not depressing. The psychological mechanism is a 'mortality salience' prompt — being reminded of finite time tends to redirect people toward what they find genuinely meaningful. It's the same principle behind the journaling exercise of 'what would I do if I had 5 years left?' but grounded in real math.",
  },
  {
    q: "What life expectancy should I use as my reference point?",
    a: "This calculator defaults to 90 years, which is an aspirational-but-achievable benchmark. You can adjust it based on your family history, health status, or simply what feels right. The point isn't precise prediction — it's using any reasonable finite number to make time feel real.",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name: title, description, applicationCategory: "LifestyleApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, url: `${SITE}/tools/${slug}` },
      { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: CAT_LABEL, item: `${SITE}/category/${CAT_SLUG}` }, { "@type": "ListItem", position: 3, name: title, item: `${SITE}/tools/${slug}` }] },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
