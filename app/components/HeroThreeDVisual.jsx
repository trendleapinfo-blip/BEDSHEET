"use client";

import React, { useRef, useEffect } from "react";
import { CheckIcon, StarIcon, SparklesIcon } from "./Icons";

export default function HeroThreeDVisual() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const leftBadgeRef = useRef(null);
  const rightBadgeRef = useRef(null);
  const glowRef = useRef(null);
  const shineRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set initial 3D transforms for proper depth rendering
    if (leftBadgeRef.current) {
      leftBadgeRef.current.style.transform = "translate3d(0px, 0px, 45px) rotateZ(-3deg)";
    }
    if (rightBadgeRef.current) {
      rightBadgeRef.current.style.transform = "translate3d(0px, 0px, 55px) rotateZ(3deg)";
    }
    if (glowRef.current) {
      glowRef.current.style.transform = "translate3d(0px, 0px, -20px) scale(1)";
    }

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;

      // Normalized coordinates from -0.5 to 0.5
      const normX = (x / width) - 0.5;
      const normY = (y / height) - 0.5;

      // Card tilting angles (slightly softer tilt for luxury feel)
      const rotateX = -normY * 14;
      const rotateY = normX * 14;

      // Apply rotation & scale to the main card
      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;
        cardRef.current.style.transition = "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)";
      }

      // Parallax: left badge floats outward and up
      if (leftBadgeRef.current) {
        const badgeX = normX * 25 - 6; // base translation shift
        const badgeY = normY * 25 - 3;
        leftBadgeRef.current.style.transform = `translate3d(${badgeX}px, ${badgeY}px, 65px) rotateZ(-4deg) scale(1.03)`;
        leftBadgeRef.current.style.transition = "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)";
      }

      // Parallax: right badge floats outward and down
      if (rightBadgeRef.current) {
        const badgeX = normX * -20 + 6;
        const badgeY = normY * -20 + 3;
        rightBadgeRef.current.style.transform = `translate3d(${badgeX}px, ${badgeY}px, 85px) rotateZ(4deg) scale(1.03)`;
        rightBadgeRef.current.style.transition = "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)";
      }

      // Dynamic ambient glow movement behind card
      if (glowRef.current) {
        const glowX = normX * 30;
        const glowY = normY * 30;
        glowRef.current.style.transform = `translate3d(${glowX}px, ${glowY}px, -40px) scale(1.12)`;
        glowRef.current.style.opacity = "1";
        glowRef.current.style.transition = "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease";
      }

      // Dynamic glare shine overlay on card surface
      if (shineRef.current) {
        const shineX = (x / width) * 100;
        const shineY = (y / height) * 100;
        shineRef.current.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(26, 79, 84, 0.15) 0%, rgba(255, 255, 255, 0.25) 30%, rgba(255, 255, 255, 0) 75%)`;
        shineRef.current.style.opacity = "1";
        shineRef.current.style.transition = "opacity 0.1s ease";
      }
    };

    const handleMouseLeave = () => {
      // Smoothly reset all elements to standard state
      if (cardRef.current) {
        cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        cardRef.current.style.transition = "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
      }
      if (leftBadgeRef.current) {
        leftBadgeRef.current.style.transform = "translate3d(0px, 0px, 45px) rotateZ(-3deg) scale(1)";
        leftBadgeRef.current.style.transition = "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
      }
      if (rightBadgeRef.current) {
        rightBadgeRef.current.style.transform = "translate3d(0px, 0px, 55px) rotateZ(3deg) scale(1)";
        rightBadgeRef.current.style.transition = "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
      }
      if (glowRef.current) {
        glowRef.current.style.transform = "translate3d(0px, 0px, -20px) scale(1)";
        glowRef.current.style.opacity = "0.7";
        glowRef.current.style.transition = "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease";
      }
      if (shineRef.current) {
        shineRef.current.style.opacity = "0";
        shineRef.current.style.transition = "opacity 0.8s ease";
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[420px] px-6 select-none cursor-default font-sans"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Decorative background glow (Teal + Gold accent) */}
      <div
        ref={glowRef}
        className="absolute inset-0 bg-gradient-to-tr from-[#1A4F54]/25 via-transparent to-[#C5A376]/15 rounded-[32px] blur-3xl -z-10 opacity-75 pointer-events-none"
        style={{
          transformStyle: "preserve-3d",
        }}
      />

      {/* Floating Badge Left (Premium Fabric) */}
      <div
        ref={leftBadgeRef}
        className="absolute left-2 sm:-left-8 top-1/4 bg-white border border-[#0D1518]/08 rounded-2xl p-3 sm:p-4 shadow-xl flex items-center gap-3 z-20 scale-95 sm:scale-100 origin-left pointer-events-none select-none"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="p-2.5 rounded-xl bg-[#1A4F54]/06 text-[#1A4F54]">
          <CheckIcon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest leading-none mb-1">
            Premium Fabric
          </p>
          <p className="text-xs font-black text-[#0B1315] leading-none font-sans">
            400 TC Cotton
          </p>
        </div>
      </div>

      {/* Floating Badge Right (Annual Savings) */}
      <div
        ref={rightBadgeRef}
        className="absolute right-2 sm:-right-8 bottom-1/4 bg-[#0B1315] text-[#FAF9F6] border border-white/10 rounded-2xl p-3 sm:p-4 shadow-xl flex items-center gap-3 z-20 scale-95 sm:scale-100 origin-right pointer-events-none select-none"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="p-2.5 rounded-xl bg-[#C5A376]/20 text-[#C5A376]">
          <StarIcon className="w-4 h-4 fill-[#C5A376] text-[#C5A376]" />
        </div>
        <div>
          <p className="text-[9px] text-[#FAF9F6]/50 font-extrabold uppercase tracking-widest leading-none mb-1">
            Annual Value
          </p>
          <p className="text-xs font-black text-[#C5A376] leading-none font-sans">
            Save ₹1200/yr
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div
        ref={cardRef}
        className="bg-white border border-[#0D1518]/08 rounded-[32px] p-6 shadow-2xl relative overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Shine Overlay Layer */}
        <div
          ref={shineRef}
          className="absolute inset-0 pointer-events-none z-50 rounded-[inherit] mix-blend-color-dodge opacity-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)",
          }}
        />

        {/* Ambient Thermodynamic Waves inside card */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full bg-[#1A4F54]/10 blur-xl animate-breeze" />
          <div className="absolute -left-10 top-20 w-40 h-40 rounded-full bg-[#C5A376]/5 blur-lg" />
        </div>

        {/* Hologram Clean Tag */}
        <div 
          className="bg-[#0B1315] text-[#FAF9F6] flex items-center justify-between p-3.5 rounded-2xl border border-white/05 mb-6 relative z-10"
          style={{ transform: "translateZ(18px)" }}
        >
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-[#C5A376]" />
            <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-[#DCEBEB]">
              ClosetRush Premium
            </span>
          </div>
          <span className="text-[9px] sm:text-2xs font-extrabold px-2 py-0.5 rounded-full bg-[#C5A376] text-[#0B1315] whitespace-nowrap">
            ACTIVE SEAL
          </span>
        </div>

        {/* Bedding Graphic */}
        <div 
          className="relative rounded-[20px] mb-6 overflow-hidden aspect-[4/3] border border-[#0D1518]/06 flex items-center justify-center bg-[#FAF9F6] shadow-inner z-10"
          style={{ transform: "translateZ(12px)" }}
        >
          <img
            src="/hero_bedding.png"
            alt="Sterile Bedding Bundle"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              // Fail-safe elegant illustration if image is missing
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          
          {/* Elegant SVG visual fallback if image doesn't exist */}
          <div className="absolute inset-0 hidden flex-col items-center justify-center bg-gradient-to-tr from-[#1A4F54]/10 to-[#C5A376]/5 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1A4F54]/10 flex items-center justify-center mb-2">
              <SparklesIcon className="w-8 h-8 text-[#1A4F54] animate-pulse-glow" />
            </div>
            <p className="font-serif text-sm font-bold text-[#0B1315]">Premium Sterile Linen</p>
            <p className="text-[9px] uppercase tracking-wider text-gray-400 mt-1">Ready for Swapping</p>
          </div>

          {/* Fresh Fragrance Label */}
          <div className="bg-[#C5A376] text-[#0B1315] rounded-full px-3 py-1 text-2xs font-bold absolute top-4 left-4 shadow-md backdrop-blur-sm bg-opacity-95">
            Sanitized at 60°C+
          </div>
        </div>

        {/* Pack Description */}
        <div className="space-y-3.5 relative z-10" style={{ transform: "translateZ(24px)" }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-[#0B1315]">
              Sterile Bedding Bundle
            </span>
            <span className="text-xs font-bold text-[#0B1315]/40 font-mono">Pack #204</span>
          </div>
          
          <div className="h-[1px] bg-[#0D1518]/06 my-2" />

          <div className="flex items-center gap-2">
            <span className="p-0.5 rounded-full bg-[#1A4F54]/10 text-[#1A4F54]">
              <CheckIcon className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs text-[#0D1518]/70 font-semibold">
              Sealed sterile packaging
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="p-0.5 rounded-full bg-[#1A4F54]/10 text-[#1A4F54]">
              <CheckIcon className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs text-[#0D1518]/70 font-semibold">
              Zero chemical allergens
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
