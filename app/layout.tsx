import type { Metadata } from "next";
import "./globals.css";

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

import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
