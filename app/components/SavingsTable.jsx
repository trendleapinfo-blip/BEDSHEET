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
      <section className="py-24 bg-[#FAF9F6]/50 border-t border-[#0D1518]/05">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D1518] mx-auto" />
        </div>
      </section>
    );
  }

  if (tiers.length === 0) return null;

  const currentTier = tiers.find((t) => t.id === selectedTier) || tiers[0];

  return (
    <section className="py-28 bg-[#FAF9F6]/50 border-t border-[#0D1518]/05 reveal-on-scroll">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A376]/10 text-[#C5A376] border border-[#C5A376]/20 tracking-widest text-2xs uppercase font-extrabold rounded-none">
            <span>Savings at a glance</span>
          </div>
          <h2 className="text-section-header">
            Choose Your Plan & Save
          </h2>
          <p className="text-body text-[#0D1518]/70">
            Compare our plans side by side and save money by choosing longer options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Side: Tier Buttons / Selector Column */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Choose Duration</h3>
              {tiers.map((tier) => {
                const isActive = selectedTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`w-full text-left p-5 rounded-[24px] border transition-all duration-400 flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? "bg-[#0B1315] border-[#0B1315] text-[#FAF9F6] shadow-xl translate-x-1"
                        : "bg-white border-[#0D1518]/06 text-[#0D1518] hover:bg-[#FAF9F6] hover:border-[#0D1518]/15"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-extrabold text-sm sm:text-base">{tier.name}</span>
                        {tier.discount !== "0%" && (
                          <span
                            className={`text-3xs sm:text-2xs font-extrabold py-0.5 px-2.5 rounded-full ${
                              isActive ? "bg-[#C5A376] text-[#0B1315]" : "bg-[#C5A376]/10 text-[#C5A376]"
                            }`}
                          >
                            {tier.discount} Off
                          </span>
                        )}
                      </div>
                      <span className={`text-3xs sm:text-2xs font-medium ${isActive ? "text-[#FAF9F6]/60" : "text-gray-400"} mt-0.5 block`}>
                        {tier.months} Month{tier.months > 1 ? "s" : ""} service
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-base sm:text-lg">₹{tier.price}</span>
                      <span className={`text-3xs sm:text-2xs block uppercase tracking-widest mt-0.5 ${isActive ? "text-[#C5A376]" : "text-[#1A4F54]"} font-black`}>
                        ₹{(Number(tier.price) / (tier.months * 30)).toFixed(0)}/day
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Micro Compare Banner */}
            <div className="bg-[#C5A376]/08 border border-[#C5A376]/15 rounded-[24px] p-5">
              <div className="flex items-center gap-2 mb-2 text-[#C5A376]">
                <StarIcon className="w-4 h-4 fill-current" />
                <span className="text-2xs font-bold uppercase tracking-wider">Our Promise</span>
              </div>
              <p className="text-3xs leading-relaxed uppercase tracking-wider text-[#0D1518]/70">
                All plans are flexible. Need to pause or change your delivery? You can change it anytime in a single tap.
              </p>
            </div>
          </div>

          {/* Right Side: Detailed Comparison Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[32px] border border-[#0D1518]/06 shadow-lg p-6 sm:p-8 md:p-10 h-full flex flex-col justify-between relative overflow-hidden group hover:border-[#C5A376]/20 transition-all duration-500">
              {/* Highlight Tag */}
              <div className="absolute top-0 right-0 bg-[#C5A376] text-[#0B1315] font-bold text-[10px] sm:text-xs uppercase px-5 py-2.5 rounded-bl-[20px] rounded-tr-none">
                {currentTier.badge}
              </div>

              <div>
                {/* Header */}
                <div className="mb-8">
                  <h4 className="text-3xs font-extrabold text-[#C5A376] uppercase tracking-widest mb-1.5">Plan Details</h4>
                  <h3 className="text-xl sm:text-3.5xl font-bold text-[#0B1315] font-serif uppercase tracking-wider">{currentTier.name} Subscription</h3>
                  <p className="text-[#0D1518]/60 text-xs sm:text-sm mt-2">
                    Complete bedding service for {currentTier.months} month{currentTier.months > 1 ? "s" : ""}.
                  </p>
                </div>

                {/* Price block */}
                <div className="grid grid-cols-3 gap-4 bg-[#FAF9F6] rounded-2xl p-5 sm:p-6 border border-[#0D1518]/05 mb-8">
                  <div>
                    <span className="text-gray-400 text-[9px] sm:text-2xs uppercase tracking-wider block font-bold">Total Price</span>
                    <span className="text-lg sm:text-3xl font-bold font-serif text-[#0B1315]">₹{currentTier.price}</span>
                    <span className="text-[10px] text-[#C5A376] font-extrabold block mt-0.5 whitespace-nowrap">
                      Just ₹{(Number(currentTier.price) / (currentTier.months * 30)).toFixed(0)}/day
                    </span>
                  </div>

                  {currentTier.savings > 0 ? (
                    <>
                      <div>
                        <span className="text-gray-400 text-[9px] sm:text-2xs uppercase tracking-wider block font-bold">Original Value</span>
                        <span className="text-sm sm:text-xl font-bold text-[#0D1518]/25 line-through">₹{currentTier.basePrice}</span>
                      </div>
                      <div>
                        <span className="text-[#C5A376] text-[9px] sm:text-2xs uppercase tracking-wider block font-bold">Instant Savings</span>
                        <span className="text-sm sm:text-xl font-bold text-[#C5A376] whitespace-nowrap">Save ₹{currentTier.savings}</span>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2">
                      <span className="text-gray-400 text-[9px] sm:text-2xs uppercase tracking-wider block font-bold">Billing Frequency</span>
                      <span className="text-2xs sm:text-sm font-bold text-[#0D1518]/80 leading-tight">Billed fully monthly</span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Included Features</h5>
                <ul className="space-y-3.5">
                  {currentTier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="p-0.5 rounded-full bg-[#C5A376]/10 text-[#C5A376] mt-0.5">
                        <CheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </span>
                      <span className="text-xs sm:text-sm text-[#0D1518]/85 font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA button */}
              <div className="mt-8 pt-8 border-t border-[#0D1518]/08">
                <a
                  href="#signup"
                  className="w-full inline-flex justify-center items-center py-4 px-6 rounded-full text-xs font-bold text-[#FAF9F6] bg-[#0B1315] hover:bg-[#C5A376] hover:text-[#0B1315] uppercase tracking-widest transition-all duration-300 shadow-md hover:scale-102"
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
