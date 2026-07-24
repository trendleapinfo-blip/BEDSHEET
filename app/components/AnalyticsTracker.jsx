"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track Page Views
  useEffect(() => {
    if (pathname) {
      const trackPageView = async () => {
        try {
          const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
          await fetch("/api/analytics/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              path: url,
              referrer: document.referrer || "Direct",
              userAgent: navigator.userAgent,
              isPwaInstall: false,
            }),
          });
        } catch (error) {
          console.error("Analytics tracking failed", error);
        }
      };

      // Debounce slightly to allow page load to settle
      const timeout = setTimeout(() => {
        trackPageView();
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [pathname, searchParams]);

  // Track PWA Installation
  useEffect(() => {
    const handleAppInstalled = async () => {
      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: "PWA_INSTALL",
            referrer: document.referrer || "Direct",
            userAgent: navigator.userAgent,
            isPwaInstall: true,
          }),
        });
      } catch (error) {
        console.error("Failed to log PWA install", error);
      }
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  return null; // Invisible tracker component
}
