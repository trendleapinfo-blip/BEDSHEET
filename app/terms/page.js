import React from "react";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata = {
  title: "Terms and Conditions | CLOSETRUSH PRIVATE LIMITED",
  description: "Official Terms & Conditions of CLOSETRUSH PRIVATE LIMITED governing subscription, rental, delivery, security deposit, and hygiene services.",
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
      <main className="max-w-4xl mx-auto px-6 sm:px-12 py-16 sm:py-20 space-y-12">
        <div className="space-y-4">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#05D4B5] bg-white/05 px-3.5 py-1 border border-white/10 rounded-full w-fit block">
            CLOSETRUSH PRIVATE LIMITED • Official Legal Terms
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">Terms & Conditions</h1>
          <p className="text-xs text-[#FCFBF9]/50 font-medium">Last Updated: July 2026</p>
        </div>

        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#FCFBF9]/80 leading-relaxed space-y-8">
          <div className="p-4 bg-white/05 border border-white/10 rounded-2xl text-xs leading-relaxed text-gray-300">
            Welcome to <strong>CLOSETRUSH PRIVATE LIMITED</strong> (&quot;Closetrush&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). These Terms & Conditions govern the use of our website, mobile application, and all subscription and rental services provided by Closetrush. By placing an order or subscribing to our services, you agree to comply with these Terms & Conditions.
          </div>

          {/* Section 1 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>1.</span> About Closetrush
            </h2>
            <p>
              Closetrush is a subscription-based hygienic bedding service that provides professionally cleaned and sanitized bedsheets and pillow covers on a rental basis. Customers receive fresh bedding at scheduled intervals without purchasing new bedsheets every month. Ownership of all bedsheets, pillow covers, and packaging remains with Closetrush at all times.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>2.</span> Eligibility
            </h2>
            <p>To use our services, you must:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>Provide accurate personal information, including your name, phone number, and delivery address.</li>
              <li>Ensure that someone is available to receive deliveries and hand over used items during scheduled replacements.</li>
            </ul>
            <p className="text-xs text-gray-400">
              Closetrush reserves the right to refuse or cancel any order if the provided information is incorrect or misleading.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>3.</span> Service Availability
            </h2>
            <p>
              Currently, our services are available only in selected serviceable locations. Orders may be accepted or declined depending on operational availability in your area.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>4.</span> Subscription Plans
            </h2>
            <p>
              Closetrush offers different subscription plans depending on customer requirements. Your subscription includes the delivery of professionally cleaned bedsheets and pillow covers according to the selected plan. The exact products, quantity, and replacement frequency are mentioned on the product or subscription page at the time of purchase.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>5.</span> Weekly Replacement Subscription
            </h2>
            <p>
              Customers who choose the Weekly Replacement Plan must subscribe for a minimum period of one (1) month. Under this plan:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>Our team will visit your location every week.</li>
              <li>The used bedsheet set will be collected.</li>
              <li>A freshly washed, sanitized, and quality-checked bedsheet set will be delivered immediately.</li>
            </ul>
            <p className="text-xs text-[#05D4B5] font-semibold">
              ✓ No security deposit is required for the Weekly Replacement Plan.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>6.</span> Security Deposit
            </h2>
            <p>
              Certain rental plans require a one-time refundable security deposit before the service begins. The current security deposit amounts are:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
              <div className="p-3 bg-white/05 border border-white/10 rounded-xl">
                <span className="text-xs font-bold text-white">Single Bed Kit</span>
                <p className="text-sm font-extrabold text-[#05D4B5]">₹500</p>
              </div>
              <div className="p-3 bg-white/05 border border-white/10 rounded-xl">
                <span className="text-xs font-bold text-white">Double Bed Kit</span>
                <p className="text-sm font-extrabold text-[#05D4B5]">₹800</p>
              </div>
            </div>
            <p>
              The security deposit is collected only to safeguard against the loss, theft, or damage of rented items. It is not a rental fee and does not transfer ownership of any product to the customer.
            </p>
            <p>
              The security deposit is payable only once at the time of starting your subscription. Once the deposit has been paid, customers can continue their active subscription by paying only the applicable monthly rental/subscription charges. No additional security deposit is required unless a new rental agreement is initiated or the existing deposit has been adjusted due to loss or damage.
            </p>
            <p>
              The security deposit will remain valid for the entire duration of your active subscription with Closetrush. After your subscription ends and all rented items (including the packaging bag) are returned in acceptable condition, the refundable security deposit will be processed in accordance with our Refund Policy.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>7.</span> Refund of Security Deposit
            </h2>
            <p>
              After all rented items have been returned and successfully inspected by our quality team:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>The refundable security deposit will be processed within <strong>5–6 working days</strong>.</li>
              <li>Refunds will be made through the original payment method or any other method approved by Closetrush.</li>
            </ul>
            <p className="text-xs text-gray-400">
              Closetrush reserves the right to deduct reasonable charges if any rented item is damaged, missing, or permanently stained.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>8.</span> Delivery Timeline
            </h2>
            <p>
              Our standard delivery timeline is: <strong>2–3 working days</strong> from successful order confirmation. Delivery timelines may vary due to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>Weather conditions</li>
              <li>Public holidays</li>
              <li>Operational issues</li>
              <li>High order volume</li>
              <li>Unforeseen circumstances</li>
            </ul>
            <p className="text-xs text-gray-400">
              Closetrush will make reasonable efforts to inform customers in case of significant delays.
            </p>
          </div>

          {/* Section 9 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>9.</span> Delivery & Replacement
            </h2>
            <p>
              Customers are responsible for ensuring someone is available during the scheduled delivery or replacement. If the customer is unavailable:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>Delivery or replacement may be rescheduled.</li>
              <li>Additional delivery charges may apply in certain situations.</li>
            </ul>
          </div>

          {/* Section 10 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>10.</span> Customer Responsibilities
            </h2>
            <p>Customers agree to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>Use the rented products responsibly.</li>
              <li>Keep the bedsheets in reasonable condition.</li>
              <li>Return all rented items on time.</li>
              <li>Inform Closetrush about any accidental damage immediately.</li>
              <li>Avoid intentional misuse of rented products.</li>
            </ul>
            <p className="pt-2 font-semibold text-white">Customers must not:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-rose-300">
              <li>Sell or transfer rented products.</li>
              <li>Exchange products with others.</li>
              <li>Alter or modify rented items.</li>
              <li>Use the products for commercial purposes without permission.</li>
            </ul>
          </div>

          {/* Section 11 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>11.</span> Packaging Bag Policy
            </h2>
            <p>
              Every delivery is made using a reusable Closetrush packaging bag designed to maintain hygiene during transportation. The packaging bag remains the property of Closetrush and must be returned during pickup or replacement.
            </p>
            <p className="text-xs text-gray-300">
              If the packaging bag is <strong>Lost, Torn, Cut, Permanently damaged, or Not returned</strong>, Closetrush reserves the right to deduct the applicable replacement cost from the customer&apos;s refundable security deposit.
            </p>
          </div>

          {/* Section 12 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>12.</span> Bedsheet Damage Policy
            </h2>
            <p>
              Normal day-to-day usage is acceptable. However, deductions may apply in case of:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>Permanent stains that cannot be removed</li>
              <li>Bleach damage / Chemical damage</li>
              <li>Burn marks / Large tears / Cuts</li>
              <li>Excessive fabric damage</li>
              <li>Missing pillow covers or missing bedsheets</li>
            </ul>
            <p className="text-xs text-gray-400">
              The actual deduction amount will depend on the extent of the damage after inspection.
            </p>
          </div>

          {/* Section 13 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>13.</span> Inspection Process
            </h2>
            <p>
              All returned items undergo a quality inspection. Closetrush will determine whether the item is reusable, requires repair, or requires replacement. Inspection decisions made by Closetrush after reasonable assessment shall be final.
            </p>
          </div>

          {/* Section 14 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>14.</span> Payments
            </h2>
            <p>
              Customers agree to pay all applicable charges before order confirmation unless otherwise specified. Failure to complete payment may result in cancellation of the order.
            </p>
          </div>

          {/* Section 15 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>15.</span> Order Cancellation
            </h2>
            <p>
              Closetrush reserves the right to cancel any order due to incorrect address, non-serviceable location, payment failure, suspected fraudulent activity, or operational limitations. Customers may also request order cancellation before dispatch, subject to our Cancellation Policy.
            </p>
          </div>

          {/* Section 16 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>16.</span> Hygiene Commitment
            </h2>
            <p>
              Every bedsheet supplied by Closetrush is professionally washed, properly sanitized, quality inspected, and hygienically packed before dispatch. While Closetrush follows strict hygiene practices, customers are expected to use and store the products responsibly after delivery.
            </p>
          </div>

          {/* Section 17 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>17.</span> Limitation of Liability
            </h2>
            <p>
              Closetrush shall not be liable for delays or interruptions caused by circumstances beyond our reasonable control, including but not limited to natural disasters, strikes, transportation disruptions, government restrictions, or force majeure events. Our maximum liability shall not exceed the amount paid by the customer for the relevant order.
            </p>
          </div>

          {/* Section 18 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>18.</span> Intellectual Property
            </h2>
            <p>
              The Closetrush name, logo, website content, images, graphics, trademarks, and branding are the exclusive property of <strong>CLOSETRUSH PRIVATE LIMITED</strong>. Unauthorized copying, reproduction, or commercial use is strictly prohibited.
            </p>
          </div>

          {/* Section 19 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>19.</span> Changes to Terms
            </h2>
            <p>
              Closetrush reserves the right to modify these Terms & Conditions at any time. The updated version will be published on our website and shall become effective immediately upon publication.
            </p>
          </div>

          {/* Section 20 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>20.</span> Governing Law
            </h2>
            <p>
              These Terms & Conditions shall be governed by the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the competent courts having jurisdiction over the registered office of <strong>CLOSETRUSH PRIVATE LIMITED</strong>.
            </p>
          </div>

          {/* Section 21 */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>21.</span> Contact Us
            </h2>
            <div className="p-4 bg-white/05 border border-white/10 rounded-2xl space-y-2">
              <p className="font-bold text-white text-sm">CLOSETRUSH PRIVATE LIMITED</p>
              <p className="text-xs text-gray-300">
                For any questions regarding these Terms & Conditions, please contact us through the official support channels listed on our website or mobile application.
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
