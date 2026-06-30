"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import {
  Play,
  Plus,
  Check,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  SkipForward,
  Sparkles,
  ArrowRight,
  Tv,
  Info,
  Calendar,
  Layers,
  ShieldAlert,
  ArrowDownUp,
  X,
  Star,
  Zap
} from "lucide-react";

// Bedding collection assets mock database (with beautiful gradients)
const INITIAL_SETS = {
  current: {
    id: "ocean-white",
    name: "Ocean White Collection",
    material: "100% Organic Sateen Cotton",
    threadCount: "400 TC",
    desc: "Crisp, cool, and pristine. Feels like a 5-star seaside resort bed.",
    gradient: "from-[#F8FAFC] via-[#E2E8F0] to-[#94A3B8]",
    textLight: false,
    mood: "Serene & Restorative",
    tags: ["Hot Seller", "Summer Pack"]
  },
  next: {
    id: "royal-grey",
    name: "Royal Grey Collection",
    material: "Long-staple Mercerized Cotton",
    threadCount: "450 TC",
    desc: "A rich charcoal satin weave that brings understated luxury to your bedroom.",
    gradient: "from-[#475569] via-[#334155] to-[#1E293B]",
    textLight: true,
    mood: "Chic & Relaxing",
    tags: ["Trending", "Ultra Soft"]
  },
  following: {
    id: "luxury-beige",
    name: "Luxury Beige Collection",
    material: "Organic Eucalyptus Sateen",
    threadCount: "500 TC",
    desc: "Silky-smooth, hypoallergenic fibers that run cool all night long.",
    gradient: "from-[#EADFCE] via-[#D2C2A4] to-[#B5A181]",
    textLight: false,
    mood: "Warm & Breathable",
    tags: ["Luxury Tier", "Eco Friendly"]
  }
};

const LIBRARY_SETS = [
  {
    id: "emerald-mint",
    name: "Emerald Mint Sateen",
    material: "100% Fine Organic Cotton",
    threadCount: "400 TC",
    desc: "A calming herbal hue that reduces stress and encourages deep REM sleep.",
    gradient: "from-[#0F766E] via-[#115E59] to-[#134E4A]",
    textLight: true,
    mood: "Calming & Botanical",
    tags: ["Stress Relief", "Spring Season"]
  },
  {
    id: "midnight-indigo",
    name: "Midnight Indigo Linen",
    material: "Pure Flax Linen & Cotton Blend",
    threadCount: "350 TC",
    desc: "Heavy-textured yet breathable, styled for a cozy winter-night feel.",
    gradient: "from-[#1E1B4B] via-[#312E81] to-[#1E293B]",
    textLight: true,
    mood: "Deep Sleep & Cozy",
    tags: ["Cozy Pack", "Premium Flax"]
  },
  {
    id: "blossom-pink",
    name: "Blossom Pink Percale",
    material: "100% Long-Staple Egyptian Cotton",
    threadCount: "420 TC",
    desc: "Crisp and matte finish, perfect for warm sleepers seeking ventilation.",
    gradient: "from-[#FCE7F3] via-[#FBCFE8] to-[#F472B6]",
    textLight: false,
    mood: "Romantic & Airy",
    tags: ["Crisp Texture", "Cool Touch"]
  },
  {
    id: "forest-green",
    name: "Forest Green Sateen",
    material: "Organic Sateen Cotton",
    threadCount: "480 TC",
    desc: "A majestic shade of pine that coordinates perfectly with ambient lighting.",
    gradient: "from-[#14532D] via-[#166534] to-[#064E3B]",
    textLight: true,
    mood: "Organic & Grounding",
    tags: ["Limited Edition", "Rich Fabric"]
  },
  {
    id: "sunset-coral",
    name: "Sunset Coral Percale",
    material: "Combed Organic Cotton",
    threadCount: "400 TC",
    desc: "Warm and inviting tone. Instantly brightens up bedrooms with low sunlight.",
    gradient: "from-[#FFF1F2] via-[#FECDD3] to-[#FDA4AF]",
    textLight: false,
    mood: "Vibrant & Inviting",
    tags: ["Bright Room", "Matte Finish"]
  }
];

export default function ValueVisualizer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // States for Cost Stack Visualizer
  const [activeStackStep, setActiveStackStep] = useState(0); // 0 to 5 for items, 6 for final total
  const [monthsCount, setMonthsCount] = useState(6);
  const [showSavingCard, setShowSavingCard] = useState(false);

  // States for Netflix Bedding Dashboard
  const [currentQueue, setCurrentQueue] = useState(INITIAL_SETS);
  const [activeQueueTab, setActiveQueueTab] = useState("next"); // "next" or "following" to choose which position to edit
  const [swapState, setSwapState] = useState("idle"); // "idle" | "sanitizing" | "delivering" | "completed"
  const [swapStep, setSwapStep] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeTier, setActiveTier] = useState("Standard"); // "Standard" | "Luxury" | "Royal"
  const [alertMessage, setAlertMessage] = useState("");

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

  // Handle Logout
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

  // Stack elements data
  const BUYING_STACK_ITEMS = [
    { name: "₹2500 Bedsheet", cost: 2500, detail: "400 TC Cotton sheet (average cost)" },
    { name: "₹1200 Pillow Covers", cost: 1200, detail: "Matching organic standard cases" },
    { name: "₹800 Laundry", cost: 800, detail: "Washing cost / electric hot-water wash" },
    { name: "₹400 Detergent", cost: 400, detail: "Eco-friendly fabric softener & soap" },
    { name: "₹300 Delivery", cost: 300, detail: "Fuel and transport to pick/buy sheets" }
  ];

  const totalBuyingCost = BUYING_STACK_ITEMS.reduce((sum, item) => sum + item.cost, 0);
  const closetRushCostPerMonth = 300;

  // Trigger stacking animation
  useEffect(() => {
    let timer;
    if (activeStackStep < 5) {
      timer = setTimeout(() => {
        setActiveStackStep(prev => prev + 1);
      }, 900);
    } else if (activeStackStep === 5) {
      timer = setTimeout(() => {
        setActiveStackStep(6);
        setShowSavingCard(true);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [activeStackStep]);

  // Restart Stack Animation
  const handleResetStack = () => {
    setActiveStackStep(0);
    setShowSavingCard(false);
  };

  // Swap Early Animation sequence
  const handleSwapEarly = () => {
    if (swapState !== "idle") return;
    setSwapState("sanitizing");
    setSwapStep(1);

    // Step 1: Sanitization
    setTimeout(() => {
      setSwapStep(2);
      setSwapState("delivering");
    }, 1500);

    // Step 2: Courier dispatch
    setTimeout(() => {
      setSwapStep(3);
    }, 3000);

    // Step 3: Delivered
    setTimeout(() => {
      setSwapState("completed");
      setSwapStep(4);
      // Swap the next set into the current position, and slide down
      setTimeout(() => {
        setCurrentQueue(prev => ({
          current: prev.next,
          next: prev.following,
          following: LIBRARY_SETS[Math.floor(Math.random() * LIBRARY_SETS.length)]
        }));
        setSwapState("idle");
        setSwapStep(0);
        triggerToast("Swap complete! Enjoy your fresh set.");
      }, 1500);
    }, 4500);
  };

  // Skip Month Action
  const handleSkipMonth = () => {
    // Current next becomes following, and following gets a new library set
    setCurrentQueue(prev => ({
      ...prev,
      next: prev.following,
      following: LIBRARY_SETS[Math.floor(Math.random() * LIBRARY_SETS.length)]
    }));
    triggerToast("Month skipped! Your collection schedule shifted forward.");
  };

  // Upgrade Collection Tier Action
  const handleConfirmUpgrade = (tier) => {
    setActiveTier(tier);
    setShowUpgradeModal(false);
    triggerToast(`Upgraded to ${tier} tier! Next month's set will feature elite fabrics.`);
  };

  // Choose Upcoming Set from Library
  const handleSelectLibrarySet = (set) => {
    if (activeQueueTab === "next") {
      if (set.id === currentQueue.current.id || set.id === currentQueue.following.id) {
        triggerToast("This collection is already queued or active!");
        return;
      }
      setCurrentQueue(prev => ({
        ...prev,
        next: set
      }));
      triggerToast(`Queued "${set.name}" for next month!`);
    } else {
      if (set.id === currentQueue.current.id || set.id === currentQueue.next.id) {
        triggerToast("This collection is already queued or active!");
        return;
      }
      setCurrentQueue(prev => ({
        ...prev,
        following: set
      }));
      triggerToast(`Queued "${set.name}" for the following month!`);
    }
  };

  // Toast alert trigger
  const triggerToast = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => {
      setAlertMessage("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-alabaster-linen text-charcoal-ink font-sans antialiased">
      <Navbar user={user} loading={loading} handleLogout={handleLogout} />

      {/* Floating Notification Toast */}
      {alertMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-linen-gold text-white font-bold text-xs px-6 py-4 rounded-none shadow-xl border border-white/20 flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-white animate-spin" />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Hero header */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-white via-alabaster-linen to-alabaster-linen border-b border-charcoal-ink/08">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5ebeb_1px,transparent_1px),linear-gradient(to_bottom,#e5ebeb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_50%,transparent_100%)] opacity-35" />
        <div className="absolute top-20 left-1/4 w-80 h-80 rounded-full bg-linen-gold/5 blur-3xl opacity-35" />
        <div className="absolute top-32 right-1/4 w-96 h-96 rounded-full bg-linen-gold/5 blur-3xl opacity-35" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none text-2xs font-extrabold bg-linen-gold/15 text-linen-gold border border-linen-gold/25 mb-6 uppercase tracking-wider">
            <Tv className="w-4 h-4 fill-current" />
            <span>Interactive Value Visualizer</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-charcoal-ink tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            "Netflix for Bedding" <br />
            <span className="bg-gradient-to-r from-linen-gold via-cyan-800 to-charcoal-ink bg-clip-text text-transparent">
              Bedding Rental Redefined
            </span>
          </h1>

          <p className="text-sm sm:text-base text-charcoal-ink/60 max-w-2xl mx-auto mb-8 font-medium">
            Nobody expects bedding rental to work like Netflix. We change the perception of bedding from a boring utility chore to a fresh, dynamic content subscription.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="#cost-stack"
              className="inline-flex justify-center items-center py-3 px-6 rounded-none text-xs font-bold uppercase tracking-widest text-charcoal-ink border border-charcoal-ink/15 hover:bg-charcoal-ink hover:text-white transition-colors"
            >
              Analyze Cost Stack
            </a>
            <a
              href="#netflix-dashboard"
              className="inline-flex justify-center items-center py-3 px-6 rounded-none text-xs font-bold uppercase tracking-widest text-white bg-linen-gold hover:bg-charcoal-ink transition-colors shadow-md"
            >
              Launch Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* Section 1: Animated Cost Stack (Buying vs ClosetRush) */}
      <section id="cost-stack" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-charcoal-ink/08">
        <div className="text-center mb-16 space-y-1">
          <span className="text-2xs font-bold tracking-widest text-linen-gold uppercase">Interactive Calculator</span>
          <h2 className="text-3xl font-serif font-bold text-charcoal-ink">Buying & Washing vs. ClosetRush</h2>
          <p className="text-charcoal-ink/60 text-xs max-w-md mx-auto">See how one simple subscription collapses the huge mountain of bedding hassle.</p>
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Buying Stack Column (Left 5 cols) */}
          <div className="lg:col-span-5 bg-white border border-charcoal-ink/10 rounded-none p-6 md:p-8 relative shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-serif font-bold text-lg text-charcoal-ink">Option A: Buying Yourself</h3>
                <p className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider">Retail prices + monthly laundry washes</p>
              </div>
              <button
                onClick={handleResetStack}
                className="p-2 bg-alabaster-linen hover:bg-charcoal-ink/05 rounded-none text-charcoal-ink/50 hover:text-charcoal-ink transition-colors border border-charcoal-ink/10 cursor-pointer"
                title="Restart Animation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>              {/* Visual Stack container */}
            <div className="space-y-3 min-h-[300px] flex flex-col justify-end">
              {BUYING_STACK_ITEMS.map((item, idx) => {
                const isShown = idx < activeStackStep;
                return (
                  <div
                    key={item.name}
                    className={`transition-all duration-700 transform ${
                      isShown
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-6 scale-95 pointer-events-none"
                    } bg-alabaster-linen border border-charcoal-ink/08 rounded-none p-4 flex items-center justify-between shadow-sm relative group`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-none bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold text-sm shrink-0">
                        +
                      </div>
                      <div>
                        <p className="text-xs font-bold text-charcoal-ink">{item.name}</p>
                        <p className="text-[10px] text-charcoal-ink/45 mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-rose-650 shrink-0">₹{item.cost}</span>
                  </div>
                );
              })}
            </div>
 
            {/* Total Calculator */}
            <div className="mt-8 pt-6 border-t border-charcoal-ink/10 flex items-center justify-between">
              <span className="text-2xs font-extrabold uppercase text-charcoal-ink/50 tracking-wider">Total Upfront Retail:</span>
              <span className={`text-xl sm:text-2xl font-bold transition-all duration-500 ${activeStackStep === 6 ? "text-rose-600 scale-105" : "text-charcoal-ink/40"}`}>
                ₹{activeStackStep === 6 ? totalBuyingCost : "???"}
              </span>
            </div>        </div>

          {/* Spacer / Vs graphic (Center 1 col) */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center self-center py-6">
            <div className="w-12 h-12 rounded-none bg-white border border-charcoal-ink/10 flex items-center justify-center text-2xs font-extrabold text-linen-gold tracking-widest shadow-sm">
              VS
            </div>
            <div className="h-24 w-0.5 bg-gradient-to-b from-charcoal-ink/10 to-transparent hidden lg:block mt-4" />
          </div>

          {/* ClosetRush Stack Column (Right 5 cols) */}
          <div className="lg:col-span-5 bg-white border border-linen-gold/25 rounded-none p-6 md:p-8 relative shadow-sm">
            <div className="absolute top-4 right-4 bg-linen-gold/10 text-linen-gold border border-linen-gold/25 text-3xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-none">
              Highly Recommended
            </div>

            <div className="mb-8">
              <h3 className="font-serif font-bold text-lg text-charcoal-ink">Option B: ClosetRush Subscription</h3>
              <p className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider">Fully serviced, hot-washed monthly swap</p>
            </div>

            {/* Visual single clean container */}
            <div className="bg-white border border-linen-gold/40 rounded-none p-6 shadow-md relative overflow-hidden min-h-[300px] flex flex-col justify-between group hover:border-linen-gold transition-all duration-300">
              {/* Glowing gradient mesh */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-linen-gold/5 rounded-full blur-2xl group-hover:bg-linen-gold/10 transition-all duration-500" />
              
              <div className="flex items-center justify-between">
                <span className="text-3xs font-bold uppercase text-linen-gold tracking-widest bg-linen-gold/15 border border-linen-gold/25 px-2.5 py-1 rounded-none">
                  All-Inclusive Fresh Bedding
                </span>
                <Sparkles className="w-5 h-5 text-linen-gold animate-pulse" />
              </div>

              <div className="my-6">
                <p className="text-4xl font-bold text-charcoal-ink flex items-baseline gap-1 font-serif">
                  ₹300<span className="text-xs font-sans font-semibold text-charcoal-ink/40">/month</span>
                </p>
                <p className="text-2xs text-charcoal-ink/65 mt-2 leading-relaxed">Rent clean sheets at just ₹10 per day. Free delivery, zero upfront costs, cancel anytime.</p>
              </div>

              <div className="space-y-2.5 border-t border-charcoal-ink/08 pt-6 text-xs text-charcoal-ink/75">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-linen-gold" />
                  <span>Fresh premium sheets delivered monthly</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-linen-gold" />
                  <span>Sanitized at 60°C+ (Zero Dust Mites)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-linen-gold" />
                  <span>Swap early, skip, or cancel in 1-click</span>
                </div>
              </div>
            </div>

            {/* Savings Calculator interactive slider */}
            {showSavingCard && (
              <div className="mt-8 bg-white border border-charcoal-ink/10 rounded-none p-5 animate-fade-in transition-all duration-500 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xs font-extrabold text-charcoal-ink/50 uppercase tracking-wide">Usage Timeline:</span>
                  <span className="text-xs font-bold text-linen-gold uppercase tracking-wider">{monthsCount} Months</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={monthsCount}
                  onChange={(e) => setMonthsCount(parseInt(e.target.value))}
                  className="w-full h-1 bg-charcoal-ink/10 rounded-none appearance-none cursor-pointer accent-linen-gold"
                />
                
                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-charcoal-ink/08 text-center">
                  <div>
                    <p className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider">Retail Cost</p>
                    <p className="text-sm font-bold text-rose-600 mt-1">₹{totalBuyingCost + (monthsCount * 1200)}</p>
                    <p className="text-[9px] text-charcoal-ink/30">(Retail + washes)</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider">ClosetRush Cost</p>
                    <p className="text-sm font-bold text-linen-gold mt-1">₹{monthsCount * closetRushCostPerMonth}</p>
                    <p className="text-[9px] text-linen-gold/75 font-semibold">Save ₹{(totalBuyingCost + (monthsCount * 1200)) - (monthsCount * closetRushCostPerMonth)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Netflix for Bedding Dashboard */}
      <section id="netflix-dashboard" className="py-24 bg-alabaster-linen border-b border-charcoal-ink/08">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-2xs font-bold tracking-widest text-linen-gold uppercase">Exclusive Feature</span>
              <h2 className="text-3xl font-serif font-bold text-charcoal-ink mt-1">"Netflix for Bedding"</h2>
              <p className="text-charcoal-ink/60 text-xs sm:text-sm mt-2 max-w-lg font-medium leading-relaxed">
                Why own one design forever when you can cycle through a fresh aesthetic calendar every month? Welcome to your dashboard.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <button
                onClick={handleSwapEarly}
                disabled={swapState !== "idle"}
                className={`px-5 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer ${
                  swapState !== "idle"
                    ? "bg-charcoal-ink/05 text-charcoal-ink/20 border border-charcoal-ink/10 cursor-not-allowed"
                    : "bg-linen-gold text-white hover:bg-charcoal-ink"
                }`}
              >
                <ArrowDownUp className="w-4 h-4 shrink-0" />
                Swap Early
              </button>
              <button
                onClick={handleSkipMonth}
                className="px-5 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest bg-transparent hover:bg-charcoal-ink/05 text-charcoal-ink border border-charcoal-ink/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <SkipForward className="w-4 h-4 shrink-0" />
                Skip Month
              </button>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-5 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest bg-charcoal-ink hover:bg-linen-gold text-white hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                Upgrade Collection
              </button>
            </div>
          </div>
 
          {/* Swap Progress Animation */}
          {swapState !== "idle" && (
            <div className="mb-12 bg-white border border-linen-gold/25 rounded-none p-6 transition-all duration-300 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-3xs font-extrabold uppercase text-linen-gold tracking-widest">Hot-Swap Delivery Steps</h4>
                <span className="text-[10px] text-linen-gold uppercase tracking-wider animate-pulse font-bold">Running In Real Time</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className={`p-4 rounded-none border text-xs font-semibold ${swapStep >= 1 ? "bg-linen-gold/15 border-linen-gold/40 text-charcoal-ink" : "bg-charcoal-ink/03 border-charcoal-ink/08 text-charcoal-ink/40"}`}>
                  <p className="text-2xs font-bold uppercase tracking-wider">1. Hot Washing</p>
                  <p className="text-[10px] text-charcoal-ink/50 mt-1 font-medium">Washed at 60°C & sealed</p>
                </div>
                <div className={`p-4 rounded-none border text-xs font-semibold ${swapStep >= 2 ? "bg-linen-gold/15 border-linen-gold/40 text-charcoal-ink" : "bg-charcoal-ink/03 border-charcoal-ink/08 text-charcoal-ink/40"}`}>
                  <p className="text-2xs font-bold uppercase tracking-wider">2. Courier Dispatched</p>
                  <p className="text-[10px] text-charcoal-ink/50 mt-1 font-medium">Delivery agent en-route</p>
                </div>
                <div className={`p-4 rounded-none border text-xs font-semibold ${swapStep >= 3 ? "bg-linen-gold/15 border-linen-gold/40 text-charcoal-ink" : "bg-charcoal-ink/03 border-charcoal-ink/08 text-charcoal-ink/40"}`}>
                  <p className="text-2xs font-bold uppercase tracking-wider">3. Hot Swap Complete</p>
                  <p className="text-[10px] text-charcoal-ink/50 mt-1 font-medium">Old pickup, fresh handoff</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Dashboard Display (Featured banner style) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
            {/* Featured Active Set (Left 7 cols) */}
            <div className="lg:col-span-7 bg-white border border-charcoal-ink/10 rounded-none overflow-hidden flex flex-col justify-between shadow-md relative min-h-[380px]">
              {/* Dynamic Gradient mockup */}
              <div className={`absolute top-0 left-0 right-0 h-48 bg-gradient-to-b ${currentQueue.current.gradient} opacity-90 relative flex flex-col justify-between p-6 overflow-hidden rounded-none`}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0F1A1C_100%)] opacity-35" />
                <div className="flex justify-between items-start z-10 w-full">
                  <div className="bg-white/90 border border-charcoal-ink/15 text-charcoal-ink px-3 py-1 rounded-none text-3xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-linen-gold animate-ping" />
                    Currently Active
                  </div>
                  <div className="bg-linen-gold text-white px-2 py-0.5 rounded-none text-4xs font-bold uppercase tracking-widest">
                    {currentQueue.current.threadCount}
                  </div>
                </div>
 
                <div className="z-10">
                  <h3 className={`text-2xl sm:text-3xl font-serif font-bold ${currentQueue.current.textLight ? "text-white" : "text-slate-950"}`}>
                    {currentQueue.current.name}
                  </h3>
                  <p className={`text-xs mt-1 font-bold tracking-wide uppercase ${currentQueue.current.textLight ? "text-alabaster-linen/70" : "text-slate-800"}`}>
                    {currentQueue.current.material}
                  </p>
                </div>
              </div>
 
              {/* Card Details */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between bg-white">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentQueue.current.tags.map(tag => (
                      <span key={tag} className="text-4xs font-bold uppercase tracking-widest px-2 py-0.5 bg-charcoal-ink/05 border border-charcoal-ink/10 rounded-none text-charcoal-ink/50">
                        {tag}
                      </span>
                    ))}
                    <span className="text-4xs font-bold uppercase tracking-widest px-2 py-0.5 bg-linen-gold/15 border border-linen-gold/25 rounded-none text-linen-gold">
                      Mood: {currentQueue.current.mood}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal-ink/75 leading-relaxed mb-6 font-medium">
                    {currentQueue.current.desc}
                  </p>
                </div>
 
                <div className="border-t border-charcoal-ink/08 pt-6 flex items-center justify-between text-2xs uppercase tracking-wider font-bold text-charcoal-ink/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-linen-gold" />
                    <span>Active Tier: {activeTier} Premium</span>
                  </div>
                  <span>Laundered: June 01, 2026</span>
                </div>
              </div>
            </div>
            {/* Upcoming Queue Schedule (Right 5 cols) */}
            <div className="lg:col-span-5 bg-white border border-charcoal-ink/10 rounded-none p-6 md:p-8 flex flex-col justify-between shadow-md">
              <div>
                <h3 className="font-serif font-bold text-lg text-charcoal-ink mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-linen-gold" />
                  Your Content Queue
                </h3>
 
                {/* Queue Stack */}
                <div className="space-y-4">
                  {/* Position 1: Next Month */}
                  <div
                    onClick={() => setActiveQueueTab("next")}
                    className={`cursor-pointer rounded-none p-4 border transition-all duration-200 ${
                      activeQueueTab === "next"
                        ? "bg-alabaster-linen border-linen-gold/60 shadow-sm"
                        : "bg-transparent border-charcoal-ink/10 hover:border-charcoal-ink/20"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-4xs font-bold uppercase tracking-widest text-linen-gold bg-linen-gold/10 px-2 py-0.5 border border-linen-gold/20">
                        Next Month (July)
                      </span>
                      <span className="text-4xs font-bold uppercase tracking-widest text-charcoal-ink/40">Edit Slot</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-none bg-gradient-to-tr ${currentQueue.next.gradient} shrink-0 border border-charcoal-ink/10`} />
                      <div>
                        <h4 className="text-sm font-bold text-charcoal-ink">{currentQueue.next.name}</h4>
                        <p className="text-3xs text-charcoal-ink/40 mt-0.5 font-bold uppercase tracking-wider">{currentQueue.next.material}</p>
                      </div>
                    </div>
                  </div>
 
                  {/* Position 2: Following Month */}
                  <div
                    onClick={() => setActiveQueueTab("following")}
                    className={`cursor-pointer rounded-none p-4 border transition-all duration-200 ${
                      activeQueueTab === "following"
                        ? "bg-alabaster-linen border-linen-gold/60 shadow-sm"
                        : "bg-transparent border-charcoal-ink/10 hover:border-charcoal-ink/20"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-4xs font-bold uppercase tracking-widest text-linen-gold bg-linen-gold/10 px-2 py-0.5 border border-linen-gold/20">
                        Following Month (Aug)
                      </span>
                      <span className="text-4xs font-bold uppercase tracking-widest text-charcoal-ink/40">Edit Slot</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-none bg-gradient-to-tr ${currentQueue.following.gradient} shrink-0 border border-charcoal-ink/10`} />
                      <div>
                        <h4 className="text-sm font-bold text-charcoal-ink">{currentQueue.following.name}</h4>
                        <p className="text-3xs text-charcoal-ink/40 mt-0.5 font-bold uppercase tracking-wider">{currentQueue.following.material}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
 
              <div className="mt-8 pt-6 border-t border-charcoal-ink/05 text-center text-3xs text-charcoal-ink/40 font-bold uppercase tracking-widest">
                💡 Tap a slot to customize its bedding collection from the library below
              </div>
            </div>    </div>
                  {/* Library Section (Netflix Browse style) */}
          <div className="mt-16 bg-white border border-charcoal-ink/10 rounded-none p-6 md:p-8 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-charcoal-ink mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-linen-gold" />
              Browse Collections Library
            </h3>
            <p className="text-3xs text-charcoal-ink/45 mb-6 uppercase tracking-widest font-bold">
              Selected Collection will go into: <span className="text-linen-gold font-extrabold">{activeQueueTab === "next" ? "NEXT MONTH (JULY)" : "FOLLOWING MONTH (AUGUST)"}</span>
            </p>
 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {LIBRARY_SETS.map(set => {
                const isSelected = currentQueue.next.id === set.id || currentQueue.following.id === set.id;
                return (
                  <div
                    key={set.id}
                    onClick={() => handleSelectLibrarySet(set)}
                    className={`bg-white border rounded-none p-4 overflow-hidden relative group cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                      isSelected
                        ? "border-linen-gold/60 opacity-60"
                        : "border-charcoal-ink/10 hover:border-charcoal-ink/20 shadow-sm"
                    }`}
                  >
                    {/* Small color box */}
                    <div className={`h-24 w-full rounded-none bg-gradient-to-tr ${set.gradient} border border-charcoal-ink/10 flex items-end justify-between p-3 relative overflow-hidden mb-3`}>
                      <span className="text-4xs font-bold px-1.5 py-0.5 bg-black/80 text-white rounded-none z-10">{set.threadCount}</span>
                      {isSelected && (
                        <span className="text-4xs font-bold px-1.5 py-0.5 bg-linen-gold text-white rounded-none z-10 uppercase tracking-widest">
                          Queued
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-charcoal-ink group-hover:text-linen-gold transition-colors">{set.name}</h4>
                      <p className="text-4xs text-charcoal-ink/40 font-bold uppercase mt-0.5 tracking-wider">{set.material}</p>
                      <p className="text-3xs text-charcoal-ink/65 mt-2 leading-relaxed line-clamp-2">{set.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Perception Shift Matrix */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-1">
          <span className="text-2xs font-bold tracking-widest text-linen-gold uppercase">Mindset Transformation</span>
          <h2 className="text-3xl font-serif font-bold text-charcoal-ink">Shifting Your Bedding Perception</h2>
          <p className="text-charcoal-ink/60 text-xs max-w-md mx-auto">From stressful domestic utility to instant aesthetic luxury.</p>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Old Perception */}
          <div className="bg-white border border-red-200 rounded-none p-6 md:p-8 relative overflow-hidden group shadow-sm">
            <div className="absolute top-4 right-4 bg-red-100 text-red-650 border border-red-200 text-3xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-none">
              Old Utility Perception
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-none bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal-ink">Bedding as a Utility Chore</h3>
            </div>
            <ul className="space-y-4 text-xs text-charcoal-ink/75 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold mt-0.5">✕</span>
                <span><strong>Dust Mites & Allergens:</strong> Washing standard sheets at home rarely breaks the 60°C target required to kill mites and completely strip sweat.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold mt-0.5">✕</span>
                <span><strong>High Maintenance:</strong> Doing the laundry, purchase of soap, iron efforts, and regular folding takes up average 4-6 hours every month.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold mt-0.5">✕</span>
                <span><strong>Aesthetic Boredom:</strong> Buying luxury sheets is costly, forcing you to sleep on the same design for years, resulting in a static bedroom vibe.</span>
              </li>
            </ul>
          </div>
 
          {/* New Perception */}
          <div className="bg-white border border-linen-gold/25 rounded-none p-6 md:p-8 relative overflow-hidden group shadow-sm">
            <div className="absolute top-4 right-4 bg-linen-gold/10 text-linen-gold border border-linen-gold/25 text-3xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-none">
              New Content Perception
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-none bg-linen-gold/10 border border-linen-gold/20 text-linen-gold flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal-ink">Bedding as Content Subscription</h3>
            </div>
            <ul className="space-y-4 text-xs text-charcoal-ink/80 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-linen-gold font-bold mt-0.5">✓</span>
                <span><strong>Super Hot Wash:</strong> Guaranteed hot wash at 60°C+ with high pressure steam press and sealed delivery.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-linen-gold font-bold mt-0.5">✓</span>
                <span><strong>Zero Physical Effort:</strong> Instant 5-minute hot swaps. Just bag your old sheet and place the new one. We wash it all.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-linen-gold font-bold mt-0.5">✓</span>
                <span><strong>Design Rotation:</strong> Swap colors, styles, and thread counts on-demand to match your bedding to the weather, seasons, or moods.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>        {/* Upgrade Tier Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-ink/80 backdrop-blur-sm p-4">
          <div className="bg-white border border-charcoal-ink/15 rounded-none p-6 md:p-8 w-full max-w-[500px] shadow-2xl relative text-charcoal-ink">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-charcoal-ink/50 hover:text-charcoal-ink transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-xl text-charcoal-ink mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-linen-gold" />
              Upgrade Collection Tier
            </h3>
            <p className="text-2xs text-charcoal-ink/60 mb-6 uppercase tracking-wider font-semibold">Select a collection tier for even higher-grade fabrics and higher thread count sheets.</p>
 
            <div className="space-y-4">
              {/* Option 1: Standard Premium */}
              <div
                onClick={() => handleConfirmUpgrade("Standard")}
                className={`p-4 rounded-none border cursor-pointer transition-all ${
                  activeTier === "Standard"
                    ? "bg-alabaster-linen border-linen-gold text-charcoal-ink"
                    : "bg-white border-charcoal-ink/10 hover:border-charcoal-ink/20 text-charcoal-ink/80"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm">Standard Premium</h4>
                  <span className="text-3xs font-bold uppercase tracking-widest text-linen-gold">Active Tier</span>
                </div>
                <p className="text-3xs text-charcoal-ink/40 font-semibold mt-0.5">400 TC Organic Sateen Cotton. Great all-rounder.</p>
              </div>
 
              {/* Option 2: Luxury Eucalyptus */}
              <div
                onClick={() => handleConfirmUpgrade("Luxury")}
                className={`p-4 rounded-none border cursor-pointer transition-all ${
                  activeTier === "Luxury"
                    ? "bg-alabaster-linen border-linen-gold text-charcoal-ink"
                    : "bg-white border-charcoal-ink/10 hover:border-charcoal-ink/20 text-charcoal-ink/80"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm">Luxury Eucalyptus</h4>
                  <span className="text-3xs font-bold uppercase tracking-widest text-linen-gold">+₹100/mo</span>
                </div>
                <p className="text-3xs text-charcoal-ink/40 font-semibold mt-0.5">480-500 TC Organic Eucalyptus fiber. Silky cooling texture.</p>
              </div>
 
              {/* Option 3: Royal Mulberry Silk */}
              <div
                onClick={() => handleConfirmUpgrade("Royal")}
                className={`p-4 rounded-none border cursor-pointer transition-all ${
                  activeTier === "Royal"
                    ? "bg-alabaster-linen border-linen-gold text-charcoal-ink"
                    : "bg-white border-charcoal-ink/10 hover:border-charcoal-ink/20 text-charcoal-ink/80"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm">Royal Mulberry Silk</h4>
                  <span className="text-3xs font-bold uppercase tracking-widest text-linen-gold">+₹250/mo</span>
                </div>
                <p className="text-3xs text-charcoal-ink/40 font-semibold mt-0.5">Pure organic Mulberry Silk blend. Premium skin-care sleep.</p>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* Subscription Banner */}
      <section className="bg-white py-16 sm:py-24 border-t border-charcoal-ink/08">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif font-bold text-charcoal-ink mb-4">Start Your Fresh Bedding Subscription</h2>
          <p className="text-charcoal-ink/60 text-sm sm:text-base mb-8 max-w-xl mx-auto font-medium leading-relaxed">
            Experience hotel-grade sleep at home. Rotate collections monthly or swap on-demand.
          </p>
 
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-2 py-4 px-10 rounded-none text-xs font-bold uppercase tracking-widest text-white bg-linen-gold hover:bg-charcoal-ink transition-colors shadow-lg"
          >
            Start Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
 
      {/* Footer */}
      <footer className="bg-charcoal-ink text-alabaster-linen py-16 border-t border-white/05">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xl sm:text-2xl font-serif font-bold bg-gradient-to-r from-linen-gold to-white bg-clip-text text-transparent">
              ClosetRush
            </span>
            <p className="text-2xs font-extrabold uppercase tracking-wider text-alabaster-linen/45">
              © {new Date().getFullYear()} ClosetRush. All rights reserved. • Built for healthier sleeping.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
