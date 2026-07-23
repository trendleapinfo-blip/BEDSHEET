import { Cormorant_Garamond, Plus_Jakarta_Sans, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Chatbot from "./components/Chatbot";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "ClosetRush | Premium Bedding & Linen Rental Service",
  description: "Rent clean bed sheets at just ₹10 per day. Clean, fresh organic bedsheets and pillow covers delivered to your doorstep. Free delivery, pause or cancel anytime.",
  keywords: ["clean bedding", "bedsheet rental", "hygienic bedsheets", "prevent bedsheet acne", "dust mite allergy bedding", "sleep hygiene", "hostel bedding"],
  icons: {
    icon: '/logo.png',
  },
  verification: {
    google: "0EETb5ay93vXXuJYFgzVq0UXtcKtuZhjMWSQsY0biiw",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${cormorant.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script
          id="service-worker-cleanup"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `,
          }}
        />
        {children}
        <Chatbot />
        <Analytics />
      </body>
    </html>
  );
}
