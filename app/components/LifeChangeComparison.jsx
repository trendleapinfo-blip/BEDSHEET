"use client";

import React from 'react';
import { X, Check } from 'lucide-react';

export default function LifeChangeComparison() {
  const withoutClosetRush = [
    "Wash heavy bedsheets yourself",
    "Dry them for hours on racks",
    "Iron out stubborn sheet wrinkles",
    "Store bulky replacement sets in closets",
    "Repeat this tedious cycle every month"
  ];

  const withClosetRush = [
    "Sleep on fresh hotel-quality bedding",
    "Contactless doorstep replacements swap",
    "Zero washing, zero ironing, zero drying",
    "No need to own multiple sheets sets",
    "Reclaim 6 hours of free time every month"
  ];

  return (
    <section className="py-12 sm:py-28 bg-[#032026] text-white border-y border-white/5 relative overflow-hidden" id="compare">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#05D4B5]/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-5 sm:px-12 space-y-8 sm:space-y-16 relative z-10">
        <div className="text-center space-y-2 sm:space-y-4 max-w-2xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#05D4B5] font-mono">
            Psychology of Convenience
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-white">
            Compare the Life Change
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 lg:gap-12 relative">
          {/* Card 1: Without ClosetRush */}
          <div className="bg-white/5 border border-white/10 p-5 sm:p-12 rounded-2xl sm:rounded-[32px] shadow-2xl transition-all duration-500 hover:border-rose-500/30 space-y-4 sm:space-y-8 backdrop-blur-sm">
            <div className="space-y-1 sm:space-y-2 border-b border-white/10 pb-4 sm:pb-6">
              <h3 className="font-serif text-xl sm:text-3xl font-bold text-white">Without ClosetRush</h3>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-rose-400">Traditional Laundry Drag</p>
            </div>
            <ul className="space-y-3 sm:space-y-6">
              {withoutClosetRush.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 sm:gap-4 group">
                  <div className="p-1 rounded-full bg-rose-500/10 text-rose-400 mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3} />
                  </div>
                  <span className="text-xs sm:text-base font-medium text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: With ClosetRush */}
          <div className="bg-[#05D4B5]/5 text-white p-5 sm:p-12 rounded-2xl sm:rounded-[32px] shadow-2xl relative overflow-hidden space-y-4 sm:space-y-8 border border-[#05D4B5]/20 transition-all duration-500 hover:border-[#05D4B5]/40 hover:shadow-[0_20px_50px_rgba(5,212,181,0.15)] backdrop-blur-sm">
            {/* Subtle glow effect inside the card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#05D4B5]/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="space-y-1 sm:space-y-2 border-b border-white/10 pb-4 sm:pb-6 relative z-10">
              <h3 className="font-serif text-xl sm:text-3xl font-bold text-white">With ClosetRush</h3>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#05D4B5]">Effortless replacements Flow</p>
            </div>
            <ul className="space-y-3 sm:space-y-6 relative z-10">
              {withClosetRush.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 sm:gap-4 group">
                  <div className="p-1 rounded-full bg-[#05D4B5]/20 text-[#05D4B5] mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3} />
                  </div>
                  <span className="text-xs sm:text-base font-medium text-gray-200 leading-relaxed group-hover:text-white transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
