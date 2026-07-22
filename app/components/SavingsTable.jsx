"use client";

import React, { useState, useEffect } from "react";
import { CheckIcon, StarIcon } from "./Icons";

export default function SavingsTable() {
  const [dbPlans, setDbPlans] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await fetch("/api/plans");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.plans && data.plans.length > 0) {
            setDbPlans(data.plans);
            const singles = data.plans.filter(p => p.bedType === "single");
            const prof = singles.find(p => p.name.toLowerCase() === "professional");
            if (prof) {
              setSelectedTier(prof._id);
            } else if (singles.length > 0) {
              setSelectedTier(singles[0]._id);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load plans in SavingsTable:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const singlePlans = dbPlans.filter(p => p.bedType === "single");
  
  const tiers = singlePlans.map(plan => {
    const originalPriceVal = Number(plan.originalPrice) || Number(plan.price);
    const savingsVal = Math.max(0, originalPriceVal - Number(plan.price));
    return {
      id: plan._id,
      name: plan.name,
      months: plan.duration.includes("Month") ? Number(plan.duration.split(" ")[0]) : 1,
      price: plan.price,
      basePrice: originalPriceVal,
      discount: plan.discount || "0%",
      savings: savingsVal,
      features: plan.features || [],
      badge: plan.badge || (plan.popular ? "Popular Selection" : "Flexible Option"),
    };
  });

  if (loading) {
    return (
      <section className="py-24 bg-[#FCFBF9]/50 border-t border-[#0D1518]/05">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D1518] mx-auto" />
        </div>
      </section>
    );
  }

  if (tiers.length === 0) return null;

  const currentTier = tiers.find((t) => t.id === selectedTier) || tiers[0];

  return (
    <section className="py-14 sm:py-32 bg-[#032026] relative overflow-hidden reveal-on-scroll">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#05D4B5]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-5 sm:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-20 space-y-3 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 bg-[#05D4B5]/10 border border-[#05D4B5]/20 rounded-full backdrop-blur-sm">
            <span className="text-[#05D4B5] font-semibold text-xs leading-none">✦</span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white">
              Savings at a glance
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-medium text-white leading-tight">
            Choose Your Plan & Save
          </h2>
          <p className="text-gray-400 text-xs sm:text-base leading-relaxed font-light">
            Compare our plans side by side and save money by choosing longer options. Enjoy luxury bedding delivered on autopilot.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Side: Tier Buttons / Selector Column */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Choose Duration</h3>
              {tiers.map((tier) => {
                const isActive = selectedTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`w-full text-left p-6 rounded-[24px] border transition-all duration-500 flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? "bg-white/5 border-[#05D4B5]/30 text-white shadow-[0_0_30px_rgba(5,212,181,0.1)] translate-x-2 backdrop-blur-md"
                        : "bg-transparent border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-lg font-serif tracking-wide">{tier.name}</span>
                        {tier.discount !== "0%" && (
                          <span
                            className={`text-[10px] font-black py-1 px-3 rounded-full uppercase tracking-wider ${
                              isActive ? "bg-[#05D4B5] text-[#032026]" : "bg-[#05D4B5]/10 text-[#05D4B5]"
                            }`}
                          >
                            {tier.discount} Off
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-medium ${isActive ? "text-[#05D4B5]" : "text-gray-500"} mt-1 block tracking-wide`}>
                        {tier.months} Month{tier.months > 1 ? "s" : ""} service
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`font-bold text-xl font-serif ${isActive ? "text-white" : "text-gray-300"}`}>₹{tier.price}</span>
                      <span className={`text-[10px] block uppercase tracking-widest mt-1 ${isActive ? "text-[#05D4B5]" : "text-gray-500"} font-black`}>
                        ₹{(Number(tier.price) / (tier.months * 30)).toFixed(0)}/day
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Micro Compare Banner */}
            <div className="bg-[#05D4B5]/5 border border-[#05D4B5]/10 rounded-[24px] p-6 backdrop-blur-sm relative overflow-hidden group hover:border-[#05D4B5]/30 transition-colors duration-500">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#05D4B5]/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:bg-[#05D4B5]/20 transition-colors duration-500" />
              <div className="flex items-center gap-3 mb-3 text-[#05D4B5]">
                <StarIcon className="w-4 h-4 fill-current" />
                <span className="text-xs font-black uppercase tracking-widest">Our Promise</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-400 font-medium">
                All plans are flexible. Need to pause or change your delivery? You can change it anytime in a single tap.
              </p>
            </div>
          </div>

          {/* Right Side: Detailed Comparison Card */}
          <div className="lg:col-span-7">
            <div className="bg-white/5 rounded-[32px] border border-white/5 shadow-2xl p-8 sm:p-12 h-full flex flex-col justify-between relative overflow-hidden group hover:border-[#05D4B5]/20 transition-all duration-500">
              {/* Highlight Tag */}
              <div className="absolute top-0 right-0 bg-[#05D4B5] text-[#032026] font-black text-[10px] sm:text-xs uppercase px-6 py-3 rounded-bl-[24px] rounded-tr-none shadow-[0_5px_15px_rgba(5,212,181,0.2)]">
                {currentTier.badge}
              </div>
              
              {/* Subtle background element inside card */}
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#05D4B5]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#05D4B5]/10 transition-colors duration-500" />

              <div className="relative z-10">
                {/* Header */}
                <div className="mb-10">
                  <h4 className="text-xs font-black text-[#05D4B5] uppercase tracking-widest mb-3">Plan Details</h4>
                  <h3 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-wide">{currentTier.name} Subscription</h3>
                  <p className="text-gray-400 text-sm mt-3 font-medium">
                    Complete bedding service for {currentTier.months} month{currentTier.months > 1 ? "s" : ""}.
                  </p>
                </div>

                {/* Price block */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#032026] rounded-2xl p-6 sm:p-8 border border-white/5 mb-10">
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase tracking-widest block font-bold mb-1">Total Price</span>
                    <span className="text-2xl sm:text-4xl font-bold font-serif text-white">₹{currentTier.price}</span>
                    <span className="text-xs text-[#05D4B5] font-black block mt-2 whitespace-nowrap">
                      Just ₹{(Number(currentTier.price) / (currentTier.months * 30)).toFixed(0)}/day
                    </span>
                  </div>

                  {currentTier.savings > 0 ? (
                    <>
                      <div>
                        <span className="text-gray-500 text-[10px] uppercase tracking-widest block font-bold mb-1">Original Value</span>
                        <span className="text-lg sm:text-2xl font-bold text-gray-600 line-through">₹{currentTier.basePrice}</span>
                      </div>
                      <div>
                        <span className="text-[#05D4B5] text-[10px] uppercase tracking-widest block font-bold mb-1">Instant Savings</span>
                        <span className="text-lg sm:text-2xl font-black text-[#05D4B5] whitespace-nowrap">Save ₹{currentTier.savings}</span>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2">
                      <span className="text-gray-500 text-[10px] uppercase tracking-widest block font-bold mb-1">Billing Frequency</span>
                      <span className="text-sm sm:text-base font-bold text-gray-300 leading-tight">Billed fully monthly</span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Included Features</h5>
                <ul className="space-y-4">
                  {currentTier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <span className="p-1 rounded-full bg-[#05D4B5]/10 text-[#05D4B5] mt-0.5 shrink-0">
                        <CheckIcon className="w-4 h-4" />
                      </span>
                      <span className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA button */}
              <div className="mt-10 pt-8 border-t border-white/5 relative z-10">
                <a
                  href="#signup"
                  className="w-full inline-flex justify-center items-center py-5 px-8 rounded-full text-xs font-black text-[#032026] bg-[#05D4B5] hover:bg-white uppercase tracking-widest transition-all duration-300 shadow-[0_10px_20px_rgba(5,212,181,0.2)] hover:shadow-[0_15px_30px_rgba(5,212,181,0.4)] hover:scale-[1.02]"
                >
                  Choose {currentTier.name} Plan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
