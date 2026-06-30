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
      leftBadgeRef.current.style.transform = "translate3d(0px, 0px, 40px) rotateZ(-4deg)";
    }
    if (rightBadgeRef.current) {
      rightBadgeRef.current.style.transform = "translate3d(0px, 0px, 50px) rotateZ(4deg)";
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

      // Card tilting angles
      const rotateX = -normY * 18;
      const rotateY = normX * 18;

      // Apply rotation & scale to the main card
      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        cardRef.current.style.transition = "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)";
      }

      // Parallax: left badge floats outward and up
      if (leftBadgeRef.current) {
        const badgeX = normX * 30 - 8; // base translation shift
        const badgeY = normY * 30 - 4;
        leftBadgeRef.current.style.transform = `translate3d(${badgeX}px, ${badgeY}px, 60px) rotateZ(-5deg) scale(1.05)`;
        leftBadgeRef.current.style.transition = "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)";
      }

      // Parallax: right badge floats outward and down
      if (rightBadgeRef.current) {
        const badgeX = normX * -25 + 8;
        const badgeY = normY * -25 + 4;
        rightBadgeRef.current.style.transform = `translate3d(${badgeX}px, ${badgeY}px, 80px) rotateZ(5deg) scale(1.05)`;
        rightBadgeRef.current.style.transition = "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)";
      }

      // Dynamic ambient glow movement behind card
      if (glowRef.current) {
        const glowX = normX * 35;
        const glowY = normY * 35;
        glowRef.current.style.transform = `translate3d(${glowX}px, ${glowY}px, -45px) scale(1.15)`;
        glowRef.current.style.opacity = "1";
        glowRef.current.style.transition = "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease";
      }

      // Dynamic glare shine overlay on card surface
      if (shineRef.current) {
        const shineX = (x / width) * 100;
        const shineY = (y / height) * 100;
        shineRef.current.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(13, 148, 136, 0.15) 0%, rgba(255, 255, 255, 0.25) 30%, rgba(255, 255, 255, 0) 70%)`;
        shineRef.current.style.opacity = "1";
        shineRef.current.style.transition = "opacity 0.1s ease";
      }
    };

    const handleMouseLeave = () => {
      // Smoothly reset all elements to standard state
      if (cardRef.current) {
        cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        cardRef.current.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
      }
      if (leftBadgeRef.current) {
        leftBadgeRef.current.style.transform = "translate3d(0px, 0px, 40px) rotateZ(-4deg) scale(1)";
        leftBadgeRef.current.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
      }
      if (rightBadgeRef.current) {
        rightBadgeRef.current.style.transform = "translate3d(0px, 0px, 50px) rotateZ(4deg) scale(1)";
        rightBadgeRef.current.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
      }
      if (glowRef.current) {
        glowRef.current.style.transform = "translate3d(0px, 0px, -20px) scale(1)";
        glowRef.current.style.opacity = "0.7";
        glowRef.current.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease";
      }
      if (shineRef.current) {
        shineRef.current.style.opacity = "0";
        shineRef.current.style.transition = "opacity 0.6s ease";
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
      {/* Decorative background glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 bg-gradient-to-tr from-linen-gold/20 to-charcoal-ink/10 rounded-[32px] blur-2xl -z-10 opacity-75 pointer-events-none"
        style={{
          transformStyle: "preserve-3d",
        }}
      />

      {/* Floating Badge Left */}
      <div
        ref={leftBadgeRef}
        className="absolute left-2 sm:-left-8 top-1/4 bg-white border border-charcoal-ink/08 rounded-none p-2.5 sm:p-3 shadow-xl flex items-center gap-2 sm:gap-2.5 z-20 scale-90 sm:scale-100 origin-left pointer-events-none select-none"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="p-1 rounded-none bg-linen-gold/10 text-linen-gold">
          <CheckIcon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[9px] text-charcoal-ink/50 font-bold uppercase tracking-wider leading-none mb-0.5">
            Premium Fabric
          </p>
          <p className="text-xs font-black text-charcoal-ink leading-none">
            400 TC Cotton
          </p>
        </div>
      </div>

      {/* Floating Badge Right */}
      <div
        ref={rightBadgeRef}
        className="absolute right-2 sm:-right-8 bottom-1/4 bg-charcoal-ink text-alabaster-linen rounded-none p-2.5 sm:p-3 shadow-xl flex items-center gap-2 sm:gap-2.5 z-20 scale-90 sm:scale-100 origin-right pointer-events-none select-none"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="p-1 rounded-none bg-linen-gold/20 text-linen-gold">
          <StarIcon className="w-4 h-4 fill-linen-gold text-linen-gold" />
        </div>
        <div>
          <p className="text-[9px] text-alabaster-linen/50 font-bold uppercase tracking-wider leading-none mb-0.5">
            Annual Value
          </p>
          <p className="text-xs font-black text-linen-gold leading-none">
            Save ₹1200/yr
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div
        ref={cardRef}
        className="bg-white border border-charcoal-ink/08 rounded-none p-6 shadow-2xl relative overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Shine Overlay Layer */}
        <div
          ref={shineRef}
          className="absolute inset-0 pointer-events-none z-50 rounded-none mix-blend-color-dodge opacity-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)",
          }}
        />

        {/* Hologram Clean Tag */}
        <div 
          className="bg-charcoal-ink text-alabaster-linen flex items-center justify-between p-2.5 sm:p-3.5 rounded-none border border-charcoal-ink/20 mb-6"
          style={{ transform: "translateZ(15px)" }}
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <SparklesIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-linen-gold" />
            <span className="text-[10px] sm:text-xs font-black tracking-wider sm:tracking-widest uppercase">
              ClosetRush Premium
            </span>
          </div>
          <span className="text-[9px] sm:text-2xs font-extrabold px-1.5 sm:px-2 py-0.5 rounded-none bg-linen-gold text-charcoal-ink whitespace-nowrap">
            ACTIVE SEAL
          </span>
        </div>

        {/* Bedding Graphic (Premium Bedding Image) */}
        <div 
          className="relative rounded-none mb-6 overflow-hidden aspect-[4/3] border border-charcoal-ink/08 flex items-center justify-center bg-alabaster-linen shadow-inner"
          style={{ transform: "translateZ(10px)" }}
        >
          <img
            src="/hero_bedding.png"
            alt="Sterile Bedding Bundle"
            className="w-full h-full object-cover"
          />
          {/* Fresh Fragrance Label */}
          <div className="bg-linen-gold text-charcoal-ink rounded-none px-3 py-1 text-2xs font-bold absolute top-4 left-4 shadow-md backdrop-blur-sm bg-opacity-90">
            Sanitized at 60°C+
          </div>
        </div>

        {/* Pack Description */}
        <div className="space-y-3" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-charcoal-ink">
              Sterile Bedding Bundle
            </span>
            <span className="text-xs font-bold text-charcoal-ink/40">Pack #204</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="p-0.5 rounded-none bg-linen-gold/10 text-linen-gold">
              <CheckIcon className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs text-charcoal-ink/60 font-semibold">
              Sealed sterile packaging
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="p-0.5 rounded-none bg-linen-gold/10 text-linen-gold">
              <CheckIcon className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs text-charcoal-ink/60 font-semibold">
              Zero chemical allergens
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
