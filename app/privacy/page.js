import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | ClosetRush",
  description: "Learn how ClosetRush collects, uses, and protects your personal data and subscription details.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#032026] text-[#FCFBF9] font-sans antialiased selection:bg-[#05D4B5] selection:text-white">
      {/* Navigation Header */}
      <header className="max-w-[1380px] mx-auto px-6 sm:px-12 py-8 flex items-center justify-between border-b border-white/05">
        <Link href="/" className="text-2xl font-serif font-bold text-[#05D4B5] tracking-[0.1em] uppercase">
          ClosetRush
        </Link>
        <Link href="/" className="text-2xs font-bold uppercase tracking-widest text-[#FCFBF9]/60 hover:text-white transition-colors border border-white/20 hover:border-white px-4 py-2 rounded-full">
          Back to Home
        </Link>
      </header>

      {/* Content Container */}
      <main className="max-w-4xl mx-auto px-6 sm:px-12 py-20 space-y-12">
        <div className="space-y-4">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#05D4B5] bg-white/05 px-3 py-1 border border-white/10 rounded-full w-fit block">
            Data Governance
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-tight">Privacy Policy</h1>
          <p className="text-xs text-[#FCFBF9]/50 font-medium">Last updated: July 14, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#FCFBF9]/80 leading-relaxed space-y-8">
          <p>
            At ClosetRush, we respect your privacy and are committed to protecting the personal data we hold about you. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website and subscription services.
          </p>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us during the registration and checkout process, including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Details:</strong> Full name, email address, phone number, and physical billing/delivery address.</li>
              <li><strong>Billing Information:</strong> Payment method detail tokens (we do not store raw credit/debit card numbers directly on our servers; payments are processed securely via Razorypay or verified gateways).</li>
              <li><strong>Interaction Logs:</strong> Chat logs, customer service requests, support tickets, and system preferences.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">2. How We Use Your Data</h2>
            <p>
              We utilize your personal information for the following business purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To manage your active subscription plans and process recurring payments.</li>
              <li>To coordinate monthly swap deliveries and pickups with our logistics associates.</li>
              <li>To notify you about delivery updates, billing statuses, or system alterations.</li>
              <li>To support the interactive chatbot assistance and customer service desks.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">3. Data Sharing and Third Parties</h2>
            <p>
              We do not sell, rent, or trade your personal data. We only share information with third parties who are essential to delivering our service:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Logistics Associates:</strong> Name, address, and phone number are shared with delivery partners to carry out swaps.</li>
              <li><strong>Payment Gateways:</strong> Necessary details are transmitted to secure processing servers during payments.</li>
              <li><strong>Regulatory Bodies:</strong> We may share data if required by law to comply with tax regulations or court orders.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">4. Cookies and Analytics</h2>
            <p>
              We use cookies to keep you logged in to your account, customize website layouts, and collect aggregated anonymous traffic analysis. You can adjust your browser settings to reject cookies, though some features of the dashboard may not function correctly as a result.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">5. Data Retention & Security</h2>
            <p>
              We employ encryption protocol standards (SSL/HTTPS) across all network layers. Personal data is retained as long as your subscription remains active or as required by regulatory compliance. You may request account deletion at any time by contacting our support desk.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#032026] py-8 border-t border-white/05 text-center">
        <p className="text-3xs text-white/30 font-semibold uppercase tracking-wider">
          © {new Date().getFullYear()} ClosetRush. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
