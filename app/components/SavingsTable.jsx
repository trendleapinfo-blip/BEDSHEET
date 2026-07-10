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
      <section className="py-24 bg-alabaster-linen/50 border-t border-charcoal-ink/05">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal-ink mx-auto" />
        </div>
      </section>
    );
  }

  if (tiers.length === 0) return null;

  const currentTier = tiers.find((t) => t.id === selectedTier) || tiers[0];

  return (
    <section className="py-24 bg-alabaster-linen/50 border-t border-charcoal-ink/05">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-2xs sm:text-xs font-semibold bg-linen-gold/10 text-linen-gold border border-linen-gold/20 mb-4 tracking-wide uppercase">
            <span>Savings at a glance</span>
          </div>
          <h2 className="text-section-header">
            See What You Save
          </h2>
          <p className="mt-4 text-body text-charcoal-ink/70">
            Compare our plans side by side and save money by choosing longer options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Side: Tier Buttons / Selector Column */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-charcoal-ink/40 uppercase tracking-widest mb-4">Choose Duration</h3>
              {tiers.map((tier) => {
                const isActive = selectedTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-none border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? "bg-charcoal-ink border-charcoal-ink text-alabaster-linen shadow-xl"
                        : "bg-white border-charcoal-ink/08 text-charcoal-ink hover:bg-alabaster-linen hover:border-charcoal-ink/20"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base">{tier.name}</span>
                        {tier.discount !== "0%" && (
                          <span
                            className={`text-3xs sm:text-2xs font-extrabold py-0.5 px-2 rounded-none ${
                              isActive ? "bg-linen-gold text-charcoal-ink" : "bg-linen-gold/10 text-linen-gold"
                            }`}
                          >
                            {tier.discount} Off
                          </span>
                        )}
                      </div>
                      <span className={`text-3xs sm:text-2xs font-medium ${isActive ? "text-alabaster-linen/70" : "text-charcoal-ink/50"}`}>
                        {tier.months} Month{tier.months > 1 ? "s" : ""} service
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-base sm:text-lg">₹{tier.price}</span>
                      <span className={`text-3xs sm:text-2xs block uppercase tracking-wider ${isActive ? "text-alabaster-linen/50" : "text-charcoal-ink/40"}`}>
                        Total Cost
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Micro Compare Banner */}
            <div className="bg-linen-gold/10 border border-linen-gold/20 rounded-none p-4 sm:p-5 mt-4">
              <div className="flex items-center gap-2 mb-2 text-linen-gold">
                <StarIcon className="w-3.5 h-3.5 fill-current" />
                <span className="text-2xs font-bold uppercase tracking-wider">Our Promise</span>
              </div>
              <p className="text-3xs leading-relaxed uppercase tracking-wider text-charcoal-ink/70">
                All plans are flexible. Need to pause or change your delivery? You can change it anytime in a single tap.
              </p>
            </div>
          </div>

          {/* Right Side: Detailed Comparison Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-none border border-charcoal-ink/08 shadow-lg p-5 sm:p-8 h-full flex flex-col justify-between relative overflow-hidden">
              {/* Highlight Tag */}
              <div className="absolute top-0 right-0 bg-linen-gold text-charcoal-ink font-bold text-[10px] sm:text-xs uppercase px-4 py-1.5 rounded-none">
                {currentTier.badge}
              </div>

              <div>
                {/* Header */}
                <div className="mb-6">
                  <h4 className="text-3xs font-extrabold text-linen-gold uppercase tracking-widest mb-1">Plan Details</h4>
                  <h3 className="text-xl sm:text-3xl font-bold text-charcoal-ink font-serif uppercase tracking-wider">{currentTier.name} Subscription</h3>
                  <p className="text-charcoal-ink/60 text-xs sm:text-sm mt-1">
                    Complete bedding service for {currentTier.months} month{currentTier.months > 1 ? "s" : ""}.
                  </p>
                </div>

                {/* Price block */}
                <div className="grid grid-cols-3 gap-2 sm:gap-6 bg-alabaster-linen rounded-none p-4 sm:p-6 border border-charcoal-ink/05 mb-8">
                  <div>
                    <span className="text-charcoal-ink/40 text-[9px] sm:text-2xs uppercase tracking-wider block font-bold">Total Price</span>
                    <span className="text-lg sm:text-3xl font-bold font-serif text-charcoal-ink">₹{currentTier.price}</span>
                  </div>

                  {currentTier.savings > 0 ? (
                    <>
                      <div>
                        <span className="text-charcoal-ink/40 text-[9px] sm:text-2xs uppercase tracking-wider block font-bold">Original Value</span>
                        <span className="text-sm sm:text-xl font-bold text-charcoal-ink/30 line-through">₹{currentTier.basePrice}</span>
                      </div>
                      <div>
                        <span className="text-linen-gold text-[9px] sm:text-2xs uppercase tracking-wider block font-bold">Instant Savings</span>
                        <span className="text-sm sm:text-xl font-bold text-linen-gold whitespace-nowrap">Save ₹{currentTier.savings}</span>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2">
                      <span className="text-charcoal-ink/40 text-[9px] sm:text-2xs uppercase tracking-wider block font-bold">Billing Frequency</span>
                      <span className="text-2xs sm:text-sm font-bold text-charcoal-ink/80 leading-tight">Billed fully monthly</span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <h5 className="text-[10px] font-bold text-charcoal-ink/40 uppercase tracking-widest mb-4">Included Features</h5>
                <ul className="space-y-3">
                  {currentTier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="p-0.5 rounded-none bg-linen-gold/10 text-linen-gold mt-0.5">
                        <CheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </span>
                      <span className="text-xs sm:text-sm text-charcoal-ink/80 font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA button */}
              <div className="mt-8 pt-6 border-t border-charcoal-ink/08">
                <a
                  href="#signup"
                  className="w-full inline-flex justify-center items-center py-3.5 px-6 rounded-none text-sm sm:text-base font-bold text-alabaster-linen bg-charcoal-ink hover:bg-linen-gold hover:text-charcoal-ink transition-all duration-200"
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
