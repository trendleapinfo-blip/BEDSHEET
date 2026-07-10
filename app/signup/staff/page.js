"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Shield, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

const safeParseJson = async (res) => {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch (err) {
      throw new Error("Failed to parse response JSON from server.");
    }
  } else {
    throw new Error(`Server Error (Status ${res.status}). Please check your connection or server logs.`);
  }
};

export default function StaffSignupPage() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("WH"); // WH or LP
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !mobile || !role) {
      setError("Please fill in all the required fields.");
      return;
    }

    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/staff/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email.toLowerCase().trim(),
          mobile: mobile.trim(),
          role,
        }),
      });

      const data = await safeParseJson(res);

      if (!res.ok) {
        throw new Error(data.error || "Staff registration failed.");
      }

      setSuccess(data.message || "Registration request submitted successfully!");
      // Reset form
      setName("");
      setEmail("");
      setMobile("");
      setRole("WH");

      // Redirect after a few seconds
      setTimeout(() => {
        router.push("/login");
      }, 4000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-alabaster-linen py-16 px-4 font-sans text-charcoal-ink">
      <div className="w-full flex-grow flex flex-col justify-center items-center">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal-ink tracking-tight">
            Staff Registration
          </h1>
          <p className="text-2xs uppercase tracking-widest font-extrabold text-linen-gold">
            Apply as a Warehouse Manager or Logistics Partner
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-none p-8 md:p-10 shadow-sm border border-charcoal-ink/10 max-w-[500px] w-full relative">
          
          {/* Back button */}
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-2xs uppercase tracking-wider font-extrabold text-charcoal-ink/50 hover:text-charcoal-ink mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>

          {error && (
            <div className="mb-6 p-4 rounded-none bg-red-50 text-red-650 text-2xs font-bold border border-red-100 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-none bg-emerald-50 text-emerald-700 text-2xs font-bold border border-emerald-100 flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <p className="font-extrabold">{success}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  Redirecting to the login page shortly...
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-3xs font-bold text-charcoal-ink/50 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal-ink/40">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  disabled={loading || !!success}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-charcoal-ink/15 rounded-none text-charcoal-ink placeholder-charcoal-ink/30 focus:outline-none focus:border-linen-gold transition-colors text-xs disabled:bg-alabaster-linen disabled:text-charcoal-ink/40 font-medium"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-3xs font-bold text-charcoal-ink/50 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal-ink/40">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  disabled={loading || !!success}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your professional email"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-charcoal-ink/15 rounded-none text-charcoal-ink placeholder-charcoal-ink/30 focus:outline-none focus:border-linen-gold transition-colors text-xs disabled:bg-alabaster-linen disabled:text-charcoal-ink/40 font-medium"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-3xs font-bold text-charcoal-ink/50 uppercase tracking-widest mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal-ink/40">
                  <Phone className="w-5 h-5" />
                </span>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  value={mobile}
                  disabled={loading || !!success}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-charcoal-ink/15 rounded-none text-charcoal-ink placeholder-charcoal-ink/30 focus:outline-none focus:border-linen-gold transition-colors text-xs disabled:bg-alabaster-linen disabled:text-charcoal-ink/40 font-medium"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-3xs font-bold text-charcoal-ink/50 uppercase tracking-widest mb-2">
                Operational Role
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  disabled={loading || !!success}
                  onClick={() => setRole("WH")}
                  className={`flex flex-col items-center justify-center p-4 border rounded-none transition-all text-center cursor-pointer ${
                    role === "WH"
                      ? "border-linen-gold bg-linen-gold/05 text-linen-gold font-bold"
                      : "border-charcoal-ink/15 text-charcoal-ink/60 hover:bg-alabaster-linen"
                  }`}
                >
                  <Shield className="w-6 h-6 mb-1.5" />
                  <span className="text-xs font-extrabold">Warehouse Manager</span>
                  <span className="text-[10px] text-charcoal-ink/40 mt-0.5 font-bold uppercase tracking-wide">Stock & Orders</span>
                </button>

                <button
                  type="button"
                  disabled={loading || !!success}
                  onClick={() => setRole("LP")}
                  className={`flex flex-col items-center justify-center p-4 border rounded-none transition-all text-center cursor-pointer ${
                    role === "LP"
                      ? "border-linen-gold bg-linen-gold/05 text-linen-gold font-bold"
                      : "border-charcoal-ink/15 text-charcoal-ink/60 hover:bg-alabaster-linen"
                  }`}
                >
                  <Shield className="w-6 h-6 mb-1.5" />
                  <span className="text-xs font-extrabold">Logistics Partner</span>
                  <span className="text-[10px] text-charcoal-ink/40 mt-0.5 font-bold uppercase tracking-wide">Courier dispatches</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-none bg-charcoal-ink hover:bg-linen-gold text-alabaster-linen font-bold text-xs uppercase tracking-widest transition-colors duration-300 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  <Shield className="w-5 h-5 shrink-0" />
                  Submit Registration Request
                </>
              )}
            </button>
          </form>

          {/* Footer inside Card */}
          <div className="mt-6 text-center text-2xs text-charcoal-ink/50 font-bold uppercase tracking-wider border-t border-charcoal-ink/08 pt-5">
            Already have an approved account?{" "}
            <Link href="/login" className="text-linen-gold hover:underline font-extrabold">
              Sign In
            </Link>
          </div>

        </div>
      </div>

      {/* Footer Details */}
      <div className="w-full flex justify-center items-center gap-8 mt-12 text-2xs uppercase tracking-wider font-extrabold text-charcoal-ink/40">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-linen-gold"></span>
          Admin Verification Required
        </span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-linen-gold"></span>
          Secure Protocol
        </span>
      </div>
    </div>
  );
}
