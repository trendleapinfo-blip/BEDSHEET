"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";

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

const CATEGORY_METADATA = {
  "Bedsheet + Pillow (Single)": {
    title: "Single Bedding",
    desc: "Premium organic single bed sheets and pillow covers, sterilized and swapped on your schedule.",
    image: "/cat_single.png"
  },
  "Bedsheet + Pillow (Double)": {
    title: "Double Bedding",
    desc: "Super-soft 400 TC long-staple double bedsheets and pillow covers for maximum comfort.",
    image: "/cat_double.png"
  },
  "Curtains": {
    title: "Curtains & Linens",
    desc: "Hotel-grade sanitized curtains to refresh your living spaces and windows.",
    image: "/cat_curtains.png"
  },
  "Quilts": {
    title: "Premium Quilts",
    desc: "High-loft, hypoallergenic microfiber quilted duvets for warm, peaceful nights.",
    image: "/cat_quilt.png"
  },
  "Blankets": {
    title: "Warm Blankets",
    desc: "Insulating premium winter blankets sanitized at high thermodynamic temperatures.",
    image: "/cat_blankets.png"
  }
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [heroImage, setHeroImage] = useState("/banner_1.png");

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

    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings?.heroImage) {
            setHeroImage(data.settings.heroImage);
          }
        }
      } catch (err) {
        // silently fall back to default banner
      }
    };

    fetchSession();
    fetchPlans();
    fetchSettings();
  }, []);

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

    return () => {
      observer.disconnect();
    };
  }, [plans]);

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

  // Dynamically resolve categories from database plans list
  const uniqueCategoryNames = Array.from(new Set(plans.map(p => p.bedType)));
  const categoriesList = uniqueCategoryNames.length > 0
    ? uniqueCategoryNames.map(name => {
        const metadata = CATEGORY_METADATA[name] || {
          title: name,
          desc: "Premium sanitized linen swaps.",
          image: "/cat_single.png"
        };
        return { rawName: name, ...metadata };
      })
    : Object.keys(CATEGORY_METADATA).map(name => ({
        rawName: name,
        ...CATEGORY_METADATA[name]
      }));

  return (
    <div className="min-h-screen bg-alabaster-linen text-charcoal-ink font-sans antialiased" id="home">
      <style jsx global>{`
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-active {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>

      {/* Navigation */}
      <Navbar user={user} loading={loading} handleLogout={handleLogout} />

      {/* 1. HERO SECTION — full width, sits flush under fixed navbar */}
      <header className="relative w-full h-[520px] sm:h-[620px] md:h-screen max-h-[800px] bg-charcoal-ink overflow-hidden">
        {/* Background image — swappable from admin */}
        <img
          src={heroImage}
          alt="ClosetRush Bedding"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-700"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Brand watermark top-right */}
        <div className="absolute top-8 right-8 z-20 pointer-events-none">
          <span className="text-base font-serif font-bold text-white/70 tracking-[0.2em] uppercase">
            Closet<span className="text-[#B2905F]">Rush</span>
          </span>
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="w-full max-w-[1380px] mx-auto px-6 sm:px-12 lg:px-20">
            <div className="max-w-2xl text-left space-y-6">
              <span className="inline-block text-3xs font-extrabold uppercase tracking-widest text-[#B2905F]">
                THERMODYNAMIC LINEN SWAPS
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-medium leading-[1.1] tracking-tight">
                Always Sleep On <br />
                <span className="text-[#B2905F] italic font-normal">Fresh, Clean Sheets.</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-300/90 max-w-lg leading-relaxed font-light">
                Thermodynamic UV-C Sanitized Linen Rentals Delivered Straight To Your Door. Never wash bedsheets again.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-charcoal-ink hover:bg-[#B2905F] hover:text-white font-sans text-2xs font-extrabold tracking-widest uppercase transition-all duration-300 rounded-full shadow-lg"
                >
                  Explore Plans
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleScrollTo(e, "#how-it-works")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 hover:border-[#B2905F] hover:text-[#B2905F] text-white font-sans text-2xs font-extrabold tracking-widest uppercase transition-all duration-300 rounded-full backdrop-blur-sm"
                >
                  How It Works
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. TRUST INDICATORS (5 Simple Badges) */}
      <section className="bg-white py-12 border-b border-charcoal-ink/05 shadow-sm">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y-0 md:divide-x divide-charcoal-ink/08">
            {[
              { label: "60°C Hot Wash", icon: <SparklesIcon className="w-5 h-5 text-[#B2905F]" /> },
              { label: "UV Sanitized", icon: <ShieldCheckIcon className="w-5 h-5 text-[#B2905F]" /> },
              { label: "Free Pickup & Delivery", icon: <TruckIcon className="w-5 h-5 text-[#B2905F]" /> },
              { label: "Hotel Quality", icon: <BedIcon className="w-5 h-5 text-[#B2905F]" /> },
              { label: "Cancel Anytime", icon: <CancelIcon className="w-5 h-5 text-[#B2905F]" /> }
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center gap-2 p-2">
                <div className="p-2.5 bg-alabaster-linen rounded-full mb-1">{badge.icon}</div>
                <span className="text-3xs sm:text-2xs font-extrabold uppercase tracking-wider text-charcoal-ink/75">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW CLOSETRUSH WORKS */}
      <section id="how-it-works" className="py-24 bg-alabaster-linen/40 border-b border-charcoal-ink/05 reveal-on-scroll">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="text-micro-label">The Workflow</p>
            <h2 className="text-section-header">How ClosetRush Works</h2>
            <p className="text-body text-charcoal-ink/60">
              Clean bedding on autopilot. We handle the dirty work so you can sleep in luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { num: "01", title: "Choose Bedding", desc: "Select single or double bedding swaps on our configurator." },
              { num: "02", title: "Receive Fresh Linen", desc: "Your sealed, sterilized bedding pack is delivered directly to your room." },
              { num: "03", title: "Sleep Comfortably", desc: "Enjoy crisp, premium sheets made from 100% organic cotton." },
              { num: "04", title: "We Collect Used Linen", desc: "We pickup your used bedding. No need to wash them yourself." },
              { num: "05", title: "Replacement Swaps", desc: "Receive a fresh, UV-sterilized swap on your preferred schedule." }
            ].map((step, idx) => (
              <div key={idx} className="relative bg-white border border-charcoal-ink/05 p-8 rounded-[24px] shadow-[0_15px_40px_rgba(0,0,0,0.01)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-4">
                  <span className="font-serif text-3xl font-extrabold text-[#B2905F] block">{step.num}</span>
                  <h3 className="font-serif font-bold text-sm text-charcoal-ink leading-snug">{step.title}</h3>
                  <p className="text-3xs text-charcoal-ink/60 leading-relaxed font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CLOSETRUSH (6 Simple Cards) */}
      <section className="py-24 bg-white border-b border-charcoal-ink/05 reveal-on-scroll">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="text-micro-label">The Benefits</p>
            <h2 className="text-section-header">Designed For Modern Living</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Never Wash Bedsheets Again", desc: "Save hours of laundry every month. We handle everything.", icon: <CheckIcon className="w-5 h-5 text-[#245c77]" /> },
              { title: "Hotel Standard Hygiene", desc: "UV-C sanitized and hot-washed at 60°C+ to destroy all germs.", icon: <ShieldCheckIcon className="w-5 h-5 text-[#245c77]" /> },
              { title: "Free Doorstep Swaps", desc: "Contactless delivery and pickup swaps integrated directly into your subscription cycle.", icon: <TruckIcon className="w-5 h-5 text-[#245c77]" /> },
              { title: "Flexible Subscription", desc: "Upgrade, downgrade, swap frequencies, or cancel your plans at any time.", icon: <SparklesIcon className="w-5 h-5 text-[#245c77]" /> },
              { title: "Premium Cotton Only", desc: "100% organic long-staple cotton sheets. Breathable, soft, and hypoallergenic.", icon: <BedIcon className="w-5 h-5 text-[#245c77]" /> },
              { title: "Eco-Friendly Loop", desc: "Our professional washing systems save over 40% water compared to home washes.", icon: <CrownIcon className="w-5 h-5 text-[#245c77]" /> }
            ].map((card, idx) => (
              <div key={idx} className="bg-alabaster-linen/40 border border-charcoal-ink/05 p-8 rounded-[28px] hover:bg-alabaster-linen/70 transition-all duration-300 space-y-4 flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#245c77]/05 rounded-full">{card.icon}</div>
                  <h3 className="font-serif font-bold text-sm text-charcoal-ink">{card.title}</h3>
                </div>
                <p className="text-3xs text-charcoal-ink/65 leading-relaxed font-medium">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRODUCT CATEGORIES (No Pricing, No Plans) */}
      <section className="py-24 bg-alabaster-linen/20 border-b border-charcoal-ink/05 reveal-on-scroll">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="text-micro-label">The Catalog</p>
            <h2 className="text-section-header">Linen Collections</h2>
            <p className="text-body text-charcoal-ink/60">
              Browse our premium bedding and home linens. View options and subscribe on our shop page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {categoriesList.map((cat, idx) => (
              <div key={idx} className="bg-white border border-charcoal-ink/05 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif font-bold text-xs text-charcoal-ink">{cat.title}</h3>
                    <p className="text-3xs text-charcoal-ink/60 leading-relaxed font-semibold">{cat.desc}</p>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <a
                    href="/shop"
                    className="block w-full py-2.5 rounded-xl border border-charcoal-ink/10 hover:border-[#245c77] hover:bg-[#245c77] hover:text-white text-center font-bold text-[9px] uppercase tracking-widest transition-all duration-300"
                  >
                    View Collection
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CLEANING PROCESS (Sanitization Workflow) */}
      <section className="py-24 bg-white border-b border-charcoal-ink/05 reveal-on-scroll">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="text-micro-label">The Science</p>
            <h2 className="text-section-header">The Sanitization Cycle</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
            {[
              { title: "Pickup", desc: "Sealed transit bags prevent contamination.", num: "01" },
              { title: "60°C Wash", desc: "Hot water cycles dissolve body oils.", num: "02" },
              { title: "UV Sanitization", desc: "UV-C light destroys sub-microscopic germs.", num: "03" },
              { title: "Steam Press", desc: "Thermal heat sanitizes and flattens fibers.", num: "04" },
              { title: "Vacuum Pack", desc: "Oxygen-deprived wraps protect from dust.", num: "05" },
              { title: "Delivery", desc: "Contactless delivery guarantees freshness.", num: "06" }
            ].map((step, idx) => (
              <div key={idx} className="bg-alabaster-linen/30 border border-charcoal-ink/05 p-6 rounded-[20px] space-y-3 relative hover:scale-103 transition-all duration-300">
                <span className="text-2xs font-extrabold uppercase text-[#B2905F] tracking-widest block">Step {step.num}</span>
                <h3 className="font-serif font-bold text-xs text-charcoal-ink">{step.title}</h3>
                <p className="text-[10px] text-charcoal-ink/50 leading-relaxed font-semibold">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BUSINESS SOLUTIONS */}
      <section className="py-24 bg-alabaster-linen/30 border-b border-charcoal-ink/05 reveal-on-scroll">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0F172A] rounded-[32px] p-8 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            <div className="space-y-4 max-w-xl">
              <span className="text-3xs font-extrabold uppercase tracking-widest text-[#B2905F]">COMMERCIAL SOLUTIONS</span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">Linen Swaps For Property Owners</h2>
              <p className="text-xs sm:text-sm text-gray-300/80 leading-relaxed font-semibold">
                Minimize bedding setup and laundry overheads. We supply, wash, and swap sheets for operations of all scales.
              </p>
              <div className="flex flex-wrap gap-4 text-3xs font-bold uppercase tracking-wider text-gray-400">
                <span>✓ PGs</span>
                <span>✓ Hostels</span>
                <span>✓ Student Housing</span>
                <span>✓ Rental Apartments</span>
              </div>
            </div>
            <div>
              <a
                href="/shop?type=B2B"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-charcoal-ink hover:bg-[#B2905F] hover:text-white font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-full"
              >
                Request Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS (3-5 Testimonials) */}
      <section className="py-24 bg-white border-b border-charcoal-ink/05 reveal-on-scroll">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="text-micro-label">Testimonials</p>
            <h2 className="text-section-header">What Our Members Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Aarav Sharma", role: "Resident, Delhi", review: "ClosetRush has completely changed my weekends. I never have to wash bedsheets again, and they feel exactly like a premium hotel." },
              { name: "Priya Patel", role: "Tech Professional, Bangalore", review: "Having sensitive skin, hygiene is everything to me. The UV sanitization guarantee gives me peace of mind. Excellent service." },
              { name: "Rohan Das", role: "Student Housing Manager, Noida", review: "We switched our entire PG to ClosetRush. The bulk B2B rates and seamless bi-weekly swapping simplified our logistics completely." }
            ].map((review, idx) => (
              <div key={idx} className="bg-alabaster-linen/30 border border-charcoal-ink/05 p-8 rounded-[28px] space-y-4 flex flex-col justify-between">
                <p className="text-3xs sm:text-2xs text-charcoal-ink/80 italic leading-relaxed font-semibold">"{review.review}"</p>
                <div>
                  <h4 className="font-serif font-bold text-xs text-charcoal-ink">{review.name}</h4>
                  <span className="text-[10px] text-charcoal-ink/50 font-bold uppercase">{review.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA (Ready for Fresh Bedding?) */}
      <section className="bg-alabaster-linen/40 py-24 border-b border-charcoal-ink/05 text-center reveal-on-scroll">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-8 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-charcoal-ink">Ready for Fresh Bedding?</h2>
          <p className="text-xs sm:text-sm text-charcoal-ink/65 max-w-md mx-auto leading-relaxed font-semibold">
            Step into the ClosetRush standard of sleep. Explore our flexible bedding membership plans.
          </p>
          <div className="pt-4">
            <a
              href="/shop"
              className="inline-flex items-center gap-2.5 py-4 px-10 bg-charcoal-ink text-white font-bold text-xs uppercase tracking-widest hover:bg-[#245c77] rounded-full transition-all duration-300 hover:scale-102 hover:shadow-lg active:scale-98 cursor-pointer"
            >
              Explore Plans <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer id="signup" className="bg-charcoal-ink text-alabaster-linen py-16">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pb-10 border-b border-white/08">
            <div className="space-y-4">
              <p className="text-micro-label text-linen-gold">Newsletter</p>
              <h2 className="text-3xl font-serif text-white leading-tight">Stay Fresh, Informed.</h2>
              <p className="text-alabaster-linen/50 text-xs max-w-md font-semibold leading-relaxed">
                Join the ClosetRush circle for exclusive sleep tips, clean sheet updates, and new product news.
              </p>
            </div>

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
    </div>
  );
}
