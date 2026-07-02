"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import InteractiveScience from "./components/InteractiveScience";
import InteractivePlans from "./components/InteractivePlans";
import SavingsTable from "./components/SavingsTable";
import SubscriptionModal from "./components/SubscriptionModal";
import HeroThreeDVisual from "./components/HeroThreeDVisual";
import RoutineComparison from "./components/RoutineComparison";

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


  // Slider State for auto-playing banners
  const [currentSlide, setCurrentSlide] = useState(0);

  // Active step in "How We Do It" section
  const [activeStep, setActiveStep] = useState(0);

  // Active column in "The Material" accordion section
  const [activeMaterialCol, setActiveMaterialCol] = useState(0);



  const steps = [
    {
      step: "01",
      title: "Doorstep Pickup",
      desc: "Our courier collects your used linens in color-coded, air-tight sealed transit bags to ensure zero cross-contamination.",
      image: "/step_1.png"
    },
    {
      step: "02",
      title: "Hot Wash Disinfection",
      desc: "Linens undergo a deep thermodynamic wash cycle at 60°C+ with certified detergents to break down body oils, dust mites, and bacteria.",
      image: "/step_2.png"
    },
    {
      step: "03",
      title: "UV-C Sanitization",
      desc: "We feed washed sheets through a continuous UV-C light sterilization tunnel, destroying 99.9% of sub-microscopic germs and allergens.",
      image: "/step_3.png"
    },
    {
      step: "04",
      title: "Vacuum Sealed Shield",
      desc: "Once high-temp ironed, sheets are folded and vacuum-sealed in oxygen-deprived protective wrap, keeping them completely dust-free.",
      image: "/step_4.png"
    },
    {
      step: "05",
      title: "Contactless Fresh Swap",
      desc: "We deliver a crisp, hotel-standard sealed pack directly to your door. You swap on your schedule and return the used set back.",
      image: "/step_5.png"
    }
  ];

  const categories = [
    {
      name: "Bedsheet + Pillow (Single)",
      image: "/cat_single.png"
    },
    {
      name: "Bedsheet + Pillow (Double)",
      image: "/cat_double.png"
    },
    {
      name: "Curtains",
      image: "/cat_curtains.png"
    },
    {
      name: "Quilts",
      image: "/cat_quilt.png"
    },
    {
      name: "Blankets",
      image: "/cat_blankets.png"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [steps.length]);

  const slides = [
    {
      label: "NEW ARRIVAL",
      titleLine1: "Always Sleep On",
      titleLine2: "Fresh, Clean Sheets",
      priceLabel: "Rent starting at just",
      priceValue: "₹10 / day",
      image: "/banner_1.png",
      ctaText: "EXPLORE PLANS",
      ctaLink: "#pricing"
    },
    {
      label: "HYGIENE FIRST",
      titleLine1: "60°C+ Hot Wash &",
      titleLine2: "UV Sanitized Care",
      priceLabel: "Pristine sheets, guaranteed",
      priceValue: "100% Germ-Free",
      image: "/banner_2.png",
      ctaText: "EXPLORE SCIENCE",
      ctaLink: "#science"
    },
    {
      label: "ZERO EFFORT",
      titleLine1: "Seamless Swaps",
      titleLine2: "On Your Schedule",
      priceLabel: "Delivery & pickup included",
      priceValue: "Free Swaps",
      image: "/banner_3.png",
      ctaText: "HOW IT WORKS",
      ctaLink: "#experience"
    },
    {
      label: "BULK SOLUTIONS",
      titleLine1: "Linen Rentals For",
      titleLine2: "PGs & Hostels",
      priceLabel: "Save on setup and wash costs",
      priceValue: "Zero Deposit",
      image: "/banner_4.png",
      ctaText: "REQUEST QUOTE",
      ctaLink: "#pricing"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
    localStorage.setItem("checkout_pending", JSON.stringify(planData));
    window.location.href = "/checkout";
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
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Navigation */}
      <Navbar user={user} loading={loading} handleLogout={handleLogout} />

      {/* Hero Section Banner Carousel */}
      <header className="pt-28 pb-8 bg-alabaster-linen">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-[320px] sm:h-[380px] md:h-[460px] w-full overflow-hidden rounded-[20px] shadow-2xl bg-charcoal-ink">
            {/* Background Banners with crossfade */}
            <div className="absolute inset-0 z-0">
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.titleLine1}
                    className="w-full h-full object-cover object-center transition-transform duration-[3000ms] ease-linear"
                    style={{
                      transform: currentSlide === idx ? "scale(1.05)" : "scale(1.00)"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent" />
                </div>
              ))}
            </div>

            {/* Logo on the top-right */}
            <div className="absolute top-6 right-8 z-20 pointer-events-none">
              <span className="text-lg md:text-xl font-serif font-bold text-white tracking-[0.15em] uppercase opacity-90">
                Closet<span className="text-[#B2905F]">Rush</span>
              </span>
            </div>

            {/* Slider Content */}
            <div className="absolute inset-0 z-20 flex items-center px-8 sm:px-12 md:px-16 lg:px-20">
              <div className="w-full relative h-[80%] flex items-center">
                {slides.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`absolute w-full max-w-lg text-left space-y-4 md:space-y-6 transition-all duration-700 ease-out ${currentSlide === idx
                        ? "opacity-100 translate-y-0 pointer-events-auto z-20"
                        : "opacity-0 translate-y-8 pointer-events-none z-0"
                      }`}
                  >
                    {/* Premium micro label */}
                    <span className="block text-3xs sm:text-2xs font-extrabold uppercase tracking-widest text-[#B2905F]">
                      {slide.label}
                    </span>

                    {/* Headline */}
                    <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-medium leading-[1.15] tracking-tight">
                      {slide.titleLine1} <br />
                      <span className="text-[#B2905F] italic font-normal">{slide.titleLine2}</span>
                    </h1>

                    {/* Price details */}
                    <div className="space-y-0.5">
                      <p className="text-3xs sm:text-2xs text-gray-300/80 font-sans tracking-wide uppercase font-bold">
                        {slide.priceLabel}
                      </p>
                      <p className="font-serif text-xl sm:text-2xl md:text-3xl text-[#B2905F] font-medium">
                        {slide.priceValue}
                      </p>
                    </div>

                    {/* Button */}
                    <div className="pt-1">
                      <a
                        href={slide.ctaLink}
                        onClick={(e) => handleScrollTo(e, slide.ctaLink)}
                        className="inline-flex items-center gap-2 border border-white/20 hover:border-[#B2905F] hover:text-[#B2905F] text-white font-sans text-3xs sm:text-2xs font-bold tracking-widest px-5 py-2.5 uppercase transition-all duration-300"
                      >
                        {slide.ctaText} →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pill shaped Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-black/25 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center justify-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full cursor-pointer transition-all duration-300 border-none outline-none ${currentSlide === idx ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Left and Right Manual Control Arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 items-center justify-center rounded-full bg-black/10 hover:bg-black/30 border border-white/05 text-white transition-all cursor-pointer backdrop-blur-sm"
              aria-label="Previous slide"
            >
              ⟨
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 items-center justify-center rounded-full bg-black/10 hover:bg-black/30 border border-white/05 text-white transition-all cursor-pointer backdrop-blur-sm"
              aria-label="Next slide"
            >
              ⟩
            </button>
          </div>
        </div>
      </header>

      {/* CATEGORIES SECTION (Circular slider categories down to hero) */}
      <section className="bg-alabaster-linen pt-4 pb-12">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <h3 className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-extrabold text-charcoal-ink/40">
              Rent By Category
            </h3>
            <div className="h-[1px] w-12 bg-[#B2905F] mt-2" />
          </div>

          <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none py-4 px-2 gap-6 md:gap-10 justify-start md:justify-center items-center scrollbar-none">
            {categories.map((cat, idx) => (
              <a
                key={idx}
                href="#pricing"
                onClick={(e) => handleScrollTo(e, "#pricing")}
                className="flex flex-col items-center gap-4 group cursor-pointer flex-shrink-0"
              >
                {/* Rounded Image Container */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:border-[#B2905F] group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>

                {/* Category Name */}
                <span className="text-[10px] sm:text-2xs font-extrabold uppercase tracking-widest text-charcoal-ink/75 group-hover:text-[#B2905F] transition-colors duration-300 text-center max-w-[120px] whitespace-normal leading-normal">
                  {cat.name}
                </span>
              </a>
            ))}
          </div>
        </div>

      </section>

      {/* PRODUCT CATALOG SECTION */}
      <section id="products" className="py-24 md:py-32 bg-gradient-to-b from-[#faf9f6] via-[#f5f2eb] to-[#faf9f6] border-t border-b border-charcoal-ink/05">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="text-micro-label">The Catalog</p>
            <h2 className="text-section-header">Our Bedding Collections.</h2>
            <p className="text-body text-charcoal-ink/65">
              Choose from our premium sanitized sheets. Available for flat purchase or flexible subscription swaps.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Single Bed Bedding Set",
                desc: "Thermodynamic UV-C sanitized organic standard weave sheets. Perfect for single mattress setups.",
                rentPrice: "₹300/mo",
                buyPrice: "₹200 + GST",
                image: "/cat_single.png",
                tag: "Bestseller",
                active: true
              },
              {
                title: "Double Bed Bedding Set",
                desc: "Super-soft 400 TC long-staple cotton sheets. Full set includes 4 bedsheets + 8 pillow covers.",
                rentPrice: "₹800/mo",
                buyPrice: "₹350 + GST",
                image: "/cat_double.png",
                tag: "Popular",
                active: true
              },
              {
                title: "Premium Quilts & Duvets",
                desc: "High loft hypoallergenic microfiber quilted duvets. Sanitized and cleaned regularly.",
                rentPrice: "₹450/mo",
                buyPrice: "Coming Soon",
                image: "/cat_quilt.png",
                tag: "Coming Soon",
                active: false
              },
              {
                title: "Warm Woolen Blankets",
                desc: "Insulating premium winter blankets, sanitized and washed at hot thermodynamic temperatures.",
                rentPrice: "₹250/mo",
                buyPrice: "Coming Soon",
                image: "/cat_blankets.png",
                tag: "Coming Soon",
                active: false
              }
            ].map((prod, idx) => {
              const productId = prod.title.toLowerCase().includes("single") ? "single" : "double";
              return (
                <div 
                  key={idx} 
                  onClick={() => { if (prod.active) window.location.href = `/product/${productId}`; }}
                  className={`group bg-white/75 backdrop-blur-md border border-white/50 rounded-[32px] p-5 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_70px_rgba(36,92,119,0.08)] hover:-translate-y-2.5 transition-all duration-500 ease-out ${
                    prod.active ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-alabaster-linen shadow-inner">
                    <img 
                      src={prod.image} 
                      alt={prod.title} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out pointer-events-none"
                    />
                    {prod.tag && (
                      <span className={`absolute top-4 left-4 text-[8px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md border shadow-sm ${
                        prod.active 
                          ? "bg-charcoal-ink/90 text-white border-white/10" 
                          : "bg-white/90 text-charcoal-ink/60 border-charcoal-ink/05"
                      }`}>
                        {prod.tag}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="pt-6 flex-grow flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <h3 className="font-serif font-bold text-sm text-charcoal-ink leading-snug">
                        {prod.title}
                      </h3>
                      <p className="text-3xs text-charcoal-ink/60 leading-relaxed font-medium">
                        {prod.desc}
                      </p>
                    </div>

                    {/* Pricing Matrix */}
                    <div className="pt-2 grid grid-cols-2 gap-3 text-center text-3xs font-bold uppercase tracking-wider">
                      <div className="bg-[#245c77]/05 border border-[#245c77]/10 p-3 rounded-[16px] transition-colors group-hover:bg-[#245c77]/08">
                        <span className="text-[#245c77] block text-[8px] font-extrabold tracking-widest">Rent Rate</span>
                        <span className="text-charcoal-ink font-bold text-xs mt-1 block">{prod.rentPrice}</span>
                      </div>
                      <div className="bg-[#B2905F]/05 border border-[#B2905F]/10 p-3 rounded-[16px] transition-colors group-hover:bg-[#B2905F]/08">
                        <span className="text-[#B2905F] block text-[8px] font-extrabold tracking-widest">Buy Price</span>
                        <span className="text-charcoal-ink font-bold text-xs mt-1 block">{prod.buyPrice}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    {prod.active ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/product/${productId}`;
                        }}
                        className="w-full py-4 rounded-full bg-charcoal-ink text-white font-bold text-[9px] uppercase tracking-widest hover:bg-linen-gold hover:text-charcoal-ink shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                      >
                        Configure Order
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-4 rounded-full bg-charcoal-ink/05 border border-charcoal-ink/05 text-charcoal-ink/30 font-bold text-[9px] uppercase tracking-widest cursor-not-allowed"
                      >
                        Notify When Available
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: THE EXPERIENCE (Manufacturing / Timeline - Cinematic Storybook Option 5) */}
      <section id="experience" className="py-20 md:py-28 bg-alabaster-linen border-t border-b border-charcoal-ink/08">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center space-y-3 mb-14">
            <p className="text-micro-label">How We Do It</p>
            <h2 className="text-section-header">The Cleaning & Sanitization Cycle</h2>
            <p className="text-body text-charcoal-ink/60 max-w-xl mx-auto">
              A meticulously engineered hygiene process designed to guarantee hotel-standard freshness at your doorstep.
            </p>
          </div>

          {/* Cinematic Floating Split Slide Container */}
          <div className="w-full min-h-[560px] md:h-[580px] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row bg-[#0F1A1C]/02 border border-charcoal-ink/10 relative">
            
            {/* Left Side: Cinematic Image Showcase */}
            <div className="w-full md:w-1/2 h-[260px] md:h-full relative overflow-hidden bg-charcoal-ink">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-[1800ms] ease-out ${
                    activeStep === idx
                      ? "opacity-100 scale-105 z-10"
                      : "opacity-0 scale-100 z-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Soft vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-charcoal-ink/60 via-transparent to-transparent pointer-events-none" />
                </div>
              ))}
              
              {/* Process micro label */}
              <div className="absolute left-6 bottom-6 z-20 bg-black/35 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-3xs font-extrabold tracking-widest uppercase border border-white/05">
                🛡️ Professional Safety Standard
              </div>
            </div>

            {/* Right Side: Editorial Texts panel */}
            <div className="w-full md:w-1/2 min-h-[300px] md:h-full relative overflow-hidden bg-white flex flex-col justify-between p-8 sm:p-12 md:p-16">
              
              {/* Top Row: Elegant Number Nav */}
              <div className="flex items-center gap-6 border-b border-charcoal-ink/08 pb-4 w-full">
                {steps.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`font-serif text-base sm:text-lg font-extrabold transition-all border-none bg-transparent cursor-pointer relative pb-2 ${
                      activeStep === idx
                        ? "text-[#B2905F] scale-110"
                        : "text-charcoal-ink/25 hover:text-charcoal-ink/50"
                    }`}
                  >
                    {item.step}
                    {activeStep === idx && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B2905F] rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Middle Row: Content Card */}
              <div className="relative flex-grow flex items-center py-8 min-h-[180px] md:h-auto w-full">
                {steps.map((item, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-x-0 flex flex-col justify-center space-y-4 transition-all duration-[800ms] ease-in-out ${
                      activeStep === idx
                        ? "opacity-100 translate-y-0 z-10 pointer-events-auto"
                        : "opacity-0 -translate-y-4 z-0 pointer-events-none"
                    }`}
                  >
                    <span className="text-3xs font-extrabold uppercase tracking-widest text-[#B2905F] flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#B2905F]" /> Step {item.step} — System Cycle
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-charcoal-ink font-semibold leading-tight tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-charcoal-ink/70 leading-relaxed font-sans max-w-md">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom Row: Loading bar timeline tracker */}
              <div className="w-full space-y-2 pt-4 border-t border-charcoal-ink/08">
                <div className="flex justify-between items-center text-3xs font-extrabold uppercase tracking-widest text-charcoal-ink/40">
                  <span>Autoplay Progress</span>
                  <span>{activeStep + 1} / {steps.length}</span>
                </div>
                <div className="h-1 bg-charcoal-ink/10 rounded-full overflow-hidden w-full relative">
                  <div
                    key={activeStep} // Changing key re-triggers the forwards animation
                    className="h-full bg-[#B2905F]"
                    style={{
                      animation: "slideProgress 3500ms linear forwards"
                    }}
                  />
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: THE LUXURY (Three Pillars Sensory Accordion Grid) */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="max-w-2xl mb-14">
            <p className="text-micro-label">The Material</p>
            <h2 className="text-section-header mt-2 leading-tight">
              Hotel softness, crafted for the ultimate sensory sleep.
            </h2>
          </div>

          {/* Three Pillars Accordion Grid */}
          <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[500px] w-full select-none">
            {[
              {
                num: "01",
                title: "THE TOUCH",
                subtitle: "Super Soft Cotton Weave",
                desc: "Woven with premium 100% long-staple organic cotton. Feel the buttery softness that mimics the finest 5-star hotel sheets, getting softer with every wash cycle.",
                image: "/material_touch.png"
              },
              {
                num: "02",
                title: "THE HYGIENE",
                subtitle: "Sanitized & Skin Safe",
                desc: "Washed at high thermodynamic temperatures and UV-C treated. We guarantee zero dust mites, bed bugs, or chemical residues. Perfect for sensitive skin.",
                image: "/material_hygiene.png"
              },
              {
                num: "03",
                title: "THE CRAFT",
                subtitle: "Fits Any Bed Mattress",
                desc: "Designed with deep 14-inch pockets and heavy-duty 360° elastic bands. Hugs single and double mattresses snugly, preventing any slips or wrinkles.",
                image: "/material_craft.png"
              }
            ].map((col, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveMaterialCol(idx)}
                onClick={() => setActiveMaterialCol(idx)}
                className={`relative w-full overflow-hidden rounded-[28px] shadow-lg border border-charcoal-ink/10 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group
                  md:h-full
                  ${
                    activeMaterialCol === idx
                      ? "h-[260px] md:flex-[2.2] shadow-2xl"
                      : "h-[110px] md:flex-[0.9] hover:md:flex-[1.1]"
                  }
                `}
              >
                {/* Background Image */}
                <img
                  src={col.image}
                  alt={col.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105 pointer-events-none"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 pointer-events-none" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white select-none pointer-events-none">
                  
                  {/* Header Row */}
                  <div className="flex items-center gap-4">
                    <span className="font-serif text-3xl font-extrabold text-[#B2905F] tracking-wide leading-none">
                      {col.num}
                    </span>
                    <div className="h-6 w-[1px] bg-white/20" />
                    <h3 className="text-3xs font-extrabold tracking-[0.2em] uppercase text-white/95">
                      {col.title}
                    </h3>
                  </div>

                  {/* Expanding description container */}
                  <div
                    className={`transition-all duration-700 ease-out overflow-hidden ${
                      activeMaterialCol === idx
                        ? "opacity-100 max-h-[160px] mt-4"
                        : "opacity-0 max-h-0 mt-0"
                    }`}
                  >
                    <h4 className="font-serif text-base font-semibold text-[#B2905F] mb-1.5 leading-snug">
                      {col.subtitle}
                    </h4>
                    <p className="text-3xs sm:text-2xs text-white/80 leading-relaxed font-sans max-w-md">
                      {col.desc}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Specification Spec Sheet at the bottom */}
          <div className="mt-16 border-t border-charcoal-ink/08 pt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <span className="text-3xl sm:text-4xl font-serif text-[#B2905F] font-extrabold leading-none">100%</span>
              <div>
                <p className="text-3xs sm:text-2xs font-extrabold uppercase tracking-widest text-charcoal-ink">Pure Organic Cotton</p>
                <p className="text-[10px] text-charcoal-ink/50 mt-0.5">Sourced ethically, woven for long-lasting texture.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <span className="text-3xl sm:text-4xl font-serif text-[#B2905F] font-extrabold leading-none">60°C+</span>
              <div>
                <p className="text-3xs sm:text-2xs font-extrabold uppercase tracking-widest text-charcoal-ink">Thermal Sanitization</p>
                <p className="text-[10px] text-charcoal-ink/50 mt-0.5">Washed at high heats to break down allergens completely.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <span className="text-3xl sm:text-4xl font-serif text-[#B2905F] font-extrabold leading-none">0%</span>
              <div>
                <p className="text-3xs sm:text-2xs font-extrabold uppercase tracking-widest text-charcoal-ink">Harsh Bleach / Chemicals</p>
                <p className="text-[10px] text-charcoal-ink/50 mt-0.5">Hypoallergenic wash processes safe for all skin types.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: THE ROUTINE UPGRADE (Calendar Compare) */}
      <section className="py-16 md:py-24 bg-alabaster-linen border-t border-b border-charcoal-ink/08">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-10">
          <div className="text-center space-y-3">
            <p className="text-micro-label">The Upgrade</p>
            <h2 className="text-section-header">A Month Reclaimed</h2>
            <p className="text-body text-charcoal-ink/60 max-w-xl mx-auto">
              Compare your traditional bedding schedule against the automated ClosetRush standard.
            </p>
          </div>

          <RoutineComparison />
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
      <section className="bg-alabaster-linen py-20 md:py-28 relative overflow-hidden border-b border-charcoal-ink/08">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-8 relative z-10">
          <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-md border border-white rounded-[32px] p-8 sm:p-12 md:p-16 text-center space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_80px_rgba(36,92,119,0.06)] hover:-translate-y-1 transition-all duration-500 ease-out">
            <p className="text-micro-label text-[#245c77]">The Invitation</p>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-charcoal-ink leading-tight">
              Your next fresh bed is <span className="text-[#245c77] italic font-normal">already waiting.</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-charcoal-ink/70 max-w-2xl mx-auto leading-relaxed font-semibold">
              Step into the ClosetRush standard of sleep. Reserve your subscription today and claim your introductory rates.
            </p>
            <div className="pt-4">
              <a
                href="#pricing"
                onClick={(e) => handleScrollTo(e, "#pricing")}
                className="inline-flex items-center gap-2.5 py-4 px-10 bg-charcoal-ink text-white font-bold text-xs uppercase tracking-widest hover:bg-[#245c77] rounded-full transition-all duration-300 hover:scale-102 hover:shadow-lg active:scale-98 cursor-pointer"
              >
                Start Now <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Newsletter */}
      <footer id="signup" className="bg-charcoal-ink text-alabaster-linen py-16">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pb-10 border-b border-white/08">
            {/* Brand/Pitch */}
            <div className="space-y-4">
              <p className="text-micro-label text-linen-gold">Newsletter</p>
              <h2 className="text-3xl font-serif text-white leading-tight">Stay Fresh, Informed.</h2>
              <p className="text-alabaster-linen/50 text-xs max-w-md font-semibold leading-relaxed">
                Join the ClosetRush circle for exclusive sleep tips, clean sheet updates, and new product news.
              </p>
            </div>

            {/* Email Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 bg-white/05 p-1.5 rounded-2xl md:rounded-full border border-white/10 focus-within:border-[#245c77] focus-within:bg-white/08 transition-all duration-300">
                <div className="relative flex-grow flex items-center">
                  <div className="pl-4 text-alabaster-linen/40">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-3 pr-4 py-3 bg-transparent text-white placeholder-white/35 focus:outline-none transition-colors text-xs font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="py-3 px-8 bg-linen-gold hover:bg-white text-white hover:text-charcoal-ink font-bold text-xs uppercase tracking-wider rounded-xl md:rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  Join Circle
                </button>
              </form>

              {subscribed && (
                <p className="text-linen-gold text-xs font-bold mt-2">
                  Success! Check your inbox soon for exclusive sleep science reports.
                </p>
              )}

              <div className="flex items-center gap-2 text-3xs text-alabaster-linen/40 font-bold uppercase tracking-wider">
                <LockIcon className="w-3.5 h-3.5 text-linen-gold" />
                <span>Private • Weekly Deliveries • Zero Spam</span>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
            <span className="text-xl font-serif font-bold text-linen-gold tracking-[0.1em] uppercase">
              ClosetRush
            </span>
            <p className="text-2xs text-alabaster-linen/40 font-semibold">
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


    </div>
  );
}
