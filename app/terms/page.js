import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | ClosetRush",
  description: "Review the service terms, subscription rules, and rental agreement of ClosetRush bedding rental service.",
};

export default function TermsPage() {
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
            Service Agreement
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-tight">Terms and Conditions</h1>
          <p className="text-xs text-[#FCFBF9]/50 font-medium">Last updated: July 14, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#FCFBF9]/80 leading-relaxed space-y-8">
          <p>
            Welcome to ClosetRush. By subscribing to our bedding and linen rental services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before commencing your subscription.
          </p>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">1. Scope of Service</h2>
            <p>
              ClosetRush provides a subscription-based premium linen rental and monthly swap service. The bedding, sheets, pillow covers, and duvets delivered to you are rented, not purchased. All items remain the sole property of ClosetRush at all times.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">2. Subscription & Payments</h2>
            <p>
              Subscriptions are billed in advance on a recurring monthly, quarterly, or yearly basis depending on your selection. By signing up, you authorize ClosetRush to charge your designated payment method for renewal fees. Failure to pay will result in service suspension and retrieval of ClosetRush linens.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">3. Use and Care Guidelines</h2>
            <p>
              While the linens are in your possession, you are responsible for maintaining them in reasonable condition:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Do not wash the linens yourself using harsh chemicals, bleach, or coloring agents that may damage or stain the fibers.</li>
              <li>Avoid exposure to permanent ink, dye, oil-based products, or open flames.</li>
              <li>Normal wear, minor linting, and wash-related fading are covered by your subscription. However, excessive intentional damage, tears, or lost items will incur a replacement fee.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">4. Linen Swapping Cycle</h2>
            <p>
              Every month (or according to your subscription tier cycle), a ClosetRush delivery associate will drop off a freshly sanitized, hot-washed, and vacuum-sealed set of sheets and collect the used set currently in your possession. You must facilitate the return of the used sheets during this swap. If a swap is missed, we will schedule a retry; repeated failure to facilitate swaps may result in subscription termination.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">5. Indemnification & Liability</h2>
            <p>
              ClosetRush sanitizes all bedding using 60°C+ hot water and UV-C sterilization to eliminate 99.9% of bacteria and allergens. While we maintain medical-grade sanitization standards, ClosetRush is not liable for individual skin allergies or medical conditions arising from standard fiber usage.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">6. Modifications to Terms</h2>
            <p>
              We reserve the right to revise these Terms & Conditions at any time. Any changes will be posted here with an updated revision date. Continued usage of our services constitutes acceptance of the new terms.
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
