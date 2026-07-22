"use client";

import React from "react";
import { Factory, Thermometer, ShieldCheck, Search, Package, Truck } from "lucide-react";

export default function InteractiveScience() {
  const stages = [
    {
      num: "01",
      title: "Professional Facility",
      desc: "Linens are processed in commercial-scale, temperature-controlled facilities.",
      icon: Factory
    },
    {
      num: "02",
      title: "60°C Hot Wash",
      desc: "Hot-washed at exactly 60°C to fully dissolve body oils, dead skin cells, and cosmetics.",
      icon: Thermometer
    },
    {
      num: "03",
      title: "UV-C Sanitization",
      desc: "Exposed to deep UV-C light fields to eliminate 99.9% of bacteria and microscopic germs.",
      icon: ShieldCheck
    },
    {
      num: "04",
      title: "Quality Inspection",
      desc: "Every sheet is hand-inspected under backlighting to check yarn density and detect flaws.",
      icon: Search
    },
    {
      num: "05",
      title: "Vacuum Sealed Bags",
      desc: "Sets are vacuum-sealed in sterile bags immediately to ensure zero external dust contact.",
      icon: Package
    },
    {
      num: "06",
      title: "Doorstep Exchange",
      desc: "Contactless delivery of fresh packs and pickup of used sheets on your custom cycle.",
      icon: Truck
    }
  ];

  return (
    <section className="py-12 sm:py-28 bg-[#FCFBF9] border-b border-[#0D1518]/05 relative overflow-hidden" id="trust-process">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-12 relative z-10 space-y-8 sm:space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#05D4B5]">
            Our Trust Process
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#0D1518] leading-tight">
            How We Sanitize Your Linen
          </h2>
          <p className="text-xs sm:text-base text-[#0D1518]/60 leading-relaxed font-medium">
            We follow standard professional laundering stages to deliver a clean, sterile hotel experience, swap after swap.
          </p>
        </div>

        {/* Process Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {stages.map((stage, idx) => {
            const IconComponent = stage.icon;
            return (
              <div key={idx} className="bg-white border border-[#0D1518]/05 p-4 sm:p-8 rounded-2xl sm:rounded-[32px] hover:border-[#05D4B5]/30 transition-all duration-300 flex flex-col shadow-[0_15px_40px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_50px_rgba(5,212,181,0.05)] group relative overflow-hidden min-h-0 sm:min-h-[240px]">
                {/* Background Large Number */}
                <div className="absolute top-0 right-0 p-3 sm:p-8 text-[50px] sm:text-[100px] leading-none font-serif font-black text-[#0D1518]/03 transition-all duration-500 group-hover:scale-110 group-hover:text-[#05D4B5]/05 pointer-events-none select-none -translate-y-2 translate-x-2 sm:-translate-y-4 sm:translate-x-4">
                  {stage.num}
                </div>
                
                <div className="space-y-3 sm:space-y-6 relative z-10 flex-1 flex flex-col">
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#05D4B5]/10 flex items-center justify-center border border-[#05D4B5]/20 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 shrink-0">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[#05D4B5]" />
                  </div>
                  
                  {/* Text Content */}
                  <div className="space-y-1 sm:space-y-3 mt-auto pt-2 sm:pt-4">
                    <h3 className="font-sans font-extrabold text-xs sm:text-xl text-[#0D1518] tracking-wide leading-snug">
                      {stage.title}
                    </h3>
                    <p className="text-[11px] sm:text-sm text-[#0D1518]/60 leading-relaxed font-medium">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
