"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { 
  ShieldCheck, 
  Leaf, 
  Sparkles, 
  Clock, 
  Heart, 
  RefreshCw, 
  Truck, 
  Star,
  Package,
  ArrowRight,
  Smile,
  Thermometer,
  Microscope,
  Eye,
  CheckCircle2,
  AlertCircle,
  Zap,
  Coffee,
  Building,
  Bed,
  Award,
  ExternalLink,
  BookOpen
} from "lucide-react";

export default function AboutPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive State 1: Clean vs Hygienic toggle
  const [hygieneView, setHygieneView] = useState("hygienic"); // "clean" | "hygienic"

  // Interactive State 2: Science Insights tab
  const [activeInsight, setActiveInsight] = useState(0);

  // Interactive State 3: Persona tab selector
  const [selectedPersona, setSelectedPersona] = useState(0);

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

  useEffect(() => {
    if (!gsapReady) return;

    if (typeof window !== "undefined" && window.gsap) {
      const gsap = window.gsap;
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

  const scienceInsights = [
    {
      id: "sweat",
      icon: Thermometer,
      title: "Nightly Sweat & Body Oils",
      badge: "Shedding & Moisture",
      desc: "Our bodies naturally release sweat, oils, dead skin cells, saliva, and hair onto our bedsheets every single night, creating moisture traps within cotton fibers.",
      stat: "500 Million",
      statLabel: "Dead skin cells shed every night"
    },
    {
      id: "mites",
      icon: Microscope,
      title: "Microscopic Dust Mites",
      badge: "Allergy Triggers",
      desc: "House dust mites thrive in warm bedding environments. They feed on shed skin cells and are among the most common indoor triggers for morning allergies and sneezing.",
      stat: "Invisible",
      statLabel: "To the naked eye"
    },
    {
      id: "bacteria",
      icon: AlertCircle,
      title: "Bacteria & Fungal Growth",
      badge: "Microbial Accumulation",
      desc: "Unwashed bedding accumulates microbial cultures and fungal spores over time. A bedsheet can smell fresh on the surface while hosting millions of active microbes.",
      stat: "99.9%",
      statLabel: "Neutralized via 60°C UV-C sanitization"
    },
    {
      id: "acne",
      icon: Sparkles,
      title: "Skin Breakouts & Acne",
      badge: "Dermatologist Insight",
      desc: "Dermatologists recommend maintaining clean bedding as an essential step in acne prevention and skincare routines, especially for sensitive skin types.",
      stat: "100%",
      statLabel: "Recommended bedding hygiene"
    }
  ];

  const researchPapers = [
    {
      title: "Fungal contamination of bedding: A prospective study of fungal spores",
      journal: "NCBI / PubMed • Journal of Allergy & Clinical Immunology",
      pmid: "PMID: 16387597",
      finding: "Investigates fungal bio-burden and microbial spore survival in standard household pillows and bedding, proving severe accumulation without thermal washing.",
      link: "https://pubmed.ncbi.nlm.nih.gov/16387597/",
      category: "Microbiology"
    },
    {
      title: "House Dust Mites and Their Allergens in Bedding and Indoor Environments",
      journal: "NCBI / PubMed • Current Allergy & Asthma Reports",
      pmid: "PMID: 22821262",
      finding: "Demonstrates how bedding serves as a primary reservoir for dust mite allergens, emphasizing 60°C+ thermal washing or professional UV sterilization.",
      link: "https://pubmed.ncbi.nlm.nih.gov/22821262/",
      category: "Allergy & Asthma"
    },
    {
      title: "Role of Cutibacterium acnes and Environmental Factors in Acne Vulgaris",
      journal: "NCBI PMC • Journal of Clinical & Aesthetic Dermatology",
      pmid: "PMC: 5986265",
      finding: "Clinical research connecting pillowcase friction, sebum accumulation, and bacterial transference directly to facial acne breakouts and skin inflammation.",
      link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5986265/",
      category: "Dermatology"
    },
    {
      title: "Clinical Recommendations for Bedding Sanitation & Washing Frequency",
      journal: "National Sleep Foundation & Clinical Hygiene Advisory Board",
      pmid: "Clinical Guidelines",
      finding: "Official medical recommendations calling for weekly high-heat laundering or UV-C disinfection to prevent microscopic pathogen build-up.",
      link: "https://www.sleepfoundation.org/bedding-information/how-often-should-you-wash-your-sheets",
      category: "Sleep Medicine"
    }
  ];

  const personas = [
    {
      role: "Students",
      icon: Coffee,
      problem: "Busy with 80-hour academic schedules, exams, and fighting over shared hostel washing setups.",
      solution: "Fresh vacuum-sealed sheets delivered to room doorstep without touch."
    },
    {
      role: "Working Professionals",
      icon: Clock,
      problem: "Exhausted after long workdays, returning home only to spend weekends doing heavy bedding laundry.",
      solution: "Zero-effort automated swaps so weekends are spent resting, not doing laundry."
    },
    {
      role: "PG Residents",
      icon: Building,
      problem: "Struggling with humid Bangalore monsoons, damp smelly sheets, and crowded drying lines.",
      solution: "Clean, ironed, UV-sterilized organic cotton sheets on autopilot."
    },
    {
      role: "Busy Families",
      icon: Heart,
      problem: "Managing multiple beds, heavy duvets, and washing schedules for the entire household.",
      solution: "One simple subscription covering all beds with regular fresh swaps."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0D1518] font-sans antialiased flex flex-col justify-between" id="about-page">
      {/* Navigation */}
      <Navbar user={user} loading={loading} handleLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-grow pt-28 md:pt-36">
        
        {/* ========================================================================= */}
        {/* SECTION 1 [DARK NAVY]: HERO STORY ORIGIN */}
        {/* ========================================================================= */}
        <section className="relative w-full bg-[#032026] text-white py-12 md:py-24 overflow-hidden border-b border-white/5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#05D4B5]/5 rounded-full blur-[150px] pointer-events-none" />
          
          <div className="relative z-10 max-w-[1380px] mx-auto px-5 sm:px-12 text-center space-y-4 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#05D4B5]/10 border border-[#05D4B5]/20 shadow-[0_0_20px_rgba(5,212,181,0.15)] gsap-about-hero">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#05D4B5]" />
              <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.25em] text-[#05D4B5]">
                Our Origin Story & Vision
              </span>
            </div>

            <h1 className="text-3xl sm:text-7xl font-serif font-bold text-white tracking-tight leading-tight gsap-about-hero max-w-5xl mx-auto">
              It started with <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#05D4B5] via-[#80ffea] to-white bg-clip-text text-transparent italic font-normal">
                one common problem: Acne.
              </span>
            </h1>

            <p className="text-gray-300 max-w-3xl mx-auto text-xs sm:text-xl leading-relaxed font-light gsap-about-hero">
              Closetrush wasn't born from a boardroom presentation or a slick business idea. It started when frequent skin breakouts led to an unexpected dermatologist question that changed everything.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2 [LIGHT ALABASTER]: INTERACTIVE DERMATOLOGIST REVELATION */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-24 bg-[#FCFBF9] text-[#0D1518] border-b border-[#032026]/10 relative overflow-hidden">
          <div className="max-w-[1380px] mx-auto px-5 sm:px-12 relative z-10 space-y-8 sm:space-y-16">
            
            {/* Story Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              
              {/* Left Column: The Dermatologist Conversation */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-8">
                <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.2em] text-[#032026] bg-[#032026]/5 px-3 py-1 rounded-full border border-[#032026]/10 inline-block">
                  01. The Doctor's Question
                </span>
                <h2 className="font-serif text-2xl sm:text-5xl font-medium text-[#032026] leading-tight">
                  “A clean-looking bedsheet isn't always a hygienic bedsheet.”
                </h2>
                
                <div className="border-l-[3px] border-[#032026] pl-4 sm:pl-6 space-y-3 sm:space-y-5">
                  <p className="text-xs sm:text-lg text-gray-700 leading-relaxed font-light">
                    Like most people experiencing sudden skin breakouts, I blamed skincare products, diet, stress—everything except my bedsheet.
                  </p>
                  <p className="text-xs sm:text-lg text-gray-700 leading-relaxed font-light">
                    When the dermatologist asked how often I change my bedsheet, I confidently replied, <span className="italic font-serif text-[#032026] font-bold">“It's clean.”</span>
                  </p>
                  <p className="text-xs sm:text-lg text-gray-700 leading-relaxed font-light">
                    The doctor smiled and explained that a bedsheet can look spotless on the surface while carrying microscopic bacteria underneath. That single lightbulb moment raised the question: <strong className="text-[#032026] font-semibold">What's the difference between clean and hygienic?</strong>
                  </p>
                </div>
              </div>

              {/* Right Column: Interactive Clean vs Hygienic Card */}
              <div className="lg:col-span-5 space-y-4 sm:space-y-6">
                <div className="bg-white border border-[#032026]/10 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-2xl space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#032026]">Interactive View</span>
                    <span className="text-[9px] sm:text-[10px] bg-[#032026]/5 text-[#032026] border border-[#032026]/15 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-mono font-bold uppercase">Click tab to compare</span>
                  </div>

                  {/* Toggle Pills */}
                  <div className="grid grid-cols-2 p-1 bg-gray-100 border border-gray-200 rounded-xl sm:rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setHygieneView("clean")}
                      className={`py-2 sm:py-3 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                        hygieneView === "clean" 
                          ? "bg-amber-500 text-white shadow-md border border-amber-600" 
                          : "text-gray-500 hover:text-[#032026]"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" /> Clean (Visible)
                    </button>
                    <button
                      type="button"
                      onClick={() => setHygieneView("hygienic")}
                      className={`py-2 sm:py-3 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                        hygieneView === "hygienic" 
                          ? "bg-[#032026] text-[#05D4B5] shadow-lg shadow-[#032026]/20 scale-105" 
                          : "text-gray-500 hover:text-[#032026]"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#05D4B5]" /> Hygienic (Science)
                    </button>
                  </div>

                  {/* Dynamic Interactive Card Output */}
                  {hygieneView === "clean" ? (
                    <div className="p-4 sm:p-6 bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4 animate-fade-in text-amber-950">
                      <div className="flex items-center gap-2 text-amber-700 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                        <Eye className="w-3.5 h-3.5" /> What We See (Surface Level)
                      </div>
                      <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-amber-900 font-light">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Appears white and un-stained</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Smells fresh from detergent perfume</span>
                        </li>
                        <li className="flex items-center gap-2 text-rose-700 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>Still harbors unseen body oils & dust mites</span>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="p-4 sm:p-6 bg-teal-50 border border-teal-200 rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4 animate-fade-in text-teal-950">
                      <div className="flex items-center gap-2 text-teal-800 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#05D4B5]" /> What We Don't See (Microbial Level)
                      </div>
                      <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-teal-900 font-light">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#05D4B5] shrink-0" />
                          <span>60°C Hot-water washed to dissolve cosmetics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#05D4B5] shrink-0" />
                          <span>Sterilized via UV-C light fields (99.9% sterile)</span>
                        </li>
                        <li className="flex items-center gap-2 text-teal-800 font-semibold">
                          <Sparkles className="w-3.5 h-3.5 text-[#05D4B5] shrink-0" />
                          <span>Zero allergens, dust mites, or skin irritation triggers</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  <div className="pt-3 sm:pt-4 border-t border-gray-100 text-center">
                    <p className="text-[11px] sm:text-xs font-serif italic text-gray-500">
                      “Clean is what we see. Hygiene is what we don't.”
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3 [DARK NAVY]: RESEARCH & INSIGHTS (Science Behind Sleep) */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-28 bg-[#032026] text-white border-b border-white/5 relative">
          <div className="max-w-[1380px] mx-auto px-5 sm:px-12 space-y-8 sm:space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-4">
              <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.25em] text-[#05D4B5]">
                02. Research & Insights
              </span>
              <h2 className="font-serif text-2xl sm:text-5xl font-medium text-white leading-tight">
                The Science Behind Better Sleep
              </h2>
              <p className="text-gray-300 text-xs sm:text-base font-light leading-relaxed">
                Reading medical studies, dermatology journals, and health organization reports revealed why bedding maintenance isn't just about comfort—it's essential health.
              </p>
            </div>

            {/* Interactive Science Tab Cards - 2 Column Compact Grid on Mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {scienceInsights.map((insight, idx) => {
                const IconComp = insight.icon;
                const isSelected = activeInsight === idx;
                return (
                  <div
                    key={insight.id}
                    onClick={() => setActiveInsight(idx)}
                    className={`p-4 sm:p-8 rounded-2xl sm:rounded-[32px] border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 sm:space-y-6 ${
                      isSelected
                        ? "bg-gradient-to-b from-[#05D4B5]/15 to-white/5 border-[#05D4B5]/40 shadow-xl shadow-[#05D4B5]/10 scale-[1.02]"
                        : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${
                        isSelected ? "bg-[#05D4B5] text-[#032026] shadow-md" : "bg-white/10 text-[#05D4B5]"
                      }`}>
                        <IconComp className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>

                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#05D4B5] bg-[#05D4B5]/10 px-2 py-0.5 rounded-full border border-[#05D4B5]/20 inline-block">
                        {insight.badge}
                      </span>

                      <h3 className="font-serif text-sm sm:text-2xl font-bold text-white leading-snug">
                        {insight.title}
                      </h3>

                      <p className="text-[11px] sm:text-sm text-gray-300 font-light leading-relaxed">
                        {insight.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      <span className="text-base sm:text-2xl font-serif font-bold text-white block">{insight.stat}</span>
                      <span className="text-[9px] font-mono font-medium text-gray-400 uppercase tracking-wider block mt-0.5">{insight.statLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PEER-REVIEWED RESEARCH PAPERS SECTION */}
            <div className="pt-8 sm:pt-16 space-y-6 sm:space-y-12 border-t border-white/10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-[#05D4B5] uppercase tracking-widest flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#05D4B5]" /> Verified Clinical Citations
                  </span>
                  <h3 className="font-serif text-xl sm:text-4xl text-white font-bold">
                    Peer-Reviewed Medical Research
                  </h3>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400 font-mono font-medium">
                  Verified index from PubMed, NCBI & Medical Journals
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                {researchPapers.map((paper, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 border border-white/10 p-4 sm:p-8 rounded-2xl sm:rounded-[32px] space-y-3 sm:space-y-6 hover:border-[#05D4B5]/40 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-2 sm:space-y-4">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-[#05D4B5] bg-[#05D4B5]/10 px-2 py-0.5 rounded-full border border-[#05D4B5]/20 truncate">
                          {paper.category}
                        </span>
                        <span className="text-[8px] sm:text-[10px] font-mono text-gray-400 font-bold shrink-0">{paper.pmid}</span>
                      </div>

                      <h4 className="font-serif text-xs sm:text-xl font-bold text-white group-hover:text-[#05D4B5] transition-colors leading-snug">
                        {paper.title}
                      </h4>

                      <p className="text-[9px] sm:text-xs font-mono text-gray-400 font-medium truncate">
                        {paper.journal}
                      </p>

                      <p className="text-[10px] sm:text-sm text-gray-300 font-light leading-relaxed bg-black/30 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                        <strong className="text-[#05D4B5] font-bold block mb-0.5">Key Finding:</strong>
                        {paper.finding}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      <a
                        href={paper.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#05D4B5] hover:text-white transition-colors cursor-pointer"
                      >
                        <span>Paper Link</span>
                        <ExternalLink className="w-3 h-3 text-[#05D4B5]" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4 [LIGHT ALABASTER]: REAL WORLD FRICTION (Target Personas) */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-24 bg-[#FCFBF9] text-[#0D1518] border-b border-[#032026]/10 relative">
          <div className="max-w-[1380px] mx-auto px-5 sm:px-12 space-y-8 sm:space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-4">
              <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.2em] text-gray-500">
                03. Real World Friction
              </span>
              <h2 className="font-serif text-2xl sm:text-5xl font-medium text-[#032026] leading-tight">
                “Everyone wanted fresh sheets. Very few had time.”
              </h2>
              <p className="text-gray-600 text-xs sm:text-base font-light leading-relaxed">
                As a student living away from home, I realized changing sheets wasn't difficult because people were careless. It was difficult because life was already busy.
              </p>
            </div>

            {/* Interactive Personas Grid - 2 Column Compact Grid on Mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {personas.map((p, idx) => {
                const IconC = p.icon;
                const isActive = selectedPersona === idx;
                return (
                  <div
                    key={p.role}
                    onClick={() => setSelectedPersona(idx)}
                    className={`p-4 sm:p-8 rounded-2xl sm:rounded-[32px] border transition-all duration-300 cursor-pointer space-y-3 sm:space-y-6 flex flex-col justify-between ${
                      isActive
                        ? "bg-teal-50/80 border-2 border-[#05D4B5] shadow-xl shadow-teal-500/10 text-[#032026]"
                        : "bg-white border-[#032026]/10 text-[#032026] hover:border-[#05D4B5] shadow-sm"
                    }`}
                  >
                    <div className="space-y-2 sm:space-y-4">
                      <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#032026] text-[#05D4B5] flex items-center justify-center shadow-md">
                        <IconC className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                      <h3 className="font-serif text-sm sm:text-2xl font-bold text-[#032026]">{p.role}</h3>
                      <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed font-light">
                        <strong className="text-rose-600 block mb-0.5 font-bold">Friction:</strong>
                        {p.problem}
                      </p>
                    </div>

                    <div className="p-2.5 sm:p-4 bg-[#032026]/5 border border-[#032026]/10 rounded-xl sm:rounded-2xl space-y-0.5">
                      <span className="text-[8px] sm:text-[9px] font-mono font-bold text-[#032026] uppercase tracking-widest block">ClosetRush Fix</span>
                      <p className="text-[11px] sm:text-xs text-[#032026] font-semibold">{p.solution}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Crucial Insight Highlight Box */}
            <div className="p-5 sm:p-12 bg-gradient-to-r from-teal-50 via-[#05D4B5]/15 to-teal-50 border border-teal-200 rounded-2xl sm:rounded-[32px] text-center max-w-4xl mx-auto space-y-2 sm:space-y-4 backdrop-blur-xl shadow-sm">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-[#032026] uppercase tracking-widest">The Core Realization</span>
              <h3 className="font-serif text-lg sm:text-4xl text-[#032026] font-medium italic">
                “The problem wasn't awareness. The problem was convenience.”
              </h3>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5 [DARK NAVY]: WHY CLOSETRUSH EXISTS (The Solution) */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-28 bg-[#032026] text-white border-b border-white/5 relative">
          <div className="max-w-[1380px] mx-auto px-5 sm:px-12 space-y-8 sm:space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-4">
              <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.2em] text-[#05D4B5]">
                04. The Solution
              </span>
              <h2 className="font-serif text-2xl sm:text-5xl font-medium text-white leading-tight">
                That's Why Closetrush Exists
              </h2>
              <p className="text-gray-300 text-xs sm:text-base font-light leading-relaxed">
                We built a simple subscription service to remove the effort from bedding hygiene—delivering fresh, sanitized linens right to your doorstep.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
              <div className="bg-white/5 border border-white/10 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] space-y-3 sm:space-y-6 hover:border-[#05D4B5]/30 transition-all duration-300">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#05D4B5] flex items-center justify-center">
                  <Thermometer className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-white">Clinical Sanitization</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                  60°C hot-water washing dissolves grease and cosmetic residue, followed by high-frequency UV-C sterilizers destroying 99.9% of bacteria.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] space-y-3 sm:space-y-6 hover:border-[#05D4B5]/30 transition-all duration-300">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#05D4B5] flex items-center justify-center">
                  <Truck className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-white">Doorstep Swap Loops</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                  We handle delivery, collection, washing, and ironing. You simply receive vacuum-sealed fresh bundles on your preferred schedule.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] space-y-3 sm:space-y-6 hover:border-[#05D4B5]/30 transition-all duration-300">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#05D4B5] flex items-center justify-center">
                  <Smile className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-white">Zero Laundry Hassle</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                  No waiting for sheets to dry during monsoons, no storing extra sets, no fighting over washing machines. Just clean sheets on autopilot.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6 [LIGHT ALABASTER]: MISSION & VISION CARDS */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-24 bg-[#FCFBF9] text-[#0D1518] border-b border-[#032026]/10">
          <div className="max-w-[1380px] mx-auto px-5 sm:px-12 grid grid-cols-2 gap-3 sm:gap-8">
            
            {/* Mission Card */}
            <div className="bg-white border border-[#032026]/10 p-5 sm:p-12 rounded-2xl sm:rounded-[36px] shadow-xl space-y-3 sm:space-y-6 hover:border-[#05D4B5] transition-colors duration-300">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#032026] text-[#05D4B5] flex items-center justify-center font-bold shadow-md">
                <Award className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <span className="text-[9px] sm:text-xs font-mono font-extrabold uppercase tracking-widest text-[#032026] block">Our Mission</span>
              <h3 className="font-serif text-sm sm:text-3xl font-bold text-[#032026] leading-tight">
                Simple, Affordable, Accessible Hygiene.
              </h3>
              <p className="text-xs sm:text-base text-gray-600 font-light leading-relaxed">
                To make bedding hygiene simple, affordable, and accessible for everyone through a convenient subscription experience.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-[#032026] text-white p-5 sm:p-12 rounded-2xl sm:rounded-[36px] shadow-2xl space-y-3 sm:space-y-6 border border-[#05D4B5]/30">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#05D4B5] text-[#032026] flex items-center justify-center font-bold shadow-lg shadow-[#05D4B5]/20">
                <Zap className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <span className="text-[9px] sm:text-xs font-mono font-extrabold uppercase tracking-widest text-[#05D4B5] block">Our Vision</span>
              <h3 className="font-serif text-sm sm:text-3xl font-bold text-white leading-tight">
                India's Most Trusted HaaS Brand.
              </h3>
              <p className="text-xs sm:text-base text-gray-300 font-light leading-relaxed">
                To become India's most trusted Hygiene-as-a-Service (HaaS) brand, helping millions of people enjoy cleaner, healthier, and more comfortable living.
              </p>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7 [DARK NAVY]: FINAL TAGLINE & CTA */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-32 text-center relative overflow-hidden bg-[#032026] text-white">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#05D4B5]/20 via-transparent to-transparent pointer-events-none z-0 opacity-60 blur-3xl" />
          
          <div className="max-w-4xl mx-auto px-5 relative z-10 space-y-4 sm:space-y-8">
            <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.3em] text-[#05D4B5] bg-[#05D4B5]/10 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full border border-[#05D4B5]/20 inline-block">
              Sleep Fresh. Live Better.
            </span>

            <h2 className="text-2xl sm:text-6xl font-serif font-medium text-white leading-tight">
              Because a bedsheet shouldn't just look clean. <br />
              <span className="text-[#05D4B5] italic font-serif">It should be hygienic too.</span>
            </h2>

            <div className="pt-4 sm:pt-8 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6">
              <Link
                href="/shop"
                className="px-8 py-3.5 sm:px-10 sm:py-5 bg-[#05D4B5] hover:bg-white text-[#032026] font-sans text-2xs sm:text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 w-full sm:w-auto text-center rounded-full shadow-[0_10px_30px_rgba(5,212,181,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                Browse Catalog
              </Link>
              <Link
                href="/#pricing-plans"
                className="px-8 py-3.5 sm:px-10 sm:py-5 border border-white/20 hover:border-[#05D4B5] bg-white/5 hover:bg-white/10 text-white font-sans text-2xs sm:text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 w-full sm:w-auto text-center rounded-full hover:scale-105 active:scale-95 backdrop-blur-md cursor-pointer"
              >
                View Subscription Plans
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer showWaitlist={true} />

      {/* GSAP CDN script tags loaded sequentially */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" 
        strategy="lazyOnload" 
        onLoad={() => setGsapReady(true)}
      />
    </div>
  );
}
