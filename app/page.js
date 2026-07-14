"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import Link from "next/link";
import Navbar from "./components/Navbar";
import HeroThreeDVisual from "./components/HeroThreeDVisual";
import InteractiveScience from "./components/InteractiveScience";
import RoutineComparison from "./components/RoutineComparison";
import SavingsTable from "./components/SavingsTable";
import StaircaseWorkflow from "./components/StaircaseWorkflow";

import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Star, 
  ChevronDown, 
  Check, 
  X,
  Sparkles,
  Bed,
  Phone,
  Clock,
  Heart,
  Smile,
  Shield,
  Coffee,
  Truck,
  ShieldCheck,
  Recycle,
  DollarSign
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  
  // Lead magnet form states
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [claimedDiscount, setClaimedDiscount] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);

  // GSAP script loading states
  const [gsapReady, setGsapReady] = useState(false);

  // Fetch session & plans
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

    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/plans");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.plans) {
            setPlans(data.plans);
          }
        }
      } catch (err) {
        console.error("Fetch plans error:", err);
      }
    };

    fetchSession();
    fetchPlans();
  }, []);

  // Set up GSAP hero entry fade-in once loaded
  useEffect(() => {
    if (!gsapReady) return;

    if (typeof window !== "undefined" && window.gsap) {
      const gsap = window.gsap;
      gsap.from(".gsap-hero-fade", {
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
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        setUser(null);
        window.location.reload();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleClaimDiscount = async (e) => {
    e.preventDefault();
    if (!leadEmail.trim() || !leadPhone.trim()) return;

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: leadEmail, phone: leadPhone }),
      });

      if (res.ok) {
        setClaimedDiscount(true);
        setLeadEmail("");
        setLeadPhone("");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to join the priority waitlist. Please try again.");
      }
    } catch (err) {
      console.error("Waitlist join error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const faqs = [
    {
      q: "Is it hygienic?",
      a: "Yes, absolutely. Every sheets pack goes through our 6-stage clinical sanitization process: washed at exactly 60°C to dissolve cosmetics and body oils, sterilized with high-frequency UV-C rays to neutralize 99.9% of bacteria, and sealed in sterile packaging before delivery."
    },
    {
      q: "Can I cancel or pause anytime?",
      a: "Yes. There are zero long-term commitments or lock-in contracts. You can pause, adjust your exchange cycles, upgrade/downgrade tiers, or cancel your subscription directly from your account dashboard with a single click."
    },
    {
      q: "What if the sheets tear or stain?",
      a: "We expect normal wear and tear. Fabric thinning, minor lint, or standard sleep sweat stains are completely covered by us. For any major accidental damage or tears, our friendly support team resolves it quickly through your dashboard."
    },
    {
      q: "What bedding sizes are supported?",
      a: "We support standard Single beds (6x3 ft) and Double beds (6x5 ft) for single and double plans. You can select your specific size and details on our plan configurator."
    },
    {
      q: "How often do you replace the linen?",
      a: "Depending on your selection (Basic or Premium tier), we swap your used sheets for freshly sanitized replacements either monthly or weekly. You can also customize your preferred doorstep pickup/delivery swap dates."
    },
    {
      q: "Is there a security deposit required?",
      a: "Our Basic plans have a small, fully-refundable security deposit of ₹500 (Single) or ₹800 (Double) to protect the linen swaps. Our Premium plans require ₹0 security deposit."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFBF9] text-[#0D1518] flex flex-col items-center justify-center font-sans antialiased">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes waveLiquid {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
          .liquid-wave {
            position: absolute;
            top: 45%;
            left: 50%;
            width: 220%;
            height: 220%;
            background: linear-gradient(to bottom, rgba(197, 163, 118, 0.2), rgba(197, 163, 118, 0.35));
            border-radius: 38%;
            animation: waveLiquid 8s infinite linear;
          }
          .liquid-wave-secondary {
            position: absolute;
            top: 40%;
            left: 50%;
            width: 210%;
            height: 210%;
            background: linear-gradient(to bottom, rgba(13, 21, 24, 0.04), rgba(13, 21, 24, 0.08));
            border-radius: 40%;
            animation: waveLiquid 12s infinite linear;
          }
        `}} />

        <div className="text-center space-y-10 max-w-md px-6">
          {/* Circular Liquid Washer Container */}
          <div className="relative w-36 h-36 mx-auto bg-white border border-[#C5A376]/20 shadow-md rounded-full overflow-hidden flex items-center justify-center">
            {/* Morphing Liquid Waves */}
            <div className="liquid-wave" />
            <div className="liquid-wave-secondary" />
            
            {/* Modern Floating Bed Icon */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-2 animate-pulse">
              <Bed className="w-12 h-12 text-[#0D1518]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0D1518]/60">Sanitizing</span>
            </div>
          </div>

          <div className="space-y-4">
            <img
              src="/image.png"
              alt="ClosetRush Logo"
              className="h-14 w-auto mx-auto object-contain shrink-0"
            />
            <h1 className="font-serif font-bold text-2xl uppercase tracking-widest text-[#0D1518]">
              CLOSET RUSH
            </h1>
            
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#C5A376] font-black uppercase tracking-widest block animate-pulse">
                Thermodynamic Sanitization Active
              </span>
              <p className="text-xs text-[#0D1518]/50 font-semibold uppercase tracking-widest leading-relaxed">
                Swapping & washing fresh organic linens...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0D1518] font-sans antialiased" id="home">
      
      {/* Navigation Bar */}
      <Navbar user={user} loading={loading} handleLogout={handleLogout} />

      {/* 1. HERO SECTION — Stop Washing Bedsheets Forever */}
      <header className="relative w-full min-h-screen pt-28 md:pt-32 pb-20 flex items-center bg-[#0B1315] overflow-hidden">
        
        {/* Luxury grid & ambient light glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-950/15 via-transparent to-transparent pointer-events-none z-0 opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] pointer-events-none" />
        
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-[#C5A376]/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1315]/95 via-[#0B1315]/80 to-[#0B1315]/95" />
 
        {/* Floating watermarked text background */}
        <div className="absolute -left-12 bottom-6 z-10 pointer-events-none select-none opacity-[0.03] hidden lg:block">
          <span className="text-[15rem] font-serif font-black tracking-[0.2em] text-transparent uppercase leading-none" style={{ WebkitTextStroke: "1px white" }}>
            LUXE
          </span>
        </div>
 
        {/* Content container */}
        <div className="relative w-full max-w-[1380px] mx-auto px-6 sm:px-12 lg:px-20 z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
            
            {/* Left Column: Editorial Typography & Copy */}
            <div className="lg:col-span-7 text-left space-y-9">
              
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm shadow-inner gsap-hero-fade">
                <span className="w-2 h-2 rounded-full bg-[#C5A376] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FAF9F6]">
                  A Fresh Hotel Bed at Home • From ₹10/Day
                </span>
              </div>
              
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7.5xl text-white font-medium leading-[1.05] tracking-tight gsap-hero-fade">
                Stop Washing <br />
                <span className="bg-gradient-to-r from-[#C5A376] via-[#E6C697] to-[#C5A376] bg-clip-text text-transparent italic font-normal font-serif relative">
                  Bedsheets Forever.
                  <span className="absolute bottom-1.5 left-0 w-full h-[2px] bg-gradient-to-r from-[#C5A376]/80 to-transparent" />
                </span>
              </h1>
              
              <p className="text-sm sm:text-base text-gray-300/85 max-w-lg leading-relaxed font-light gsap-hero-fade">
                Fresh, hotel-quality sheets delivered to your door every month. We collect your used bedding and swap them for freshly sanitized replacement packs. <span className="text-white font-semibold">Starts at just ₹10/day.</span>
              </p>
              
              <div className="pt-4 flex flex-wrap gap-5 gsap-hero-fade">
                <a
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2.5 px-9 py-4.5 bg-white text-[#0B1315] hover:bg-[#C5A376] hover:text-[#0B1315] font-sans text-2xs font-extrabold tracking-widest uppercase transition-all duration-300 rounded-full shadow-xl hover:shadow-[0_0_30px_rgba(197,163,118,0.25)] hover:scale-105 active:scale-95"
                >
                  Start Subscription
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleScrollTo(e, "#how-it-works")}
                  className="inline-flex items-center justify-center gap-2.5 px-9 py-4.5 border border-white/15 bg-white/05 hover:bg-white/10 hover:border-white/30 text-white font-sans text-2xs font-extrabold tracking-widest uppercase transition-all duration-300 rounded-full backdrop-blur-xs hover:scale-105 active:scale-95"
                >
                  See How It Works
                </a>
              </div>
              

              
            </div>
 
            {/* Right Column: Interactive 3D Visual Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
              <HeroThreeDVisual />
            </div>
          </div>
        </div>
      </header>

      {/* 2. SOCIAL PROOF ROW */}
      <section className="bg-white py-12 border-b border-[#0D1518]/05 shadow-sm text-center">
        <div className="max-w-[1380px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y-0 md:divide-x divide-[#0D1518]/08">
            <div className="p-2.5">
              <p className="text-sm font-serif font-bold text-[#0D1518]">★★★★★ 4.9/5 Rating</p>
              <p className="text-4xs text-gray-500 font-bold uppercase tracking-wider mt-1">Verified Member Reviews</p>
            </div>
            <div className="p-2.5">
              <p className="text-sm font-serif font-bold text-[#0D1518]">500+ Beds Swaps</p>
              <p className="text-4xs text-gray-500 font-bold uppercase tracking-wider mt-1">Delivered and Collected</p>
            </div>
            <div className="p-2.5">
              <p className="text-sm font-serif font-bold text-[#0D1518]">99.9% Sanitized</p>
              <p className="text-4xs text-gray-500 font-bold uppercase tracking-wider mt-1">Professionally Sterilized</p>
            </div>
            <div className="p-2.5">
              <p className="text-sm font-serif font-bold text-[#0D1518]">Free Swaps</p>
              <p className="text-4xs text-gray-500 font-bold uppercase tracking-wider mt-1">Contactless doorstep collection</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW CLOSETRUSH WORKS — 3-Step Lifecycle Timeline */}
      <StaircaseWorkflow />

      {/* 4. PRICING PLANS */}
      <div id="pricing-plans" className="relative z-30">
        <SavingsTable />
      </div>

      {/* 5. WHO IT'S FOR (Target Personas Grid) */}
      <section className="py-28 bg-[#FCFBF9] border-b border-[#0D1518]/05" id="who-it-is-for">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-12 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="text-micro-label">Designed for You</p>
            <h2 className="text-section-header">Who Is ClosetRush For?</h2>
            <p className="text-body text-[#0D1518]/60">
              We handle the sheets, you get back your weekends. See where you fit in.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {[
              { title: "Students", desc: "Living away from home? Ditch poor hostel washing setups and sleep like royalty.", icon: Coffee },
              { title: "Working Professionals", desc: "Reclaim your weekends. Save hours spent washing, drying, and ironing sheets.", icon: Clock },
              { title: "PG Residents", desc: "Say goodbye to damp laundry, dirty shared lines, and smelly sheets.", icon: Smile },
              { title: "Rental Apartments", desc: "Perfect for flatmates and co-living spaces looking to split laundry efforts.", icon: Bed },
              { title: "Busy Families", desc: "Keep everyone's bedding fresh on autopilot. One less chore to manage.", icon: Heart }
            ].map((persona, idx) => {
              const IconComponent = persona.icon;
              return (
                <div key={idx} className="bg-white border border-[#0D1518]/05 p-4 sm:p-6 rounded-[28px] hover:border-[#C5A376]/20 transition-all duration-300 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.01)] hover:shadow-lg">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="p-2.5 sm:p-3 bg-[#C5A376]/05 text-[#C5A376] border border-[#C5A376]/10 rounded-xl w-fit">
                      <IconComponent className="w-4.5 h-4.5 sm:w-5 h-5" />
                    </div>
                    <h3 className="font-sans font-extrabold text-xs sm:text-sm md:text-base text-[#0D1518] leading-tight uppercase tracking-wider">{persona.title}</h3>
                    <p className="text-[10px] sm:text-xs text-[#0D1518]/70 leading-relaxed font-semibold">{persona.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. WHY CLOSETRUSH? (Outcome-Focused Benefits & Time Saved) */}
      <section className="py-28 bg-white border-b border-[#0D1518]/05" id="luxe-benefits">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-12 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="text-micro-label">The Transformation</p>
            <h2 className="text-section-header">Designed For Modern Living</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Feels like checking into a hotel", desc: "Enjoy crisp, premium sheets swap after swap. Breathable, hypoallergenic, and clean.", icon: Bed, color: "#1A4F54", bg: "bg-teal-500/05", border: "border-teal-500/10" },
              { num: "02", title: "Your bed feels brand new every swap", desc: "Sterilized replaces sheets vacuum-packed in sealed protective bags. Zero allergens.", icon: Shield, color: "#10B981", bg: "bg-emerald-500/05", border: "border-emerald-500/10" },
              { num: "03", title: "Never carry laundry bags again", desc: "Contactless delivery and doorstep collection. We swap sheets directly on your schedule.", icon: Truck, color: "#3B82F6", bg: "bg-blue-500/05", border: "border-blue-500/10" }
            ].map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <div key={idx} className="group bg-white border border-[#0D1518]/06 p-8 rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.015)] hover:shadow-xl hover:border-[#C5A376]/20 transition-all duration-500 flex flex-col justify-between min-h-[200px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#C5A376]/5 to-transparent rounded-bl-full pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between">
                      <div className={`p-3.5 rounded-2xl ${card.bg} border ${card.border}`}>
                        <IconComponent style={{ color: card.color }} className="w-5.5 h-5.5" />
                      </div>
                      <span className="font-serif text-3xl font-extrabold text-gray-200/50 font-mono">
                        {card.num}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#0D1518] mt-6 leading-snug group-hover:text-[#C5A376] transition-colors duration-300">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-3xs text-[#0D1518]/65 leading-relaxed font-semibold mt-4">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Time Saved Metrics Panel */}
          <div className="bg-[#0B1315] text-white rounded-[32px] p-8 sm:p-12 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 border border-white/5">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A376] font-mono">Time Savings Calculator</span>
              <h3 className="font-serif text-2xl font-bold">Buy Back Your Weekends</h3>
              <p className="text-xs text-gray-400 max-w-md font-light leading-relaxed">
                Bedsheet laundry takes an average of 1.5 hours per wash (loading, drying, folding, ironing). By letting us handle it, you save:
              </p>
            </div>
            
            <div className="flex items-center gap-6 shrink-0 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-[#3B82F6]">6 hrs</p>
                <p className="text-[8px] uppercase tracking-wider text-gray-400 font-bold mt-1">Every Month</p>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-[#F97316]">72 hrs</p>
                <p className="text-[8px] uppercase tracking-wider text-gray-400 font-bold mt-1">Every Year</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6.5 EMOTIONAL IMAGINE ROW + LIFESTYLE IMAGE */}
      <section className="py-28 bg-[#FCFBF9] border-b border-[#0D1518]/05">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side: Editorial Emotional Card */}
            <div className="lg:col-span-6 bg-white border border-[#0D1518]/05 p-8 sm:p-12 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.015)] space-y-6">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#C5A376] font-mono">
                Imagine This
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-medium text-[#0D1518] leading-tight">
                Friday Night. You come home.
              </h3>
              
              <div className="space-y-4 text-sm sm:text-base font-semibold text-gray-600 leading-relaxed font-sans">
                <p className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#C5A376]" />
                  <span>Your bedroom smells fresh and clean.</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#C5A376]" />
                  <span>Crisp, hotel-quality organic cotton sheets on your bed.</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#C5A376]" />
                  <span>No heavy laundry basket overflows.</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#C5A376]" />
                  <span>No hours spent loading washers, hanging sheets, or ironing.</span>
                </p>
              </div>

              <blockquote className="border-l-2 border-[#C5A376] pl-4 italic text-sm sm:text-base font-light text-gray-500 font-serif">
                “Just crawl into bed, relax, and sleep. We handle the rest.”
              </blockquote>
            </div>

            {/* Right side: High-trust Lifestyle stock bedroom image */}
            <div className="lg:col-span-6 overflow-hidden rounded-[40px] shadow-xl relative h-[380px] sm:h-[450px]">
              <img 
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80" 
                alt="Hotel Quality Bedding Bedroom Lifestyle"
                className="w-full h-full object-cover object-center hover:scale-105 transition-all duration-700"
              />
              <div className="absolute bottom-6 left-6 bg-[#0B1315]/80 text-[#FCFBF9] text-2xs font-mono font-bold uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                Premium Sleep Aesthetic
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. COMPARISON TABLE & COST COMPARISON CONTAINER */}
      <section className="py-28 bg-white border-b border-[#0D1518]/05" id="comparison-table-section">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-12 space-y-16">
          <div className="text-center space-y-3">
            <p className="text-micro-label">The Contrast</p>
            <h2 className="font-serif text-3xl font-medium">Bedsheets Laundry: Side by Side</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Home Laundry vs ClosetRush Table */}
            <div className="lg:col-span-7 bg-white border border-[#0D1518]/06 rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.015)]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0B1315] text-white">
                    <th className="p-4 sm:p-5 font-serif text-xs font-semibold">Service Parameter</th>
                    <th className="p-4 sm:p-5 font-serif text-xs font-semibold text-center bg-white/5">Home Laundry</th>
                    <th className="p-4 sm:p-5 font-serif text-xs font-semibold text-center text-[#C5A376]">ClosetRush Life</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0D1518]/06 text-3xs font-semibold text-[#0D1518]/80">
                  {[
                    { param: "Washing Effort", home: "Wash & scrub yourself", close: "We handle everything" },
                    { param: "Drying Time", home: "Draping on racks for hours", close: "Delivered fully dried & ready" },
                    { param: "Ironing", home: "Time-consuming wrinkle removal", close: "Crisp hotel-quality press" },
                    { param: "Storage Space", home: "Bulky sheet sets clutter closets", close: "No storage extras needed" },
                    { param: "Monthly Time Cost", home: "6+ hours per month", close: "5 minutes (door swap)" },
                    { param: "Hygiene Standard", home: "Depends on home wash temperature", close: "Standardized 60°C wash + UV-C" }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 sm:p-5 font-serif text-2xs font-bold text-[#0D1518]">{row.param}</td>
                      <td className="p-4 sm:p-5 text-center text-gray-500 bg-[#FCFBF9]/30">{row.home}</td>
                      <td className="p-4 sm:p-5 text-center text-[#1A4F54] font-bold">{row.close}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right: Cost Comparison Breakdowns Card */}
            <div className="lg:col-span-5 bg-[#0B1315] border border-white/5 text-white p-8 rounded-3xl flex flex-col justify-between space-y-6 shadow-lg">
              <div className="space-y-4">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#C5A376] bg-white/05 px-3 py-1 border border-white/10 rounded-full w-fit block">
                  Monthly Cost Comparison
                </span>
                <h3 className="font-serif text-xl font-bold">What are you really spending?</h3>
                <p className="text-3xs text-gray-400 font-light leading-relaxed">
                  Traditional home washing has hidden utility, time, and detergent overhead costs. Here is the realistic breakdown:
                </p>
              </div>

              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between border-b border-white/05 pb-2 text-gray-300">
                  <span>Detergents & Softeners</span>
                  <span>₹150</span>
                </div>
                <div className="flex justify-between border-b border-white/05 pb-2 text-gray-300">
                  <span>Electricity & Water Bills</span>
                  <span>₹200</span>
                </div>
                <div className="flex justify-between border-b border-white/05 pb-2 text-gray-300">
                  <span>Ironing/Dry-cleaning swaps</span>
                  <span>₹250</span>
                </div>
                <div className="flex justify-between border-b border-white/05 pb-2 text-gray-300">
                  <span>Value of Time Saved (6 hrs)</span>
                  <span>₹300+</span>
                </div>
                <div className="flex justify-between text-[#F97316] font-bold border-b border-white/10 pb-2 text-sm">
                  <span>Home Laundry Total Cost</span>
                  <span>₹900+</span>
                </div>
                <div className="flex justify-between text-[#10B981] font-bold text-sm pt-2">
                  <span>ClosetRush Bedding Swap</span>
                  <span>₹299</span>
                </div>
              </div>

              <p className="text-[10px] text-gray-500 font-mono text-center">
                Autopilot luxury sleep at a fraction of home laundry costs.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 8. OUR CLEANING PROCESS — 6-Stage Trust Facility Wash */}
      <InteractiveScience />

      {/* 9. REAL EMOTIONAL STORIES (Testimonials) */}
      <section className="py-28 bg-white border-b border-[#0D1518]/05" id="testimonials-section">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-12 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="text-micro-label">Customer Stories</p>
            <h2 className="text-section-header">What Our Members Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Rohit K.", role: "Software Engineer", quote: "I used to wash bedsheets every Sunday. Now I haven't done sheets laundry in 4 months. The doorstep swap takes less than a minute." },
              { name: "Ananya S.", role: "Consultant", quote: "My rental apartment dryer is terrible. sheets take forever to dry. ClosetRush delivers crisp, vacuum-sealed hotel sheets every month on auto-pilot." },
              { name: "Kunal M.", role: "PG Resident", quote: "Hostel/PG laundry is a absolute mess. Now my bed smells amazing and looks clean. My roommates are already ordering subscriptions." }
            ].map((review, idx) => (
              <div key={idx} className="bg-white border border-[#0D1518]/05 p-8 rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.01)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[180px]">
                <div className="space-y-4">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-[#0D1518]/75 italic leading-relaxed font-light">
                    “{review.quote}”
                  </p>
                </div>
                <div className="pt-6 border-t border-[#0D1518]/05 mt-6">
                  <p className="font-serif text-2xs font-bold text-[#0D1518]">{review.name}</p>
                  <p className="text-4xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ SECTION — Accordions */}
      <section className="py-28 bg-[#FCFBF9] border-b border-[#0D1518]/05" id="faq-section-container">
        <div className="max-w-[780px] mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <p className="text-micro-label">Objections Solved</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium leading-tight">Got Questions?</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-[#0D1518]/06 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left font-sans font-bold text-sm sm:text-base md:text-lg text-[#0D1518] hover:text-[#C5A376] transition-all duration-300 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? "max-h-60 border-t border-gray-100" : "max-h-0"
                    }`}
                  >
                    <p className="p-6 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. UPGRADE SUBSCRIPTION CTA (The smart fresher bed block) */}
      <section className="py-28 bg-white border-b border-[#0D1518]/05 text-center">
        <div className="max-w-[850px] mx-auto px-6 space-y-8">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C5A376] font-mono">
            Get Started
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#0D1518] leading-tight">
            Your next fresh bed is one click away.
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light max-w-xl mx-auto">
            Join thousands of households enjoying fresh, UV-sanitized organic cotton bedsheets without the laundry chore.
          </p>
          
          <div className="pt-4 flex justify-center gap-4.5 flex-wrap">
            <a
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#0B1315] hover:bg-[#C5A376] text-white hover:text-[#0B1315] font-sans text-2xs font-extrabold tracking-widest uppercase transition-all duration-300 rounded-full shadow-md hover:scale-105 active:scale-95"
            >
              Browse Catalog
            </a>
            <a
              href="#pricing-plans"
              onClick={(e) => handleScrollTo(e, "#pricing-plans")}
              className="inline-flex items-center justify-center px-8 py-4 border border-[#0D1518]/20 hover:bg-[#0D1518]/05 text-[#0D1518] font-sans text-2xs font-extrabold tracking-widest uppercase transition-all duration-300 rounded-full hover:scale-105 active:scale-95"
            >
              View Plans
            </a>
          </div>
        </div>
      </section>

      {/* 12. B2B COMMERCIAL CALLOUT */}
      <section className="py-24 bg-[#FCFBF9] border-b border-charcoal-ink/05">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-12">
          <div className="bg-[#0F172A] rounded-[32px] p-8 sm:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative space-y-6 max-w-2xl z-10">
              <span className="inline-block text-[9px] font-black uppercase tracking-widest text-[#C5A376] bg-white/05 px-3 py-1 border border-white/10 rounded-full font-mono">
                COMMERCIAL SOLUTIONS
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">Linen Swaps For Property Owners</h2>
              <p className="text-3xs sm:text-xs text-gray-300/80 leading-relaxed font-light">
                Minimize bedding setup and laundry overheads. We supply, wash, and swap sheets for operations of all scales. Reclaim operation hours and elevate guest experience.
              </p>
              <div className="flex flex-wrap gap-3 text-4xs font-bold uppercase tracking-wider">
                {["PGs", "Hostels", "Student Housing", "Rental Apartments"].map((item, idx) => (
                  <span key={idx} className="bg-white/05 px-3.5 py-1.5 border border-white/10 rounded-full text-white/70">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 z-10">
              <a
                href="/shop?type=B2B"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-charcoal-ink hover:bg-[#C5A376] hover:text-white font-sans text-2xs font-extrabold tracking-widest uppercase transition-all duration-300 rounded-full shadow-lg hover:scale-105 active:scale-95"
              >
                Request Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FOOTER & LEAD MAGNET */}
      <footer id="signup" className="bg-[#0B1315] text-[#FCFBF9] py-16">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pb-10">
            <div className="space-y-4">
              <p className="text-micro-label text-[#C5A376]">Waitlist Status: Active</p>
              <h2 className="text-3xl font-serif text-white leading-tight">Join the Priority Waitlist.</h2>
              <p className="text-gray-400 text-xs max-w-sm font-semibold leading-relaxed">
                We are currently at full subscription capacity to guarantee maximum sanitization quality. Enter your details to secure your spot.
              </p>
            </div>

            <div className="space-y-4">
              {claimedDiscount ? (
                <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-2xl p-6 text-center space-y-2 animate-fadeInUp">
                  <p className="text-[#10B981] font-bold text-sm">✓ Waitlist Spot Secured!</p>
                  <p className="text-xs text-gray-300">Thank you for joining. We have successfully registered you to our priority waitlist.</p>
                  <p className="text-4xs text-gray-500">We will contact you via email or phone as soon as a subscription slot opens up.</p>
                </div>
              ) : (
                <form onSubmit={handleClaimDiscount} className="flex flex-col gap-3 bg-white/5 p-4 rounded-3xl border border-white/10 focus-within:border-[#C5A376] transition-all duration-300">
                  <div className="relative flex items-center bg-white/02 border border-[#9CA3AF]/20 rounded-xl px-4">
                    <Mail className="w-4 h-4 text-white/30 shrink-0" />
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full pl-3 pr-2 py-3 bg-transparent text-white placeholder-white/30 focus:outline-none text-xs font-semibold"
                    />
                  </div>

                  <div className="relative flex items-center bg-white/02 border border-[#9CA3AF]/20 rounded-xl px-4">
                    <Phone className="w-4 h-4 text-white/30 shrink-0" />
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="Phone number"
                      className="w-full pl-3 pr-2 py-3 bg-transparent text-white placeholder-white/30 focus:outline-none text-xs font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-3.5 px-8 bg-[#C5A376] hover:bg-white text-white hover:text-[#0B1315] font-black text-2xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    Join Priority Waitlist
                  </button>
                </form>
              )}

              <div className="flex items-center gap-2 text-3xs text-white/40 font-bold uppercase tracking-wider pl-1">
                <Lock className="w-3.5 h-3.5 text-[#C5A376]" />
                <span>Private • Single Bedding & Double Bedding Tiers • Zero Spam</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-white/05">
            <div className="flex flex-col items-center sm:items-start gap-2.5">
              <div className="flex items-center gap-3">
                <img src="/image.png" alt="ClosetRush Logo" className="h-12 w-auto object-contain bg-white p-1 rounded-sm shrink-0" />
                <span className="text-2xl font-serif font-bold text-[#C5A376] tracking-[0.1em] uppercase">
                  ClosetRush
                </span>
              </div>
              <p className="text-3xs text-white/40 font-semibold">
                © {new Date().getFullYear()} ClosetRush. All rights reserved. • Built for healthier sleeping.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-wider text-white/50">
              <Link href="/terms" className="hover:text-[#C5A376] transition-colors">Terms & Conditions</Link>
              <Link href="/privacy" className="hover:text-[#C5A376] transition-colors">Privacy Policy</Link>
              <Link href="/shipping" className="hover:text-[#C5A376] transition-colors">Shipping & Swaps</Link>
              <Link href="/cancellation" className="hover:text-[#C5A376] transition-colors">Cancellations & Refunds</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* GSAP CDN script tags loaded sequentially to ensure Hero fade-in works */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" 
        strategy="lazyOnload" 
        onLoad={() => setGsapReady(true)}
      />
    </div>
  );
}
