"use client";

import React from "react";
import { Factory, Thermometer, ShieldCheck, Search, Package, Truck } from "lucide-react";

export default function InteractiveScience() {
  const stages = [
    {
      num: "01",
      title: "Professional Facility",
      desc: "Linens are processed in commercial-scale, temperature-controlled facilities.",
      icon: Factory,
      color: "text-blue-500",
      bg: "bg-blue-500/05",
      border: "border-blue-500/10"
    },
    {
      num: "02",
      title: "60°C Hot Wash",
      desc: "Hot-washed at exactly 60°C to fully dissolve body oils, dead skin cells, and cosmetics.",
      icon: Thermometer,
      color: "text-red-500",
      bg: "bg-red-500/05",
      border: "border-red-500/10"
    },
    {
      num: "03",
      title: "UV-C Sanitization",
      desc: "Exposed to deep UV-C light fields to eliminate 99.9% of bacteria and microscopic germs.",
      icon: ShieldCheck,
      color: "text-teal-500",
      bg: "bg-teal-500/05",
      border: "border-teal-500/10"
    },
    {
      num: "04",
      title: "Quality Inspection",
      desc: "Every sheet is hand-inspected under backlighting to check yarn density and detect flaws.",
      icon: Search,
      color: "text-amber-500",
      bg: "bg-amber-500/05",
      border: "border-amber-500/10"
    },
    {
      num: "05",
      title: "Vacuum Sealed Bags",
      desc: "Sets are vacuum-sealed in sterile bags immediately to ensure zero external dust contact.",
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-500/05",
      border: "border-purple-500/10"
    },
    {
      num: "06",
      title: "Doorstep Exchange",
      desc: "Contactless delivery of fresh packs and pickup of used sheets on your custom cycle.",
      icon: Truck,
      color: "text-orange-500",
      bg: "bg-orange-500/05",
      border: "border-orange-500/10"
    }
  ];

  return (
    <section className="py-28 bg-[#FCFBF9] border-b border-[#0D1518]/05 reveal-on-scroll">
      <div className="max-w-[1380px] mx-auto px-6 sm:px-12 space-y-16">
        
        {/* Simplified Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <p className="text-micro-label text-[#C5A376]">Our Trust Process</p>
          <h2 className="text-section-header font-serif font-medium text-[#0D1518]">How We Sanitize Your Linen</h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-light">
            We follow standard professional laundering stages to deliver a clean hotel experience, swap after swap.
          </p>
        </div>

        {/* Clean, Simple 6-Step Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {stages.map((stage, idx) => {
            const IconComponent = stage.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border border-[#0D1518]/06 p-5 sm:p-6 rounded-[28px] shadow-[0_10px_35px_rgba(0,0,0,0.01)] hover:shadow-lg hover:border-[#C5A376]/20 transition-all duration-300 flex flex-col justify-between min-h-[220px]"
              >
                {/* Top content: Icon & Step Num */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${stage.bg} border ${stage.border}`}>
                      <IconComponent className={`w-4.5 h-4.5 ${stage.color}`} />
                    </div>
                    <span className="text-2xs font-mono font-black text-gray-300">
                      {stage.num}
                    </span>
                  </div>
                  
                  <h3 className="font-sans font-extrabold text-xs sm:text-sm text-[#0D1518] leading-tight uppercase tracking-wider">
                    {stage.title}
                  </h3>
                </div>

                {/* Bottom content: Description */}
                <p className="text-[10px] sm:text-xs text-[#0D1518]/65 leading-relaxed font-semibold mt-4">
                  {stage.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
