import React from "react";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata = {
  title: "Privacy Policy | CLOSETRUSH PRIVATE LIMITED",
  description: "Official Privacy Policy of CLOSETRUSH PRIVATE LIMITED detailing how we collect, process, safeguard, and manage customer personal data and subscription privacy.",
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
      <main className="max-w-4xl mx-auto px-6 sm:px-12 py-16 sm:py-20 space-y-12">
        <div className="space-y-4">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#05D4B5] bg-white/05 px-3.5 py-1 border border-white/10 rounded-full w-fit block">
            CLOSETRUSH PRIVATE LIMITED • Privacy & Data Protection
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">Privacy Policy</h1>
          <p className="text-xs text-[#FCFBF9]/50 font-medium">Last Updated: July 2026</p>
        </div>

        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#FCFBF9]/80 leading-relaxed space-y-8">
          <div className="p-4 bg-white/05 border border-white/10 rounded-2xl text-xs leading-relaxed text-gray-300">
            At <strong>CLOSETRUSH PRIVATE LIMITED</strong> (&quot;Closetrush&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, store, and safeguard your data when you visit our website, mobile application, or use our linen subscription and replacement services.
          </div>

          {/* Section 1 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>1.</span> Information We Collect
            </h2>
            <p>
              We collect information to provide efficient, hygienic, and personalized subscription delivery services. The types of data we collect include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li><strong>Personal Contact Information:</strong> Full name, phone number, email address, physical delivery/billing address, and city/pincode.</li>
              <li><strong>Account Credentials:</strong> Passwords, Google OAuth tokens, and account profile preferences.</li>
              <li><strong>Payment & Billing Data:</strong> Payment transaction status, order history, and payment gateway tokens (processed securely via PCI-DSS compliant partners such as Razorpay; Closetrush does not store raw credit card or debit card numbers directly on our servers).</li>
              <li><strong>Subscription & Delivery Data:</strong> Selected bed size, rental package tier, delivery schedules, replacement preferences, and swap pickup logs.</li>
              <li><strong>Communication & Support Data:</strong> Interaction logs, WhatsApp/SMS messaging records, chatbot history, customer service tickets, and feedback.</li>
              <li><strong>Device & Usage Data:</strong> IP address, browser type, operating system, device identifiers, and website usage statistics via cookies and analytics.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>2.</span> How We Use Your Information
            </h2>
            <p>
              We use the collected information for legitimate business purposes, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>Processing your orders, subscriptions, deposits, and billing transactions.</li>
              <li>Coordinating weekly or monthly delivery dispatches, linen replacements, and pickups with our logistics team.</li>
              <li>Sending essential service notifications, delivery status updates, billing receipts, and account alerts.</li>
              <li>Providing customer support, resolving queries, and responding to service requests.</li>
              <li>Maintaining and improving the functionality, security, and performance of our website and mobile application.</li>
              <li>Preventing fraudulent transactions, unpermitted commercial misuse, and unauthorized account access.</li>
              <li>Complying with applicable legal obligations, tax regulations, and regulatory requirements in India.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>3.</span> Sharing & Disclosure of Data
            </h2>
            <p>
              Closetrush respects your privacy and <strong>does not sell, rent, or trade</strong> your personal information to third parties for marketing purposes. We only share information with trusted third parties under the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li><strong>Logistics & Delivery Partners:</strong> Necessary delivery details (name, address, contact number) are shared with our logistics personnel to carry out scheduled deliveries and pickups.</li>
              <li><strong>Payment Processors:</strong> Transaction details are shared securely with RBI-regulated payment gateways (e.g. Razorpay) to complete billing transactions.</li>
              <li><strong>IT & System Infrastructure Service Providers:</strong> Secure cloud hosting, database management, and SMS/WhatsApp API partners bound by confidentiality agreements.</li>
              <li><strong>Legal & Regulatory Authorities:</strong> We may disclose data if required to do so by law, court order, tax authority directive, or government regulation.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>4.</span> Cookies & Tracking Technologies
            </h2>
            <p>
              We use cookies and similar tracking technologies to enhance user experience, keep you logged into your customer portal, remember your preferences, and analyze website traffic.
            </p>
            <p className="text-xs text-gray-300">
              You can control cookie settings through your internet browser preferences. Disabling certain cookies may affect the availability of specific features on our dashboard.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>5.</span> Data Security & Storage
            </h2>
            <p>
              <strong>CLOSETRUSH PRIVATE LIMITED</strong> employs robust technical and organizational security measures to protect your personal data from unauthorized access, loss, misuse, or alteration:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li>Standard SSL/HTTPS encryption across all web traffic and data transmissions.</li>
              <li>Encrypted database storage and restricted system access controls.</li>
              <li>Regular security reviews and vulnerability assessments.</li>
            </ul>
            <p className="text-xs text-gray-400">
              While we take all reasonable precautions, no internet transmission or electronic storage method is 100% immune. We encourage users to keep their account passwords confidential.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>6.</span> Data Retention & Your Rights
            </h2>
            <p>
              We retain personal information for as long as your subscription is active or as necessary to fulfill the purposes outlined in this policy, satisfy tax and legal obligations, and resolve disputes.
            </p>
            <p className="pt-2 font-semibold text-white">Your Data Rights:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-300">
              <li><strong>Access & Correction:</strong> You can view and update your profile, phone number, and address anytime via your customer dashboard.</li>
              <li><strong>Account Deletion:</strong> You can request account deletion and removal of your personal data after completing any active rental pickups and settling pending balances by contacting support.</li>
              <li><strong>Marketing Opt-out:</strong> You may opt out of non-essential promotional SMS/emails at any time.</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>7.</span> Children&apos;s Privacy
            </h2>
            <p>
              Our website and subscription services are intended for adults aged 18 and older. We do not knowingly collect or solicit personal information from individuals under 18 years of age.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-3 border-b border-white/05 pb-6">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>8.</span> Changes to This Privacy Policy
            </h2>
            <p>
              Closetrush reserves the right to modify or update this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date. Continued usage of our website or services after changes are posted constitutes acceptance of the updated Privacy Policy.
            </p>
          </div>

          {/* Section 9 */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#05D4B5] flex items-center gap-2">
              <span>9.</span> Contact Us & Grievance Redressal
            </h2>
            <div className="p-4 bg-white/05 border border-white/10 rounded-2xl space-y-2">
              <p className="font-bold text-white text-sm">CLOSETRUSH PRIVATE LIMITED • Privacy & Support Desk</p>
              <p className="text-xs text-gray-300">
                If you have questions, concerns, or requests regarding this Privacy Policy or how your personal data is handled, please contact our support team through the official support channels listed on our website or mobile application.
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
