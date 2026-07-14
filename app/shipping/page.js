import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Shipping & Swap Delivery Policy | ClosetRush",
  description: "Understand the delivery schedule, monthly sheet swaps logistics, and shipping policies of ClosetRush.",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#0B1315] text-[#FCFBF9] font-sans antialiased selection:bg-[#C5A376] selection:text-white">
      {/* Navigation Header */}
      <header className="max-w-[1380px] mx-auto px-6 sm:px-12 py-8 flex items-center justify-between border-b border-white/05">
        <Link href="/" className="text-2xl font-serif font-bold text-[#C5A376] tracking-[0.1em] uppercase">
          ClosetRush
        </Link>
        <Link href="/" className="text-2xs font-bold uppercase tracking-widest text-[#FCFBF9]/60 hover:text-white transition-colors border border-white/20 hover:border-white px-4 py-2 rounded-full">
          Back to Home
        </Link>
      </header>

      {/* Content Container */}
      <main className="max-w-4xl mx-auto px-6 sm:px-12 py-20 space-y-12">
        <div className="space-y-4">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#C5A376] bg-white/05 px-3 py-1 border border-white/10 rounded-full w-fit block">
            Logistics & Operations
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-tight">Shipping & Swap Delivery Policy</h1>
          <p className="text-xs text-[#FCFBF9]/50 font-medium">Last updated: July 14, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#FCFBF9]/80 leading-relaxed space-y-8">
          <p>
            ClosetRush operates a dedicated local logistics network to ensure seamless deliveries, pickup swaps, and hygienic transit. Below are the operational policies governing shipping and subscription swap deliveries.
          </p>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">1. Delivery Zones & Availability</h2>
            <p>
              ClosetRush currently operates in select metropolitan areas and student residential hubs (including Bangalore). Delivery eligibility is validated during the address setup step in your checkout flow. We do not support deliveries to areas outside our designated active service coverage zones.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">2. Initial Delivery Dispatch</h2>
            <p>
              Once your subscription plan purchase is verified and confirmed:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your first fresh set of sanitized linens will be dispatched within <strong>24 to 48 hours</strong>.</li>
              <li>Delivery slots can be selected during checkout or rescheduled via your customer dashboard.</li>
              <li>All initial shipments arrive sealed in dust-proof, eco-friendly protection packs.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">3. Monthly Swap Coordination</h2>
            <p>
              Subsequent swaps occur on a regular monthly schedule (or according to your subscription tier rate):
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>We will notify you via WhatsApp/SMS 24 hours prior to the scheduled delivery agent arrival.</li>
              <li>During the swap, you must return the dirty/used linens in the reusable laundry bag provided during the initial delivery.</li>
              <li>The delivery agent will hand over the fresh, sealed set and collect the used set in a single, 2-minute transaction.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">4. Missed Swap Deliveries</h2>
            <p>
              If you are unavailable during the scheduled swap, you may request a reschedule from your customer panel. We offer up to 2 free retry attempts per cycle. If swaps are consistently missed over a 15-day period, a logistics dispatch fee of ₹100 may apply for additional attempts, or the subscription may be paused.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-white border-b border-white/10 pb-2">5. Shipping Rates</h2>
            <p>
              All standard delivery swaps, pickups, and dispatches are <strong>100% Free</strong>. There are no shipping charges, delivery surcharges, or hidden handling fees added to your active monthly subscription rate.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#080E10] py-8 border-t border-white/05 text-center">
        <p className="text-3xs text-white/30 font-semibold uppercase tracking-wider">
          © {new Date().getFullYear()} ClosetRush. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
