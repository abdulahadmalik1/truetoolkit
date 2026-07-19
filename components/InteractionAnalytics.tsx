"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

export function InteractionAnalytics() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const handleInteraction = () => setLoad(true);
    const events = ["scroll", "mousemove", "touchstart", "keydown", "click"];
    events.forEach((e) => window.addEventListener(e, handleInteraction, { once: true, passive: true }));
    
    // Fallback: load after 5 seconds even without interaction
    const timeout = setTimeout(() => setLoad(true), 5000);
    
    return () => {
      events.forEach((e) => window.removeEventListener(e, handleInteraction));
      clearTimeout(timeout);
    };
  }, []);

  if (!load) return null;

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-3FPW2HZZYD"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-3FPW2HZZYD');
        `}
      </Script>
    </>
  );
}
