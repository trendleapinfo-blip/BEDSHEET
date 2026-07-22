import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Cancellation & Refund Policy | ClosetRush",
  description: "Learn about subscription cancellations, pausing plans, security deposit returns, and refund guidelines.",
};

export default function CancellationPage() {
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
            Billing & Flexibility
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-tight">Cancellation & Refund Policy</h1>
          <p className="text-xs text-[#FCFBF9]/50 font-medium">Last updated: July 14, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#FCFBF9]/80 leading-relaxed space-y-8">
          <p>
            ClosetRush is designed around convenience and flexibility. We don't lock you into long contracts, and you can change your subscription setup at any time. Below are the terms governing cancellation, pausing, and deposit refunds.
          </p>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">1. Subscription Cancellation</h2>
            <p>
              You can cancel your subscription plan at any time through your customer profile dashboard or by raising a support ticket.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Cancellations must be requested at least <strong>48 hours prior</strong> to your next renewal billing date to avoid being charged for the subsequent cycle.</li>
              <li>Upon cancellation, your service will remain active until the end of your current paid billing period.</li>
              <li>A final pickup of the rented linens in your possession will be scheduled at the end of your billing period.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">2. Pause & Vacation Mode</h2>
            <p>
              Traveling or going home for holidays? You can pause your subscription.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Plan pausing can be enabled from the dashboard for a duration ranging from 1 week up to 3 months.</li>
              <li>When paused, we stop the billing cycles and swap dispatches. You may choose to hold the sheets or request a pickup before you leave.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">3. Refund Policy</h2>
            <p>
              Because our linens undergo strict, individualized sanitization processing upon initial subscription dispatch, we do not offer pro-rated refunds for partially unused monthly cycles once the billing has gone through. However, you will continue to have access to swap services until the cycle ends.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">4. Security Deposit Returns</h2>
            <p>
              If your plan included a refundable security deposit:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Following subscription cancellation, a logistics agent will pick up all outstanding ClosetRush linen items.</li>
              <li>Once the linens are received at our warehouse, they are checked for severe non-correctable damages (e.g. burn holes, large ink stains, deep tears).</li>
              <li>Standard wear, wash fading, and minor laundry blemishes are expected and will not affect your refund.</li>
              <li>The deposit amount is automatically credited back to your original payment source within <strong>5 to 7 working days</strong> of inspection approval.</li>
            </ul>
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
