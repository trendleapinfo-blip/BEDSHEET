"use client";

import React from "react";
import { Bed, Truck, Package, ShoppingBag, Sparkles, X, Check } from "lucide-react";

export default function StaircaseWorkflow() {
  const steps = [
    {
      num: 1,
      title: "We Deliver",
      desc: "We deliver fresh bedsheet kit at your doorstep.",
      icon: Package,
    },
    {
      num: 2,
      title: "You Use",
      desc: "Use a fresh bedsheet every week for a better sleep.",
      icon: Bed,
    },
    {
      num: 3,
      title: "We Pickup",
      desc: "We pickup the used kit & take it for deep cleaning.",
      icon: ShoppingBag,
    },
    {
      num: 4,
      title: "We Replace",
      desc: "We deliver the next fresh & clean set. Every week.",
      icon: Sparkles,
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#FCFBF9] border-y border-[#0D1518]/05 py-12 sm:py-28 relative overflow-hidden font-sans">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#05D4B5]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#05D4B5]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-5 sm:px-12 relative z-10 space-y-8 sm:space-y-24">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-4">
          <h2 className="font-serif text-3xl sm:text-5xl text-[#0D1518] font-bold leading-tight relative inline-block pb-3 sm:pb-4">
            How It Works
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#05D4B5] rounded-full" />
          </h2>
          <p className="text-xs sm:text-lg text-gray-600 leading-relaxed font-light mt-2 sm:mt-4">
            Autopilot luxury sleep is simple. Here is how we swap your used sheets for freshly sanitized replacements.
          </p>
        </div>

        {/* ========================================================
            1. STEP TIMELINE VIEW
           ======================================================== */}
        <div className="relative">
          
          {/* Connecting dotted lines for desktop */}
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-[2px] z-0 pointer-events-none">
            <div className="w-full h-full border-t-2 border-dashed border-[#05D4B5]/30" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-12 relative z-10">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center group bg-white/60 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none border border-[#0D1518]/05 md:border-none shadow-sm md:shadow-none">
                  
                  {/* Icon Box */}
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#05D4B5]/10 border border-[#05D4B5]/20 rounded-2xl sm:rounded-3xl flex items-center justify-center text-[#05D4B5] relative hover:scale-105 hover:bg-[#05D4B5]/15 transition-all duration-300 shadow-md shadow-[#05D4B5]/5">
                    <IconComponent className="w-7 h-7 sm:w-10 sm:h-10" />
                  </div>

                  {/* Step Number + Title */}
                  <div className="flex items-center justify-center gap-2 mt-3 sm:mt-6">
                    <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#05D4B5] text-white flex items-center justify-center text-xs sm:text-sm font-extrabold font-sans shadow-md">
                      {step.num}
                    </span>
                    <h3 className="font-sans font-extrabold text-[#0D1518] text-xs sm:text-base uppercase tracking-wider leading-none">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-2 sm:mt-4 max-w-[220px] mx-auto leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
