"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";

export default function AgreementPage() {
  const { token } = useParams(); // Using quoteId as token for MVP
  const router = useRouter();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signing, setSigning] = useState(false);
  const [success, setSuccess] = useState(false);

  // For real implementation, you'd use a canvas for signature, here we use a simple type-to-sign for MVP
  const [signature, setSignature] = useState("");

  useEffect(() => {
    // In a real app, you would have a specific public API endpoint to get quote details for signing
    // For now, we will mock the fetch or assume the backend has a public route.
    // Let's create a quick API fetch (Note: you need to create a public API for this if it doesn't exist)
    const fetchQuote = async () => {
      try {
        const res = await fetch(`/api/public/quotes/${token}`);
        if (res.ok) {
          const data = await res.json();
          setQuote(data.quote);
        } else {
          setError("Invalid or expired agreement link.");
        }
      } catch (err) {
        setError("Failed to load agreement details.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, [token]);

  const handleSign = async () => {
    if (!signature.trim()) {
      setError("Please type your full name to sign.");
      return;
    }
    setSigning(true);
    setError("");

    try {
      const res = await fetch("/api/vendor/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: token,
          signatureData: signature
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to sign agreement.");
      }
    } catch (err) {
      setError("An error occurred during signing.");
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading Agreement Details...</div>;
  }

  if (error && !quote) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-6 bg-rose-50 text-rose-600 border border-rose-200 text-center">
        <ShieldAlert className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-green-50 text-green-700 border border-green-200 text-center">
        <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Agreement Signed Successfully!</h2>
        <p className="mt-4">
          Thank you, {quote?.contactPerson}. Your service has been activated and your first bundle is being prepared.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 sm:p-10 bg-white border border-gray-200 shadow-sm">
      <div className="border-b pb-6 mb-6">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Service Agreement</h1>
        <p className="text-gray-500 mt-2">Please review the terms and sign below to commence service.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Business Name:</span>
            <p className="font-semibold text-gray-900">{quote.businessName}</p>
          </div>
          <div>
            <span className="text-gray-500">Contact Person:</span>
            <p className="font-semibold text-gray-900">{quote.contactPerson}</p>
          </div>
          <div>
            <span className="text-gray-500">Agreed Price (per billing cycle):</span>
            <p className="font-semibold text-gray-900">₹{quote.finalPrice || quote.priceQuote}</p>
          </div>
          <div>
            <span className="text-gray-500">Contract Duration:</span>
            <p className="font-semibold text-gray-900">{quote.durationMonths} Months</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Service Location:</span>
            <p className="font-semibold text-gray-900">{quote.propertyAddress}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 border border-gray-200 text-sm text-gray-700 h-64 overflow-y-auto">
          <h3 className="font-bold mb-2">Terms and Conditions</h3>
          <p className="mb-4">
            By signing this agreement, you ({quote.businessName}) agree to engage CloseRush for bedding rental and laundry services as per the finalized quotation.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The contract duration is set for {quote.durationMonths} months starting from the date of signature.</li>
            <li>The agreed price is ₹{quote.finalPrice || quote.priceQuote} per billing cycle.</li>
            <li>Weekly swaps will be coordinated between the warehouse and your designated contact person.</li>
            <li>Any damaged or lost items during the rental period may incur additional charges.</li>
          </ul>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Electronic Signature</label>
          <input
            type="text"
            placeholder="Type your full name to sign"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        <button
          onClick={handleSign}
          disabled={signing}
          className="w-full bg-black text-white font-bold py-4 uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {signing ? "Processing..." : "I Agree and Sign"}
        </button>
      </div>
    </div>
  );
}
