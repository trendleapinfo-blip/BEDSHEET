import { Cormorant_Garamond, Plus_Jakarta_Sans, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Chatbot from "./components/Chatbot";

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
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${cormorant.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
