"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import Navbar from "../components/Navbar";

import { 
  ShieldCheck, 
  Leaf, 
  Sparkles, 
  Clock, 
  Heart, 
  RefreshCw, 
  Truck, 
  Star,
  Search,
  Package,
  ArrowRight,
  Smile,
  Thermometer
} from "lucide-react";

export default function AboutPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  // GSAP script loading states
  const [gsapReady, setGsapReady] = useState(false);

  // Set up GSAP entry triggers once loaded
  useEffect(() => {
    if (!gsapReady) return;

    if (typeof window !== "undefined" && window.gsap) {
      const gsap = window.gsap;

      // 1. Hero Reveal
      gsap.from(".gsap-about-hero", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out"
      });
    }
  }, [gsapReady]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        window.location.reload();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0D1518] font-sans antialiased flex flex-col justify-between" id="about-page">
      {/* Navigation */}
      <Navbar user={user} loading={loading} handleLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-grow pt-28 md:pt-36">
        
        {/* SECTION 1: Hero */}
        <section className="max-w-[1380px] mx-auto px-6 sm:px-12 py-12 md:py-20 text-center space-y-6">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C5A376] bg-[#C5A376]/10 px-4 py-1.5 rounded-full border border-[#C5A376]/20 inline-block font-mono gsap-about-hero">
            Our Story & Vision
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#0D1518] tracking-tight max-w-4xl mx-auto leading-tight gsap-about-hero">
            Rethinking how the <span className="bg-gradient-to-r from-[#C5A376] to-[#E6C697] bg-clip-text text-transparent italic font-normal">modern world sleeps.</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed font-light gsap-about-hero">
            ClosetRush is a luxury bedding subscription service. We deliver sanitized, fresh, certified organic sheets and pillowcases right to your doorstep, swapping them out periodically so you enjoy clean sheets without the laundry hassle.
          </p>
        </section>

        {/* SECTION 2: Our Story Split Layout */}
        <section id="story-segment" className="py-20 bg-white border-y border-[#0D1518]/05">
          <div className="max-w-[1380px] mx-auto px-6 sm:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Left Column: Bangalore PG Origin Story */}
              <div className="lg:col-span-7 space-y-6 gsap-story-reveal">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C5A376] font-mono block">
                  The Genesis
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-medium text-[#0D1518] leading-tight">
                  The Story Behind the Idea
                </h2>
                
                <div className="border-l-[3px] border-[#C5A376]/40 pl-5 space-y-4 pt-1">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-semibold">
                    The idea was born in a cramped, humid student apartment in Bangalore. Founder Ruchi Pathak, overwhelmed by 80-hour work weeks and academic stress, found herself constantly fighting over a single, slow shared washing machine.
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
                    After sleeping on damp, musty cotton sheets for a week during the heavy monsoons and waking up with skin irritations, Ruchi remarked: <span className="italic font-serif text-[#0D1518] font-bold">“We don't buy sheets, we buy the feeling of fresh, hotel-quality sleep.”</span> That lightbulb moment became ClosetRush—clean bedding on autopilot.
                  </p>
                </div>
              </div>

              {/* Right Column: Founder Info Card */}
              <div className="lg:col-span-5 bg-[#FCFBF9] border border-[#0D1518]/05 p-8 rounded-[32px] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[320px] gsap-story-reveal">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C5A376]/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-4">
                  <span className="text-3xs font-mono font-black uppercase tracking-widest text-[#C5A376] bg-[#C5A376]/10 px-3 py-1 border border-[#C5A376]/15 rounded-full w-fit block">
                    Sleep & Hygiene Innovator
                  </span>
                  
                  <h3 className="font-serif text-2xl font-bold text-[#0D1518] leading-tight">
                    Ruchi Pathak
                  </h3>
                  <p className="text-2xs text-gray-500 font-bold uppercase tracking-wider -mt-2">
                    Founder of ClosetRush
                  </p>
                  
                  <p className="text-sm sm:text-base text-gray-600 italic font-light leading-relaxed">
                    “Sleep is the foundation of energy. By removing the friction of laundry, we help busy people buy back their weekends while sleeping in absolute comfort.”
                  </p>
                </div>

                <div className="pt-6 border-t border-[#0D1518]/06 mt-6 flex justify-between items-center text-2xs font-mono font-bold tracking-wider text-gray-400">
                  <span>CLOSET RUSH TEAM</span>
                  <span className="text-[#C5A376]">EST. 2026</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 3: Why ClosetRush Features Grid */}
        <section id="why-closetrush-segment" className="py-24 bg-[#FCFBF9]/50 border-b border-[#0D1518]/05">
          <div className="max-w-[1380px] mx-auto px-6 sm:px-12">
            <div className="text-center mb-16 space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C5A376] font-mono block">Why ClosetRush</span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#0D1518] font-medium leading-tight">Built on hygiene, sustainability, & luxury</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1: Absolute Sanitization */}
              <div className="bg-white border border-[#0D1518]/05 p-8 rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300 space-y-6 flex flex-col justify-between gsap-why-card">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-red-500/05 border border-red-500/10 flex items-center justify-center text-red-500">
                    <ShieldCheck className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#0D1518]">Absolute Sanitization</h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold leading-relaxed">
                    Every swap undergoes 60°C+ hot-water washing and deep UV-C sterilization to eliminate 99.9% of bacteria, allergens, and germs.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-500 bg-red-500/05 border border-red-500/10 px-2.5 py-1 rounded-full w-fit">
                  100% Germ-Free Promise
                </span>
              </div>

              {/* Feature 2: Eco-Conscious Loop */}
              <div className="bg-white border border-[#0D1518]/05 p-8 rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300 space-y-6 flex flex-col justify-between gsap-why-card">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-teal-500/05 border border-teal-500/10 flex items-center justify-center text-teal-600">
                    <Leaf className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#0D1518]">Eco-Conscious Loop</h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold leading-relaxed">
                    Commercial laundering saves up to 45% water and electricity compared to home washing machines. Our standard sheets are made of GOTS-certified organic cotton.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-600 bg-teal-500/05 border border-teal-500/10 px-2.5 py-1 rounded-full w-fit">
                  Sustainable Bedding
                </span>
              </div>

              {/* Feature 3: Zero-Effort Comfort */}
              <div className="bg-white border border-[#0D1518]/05 p-8 rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300 space-y-6 flex flex-col justify-between gsap-why-card">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-orange-500/05 border border-orange-500/10 flex items-center justify-center text-orange-500">
                    <Clock className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#0D1518]">Zero-Effort Comfort</h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold leading-relaxed">
                    We handle everything from delivery to collection. Receive vacuum-sealed, perfectly ironed bundles on a schedule that fits your life.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-500 bg-orange-500/05 border border-orange-500/10 px-2.5 py-1 rounded-full w-fit">
                  No Laundering Ever
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Our Production Standard & Promise Split */}
        <section id="standards-segment" className="max-w-[1380px] mx-auto px-6 sm:px-12 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left: Production standards list */}
            <div className="lg:col-span-7 space-y-8">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C5A376] font-mono block">
                Our Production Standard
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#0D1518] leading-tight">
                How we achieve five-star luxury cleanliness.
              </h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-light">
                Bed sheets collect dead skin cells, sweat, dust mites, and bacteria daily. Standard home laundering rarely eliminates them completely.
              </p>
              
              <div className="space-y-6">
                {[
                  { num: 1, title: "Hypoallergenic Wash Cycles", desc: "We wash sheets in professional facility drums using specialized eco-detergents at extreme heat (60°C+) to completely dissolve grease and allergens.", icon: Thermometer },
                  { num: 2, title: "UV-C Sanitation Tunnel", desc: "Post-drying, all sheets pass through active UV-C light fields to destroy any microscopic bacteria or viruses remaining.", icon: ShieldCheck },
                  { num: 3, title: "Vacuum-Sealed Dispatches", desc: "Linen sets are vacuum sealed in our sterile facility immediately after sanitization, ensuring no external dust touches your bedding until you tear the bag open.", icon: Package }
                ].map((step, idx) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={idx} className="flex gap-5 gsap-standard-step">
                      <div className="w-10 h-10 rounded-xl bg-[#0B1315] text-white flex items-center justify-center text-xs shrink-0 font-bold border border-white/5 font-mono shadow-md">
                        {step.num}
                      </div>
                      <div>
                        <h4 className="font-sans font-extrabold text-sm text-[#0D1518] uppercase tracking-wider">{step.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 font-semibold leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: The ClosetRush Promise Quote */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white border border-[#0D1518]/06 rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.015)] space-y-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#C5A376]" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#0B1315] font-mono">The ClosetRush Promise</span>
                </div>
                <blockquote className="text-base sm:text-lg font-serif italic text-[#0D1518]/85 leading-relaxed font-light">
                  “Our goal was never just to build a bedding rental service. We wanted to eliminate one of the most tedious home chores while elevating the quality of sleep. Clean sheets change the mood of a home. We want everyone to experience that hotel-quality feeling every single week.”
                </blockquote>
                <div className="flex items-center gap-3 pt-5 border-t border-[#0D1518]/05">
                  <div className="w-10 h-10 rounded-full bg-[#C5A376]/10 flex items-center justify-center text-[#C5A376] font-bold text-sm font-serif">CR</div>
                  <div>
                    <h5 className="font-serif text-sm sm:text-base font-bold text-[#0D1518]">Ruchi Pathak</h5>
                    <p className="text-2xs text-gray-400 font-bold uppercase tracking-wider">Founder, ClosetRush • Sleep & Hygiene Innovator</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 5: CTA */}
        <section className="bg-[#0B1315] text-[#FCFBF9] py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-950/15 via-transparent to-transparent pointer-events-none z-0 opacity-40" />
          <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Ready to upgrade to a smarter, fresher bed?
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm max-w-lg mx-auto font-light leading-relaxed">
              Join thousands of households enjoying fresh, UV-sanitized organic cotton bedsheets without the laundry chore.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/shop"
                className="px-8 py-4 bg-[#C5A376] hover:bg-white text-white hover:text-[#0B1315] font-sans text-2xs font-extrabold tracking-widest uppercase transition-all duration-300 w-full sm:w-auto text-center rounded-full shadow-md hover:scale-105 active:scale-95"
              >
                Browse Catalog
              </Link>
              <Link
                href="/#pricing-plans"
                className="px-8 py-4 border border-white/10 hover:border-white/30 bg-white/02 text-white font-sans text-2xs font-extrabold tracking-widest uppercase transition-all duration-300 w-full sm:w-auto text-center rounded-full hover:scale-105 active:scale-95 animate-pulse"
              >
                View Plans
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#0B1315] text-[#FCFBF9] py-12 border-t border-white/05">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
            <span className="text-xl font-serif font-bold text-[#C5A376] tracking-[0.1em] uppercase">
              ClosetRush
            </span>
            <p className="text-2xs text-white/40 font-semibold">
              © {new Date().getFullYear()} ClosetRush. All rights reserved. • Built for healthier sleeping.
            </p>
          </div>
        </div>
      </footer>

      {/* GSAP CDN script tags loaded sequentially to ensure entry animation works */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" 
        strategy="lazyOnload" 
        onLoad={() => setGsapReady(true)}
      />
    </div>
  );
}
