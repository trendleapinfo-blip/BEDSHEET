"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { ShieldCheck, Leaf, Sparkles, Clock, Heart, RefreshCw, Truck } from "lucide-react";

export default function AboutPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-alabaster-linen text-charcoal-ink font-sans antialiased flex flex-col justify-between">
      {/* Navigation */}
      <Navbar user={user} loading={loading} handleLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-grow pt-28 md:pt-36">
        
        {/* Section 1: Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center space-y-6">
          <span className="text-3xs uppercase tracking-widest text-linen-gold bg-[#245c77]/10 px-4 py-1.5 rounded-full border border-[#245c77]/20 inline-block font-extrabold">
            Our Story & Vision
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-charcoal-ink tracking-tight max-w-4xl mx-auto leading-tight">
            Rethinking how the <span className="text-[#245c77]">modern world sleeps.</span>
          </h1>
          <p className="text-charcoal-ink/75 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed font-medium">
            ClosetRush is a luxury bedding rental service. We deliver sanitized, fresh, certified organic sheets and pillowcases right to your doorstep, swapping them out periodically so you enjoy clean sheets without the laundry hassle.
          </p>
        </section>

        {/* Section 2: Values Cards */}
        <section className="bg-white/40 py-16 md:py-24 border-y border-charcoal-ink/05">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-2">
              <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">Why ClosetRush</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-ink">Built on hygiene, sustainability, & luxury</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Hygiene */}
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-[24px] border border-charcoal-ink/05 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-72">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#245c77]/10 flex items-center justify-center text-[#245c77] mb-6">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-charcoal-ink mb-3">Absolute Sanitization</h3>
                  <p className="text-charcoal-ink/70 text-xs leading-relaxed font-semibold">
                    Every swap undergoes 60°C+ hot-water washing and deep UV-C sterilization to eliminate 99.9% of bacteria, allergens, and germs.
                  </p>
                </div>
                <span className="text-3xs uppercase tracking-widest text-linen-gold font-bold">100% Germ-Free Promise</span>
              </div>

              {/* Card 2: Environment */}
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-[24px] border border-charcoal-ink/05 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-72">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#245c77]/10 flex items-center justify-center text-[#245c77] mb-6">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-charcoal-ink mb-3">Eco-Conscious Loop</h3>
                  <p className="text-charcoal-ink/70 text-xs leading-relaxed font-semibold">
                    Commercial laundering saves up to 45% water and electricity compared to home washing machines. Our standard sheets are made of GOTS-certified organic cotton.
                  </p>
                </div>
                <span className="text-3xs uppercase tracking-widest text-linen-gold font-bold">Sustainable Bedding</span>
              </div>

              {/* Card 3: Convenience */}
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-[24px] border border-charcoal-ink/05 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-72">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#245c77]/10 flex items-center justify-center text-[#245c77] mb-6">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-charcoal-ink mb-3">Zero-Effort Comfort</h3>
                  <p className="text-charcoal-ink/70 text-xs leading-relaxed font-semibold">
                    We handle everything from delivery to collection. Receive vacuum-sealed, perfectly ironed bundles on a schedule that fits your life.
                  </p>
                </div>
                <span className="text-3xs uppercase tracking-widest text-linen-gold font-bold">No Laundering Ever</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: The Process / How It Works Detail */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <span className="text-3xs uppercase tracking-widest text-[#245c77] font-bold block">Our Production Standard</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-ink leading-tight">
                How we achieve five-star luxury cleanliness.
              </h2>
              <p className="text-charcoal-ink/70 text-sm leading-relaxed">
                Bed sheets collect dead skin cells, sweat, dust mites, and bacteria daily. Standard home laundering rarely eliminates them completely. 
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#245c77] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-charcoal-ink uppercase tracking-wider">Hypoallergenic Wash Cycles</h4>
                    <p className="text-charcoal-ink/60 text-xs mt-1">We wash sheets in professional facility drums using specialized eco-detergents at extreme heat (60°C+) to completely dissolve grease and allergens.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#245c77] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-charcoal-ink uppercase tracking-wider">UV-C Sanitation Tunnel</h4>
                    <p className="text-charcoal-ink/60 text-xs mt-1">Post-drying, all sheets pass through active UV-C light fields to destroy any microscopic bacteria or viruses remaining.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#245c77] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-charcoal-ink uppercase tracking-wider">Vacuum-Sealed Dispatches</h4>
                    <p className="text-charcoal-ink/60 text-xs mt-1">Linen sets are vacuum sealed in our sterile facility immediately after sanitization, ensuring no external dust touches your bedding until you tear the bag open.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/70 border border-white rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] space-y-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-linen-gold" />
                  <span className="text-2xs font-extrabold uppercase tracking-widest text-[#245c77]">The ClosetRush Promise</span>
                </div>
                <blockquote className="text-base font-serif italic text-charcoal-ink/80 leading-relaxed">
                  "Our goal was never just to build a bedding rental service. We wanted to eliminate one of the most tedious home chores while elevating the quality of sleep. Clean sheets change the mood of a home. We want everyone to experience that hotel-quality feeling every single week."
                </blockquote>
                <div className="flex items-center gap-3 pt-4 border-t border-charcoal-ink/05">
                  <div className="w-10 h-10 rounded-full bg-[#245c77]/10 flex items-center justify-center text-[#245c77] font-bold text-sm">CR</div>
                  <div>
                    <h5 className="font-bold text-xs text-charcoal-ink">The ClosetRush Team</h5>
                    <p className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-semibold">Sleep & Hygiene Innovators</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: CTA */}
        <section className="bg-charcoal-ink text-white py-16 md:py-20 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-alabaster-linen leading-tight">
              Ready to upgrade to a smarter, fresher bed?
            </h2>
            <p className="text-alabaster-linen/60 text-xs sm:text-sm max-w-lg mx-auto font-medium">
              Join thousands of households enjoying fresh, UV-sanitized organic cotton bedsheets without the laundry chore.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/#products"
                className="px-8 py-3.5 bg-linen-gold hover:bg-white hover:text-charcoal-ink text-alabaster-linen font-bold text-2xs uppercase tracking-widest transition-all duration-300 w-full sm:w-auto text-center"
              >
                Browse Catalog
              </Link>
              <Link
                href="/#pricing"
                className="px-8 py-3.5 border border-white/20 hover:border-white text-white font-bold text-2xs uppercase tracking-widest transition-all duration-300 w-full sm:w-auto text-center"
              >
                View Plans
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-charcoal-ink text-alabaster-linen py-12 border-t border-white/05">
        <div className="max-w-[1380px] mx-auto px-6 sm:px-8 space-y-10">
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
    </div>
  );
}
