"use client";

import React, { useState } from "react";
import { Bed, Truck, RotateCw, Package, ArrowUp, X, Check } from "lucide-react";

export default function StaircaseWorkflow() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const steps = [
    {
      num: "01",
      title: "Day 1",
      subtitle: "Fresh Bedding Delivered",
      desc: "Your sealed, clean sheets are delivered directly to your room. Put them on and sleep in hotel-grade luxury.",
      color: "#3B82F6", // Blue
      icon: Package,
      renderIcon: () => (
        <div className="text-[#3B82F6] flex items-center justify-center p-3.5 bg-blue-500/06 border border-blue-500/10 rounded-2xl">
          <Package className="w-8 h-8" />
        </div>
      )
    },
    {
      num: "02",
      title: "Day 30",
      subtitle: "Used Sheets Collected",
      desc: "We pick up your used, dirty sheets right from your doorstep. No washing or scrubbing needed.",
      color: "#84CC16", // Lime Green
      icon: Truck,
      renderIcon: () => (
        <div className="text-[#84CC16] flex items-center justify-center p-3.5 bg-lime-500/06 border border-lime-500/10 rounded-2xl">
          <Truck className="w-8 h-8" />
        </div>
      )
    },
    {
      num: "03",
      title: "Same Day",
      subtitle: "Fresh replacements swap",
      desc: "Receive your fresh, replacement swap pack at the same time. The effortless cycle repeats.",
      color: "#F97316", // Orange
      icon: RotateCw,
      renderIcon: () => (
        <div className="text-[#F97316] flex items-center justify-center p-3.5 bg-orange-500/06 border border-orange-500/10 rounded-2xl relative">
          <Bed className="w-8 h-8" />
          <div className="absolute -bottom-1 -right-1 bg-[#F97316] rounded-full p-0.5 border border-[#0B1315]">
            <RotateCw className="w-2.5 h-2.5 text-white animate-spin-slow" />
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="bg-[#0B1315] border-y border-white/5 py-28 relative overflow-hidden font-sans reveal-on-scroll">
      {/* CSS keyframe animations for chevrons and pulse */}
      <style jsx>{`
        @keyframes chevronPulse {
          0%, 100% {
            opacity: 0.35;
            transform: translateX(0);
          }
          50% {
            opacity: 1;
            transform: translateX(4px);
          }
        }
        .chev-1 { animation: chevronPulse 1.4s infinite 0s; }
        .chev-2 { animation: chevronPulse 1.4s infinite 0.2s; }
        .chev-3 { animation: chevronPulse 1.4s infinite 0.4s; }

        .reveal-active .timeline-line-horizontal {
          width: 100% !important;
        }

        @keyframes arrowLineFlow {
          from {
            stroke-dashoffset: 12;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .arrow-line-flow {
          stroke-dasharray: 6, 6;
          animation: arrowLineFlow 0.8s linear infinite;
        }
      `}</style>

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#C5A376]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-12 relative z-10 space-y-24">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <p className="text-micro-label text-[#C5A376]">The Lifecycle</p>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-medium leading-tight">
            How ClosetRush Works
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed font-light">
            We handle the dirty work on autopilot so you can sleep on hotel-fresh replacements every month.
          </p>
        </div>

        {/* ========================================================
            1. DESKTOP 3-STEP TIMELINE VIEW (lg and up)
           ======================================================== */}
        <div className="hidden lg:grid grid-cols-3 gap-8 items-stretch relative min-h-[380px] select-none">
          
          {/* Static Center Line across all steps */}
          <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-[1px] bg-white/10 z-0">
            {/* Animated growing progress line on reveal */}
            <div className="timeline-line-horizontal w-0 h-full bg-gradient-to-r from-[#3B82F6] via-[#84CC16] to-[#F97316] opacity-40 transition-all duration-[2s] ease-in-out" />
          </div>

          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;
            const isHovered = hoveredIdx === idx;

            return (
              <div 
                key={idx} 
                className="relative flex flex-col justify-between items-center text-center z-10"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Vertical dotted crossline */}
                <div className="absolute top-4 bottom-4 left-1/2 w-[1px] border-l border-dashed border-white/10 z-0 pointer-events-none" />

                {/* ================= TOP SLOT ================= */}
                <div className="w-full min-h-[120px] flex items-end justify-center px-4 pb-4">
                  {isEven ? (
                    // Text details
                    <div className={`space-y-1.5 transition-all duration-500 transform ${isHovered ? "translate-y-[-6px]" : "translate-y-0"}`}>
                      <span style={{ color: step.color }} className="text-[10px] font-black tracking-widest uppercase font-mono block">
                        {step.title}
                      </span>
                      <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                        {step.subtitle}
                      </h4>
                      <p className="text-3xs text-gray-400 font-semibold leading-relaxed max-w-[200px] mx-auto">
                        {step.desc}
                      </p>
                    </div>
                  ) : (
                    // Icon
                    <div className={`transition-all duration-500 transform ${isHovered ? "scale-110 translate-y-[-6px]" : "scale-100"}`}>
                      {step.renderIcon()}
                    </div>
                  )}
                </div>

                {/* ================= MIDDLE CONNECTOR SLOT ================= */}
                <div className="h-16 w-full flex items-center justify-center relative">
                  
                  {/* Left-side Chevron indicators */}
                  <div className="absolute left-8 flex gap-0.5 text-white/10 select-none">
                    <span style={{ color: isHovered ? step.color : "inherit" }} className="text-[9px] font-bold tracking-tighter chev-1">›</span>
                    <span style={{ color: isHovered ? step.color : "inherit" }} className="text-[9px] font-bold tracking-tighter chev-2">›</span>
                    <span style={{ color: isHovered ? step.color : "inherit" }} className="text-[9px] font-bold tracking-tighter chev-3">›</span>
                  </div>

                  {/* Central Node Circle with Inner Dot */}
                  <div 
                    style={{ 
                      borderColor: step.color,
                      boxShadow: isHovered ? `0 0 15px ${step.color}45` : "none",
                      transform: isHovered ? "scale(1.2)" : "scale(1)"
                    }}
                    className="w-5.5 h-5.5 rounded-full border-[1.5px] bg-[#0B1315] flex items-center justify-center z-10 transition-all duration-300"
                  >
                    <div style={{ backgroundColor: step.color }} className="w-1.5 h-1.5 rounded-full" />
                  </div>

                  {/* Glowing Arrow Path to the right of node */}
                  {idx < 2 && (
                    <svg 
                      className="absolute right-0 w-12 h-6 overflow-visible pointer-events-none transition-all duration-300" 
                      viewBox="0 0 48 24"
                      style={{
                        transform: `translateX(50%) ${isHovered ? "scale(1.15)" : "scale(1)"}`,
                      }}
                    >
                      {/* Flowing horizontal line */}
                      <path
                        d="M 2 12 H 30"
                        fill="none"
                        stroke={step.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="arrow-line-flow"
                        style={{
                          opacity: isHovered ? 1 : 0.4,
                          transition: "opacity 0.3s ease"
                        }}
                      />
                      {/* Solid arrowhead */}
                      <path
                        d="M 24 6 L 32 12 L 24 18"
                        fill="none"
                        stroke={step.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          opacity: isHovered ? 1 : 0.4,
                          transition: "opacity 0.3s ease"
                        }}
                      />
                    </svg>
                  )}

                </div>

                {/* ================= BOTTOM SLOT ================= */}
                <div className="w-full min-h-[120px] flex items-start justify-center px-4 pt-4">
                  {!isEven ? (
                    // Text details
                    <div className={`space-y-1.5 transition-all duration-500 transform ${isHovered ? "translate-y-[6px]" : "translate-y-0"}`}>
                      <span style={{ color: step.color }} className="text-[10px] font-black tracking-widest uppercase font-mono block">
                        {step.title}
                      </span>
                      <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                        {step.subtitle}
                      </h4>
                      <p className="text-3xs text-gray-400 font-semibold leading-relaxed max-w-[200px] mx-auto">
                        {step.desc}
                      </p>
                    </div>
                  ) : (
                    // Icon
                    <div className={`transition-all duration-500 transform ${isHovered ? "scale-110 translate-y-[6px]" : "scale-100"}`}>
                      {step.renderIcon()}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* ========================================================
            2. MOBILE/TABLET VERTICAL STACK TIMELINE VIEW
           ======================================================== */}
        <div className="lg:hidden space-y-6 relative">
          <div className="absolute left-[34px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#3B82F6] via-[#84CC16] to-[#F97316] z-0 opacity-20" />

          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="relative flex items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-3xl z-10"
            >
              <div 
                style={{ borderColor: step.color, boxShadow: `0 0 10px ${step.color}15` }}
                className="w-13 h-13 rounded-2xl border bg-[#0B1315] flex items-center justify-center shrink-0"
              >
                {step.renderIcon()}
              </div>

              <div className="space-y-1">
                <span style={{ color: step.color }} className="text-[9px] font-black uppercase tracking-widest font-mono">
                  {step.title}
                </span>
                <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">{step.subtitle}</h3>
                <p className="text-3xs text-gray-400 font-semibold leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================
            3. BEFORE / AFTER LIFESTYLE COMPARISON GRID
           ======================================================== */}
        <div className="pt-12 border-t border-white/5">
          <div className="text-center max-w-lg mx-auto mb-12 space-y-2">
            <h3 className="font-serif text-2xl text-white font-medium">Compare the Life Change</h3>
            <p className="text-3xs text-gray-400 uppercase tracking-widest font-mono font-bold">Psychology of Convenience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Without ClosetRush (❌ Life) */}
            <div className="bg-red-500/05 border border-red-500/10 rounded-[32px] p-8 space-y-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400">
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                  <span className="text-[9px] font-black uppercase tracking-widest font-mono">Without ClosetRush</span>
                </div>
                <h4 className="font-serif text-lg text-white font-semibold mt-4">Traditional Laundry Drag</h4>
              </div>

              <ul className="space-y-4 text-xs font-semibold text-gray-400">
                {[
                  "Wash heavy bedsheets yourself",
                  "Dry them for hours on racks",
                  "Iron out stubborn sheet wrinkles",
                  "Store bulky replacement sets in closets",
                  "Repeat this tedious cycle every month"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-[10px] shrink-0 font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* With ClosetRush (✅ Life) */}
            <div className="bg-[#10B981]/05 border border-[#10B981]/10 rounded-[32px] p-8 space-y-6 flex flex-col justify-between shadow-[0_15px_40px_rgba(16,185,129,0.02)]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full text-[#10B981]">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span className="text-[9px] font-black uppercase tracking-widest font-mono">With ClosetRush</span>
                </div>
                <h4 className="font-serif text-lg text-white font-semibold mt-4">Effortless replacements Flow</h4>
              </div>

              <ul className="space-y-4 text-xs font-semibold text-gray-100">
                {[
                  "Sleep on fresh hotel-quality bedding",
                  "Contactless doorstep replacements swap",
                  "Zero washing, zero ironing, zero drying",
                  "No need to own multiple sheets sets",
                  "Reclaim 6 hours of free time every month"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] text-[10px] shrink-0 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
