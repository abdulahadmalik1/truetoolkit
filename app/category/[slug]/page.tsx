import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { tools, categories, getCategoryLabel, getCategorySlug } from "@/lib/tools";
import { categoryContent } from "@/lib/categories";

const SITE_URL = "https://truetoolkit.com";

export function generateStaticParams() {
  return categories.map((cat) => ({
    slug: getCategorySlug(cat),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const content = categoryContent[resolvedParams.slug];
  if (!content) return {};

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `${SITE_URL}/category/${resolvedParams.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const content = categoryContent[resolvedParams.slug];
  if (!content) {
    notFound();
  }

  const categoryName = categories.find((c) => getCategorySlug(c) === resolvedParams.slug);
  if (!categoryName) {
    notFound();
  }

  const { icon, label } = getCategoryLabel(categoryName);
  const categoryTools = tools.filter((t) => t.category === categoryName);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/category/${resolvedParams.slug}#webpage`,
        "url": `${SITE_URL}/category/${resolvedParams.slug}`,
        "name": content.title,
        "description": content.description,
        "isPartOf": { "@id": `${SITE_URL}/#website` }
      },
      {
        "@type": "ItemList",
        "itemListElement": categoryTools.map((t, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "url": `${SITE_URL}/tools/${t.slug}`,
          "name": t.name
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": SITE_URL
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": label,
            "item": `${SITE_URL}/category/${resolvedParams.slug}`
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="max-w-4xl mx-auto px-4">
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-slate-500">
            <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-slate-900 font-medium" aria-current="page">{label}</li>
          </ol>
        </nav>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl" aria-hidden="true">{icon}</span>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {content.title}
            </h1>
          </div>
          <div className="prose prose-slate prose-lg max-w-none text-slate-600">
            {content.copy.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </header>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
            All {categoryTools.length} tools in this category
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {categoryTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="group flex flex-col p-6 rounded-2xl bg-white shadow-sm border border-slate-200 hover:border-blue-500/50 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                  {tool.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-1">
                  {tool.description}
                </p>
                <div className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-800 flex items-center gap-1">
                  Open Calculator 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
