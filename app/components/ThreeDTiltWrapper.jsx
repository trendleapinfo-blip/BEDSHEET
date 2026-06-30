"use client";

import React, { useRef, useEffect } from "react";

export default function ThreeDTiltWrapper({
  children,
  className = "",
  maxTilt = 12,
  perspective = 1000,
  scale = 1.025,
}) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const shineRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;

      // Normalized coordinates from -0.5 to 0.5
      const normX = (x / width) - 0.5;
      const normY = (y / height) - 0.5;

      const rotateX = -normY * maxTilt;
      const rotateY = normX * maxTilt;

      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
        cardRef.current.style.transition = "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)";
      }

      if (shineRef.current) {
        const shineX = (x / width) * 100;
        const shineY = (y / height) * 100;
        shineRef.current.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(13, 148, 136, 0.12) 0%, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0) 70%)`;
        shineRef.current.style.opacity = "1";
        shineRef.current.style.transition = "opacity 0.15s ease";
      }
    };

    const handleMouseLeave = () => {
      if (cardRef.current) {
        cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        cardRef.current.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
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
  }, [maxTilt, perspective, scale]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none cursor-default ${className}`}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        ref={cardRef}
        className="w-full h-full relative"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Dynamic glossy glare layer */}
        <div
          ref={shineRef}
          className="absolute inset-0 pointer-events-none z-50 rounded-[inherit] mix-blend-color-dodge opacity-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
        {children}
      </div>
    </div>
  );
}
