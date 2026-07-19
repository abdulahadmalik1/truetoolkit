import type { Metadata } from "next";
import { Suspense } from "react";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  metadataBase: new URL('https://truetoolkit.com'),
  title: {
    template: '%s | TrueToolkit',
    default: "TrueToolkit — 63 Free Instant Calculators & Tools",
  },
  description:
    "63 free, accurate, client-side calculators for money, time, and everyday life. No signup, no ads, no data collection — runs completely in your browser.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://truetoolkit.com/",
    siteName: "TrueToolkit",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

import { InteractionAnalytics } from "@/components/InteractionAnalytics";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cssPath = path.join(process.cwd(), "public", "tailwind-compiled.css");
  let cssString = "";
  try {
    cssString = fs.readFileSync(cssPath, "utf8");
  } catch (e) {
    console.error("Failed to read compiled CSS");
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <style dangerouslySetInnerHTML={{ __html: cssString }} />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <InteractionAnalytics />
      </body>
    </html>
  );
}
