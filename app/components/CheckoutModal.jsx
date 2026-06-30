"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Sparkles, 
  MapPin, 
  Phone, 
  Check, 
  ShieldCheck, 
  RefreshCw, 
  AlertCircle,
  Truck,
  Layers,
  Calendar
} from "lucide-react";

const CUSTOMIZATION_PRICING = {
  colors: {
    "Classic White": 0,
    "Deep Teal": 100,
    "Linen Gold": 150,
    "Slate Gray": 120,
    "Lavender Mist": 130
  },
  fabrics: {
    "400 TC Organic Cotton": 0,
    "600 TC Egyptian Cotton": 250,
    "Organic Bamboo Linen": 350,
    "Mulberry Silk Blend": 500
  },
  prints: {
    "Solid / Minimalist": 0,
    "Classic Stripes": 100,
    "Modern Geometric": 120,
    "Floral Bloom": 150
  }
};

export default function CheckoutModal({ plan, user, onClose, onConfirm, loading }) {
  const [subscriptionType, setSubscriptionType] = useState("monthly"); // "monthly" or "weekly"
  const [address, setAddress] = useState(user?.address || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [error, setError] = useState("");

  const isSingle = plan.bedType === "single";

  const getCustomExtra = () => {
    if (!plan.isCustom) return 0;
    
    const colorCost = CUSTOMIZATION_PRICING.colors[plan.color] || 0;
    const fabricCost = CUSTOMIZATION_PRICING.fabrics[plan.fabric] || 0;
    const printCost = CUSTOMIZATION_PRICING.prints[plan.print] || 0;
    const extraPerMonth = colorCost + fabricCost + printCost;

    let multiplier = 1;
    let discountRate = 0;
    if (plan.duration === "3 Months") {
      multiplier = 3;
      discountRate = 0.05;
    } else if (plan.duration === "6 Months") {
      multiplier = 6;
      discountRate = 0.10;
    } else if (plan.duration === "12 Months") {
      multiplier = 12;
      discountRate = 0.20;
    }

    const rawExtra = extraPerMonth * multiplier;
    return Math.round(rawExtra * (1 - discountRate));
  };

  // Calculate pricing breakdown
  const getPricing = () => {
    const customExtra = getCustomExtra();

    // 1. Monthly Kit pricing
    if (subscriptionType === "monthly") {
      let basePlanPrice = Number(plan.basePlanPrice || plan.price) || 0;
      if (plan.isCustom) {
        basePlanPrice = Number(plan.basePlanPrice) || (Number(plan.price) - customExtra);
      }
      const base = basePlanPrice + customExtra;
      const gst = Math.round(base * 0.18);
      const deposit = 500;
      const total = base + gst + deposit;
      return { base, gst, deposit, total };
    }

    // 2. Weekly Change Service pricing (₹1200/mo single bed, ₹2000/mo double bed)
    const baseWeeklyMonthly = isSingle ? 1200 : 2000;
    
    // Scale according to duration
    let multiplier = 1;
    let discountRate = 0;
    if (plan.duration === "3 Months") {
      multiplier = 3;
      discountRate = 0.05;
    } else if (plan.duration === "6 Months") {
      multiplier = 6;
      discountRate = 0.10;
    } else if (plan.duration === "12 Months") {
      multiplier = 12;
      discountRate = 0.20;
    }

    const rawBase = baseWeeklyMonthly * multiplier;
    const baseWeekly = Math.round(rawBase * (1 - discountRate));
    const base = baseWeekly + customExtra;
    const gst = Math.round(base * 0.18);
    const deposit = 0;
    const total = base + gst + deposit;

    return { base, gst, deposit, total };
  };

  const pricing = getPricing();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!mobile || mobile.length !== 10) {
      setError("Please provide a valid 10-digit mobile number.");
      return;
    }

    if (!address.trim()) {
      setError("Delivery address is required to dispatch fresh linens.");
      return;
    }

    onConfirm({
      bedType: plan.bedType,
      planName: plan.planName,
      price: pricing.base,
      duration: plan.duration,
      subscriptionType,
      securityDeposit: pricing.deposit,
      gst: pricing.gst,
      totalPrice: pricing.total,
      address,
      mobile,
      isCustom: plan.isCustom,
      color: plan.color,
      fabric: plan.fabric,
      print: plan.print
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white max-w-[620px] w-full p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 overflow-y-auto max-h-[90vh] rounded-[2rem] transform transition-all duration-300 scale-100 animate-[fadeIn_0.2s_ease-out]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#245c77]/10 text-[#245c77] rounded text-3xs font-extrabold uppercase tracking-widest mb-2">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>Set Up Your Plan</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Checkout Review: {isSingle ? "Single Bed Plan" : "Double Bed Plan"}
          </h3>
          <p className="text-slate-400 text-xs font-semibold mt-1">
            Choose how you want your clean linen delivered and confirm your details.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Subscription Options Selection */}
          <div className="space-y-3">
            <label className="block text-3xs font-black text-slate-450 uppercase tracking-widest">
              Select Delivery & Swap Option
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Option A: Monthly Kit */}
              <button
                type="button"
                onClick={() => setSubscriptionType("monthly")}
                className={`text-left p-4 border rounded-2xl flex flex-col justify-between h-36 transition-all duration-300 cursor-pointer ${
                  subscriptionType === "monthly"
                    ? "bg-[#245c77]/05 border-[#245c77] ring-1 ring-[#245c77] shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-350"
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className={`p-1.5 rounded-lg ${subscriptionType === "monthly" ? "bg-[#245c77]/20 text-[#245c77]" : "bg-slate-100 text-slate-500"}`}>
                    <Layers className="w-4 h-4" />
                  </span>
                  {subscriptionType === "monthly" && (
                    <span className="w-4.5 h-4.5 rounded-full bg-[#245c77] text-white flex items-center justify-center p-1">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                    Monthly Kit (Self Change)
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">
                    We deliver a bundle of 4 sheets and 4 pillow covers once a month. You swap them yourself.
                  </p>
                  <p className="text-[9px] text-[#A89276] font-bold mt-1.5 uppercase tracking-wide">
                    Requires ₹500 Security Deposit
                  </p>
                </div>
              </button>

              {/* Option B: Weekly Service */}
              <button
                type="button"
                onClick={() => setSubscriptionType("weekly")}
                className={`text-left p-4 border rounded-2xl flex flex-col justify-between h-36 transition-all duration-300 cursor-pointer ${
                  subscriptionType === "weekly"
                    ? "bg-[#245c77]/05 border-[#245c77] ring-1 ring-[#245c77] shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-350"
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className={`p-1.5 rounded-lg ${subscriptionType === "weekly" ? "bg-[#245c77]/20 text-[#245c77]" : "bg-slate-100 text-slate-500"}`}>
                    <Truck className="w-4 h-4" />
                  </span>
                  {subscriptionType === "weekly" && (
                    <span className="w-4.5 h-4.5 rounded-full bg-[#245c77] text-white flex items-center justify-center p-1">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
                    Weekly Change Service <span className="bg-[#A89276] text-white text-[8px] px-1 rounded">Premium</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">
                    Our staff visits you every week to change the sheets, clean the bed, and retrieve used linen.
                  </p>
                  <p className="text-[9px] text-emerald-600 font-extrabold mt-1.5 uppercase tracking-wide">
                    No Security Deposit Needed
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Custom Selections Review */}
          {plan.isCustom && (plan.color || plan.fabric || plan.print) && (
            <div className="bg-slate-50 border border-slate-150 rounded-[1.5rem] p-5 space-y-3">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Selected Customizations
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                {plan.color && (
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Color</span>
                    <span className="text-slate-800">{plan.color}</span>
                  </div>
                )}
                {plan.fabric && (
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Fabric</span>
                    <span className="text-slate-800">{plan.fabric}</span>
                  </div>
                )}
                {plan.print && (
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Print</span>
                    <span className="text-slate-800">{plan.print}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delivery Details Form */}
          <div className="space-y-4">
            <h4 className="block text-3xs font-black text-slate-450 uppercase tracking-widest">
              Confirm Contact & Dispatch Details
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mobile Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Confirm Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#245c77] text-xs font-bold"
                />
              </div>

              {/* Plan Period */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Plan Duration
                </label>
                <div className="w-full px-4 py-3 bg-slate-100 border border-slate-150 rounded-xl text-slate-500 text-xs font-extrabold select-none">
                  {plan.planName} ({plan.duration})
                </div>
              </div>
            </div>

            {/* Complete Address Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Confirm Complete Address
              </label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Room / flat number, apartment building, street name, city, state, pin code"
                rows="2.5"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#245c77] text-xs font-semibold resize-none"
              ></textarea>
            </div>
          </div>

          {/* Pricing Invoice Summary Panel */}
          <div className="bg-slate-50 border border-slate-150 rounded-3xl p-5 space-y-3">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Payment Summary
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-400">
                  {subscriptionType === "weekly" ? "Weekly Service Rate" : "Standard Kit Rate"} ({plan.duration}):
                </span>
                <span className="text-slate-700">₹{pricing.base}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-400">GST (18%):</span>
                <span className="text-slate-700">₹{pricing.gst}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-400">Refundable Security Deposit:</span>
                <span className="text-slate-700">₹{pricing.deposit}</span>
              </div>

              <div className="border-t border-slate-200 my-2 pt-3 flex justify-between items-baseline">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Total Upfront Payable:
                </span>
                <div className="text-right">
                  <span className="text-xl font-black text-[#245c77] font-serif">
                    ₹{pricing.total}
                  </span>
                  <span className="text-slate-400 text-3xs font-bold uppercase tracking-widest block">
                    / {plan.duration}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-slate-900 hover:bg-[#245c77] text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-99 hover:shadow-lg hover:shadow-[#245c77]/10"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4.5 h-4.5" />
            )}
            {loading ? "Processing Secure Checkout..." : "Confirm Subscription & Pay"}
          </button>
        </form>
      </div>
    </div>
  );
}
