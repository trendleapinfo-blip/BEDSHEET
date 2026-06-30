"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import InteractiveScience from "./components/InteractiveScience";
import InteractivePlans from "./components/InteractivePlans";
import SavingsTable from "./components/SavingsTable";
import SubscriptionModal from "./components/SubscriptionModal";
import HeroThreeDVisual from "./components/HeroThreeDVisual";
import CheckoutModal from "./components/CheckoutModal";
import {
  TruckIcon,
  CancelIcon,
  CheckIcon,
  StarIcon,
  SparklesIcon,
  MailIcon,
  LockIcon,
  ArrowRightIcon,
  CrownIcon,
  ShieldCheckIcon,
  BedIcon,
} from "./components/Icons";

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittingPlan, setSubmittingPlan] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState(null);

  // Intersection Observer for scroll-triggered fades
  const observerRef = useRef(null);

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

  useEffect(() => {
    if (loading) return;

    const processPendingCheckout = async () => {
      const pending = localStorage.getItem("checkout_pending");
      if (!pending) return;

      if (!user) {
        return; // Wait for login
      }

      try {
        const planData = JSON.parse(pending);
        setCheckoutPlan(planData);
        if (typeof window !== "undefined") {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } catch (err) {
        console.error("Failed to parse pending checkout:", err);
      } finally {
        localStorage.removeItem("checkout_pending");
      }
    };

    processPendingCheckout();
  }, [user, loading]);

  // Set up Intersection Observer for scrolling reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    revealElements.forEach((el) => observer.observe(el));
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleSelectPlan = (planData) => {
    if (!user) {
      localStorage.setItem("checkout_pending", JSON.stringify(planData));
      window.location.href = `/login?redirect=pricing&bedType=${planData.bedType}&planName=${planData.planName}&price=${planData.price}&duration=${planData.duration}`;
      return;
    }
    setCheckoutPlan(planData);
  };

  const handleConfirmCheckout = async (finalPlanData) => {
    try {
      setSubmittingPlan(true);
      const res = await fetch("/api/user/select-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPlanData),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setSelectedPlan(data.user.selectedPlan);
        setCheckoutPlan(null);
        setShowSuccessModal(true);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to select plan.");
      }
    } catch (err) {
      console.error("Plan selection error:", err);
    } finally {
      setSubmittingPlan(false);
    }
  };

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

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
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

  return (
    <div className="min-h-screen bg-alabaster-linen text-charcoal-ink font-sans antialiased" id="home">
      {/* CSS style injection for observer transitions */}
      <style jsx global>{`
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-active {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>

      {/* Navigation */}
      <Navbar user={user} loading={loading} handleLogout={handleLogout} />

      {/* Hero Section */}
      <header className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-alabaster-linen">
        {/* Subtle texture grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(17,17,17,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,17,17,0.03)_1px,transparent_1px)] bg-[size:6rem_6rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Premium micro label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-linen-gold/10 text-linen-gold text-2xs font-bold uppercase tracking-widest border border-linen-gold/20">
                <SparklesIcon className="w-3.5 h-3.5 fill-current" />
                <span>Super Clean Bed Sheets</span>
              </div>

              {/* Massive Serif Headline */}
              <h1 className="text-hero leading-tight">
                Always sleep on <br className="hidden sm:inline" />
                fresh, clean sheets.
              </h1>

              {/* Body Copy */}
              <p className="text-body text-charcoal-ink/70 max-w-xl mx-auto lg:mx-0">
                We deliver fresh, clean bed sheets to your door on your schedule. No contracts. Stop or pause anytime.
              </p>

              {/* Luxury CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#pricing"
                  onClick={(e) => handleScrollTo(e, "#pricing")}
                  className="w-full sm:w-auto inline-flex justify-center items-center py-4 px-8 bg-charcoal-ink text-alabaster-linen font-bold text-xs uppercase tracking-widest hover:bg-linen-gold transition-colors duration-300"
                >
                  Choose Your Plan
                </a>
                <a
                  href="#experience"
                  onClick={(e) => handleScrollTo(e, "#experience")}
                  className="w-full sm:w-auto inline-flex justify-center items-center py-4 px-8 border border-charcoal-ink/15 text-charcoal-ink font-bold text-xs uppercase tracking-widest hover:border-charcoal-ink transition-colors duration-300"
                >
                  How It Works
                </a>
              </div>

              {/* Verified Badge */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 pt-6 border-t border-charcoal-ink/08">
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-linen-gold" />
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-ink/60">Free Door Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-linen-gold" />
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-ink/60">No Contracts</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: 3D interactive bedding mockup */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <HeroThreeDVisual />
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 1: THE REALIZATION (Full-Screen Typography Reveal) */}
      <section className="bg-charcoal-ink py-20 md:py-28 flex items-center overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-8">
          <p className="text-micro-label" style={{ color: "white" }}>The Truth</p>
          <div className="space-y-6">
            <h2 className="reveal-on-scroll text-section-header leading-snug" style={{ color: "white" }}>
              "You wear fresh clothes every day."
            </h2>
            <h2 className="reveal-on-scroll text-section-header leading-snug" style={{ transitionDelay: "400ms", color: "white" }}>
              "But you sleep on the same dirty sheets for weeks."
            </h2>
          </div>
          <p className="text-body max-w-xl mx-auto pt-4" style={{ transitionDelay: "600ms", color: "white", opacity: 0.9 }}>
            Bed sheets get dirty fast with sweat, hair, and dead skin. Your bed sheets should be kept as clean as your clothes.
          </p>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM (Cinematic Split Screen) */}

      {/* SECTION 3: THE SHIFT (The Shift Focus) */}
      <section className="relative py-20 md:py-28 bg-white overflow-hidden flex items-center justify-center">
        {/* Soft abstract graphic representation of fresh sheet */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(168,146,118,0.08)_0%,transparent_60%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-4 relative z-10">
          <p className="text-micro-label">The Solution</p>
          <h2 className="text-hero tracking-tight leading-none text-charcoal-ink">
            A fresh bed. <br /> Without the work.
          </h2>
          <p className="text-body text-charcoal-ink/60 max-w-lg mx-auto">
            We are not just a laundry shop. We take care of everything so your bed is always clean and fresh, like a nice hotel.
          </p>
        </div>
      </section>

      {/* SECTION 4: THE EXPERIENCE (Manufacturing / Timeline) */}
      <section id="experience" className="py-16 md:py-24 bg-alabaster-linen border-t border-b border-charcoal-ink/08">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-10">
          <div className="text-center space-y-3">
            <p className="text-micro-label">How We Do It</p>
            <h2 className="text-section-header">Our Simple Steps</h2>
            <p className="text-body text-charcoal-ink/60 max-w-xl mx-auto">
              How we clean, sanitize, and deliver fresh sheets straight to your door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
            {[
              {
                step: "01",
                title: "1. We Pick Up",
                desc: "We come to your house and collect your dirty sheets in sealed bags.",
              },
              {
                step: "02",
                title: "2. We Hot Wash",
                desc: "We wash the sheets in very hot water to kill all dirt, sweat, and bed bugs.",
              },
              {
                step: "03",
                title: "3. We Sanitize",
                desc: "We use special safe blue lights to kill all leftover germs and viruses.",
              },
              {
                step: "04",
                title: "4. We Seal",
                desc: "We wrap and seal the sheets in clean bags to keep dust out.",
              },
              {
                step: "05",
                title: "5. We Deliver",
                desc: "We bring fresh, ready-to-use sheets to your door whenever you want them.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="reveal-on-scroll p-6 bg-white border border-charcoal-ink/05 flex flex-col justify-between h-64 hover:border-linen-gold transition-colors duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="font-serif text-2xl font-bold text-linen-gold">{item.step}</span>
                <div className="space-y-2">
                  <h4 className="text-sm uppercase tracking-wider font-extrabold text-charcoal-ink">
                    {item.title}
                  </h4>
                  <p className="text-2xs sm:text-xs text-charcoal-ink/60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: THE LUXURY (Textural Editorial Grid) */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Graphics Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Tall Image Card */}
              <div className="sm:col-span-1 relative border border-charcoal-ink/08 h-full min-h-[250px] sm:min-h-full bg-alabaster-linen group overflow-hidden">
                <img
                  src="/about_bedding.png"
                  alt="Organic Cotton weave"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/30 via-transparent to-transparent opacity-40 pointer-events-none" />
              </div>
              <div className="space-y-4 sm:col-span-1">
                <div className="bg-alabaster-linen border border-charcoal-ink/05 p-6 h-[calc(50%-8px)] flex flex-col justify-center transition-all duration-300 hover:border-linen-gold">
                  <CrownIcon className="w-8 h-8 text-linen-gold mb-3" />
                  <h4 className="font-bold text-charcoal-ink text-sm uppercase tracking-wider mb-1">Super Soft</h4>
                  <p className="text-3xs text-charcoal-ink/60 leading-relaxed uppercase tracking-wider">
                    Very soft cotton sheets that feel like a luxury hotel.
                  </p>
                </div>
                <div className="bg-charcoal-ink text-alabaster-linen p-6 h-[calc(50%-8px)] flex flex-col justify-center transition-all duration-300 hover:shadow-xl">
                  <ShieldCheckIcon className="w-8 h-8 text-linen-gold mb-3" />
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1">Germ Free</h4>
                  <p className="text-3xs text-alabaster-linen/50 leading-relaxed uppercase tracking-wider">
                    No germs or dust bugs left on the sheets. Safe for skin.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-0 sm:pt-8 sm:col-span-1">
                <div className="bg-linen-gold/10 border border-linen-gold/20 p-6 h-[calc(50%-8px)] flex flex-col justify-center transition-all duration-300 hover:border-linen-gold">
                  <TruckIcon className="w-8 h-8 text-linen-gold mb-3" />
                  <h4 className="font-bold text-charcoal-ink text-sm uppercase tracking-wider mb-1">Eco Bags</h4>
                  <p className="text-3xs text-charcoal-ink/60 leading-relaxed uppercase tracking-wider">
                    We use reusable packages to protect nature.
                  </p>
                </div>
                <div className="bg-alabaster-linen border border-charcoal-ink/05 p-6 h-[calc(50%-8px)] flex flex-col justify-center transition-all duration-300 hover:border-linen-gold">
                  <BedIcon className="w-8 h-8 text-linen-gold mb-3" />
                  <h4 className="font-bold text-charcoal-ink text-sm uppercase tracking-wider mb-1">Fits Any Bed</h4>
                  <p className="text-3xs text-charcoal-ink/60 leading-relaxed uppercase tracking-wider">
                    Fits both thin and thick mattresses easily.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Story Details */}
            <div className="lg:col-span-6 space-y-6">
              <p className="text-micro-label">The Material</p>
              <h2 className="text-section-header">
                Hotel softness, made for your own home.
              </h2>
              <p className="text-body text-charcoal-ink/70">
                At ClosetRush, we believe sleeping on clean sheets is important for your health. Made from 100% fine cotton, our sheets are cool and super soft. We wash and deliver them so you can sleep peacefully.
              </p>
              <p className="text-body text-charcoal-ink/70">
                We take care of the entire washing chore, giving you back your weekends and fresh sheets every single time.
              </p>

              <div className="border-t border-charcoal-ink/08 pt-8 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold font-serif text-charcoal-ink">100%</div>
                  <p className="text-[10px] text-charcoal-ink/50 uppercase tracking-widest font-bold mt-1">Pure Cotton</p>
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif text-charcoal-ink">Hot</div>
                  <p className="text-[10px] text-charcoal-ink/50 uppercase tracking-widest font-bold mt-1">Wash Standard</p>
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif text-charcoal-ink">0%</div>
                  <p className="text-[10px] text-charcoal-ink/50 uppercase tracking-widest font-bold mt-1">Harsh Bleach</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: THE ROUTINE UPGRADE (Calendar Compare) */}
      <section className="py-16 md:py-24 bg-alabaster-linen border-t border-b border-charcoal-ink/08">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-10">
          <div className="text-center space-y-3">
            <p className="text-micro-label">The Upgrade</p>
            <h2 className="text-section-header">A Month Reclaimed</h2>
            <p className="text-body text-charcoal-ink/60 max-w-xl mx-auto">
              Compare your traditional bedding schedule against the automated ClosetRush standard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Before */}
            <div className="bg-white border border-charcoal-ink/08 p-8 space-y-6">
              <h4 className="text-subheading font-bold text-[#E63946]">Month without ClosetRush</h4>
              <ul className="space-y-4 text-sm text-charcoal-ink/70">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>4 washes run</strong>: Energy, detergent, and water costs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>8 hours lost</strong>: Stripping, monitoring, hanging, folding.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Drying Clutter</strong>: Wet sheets draped over living furniture.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Dust & Allergens</strong>: Accumulates gradually with late washes.</span>
                </li>
              </ul>
            </div>

            {/* After */}
            <div className="bg-charcoal-ink text-alabaster-linen border border-charcoal-ink/20 p-8 space-y-6">
              <h4 className="text-subheading font-bold text-linen-gold">Month with ClosetRush</h4>
              <ul className="space-y-4 text-sm text-alabaster-linen/80">
                <li className="flex items-start gap-3">
                  <span className="text-linen-gold font-bold">✓</span>
                  <span><strong>0 domestic washes</strong>: Entire cycle managed out-of-house.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-linen-gold font-bold">✓</span>
                  <span><strong>0 minutes spent</strong>: Courier drops sealed fresh pack at door.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-linen-gold font-bold">✓</span>
                  <span><strong>Immaculate Space</strong>: No damp laundry drying in your view.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-linen-gold font-bold">✓</span>
                  <span><strong>Hotel feel</strong>: Soft, clean sheet swaps every 2 weeks.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Science Panel (Keep functional interactive elements from original) */}
      <section id="science" className="bg-white">
        <InteractiveScience />
      </section>

      {/* SECTION 7: THE MEMBERSHIP (Interactive Plans Redesign) */}
      <section id="pricing" className="py-16 md:py-24 bg-alabaster-linen border-t border-b border-charcoal-ink/08">
        <InteractivePlans handleSelectPlan={handleSelectPlan} submittingPlan={submittingPlan} />
      </section>

      {/* Savings Table / Savings at a Glance */}
      <section className="bg-white">
        <SavingsTable />
      </section>

      {/* SECTION 8: VERIFIABLE METRICS (Social Proof) */}
      <section className="py-16 md:py-20 bg-charcoal-ink text-alabaster-linen border-b border-charcoal-ink/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold font-serif text-linen-gold">124,500+</div>
              <p className="text-[10px] uppercase tracking-widest text-alabaster-linen/50 font-bold">Fresh Beds Delivered</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold font-serif text-linen-gold">94.2%</div>
              <p className="text-[10px] uppercase tracking-widest text-alabaster-linen/50 font-bold">Customer Retention</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold font-serif text-linen-gold">0%</div>
              <p className="text-[10px] uppercase tracking-widest text-alabaster-linen/50 font-bold">Chemical Residue Guarantee</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold font-serif text-linen-gold">14 Days</div>
              <p className="text-[10px] uppercase tracking-widest text-alabaster-linen/50 font-bold">Standard Swap Cycle</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: FINAL CONVERSION */}
      <section className="bg-alabaster-linen py-16 md:py-24 relative overflow-hidden border-b border-charcoal-ink/08">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-6 relative z-10">
          <p className="text-micro-label">The Invitation</p>
          <h2 className="text-section-header">Your next fresh bed is already waiting.</h2>
          <p className="text-body text-charcoal-ink/70 max-w-xl mx-auto">
            Step into the ClosetRush standard of sleep. Reserve your subscription today and claim your introductory rates.
          </p>

          <a
            href="#pricing"
            onClick={(e) => handleScrollTo(e, "#pricing")}
            className="inline-flex items-center gap-2 py-4 px-10 bg-charcoal-ink text-alabaster-linen font-bold text-xs uppercase tracking-widest hover:bg-linen-gold transition-all duration-300 hover:scale-101 active:scale-99"
          >
            Start Now <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer / Newsletter */}
      <footer id="signup" className="bg-charcoal-ink text-alabaster-linen py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pb-8 border-b border-white/08">
            {/* Brand/Pitch */}
            <div className="space-y-4">
              <p className="text-micro-label text-linen-gold">Newsletter</p>
              <h2 className="text-3xl font-serif text-white">Stay Fresh, Informed.</h2>
              <p className="text-alabaster-linen/50 text-xs max-w-md">
                Join the ClosetRush circle for exclusive sleep tips, clean sheet updates, and new product news.
              </p>
            </div>

            {/* Email Form */}
            <div className="space-y-4">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-alabaster-linen/40">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/05 border border-white/10 rounded-none text-white placeholder-white/30 focus:outline-none focus:border-linen-gold transition-colors text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="py-3.5 px-6 bg-linen-gold text-charcoal-ink font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-charcoal-ink transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Join
                </button>
              </form>

              {subscribed && (
                <p className="text-linen-gold text-xs font-bold mt-2">
                  Success! Check your inbox soon for exclusive sleep science reports.
                </p>
              )}

              <div className="flex items-center gap-2 text-3xs text-alabaster-linen/40 font-bold uppercase tracking-wider">
                <LockIcon className="w-3.5 h-3.5" />
                <span>Private • Weekly • Zero Spam</span>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
            <span className="text-xl font-serif font-bold text-linen-gold tracking-[0.1em] uppercase">
              ClosetRush
            </span>
            <p className="text-2xs text-alabaster-linen/40">
              © {new Date().getFullYear()} ClosetRush. All rights reserved. • Built for healthier sleeping.
            </p>
          </div>
        </div>
      </footer>

      {showSuccessModal && selectedPlan && (
        <SubscriptionModal
          plan={selectedPlan}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {checkoutPlan && (
        <CheckoutModal
          plan={checkoutPlan}
          user={user}
          loading={submittingPlan}
          onClose={() => setCheckoutPlan(null)}
          onConfirm={handleConfirmCheckout}
        />
      )}
    </div>
  );
}
