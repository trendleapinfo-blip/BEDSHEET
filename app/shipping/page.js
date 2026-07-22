import React from "react";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata = {
  title: "Shipping & Delivery Policy | CLOSETRUSH PRIVATE LIMITED",
  description: "Official Shipping & Delivery Policy of CLOSETRUSH PRIVATE LIMITED detailing delivery timelines, replacement swaps, missed dispatches, and packaging guidelines.",
};

export default function ShippingPage() {
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
      <main className="max-w-4xl mx-auto px-6 sm:px-12 py-16 sm:py-20 space-y-12">
        <div className="space-y-4">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#05D4B5] bg-white/05 px-3.5 py-1 border border-white/10 rounded-full w-fit block">
            CLOSETRUSH PRIVATE LIMITED • Logistics & Shipping
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">Shipping & Delivery Policy</h1>
          <p className="text-xs text-[#FCFBF9]/50 font-medium">Last Updated: July 2026</p>
        </div>

        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#FCFBF9]/80 leading-relaxed space-y-8">
          <div className="p-4 bg-white/05 border border-white/10 rounded-2xl text-xs leading-relaxed text-gray-300">
            At <strong>CLOSETRUSH PRIVATE LIMITED</strong> (&quot;Closetrush&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we are committed to delivering hygienic, professionally cleaned bedding in a timely and reliable manner. This Shipping & Delivery Policy explains how deliveries, replacements, and pickups are managed.
          </div>

          {/* Section 1 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>1.</span> Serviceable Areas
            </h2>
            <p>
              Closetrush currently operates in selected serviceable locations. Orders are accepted only for areas where our delivery and pickup services are available. If your location falls outside our service network, we reserve the right to decline or cancel the order.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>2.</span> Order Processing
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>Orders are processed after successful payment and order confirmation.</li>
              <li>Customers may receive confirmation through WhatsApp, SMS, email, or phone call.</li>
              <li>Orders placed on public holidays or non-working days may be processed on the next working day.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>3.</span> Delivery Timeline
            </h2>
            <p>
              Our standard delivery timeline is: <strong>2–3 working days</strong> from the date of order confirmation. While we strive to deliver within the estimated timeline, delays may occur due to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>Severe weather conditions</li>
              <li>Public holidays</li>
              <li>High order volumes</li>
              <li>Traffic or transportation disruptions</li>
              <li>Operational or technical issues</li>
              <li>Other circumstances beyond our reasonable control</li>
            </ul>
            <p className="text-xs text-gray-400">
              In such cases, we will make reasonable efforts to keep customers informed.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>4.</span> Delivery Charges
            </h2>
            <p>
              Any applicable delivery charges, if any, will be displayed at the time of checkout before the order is confirmed. Closetrush reserves the right to revise delivery charges based on location, special delivery requests, or operational requirements.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>5.</span> Delivery Process
            </h2>
            <p>At the time of delivery, customers are requested to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>Be available at the provided delivery address.</li>
              <li>Verify the delivered package upon receipt.</li>
              <li>Report any visible damage to the package immediately.</li>
            </ul>
            <p className="text-xs text-[#05D4B5] font-semibold">
              ✓ All deliveries are made in hygienically packed reusable Closetrush packaging bags.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>6.</span> Weekly Replacement Service
            </h2>
            <p>
              Customers enrolled in the Weekly Replacement Plan will receive scheduled weekly visits from our team. During each visit:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>The previously used bedsheet set will be collected.</li>
              <li>A freshly washed, sanitized, and quality-checked bedsheet set will be delivered.</li>
            </ul>
            <p className="pt-2 font-semibold text-white">To ensure smooth service, customers are requested to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>Keep the used bedsheet set ready before the scheduled visit.</li>
              <li>Be available or arrange access at the agreed delivery location.</li>
            </ul>
            <p className="text-xs text-gray-400">
              If a replacement visit cannot be completed because the customer is unavailable, Closetrush will attempt to reschedule based on operational availability.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>7.</span> Monthly Subscription Deliveries
            </h2>
            <p>
              Customers on monthly rental plans will receive deliveries and pickups according to the subscription schedule selected at the time of purchase. Replacement dates may vary slightly depending on operational planning and public holidays.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>8.</span> Missed Delivery or Pickup
            </h2>
            <p>If our delivery partner or service representative is unable to complete the delivery or pickup because:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>The customer is unavailable,</li>
              <li>The provided address is incorrect,</li>
              <li>Entry to the location is denied, or</li>
              <li>The customer cannot be contacted,</li>
            </ul>
            <p className="text-xs text-gray-300">
              Closetrush may reschedule the visit. Repeated failed delivery or pickup attempts may attract additional service charges or result in temporary suspension of the service until a successful visit can be completed.
            </p>
          </div>

          {/* Section 9 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>9.</span> Change of Delivery Address
            </h2>
            <p>
              Customers may request a change of delivery address before the order is dispatched or before the scheduled replacement date. Address changes are subject to service availability in the new location. Closetrush may not be able to accommodate last-minute address changes after dispatch.
            </p>
          </div>

          {/* Section 10 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>10.</span> Packaging Policy
            </h2>
            <p>
              All products are delivered in reusable Closetrush packaging bags to maintain hygiene and protect the rented items during transportation. The packaging bag remains the property of Closetrush and must be returned during the final pickup or at the time of replacement, as applicable.
            </p>
            <p className="text-xs text-gray-400">
              If the packaging bag is lost, torn, cut, permanently damaged, or not returned, Closetrush reserves the right to deduct the applicable replacement cost from the customer&apos;s refundable security deposit or recover the applicable amount separately where no security deposit exists.
            </p>
          </div>

          {/* Section 11 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>11.</span> Inspection at Pickup
            </h2>
            <p>During every pickup, our team may inspect the returned items for:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>Missing products</li>
              <li>Permanent stains</li>
              <li>Tears or cuts</li>
              <li>Burn marks</li>
              <li>Excessive damage</li>
              <li>Packaging condition</li>
            </ul>
            <p className="text-xs text-gray-400">
              Any applicable deductions will be processed in accordance with our Terms & Conditions and Damage Policy.
            </p>
          </div>

          {/* Section 12 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>12.</span> Delayed Deliveries
            </h2>
            <p>
              Closetrush aims to deliver all orders within the estimated delivery timeline of 2–3 working days. However, delivery delays may occasionally occur due to circumstances beyond our reasonable control, including but not limited to natural disasters, severe weather conditions, government restrictions, public holidays, strikes, transportation disruptions, high order volumes, or other force majeure events.
            </p>
            <p className="text-xs text-[#05D4B5] font-semibold">
              In such situations, the delivery may be delayed by an additional maximum of 2–3 working days. Closetrush will make reasonable efforts to keep customers informed about any significant delays and complete the delivery at the earliest possible opportunity.
            </p>
          </div>

          {/* Section 13 */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>13.</span> Customer Support
            </h2>
            <div className="p-4 bg-white/05 border border-white/10 rounded-2xl space-y-2">
              <p className="font-bold text-white text-sm">CLOSETRUSH PRIVATE LIMITED • Delivery Support</p>
              <p className="text-xs text-gray-300">
                For delivery-related queries, rescheduling requests, or shipping assistance, customers may contact Closetrush through our official customer support channels during business hours. We are committed to resolving delivery-related concerns as quickly as possible.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer showWaitlist={false} />
    </div>
  );
}
