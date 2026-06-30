"use client";

import React, { useState, useEffect } from "react";
import {
  BedIcon,
  CrownIcon,
  TruckIcon,
  SparklesIcon,
  CancelIcon,
  CheckIcon,
  ArrowRightIcon,
  StarIcon,
} from "./Icons";

const CUSTOMIZATION_PRICING = {
  colors: {
    "Classic White": 0,
    "Deep Teal": 100,
    "Linen Gold": 150,
    "Slate Gray": 120,
    "Lavender Mist": 130
  },
  colorsHex: {
    "Classic White": "#FFFFFF",
    "Deep Teal": "#245c77",
    "Linen Gold": "#A89276",
    "Slate Gray": "#64748B",
    "Lavender Mist": "#E9E3FF"
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

export default function InteractivePlans({ handleSelectPlan, submittingPlan }) {
  const [selectedSuite, setSelectedSuite] = useState("residence"); // 'atelier' | 'residence' | 'maison' | 'corporate' | 'custom'
  const [selectedDuration, setSelectedDuration] = useState("6 Months"); // '1 Month' | '3 Months' | '6 Months' | '12 Months'
  const [customBedType, setCustomBedType] = useState("single");
  const [customColor, setCustomColor] = useState("Classic White");
  const [customFabric, setCustomFabric] = useState("400 TC Organic Cotton");
  const [customPrint, setCustomPrint] = useState("Solid / Minimalist");

  const defaultPlansData = {
    single: {
      title: "Single Bed Plan",
      subtitle: "For one person sleeping alone. Always clean.",
      basePrice: 300,
      image: "/hero_bedding.png",
      cottonType: "Very Soft Clean Cotton",
      frequency: "Fresh Sheets Every 2 Weeks",
      durations: [
        { name: "1 Month Plan", duration: "1 Month", price: "300", originalPrice: null, discount: null, cta: "Get 1 Month Plan" },
        { name: "3 Months Plan", duration: "3 Months", price: "855", originalPrice: "900", discount: "5% off", cta: "Get 3 Months Plan" },
        { name: "6 Months Plan", duration: "6 Months", price: "1620", originalPrice: "1800", discount: "10% off", cta: "Get 6 Months Plan", popular: true, badge: "Best Value" },
        { name: "12 Months Plan", duration: "12 Months", price: "2880", originalPrice: "3600", discount: "20% off", cta: "Get 12 Months Plan" },
      ],
    },
    double: {
      title: "Double Bed Plan",
      subtitle: "For two people or bigger beds.",
      basePrice: 500,
      image: "/about_bedding.png",
      cottonType: "Super Soft Egyptian Cotton",
      frequency: "Fresh Sheets Every 2 Weeks",
      durations: [
        { name: "1 Month Plan", duration: "1 Month", price: "500", originalPrice: null, discount: null, cta: "Get 1 Month Plan" },
        { name: "3 Months Plan", duration: "3 Months", price: "1425", originalPrice: "1500", discount: "5% off", cta: "Get 3 Months Plan" },
        { name: "6 Months Plan", duration: "6 Months", price: "2700", originalPrice: "3000", discount: "10% off", cta: "Get 6 Months Plan", popular: true, badge: "Best Value" },
        { name: "12 Months Plan", duration: "12 Months", price: "4800", originalPrice: "6000", discount: "20% off", cta: "Get 12 Months Plan" },
      ],
    },
  };

  const [dbPlans, setDbPlans] = useState(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await fetch("/api/plans");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.plans && data.plans.length > 0) {
            // Group and sort API data to match our schema structure
            const grouped = {
              single: {
                title: "Single Bed Plan",
                subtitle: "For one person sleeping alone. Always clean.",
                basePrice: 300,
                image: "/hero_bedding.png",
                cottonType: "Very Soft Clean Cotton",
                frequency: "Fresh Sheets Every 2 Weeks",
                durations: []
              },
              double: {
                title: "Double Bed Plan",
                subtitle: "For two people or bigger beds.",
                basePrice: 500,
                image: "/about_bedding.png",
                cottonType: "Super Soft Egyptian Cotton",
                frequency: "Fresh Sheets Every 2 Weeks",
                durations: []
              }
            };

            data.plans.forEach(plan => {
              const bedType = plan.bedType === "single" ? "single" : "double";
              grouped[bedType].durations.push({
                name: plan.name,
                duration: plan.duration,
                price: String(plan.price),
                originalPrice: plan.originalPrice ? String(plan.originalPrice) : null,
                discount: plan.discount,
                features: plan.features || [],
                cta: plan.cta || `Reserve ${plan.name}`,
                popular: !!plan.popular,
                badge: plan.badge
              });
            });

            grouped.single.durations.sort((a, b) => Number(a.price) - Number(b.price));
            grouped.double.durations.sort((a, b) => Number(a.price) - Number(b.price));

            if (grouped.single.durations.length > 0 || grouped.double.durations.length > 0) {
              setDbPlans(grouped);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic plans:", err);
      }
    }
    loadPlans();
  }, []);

  const activePlans = dbPlans || defaultPlansData;

  // Resolve the dynamic selected plan based on Suite and Duration
  const getSelectedPlanData = () => {
    if (selectedSuite === "corporate") {
      return {
        name: "Business Plan",
        subtitle: "For hotels, Airbnbs, or shared rooms.",
        price: "Custom Quote",
        duration: "Custom Schedule",
        cottonType: "Strong Business Cotton",
        frequency: "Flexible Deliveries",
        cta: "Call Us to Order"
      };
    }

    if (selectedSuite === "custom") {
      const pKey = customBedType === "single" ? "single" : "double";
      const suite = activePlans[pKey];
      const durationPlan = suite.durations.find(d => d.duration === selectedDuration) || suite.durations[0];

      const basePlanPrice = Number(durationPlan.price) || 0;

      const colorCost = CUSTOMIZATION_PRICING.colors[customColor] || 0;
      const fabricCost = CUSTOMIZATION_PRICING.fabrics[customFabric] || 0;
      const printCost = CUSTOMIZATION_PRICING.prints[customPrint] || 0;
      const extraPerMonth = colorCost + fabricCost + printCost;

      let multiplier = 1;
      let discountRate = 0;
      if (selectedDuration === "3 Months") {
        multiplier = 3;
        discountRate = 0.05;
      } else if (selectedDuration === "6 Months") {
        multiplier = 6;
        discountRate = 0.10;
      } else if (selectedDuration === "12 Months") {
        multiplier = 12;
        discountRate = 0.20;
      }

      const rawExtra = extraPerMonth * multiplier;
      const discountedExtra = Math.round(rawExtra * (1 - discountRate));
      const totalPrice = basePlanPrice + discountedExtra;

      return {
        bedType: customBedType,
        planName: `Custom Plan (${customColor}, ${customFabric}, ${customPrint})`,
        price: totalPrice,
        originalPrice: durationPlan.originalPrice ? (Number(durationPlan.originalPrice) + rawExtra) : null,
        discount: durationPlan.discount,
        duration: selectedDuration,
        title: "Your Custom Bed Sheets",
        subtitle: `Custom sheets made for your ${customBedType === "single" ? "Single Bed Plan" : "Double Bed Plan"}.`,
        cottonType: customFabric,
        frequency: "Fresh Sheets Every 2 Weeks",
        image: customBedType === "single" ? "/hero_bedding.png" : "/about_bedding.png",
        cta: "Order Your Custom Sheets",
        isCustom: true,
        basePlanPrice,
        color: customColor,
        fabric: customFabric,
        print: customPrint
      };
    }

    const bedTypeKey = selectedSuite === "atelier" ? "single" : "double";
    const suite = activePlans[bedTypeKey];
    const durationPlan = suite.durations.find(d => d.duration === selectedDuration) || suite.durations[0];

    return {
      bedType: bedTypeKey,
      planName: durationPlan.name,
      price: durationPlan.price,
      originalPrice: durationPlan.originalPrice,
      discount: durationPlan.discount,
      duration: durationPlan.duration,
      title: suite.title,
      subtitle: suite.subtitle,
      cottonType: suite.cottonType,
      frequency: suite.frequency,
      image: suite.image,
      cta: durationPlan.cta
    };
  };

  const currentPlan = getSelectedPlanData();

  const handleReserve = () => {
    if (selectedSuite === "corporate") {
      handleSelectPlan({
        bedType: "corporate",
        planName: "Corporate Plan",
        price: 0,
        duration: "Custom"
      });
      return;
    }

    if (selectedSuite === "custom") {
      handleSelectPlan({
        bedType: currentPlan.bedType,
        planName: currentPlan.planName,
        price: currentPlan.price,
        basePlanPrice: currentPlan.basePlanPrice,
        duration: currentPlan.duration,
        isCustom: true,
        color: currentPlan.color,
        fabric: currentPlan.fabric,
        print: currentPlan.print
      });
      return;
    }

    handleSelectPlan({
      bedType: currentPlan.bedType,
      planName: currentPlan.planName,
      price: currentPlan.price,
      duration: currentPlan.duration
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16 font-sans">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <p className="text-micro-label">Our Plans</p>
        <h2 className="text-section-header">Choose Your Bed Plan.</h2>
        <p className="text-body text-charcoal-ink/65">
          Pick the bed sheets that fit your bed. Select how many months you want on the right side.
        </p>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Suite Selectors */}
        <div className="lg:col-span-5 space-y-4">
          {[
            {
              id: "atelier",
              num: "01",
              title: "Single Bed Plan",
              desc: "Clean sheets for one person.",
            },
            {
              id: "residence",
              num: "02",
              title: "Double Bed Plan",
              desc: "Clean sheets for couples or larger beds.",
            },
            {
              id: "corporate",
              num: "03",
              title: "Business Plan",
              desc: "For hotels, Airbnbs, or shared rooms.",
            },
            {
              id: "custom",
              num: "04",
              title: "Design Your Plan",
              desc: "Pick your own colors, fabrics, and prints.",
            },
          ].map((suite) => (
            <button
              key={suite.id}
              onClick={() => {
                setSelectedSuite(suite.id);
                if (suite.id !== "corporate") {
                  setSelectedDuration("6 Months"); // reset to default professional duration
                }
              }}
              className={`w-full text-left p-6 border transition-all duration-300 flex items-start gap-6 cursor-pointer rounded-none ${
                selectedSuite === suite.id
                  ? "bg-charcoal-ink text-alabaster-linen border-charcoal-ink shadow-md"
                  : "bg-white text-charcoal-ink border-charcoal-ink/08 hover:border-charcoal-ink/20"
              }`}
            >
              <span className={`font-serif text-lg font-bold ${selectedSuite === suite.id ? "text-linen-gold" : "text-charcoal-ink/40"}`}>
                {suite.num}
              </span>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold uppercase tracking-wider">{suite.title}</h4>
                <p className={`text-2xs ${selectedSuite === suite.id ? "text-alabaster-linen/70" : "text-charcoal-ink/50"}`}>
                  {suite.desc}
                </p>
              </div>
            </button>
          ))}
 
          {/* Value note */}
          <div className="p-6 border border-linen-gold/20 bg-linen-gold/05 space-y-2">
            <span className="text-2xs font-extrabold text-linen-gold uppercase tracking-wider flex items-center gap-1.5">
              <CrownIcon className="w-3.5 h-3.5" /> Guaranteed Fresh Sleep
            </span>
            <p className="text-3xs text-charcoal-ink/60 leading-relaxed uppercase tracking-wider">
              Every plan includes hot washing, germ-killing treatment, and delivery to your door.
            </p>
          </div>
        </div>

        {/* Right Column: Suite Details Dashboard */}
        <div className="lg:col-span-7 bg-white border border-charcoal-ink/08 p-8 space-y-8">
          {selectedSuite === "custom" ? (
            <div className="space-y-6">
              {/* Suite Title and Sub */}
              <div className="space-y-2 border-b border-charcoal-ink/08 pb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold uppercase tracking-wider text-charcoal-ink">
                    Design Your Plan
                  </h3>
                  <span className="text-2xs font-bold bg-[#245c77]/10 text-[#245c77] px-2.5 py-1 uppercase tracking-wider">
                    Custom Bed Setup
                  </span>
                </div>
                <p className="text-xs text-charcoal-ink/60 leading-relaxed">
                  Pick your size, time length, colors, fabric type, and print styles to design sheets you love.
                </p>
              </div>
 
              {/* Step 1: Base Bed Size */}
              <div className="space-y-3">
                <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">
                  Step 1: Pick Your Bed Size
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setCustomBedType("single")}
                    className={`p-4 border flex items-center gap-3 transition-all cursor-pointer rounded-none ${
                      customBedType === "single"
                        ? "border-[#245c77] bg-[#245c77]/05 text-[#245c77] ring-1 ring-[#245c77]"
                        : "border-charcoal-ink/08 bg-white text-charcoal-ink hover:border-charcoal-ink/20"
                    }`}
                  >
                    <BedIcon className="w-5 h-5 text-[#245c77]" />
                    <div className="text-left">
                      <span className="text-2xs font-extrabold uppercase tracking-wider block">Single Bed</span>
                      <span className="text-[10px] opacity-60">Single Bed base</span>
                    </div>
                  </button>
 
                  <button
                    onClick={() => setCustomBedType("double")}
                    className={`p-4 border flex items-center gap-3 transition-all cursor-pointer rounded-none ${
                      customBedType === "double"
                        ? "border-[#245c77] bg-[#245c77]/05 text-[#245c77] ring-1 ring-[#245c77]"
                        : "border-charcoal-ink/08 bg-white text-charcoal-ink hover:border-charcoal-ink/20"
                    }`}
                  >
                    <BedIcon className="w-5 h-5 text-[#245c77]" />
                    <div className="text-left">
                      <span className="text-2xs font-extrabold uppercase tracking-wider block">Double Bed</span>
                      <span className="text-[10px] opacity-60">Double Bed base</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Subscription Duration */}
              <div className="space-y-3">
                <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">
                  Step 2: Choose How Many Months
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { duration: "1 Month", discount: null },
                    { duration: "3 Months", discount: "5% off" },
                    { duration: "6 Months", discount: "10% off" },
                    { duration: "12 Months", discount: "20% off" }
                  ].map((item) => (
                    <button
                      key={item.duration}
                      onClick={() => setSelectedDuration(item.duration)}
                      className={`py-3 px-2 border text-center transition-all cursor-pointer rounded-none ${
                        selectedDuration === item.duration
                          ? "bg-charcoal-ink text-alabaster-linen border-charcoal-ink"
                          : "bg-alabaster-linen text-charcoal-ink border-charcoal-ink/05 hover:border-charcoal-ink/20"
                      }`}
                    >
                      <span className="text-3xs font-extrabold uppercase tracking-wider block">{item.duration}</span>
                      {item.discount && (
                        <span className="text-[8px] font-black text-linen-gold block mt-0.5 uppercase tracking-tight">
                          {item.discount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
 
              {/* Step 3: Color Customization */}
              <div className="space-y-3">
                <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">
                  Step 3: Choose Your Color
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {Object.entries(CUSTOMIZATION_PRICING.colors).map(([colorName, colorPrice]) => (
                    <button
                      key={colorName}
                      onClick={() => setCustomColor(colorName)}
                      className={`p-2.5 border flex flex-col items-center justify-between gap-2 text-center transition-all cursor-pointer h-20 rounded-none ${
                        customColor === colorName
                          ? "border-[#245c77] bg-[#245c77]/05 ring-1 ring-[#245c77]"
                          : "border-charcoal-ink/08 bg-white hover:border-charcoal-ink/20"
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-slate-350"
                        style={{ backgroundColor: CUSTOMIZATION_PRICING.colorsHex[colorName] }}
                      />
                      <div>
                        <span className="text-[8px] font-extrabold uppercase tracking-tight block truncate w-full max-w-[80px]">
                          {colorName}
                        </span>
                        <span className="text-[8px] text-slate-400 font-bold">
                          {colorPrice === 0 ? "Free" : `+₹${colorPrice}/mo`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
 
              {/* Step 4: Fabric Premium Options */}
              <div className="space-y-3">
                <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">
                  Step 4: Choose Your Fabric
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(CUSTOMIZATION_PRICING.fabrics).map(([fabricName, fabricPrice]) => {
                    let desc = "";
                    if (fabricName === "400 TC Organic Cotton") desc = "Cool, soft organic cotton sheets.";
                    else if (fabricName === "600 TC Egyptian Cotton") desc = "Thicker, luxury Egyptian cotton sheets.";
                    else if (fabricName === "Organic Bamboo Linen") desc = "Super cool bamboo sheets, great for allergies.";
                    else if (fabricName === "Mulberry Silk Blend") desc = "Softest silk sheets, very gentle on your skin.";
 
                    return (
                      <button
                        key={fabricName}
                        onClick={() => setCustomFabric(fabricName)}
                        className={`p-4 border text-left flex flex-col justify-between h-28 transition-all cursor-pointer rounded-none ${
                          customFabric === fabricName
                            ? "border-[#245c77] bg-[#245c77]/05 ring-1 ring-[#245c77]"
                            : "border-charcoal-ink/08 bg-white hover:border-charcoal-ink/20"
                        }`}
                      >
                        <div>
                          <span className="text-2xs font-extrabold uppercase tracking-wider block text-slate-800">
                            {fabricName}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium block mt-1 leading-tight">
                            {desc}
                          </span>
                        </div>
                        <span className="text-[9px] text-[#245c77] font-bold mt-2">
                          {fabricPrice === 0 ? "Basic Fabric (Free)" : `+₹${fabricPrice}/mo`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
 
              {/* Step 5: Print Style */}
              <div className="space-y-3">
                <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">
                  Step 5: Choose Your Design
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(CUSTOMIZATION_PRICING.prints).map(([printName, printPrice]) => (
                    <button
                      key={printName}
                      onClick={() => setCustomPrint(printName)}
                      className={`p-3 border text-center transition-all cursor-pointer flex flex-col justify-between h-16 rounded-none ${
                        customPrint === printName
                          ? "border-[#245c77] bg-[#245c77]/05 ring-1 ring-[#245c77]"
                          : "border-charcoal-ink/08 bg-white hover:border-charcoal-ink/20"
                      }`}
                    >
                      <span className="text-[9px] font-extrabold uppercase tracking-wider block truncate text-slate-800">
                        {printName}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold mt-1">
                        {printPrice === 0 ? "Free" : `+₹${printPrice}/mo`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
 
              {/* Step 6: Pricing Breakdown Formula Card */}
              <div className="bg-[#245c77]/05 border border-[#245c77]/10 p-5 rounded-none space-y-3 text-xs">
                <span className="text-[10px] uppercase tracking-widest text-[#245c77] font-extrabold block">
                  How Your Price is Calculated
                </span>
                
                <div className="space-y-2 text-charcoal-ink font-semibold">
                  <div className="flex justify-between">
                    <span className="text-charcoal-ink/60 font-bold">Bed Size Price ({selectedDuration}):</span>
                    <span>₹{currentPlan.basePlanPrice}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-charcoal-ink/60 font-bold">Extra Choices Price (per Month):</span>
                    <span className="text-right">
                      ₹{CUSTOMIZATION_PRICING.colors[customColor]} (Color) + ₹{CUSTOMIZATION_PRICING.fabrics[customFabric]} (Fabric) + ₹{CUSTOMIZATION_PRICING.prints[customPrint]} (Print) = +₹{CUSTOMIZATION_PRICING.colors[customColor] + CUSTOMIZATION_PRICING.fabrics[customFabric] + CUSTOMIZATION_PRICING.prints[customPrint]}/mo
                    </span>
                  </div>
 
                  {selectedDuration !== "1 Month" && (
                    <div className="flex justify-between text-[#A89276]">
                      <span className="font-bold">Discount Applied:</span>
                      <span>
                        {selectedDuration === "3 Months" && "3 Months (5% off)"}
                        {selectedDuration === "6 Months" && "6 Months (10% off)"}
                        {selectedDuration === "12 Months" && "12 Months (20% off)"}
                      </span>
                    </div>
                  )}
 
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 uppercase tracking-wide">
                    <span>Extras Total Price:</span>
                    <span>
                      ₹{currentPlan.price - currentPlan.basePlanPrice}
                    </span>
                  </div>
                </div>
              </div>            </div>
          ) : (
            <>
              {/* Suite Title and Sub */}
              <div className="space-y-2 border-b border-charcoal-ink/08 pb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold uppercase tracking-wider text-charcoal-ink">
                    {selectedSuite === "corporate" ? "Maison Corporate" : currentPlan.title}
                  </h3>
                  {selectedSuite !== "corporate" && (
                    <span className="text-2xs font-bold bg-linen-gold/10 text-linen-gold px-2.5 py-1 uppercase tracking-wider">
                      Hotel Grade Standard
                    </span>
                  )}
                </div>
                <p className="text-xs text-charcoal-ink/60 leading-relaxed">
                  {selectedSuite === "corporate" ? currentPlan.subtitle : currentPlan.subtitle}
                </p>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-4 border-b border-charcoal-ink/08 pb-6 text-xs">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">Fabric Type</span>
                  <p className="font-bold text-charcoal-ink">{currentPlan.cottonType}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">How Often We Change</span>
                  <p className="font-bold text-charcoal-ink">{currentPlan.frequency}</p>
                </div>
              </div>

              {/* Duration Toggles (Only for Non-Corporate suites) */}
              {selectedSuite !== "corporate" && (
                <div className="space-y-4">
                  <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">
                    Choose Duration
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["1 Month", "3 Months", "6 Months", "12 Months"].map((duration) => {
                      const pKey = selectedSuite === "atelier" ? "single" : "double";
                      const pData = activePlans[pKey].durations.find(d => d.duration === duration);
                      if (!pData) return null;

                      return (
                        <button
                          key={duration}
                          onClick={() => setSelectedDuration(duration)}
                          className={`py-3 px-4 border text-center transition-all cursor-pointer rounded-none ${
                            selectedDuration === duration
                              ? "bg-charcoal-ink text-alabaster-linen border-charcoal-ink"
                              : "bg-alabaster-linen text-charcoal-ink border-charcoal-ink/05 hover:border-charcoal-ink/20"
                          }`}
                        >
                          <span className="text-2xs font-bold uppercase tracking-wider block">{duration}</span>
                          <span className="text-3xs opacity-80 block mt-0.5">₹{pData.price}</span>
                          {pData.discount && (
                            <span className="text-[8px] font-extrabold text-linen-gold block mt-0.5 uppercase tracking-tight">
                              {pData.discount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Pricing Panel */}
          <div className="bg-alabaster-linen p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">
                Price
              </span>
              <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-1">
                <span className="text-2xl font-bold font-serif text-charcoal-ink">
                  {selectedSuite === "corporate" ? "Custom Quote" : `₹${currentPlan.price}`}
                </span>
                {selectedSuite !== "corporate" && (
                  <span className="text-3xs text-charcoal-ink/50 uppercase tracking-widest font-bold">
                    / {currentPlan.duration}
                  </span>
                )}
              </div>
              {selectedSuite !== "corporate" && currentPlan.originalPrice && (
                <p className="text-[10px] text-charcoal-ink/40 mt-1">
                  Instead of <span className="line-through">₹{currentPlan.originalPrice}</span> ({currentPlan.discount} savings applied)
                </p>
              )}
            </div>

            <button
              onClick={handleReserve}
              disabled={submittingPlan}
              className="w-full sm:w-auto py-4 px-8 bg-charcoal-ink text-alabaster-linen font-bold text-2xs uppercase tracking-widest hover:bg-linen-gold transition-colors duration-300 cursor-pointer disabled:opacity-50"
            >
              {submittingPlan ? "Processing..." : selectedSuite === "corporate" ? "Contact Us" : currentPlan.cta}
            </button>
          </div>

          {/* Details footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-3xs text-charcoal-ink/50 uppercase tracking-widest font-bold">
            <span className="flex items-center gap-1"><TruckIcon className="w-3.5 h-3.5" /> Free Delivery</span>
            <span className="flex items-center gap-1"><SparklesIcon className="w-3.5 h-3.5" /> Hot Wash Guarantee</span>
            <span className="flex items-center gap-1"><CancelIcon className="w-3.5 h-3.5" /> Change Plans Anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
