"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HeartIcon, ShieldCheckIcon, LotusIcon, BrainIcon, CheckIcon, ArrowRightIcon } from "./Icons";

export default function InteractiveScience() {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // State for interactive simulation widgets
  const [isStandardBedding, setIsStandardBedding] = useState(false);
  const [washTemp, setWashTemp] = useState(60);
  const [activeChakra, setActiveChakra] = useState(6); // Default to Muladhara (Root)
  const [beddingAge, setBeddingAge] = useState(1);

  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeTab, isPaused]);

  const pillars = [
    {
      id: 0,
      title: "Health Benefits",
      metric: "30%",
      label: "Better Sleep",
      description: "Helps you sleep better, breathe cleaner air, and keeps your skin clean and healthy.",
      icon: HeartIcon,
      accentColor: "from-linen-gold to-charcoal-ink",
      textColor: "text-linen-gold",
      bgColor: "bg-linen-gold/10",
      borderColor: "border-linen-gold/20",
      checklist: [
        "Protects skin from itching",
        "Helps you breathe easy",
        "Keeps germs away",
        "Less sneezing and allergies",
        "Helps you stay healthy",
        "Keeps air around bed fresh",
      ],
    },
    {
      id: 1,
      title: "Washing Standards",
      metric: "99.9%",
      label: "Germ Free",
      description: "We wash sheets in very hot water so all germs are killed. Delivered in sealed clean bags.",
      icon: ShieldCheckIcon,
      accentColor: "from-linen-gold to-charcoal-ink",
      textColor: "text-linen-gold",
      bgColor: "bg-linen-gold/10",
      borderColor: "border-linen-gold/20",
      checklist: [
        "Hot wash (kills bugs)",
        "Cleaned without bad chemicals",
        "Sealed in clean plastic bags",
        "Sanitized with special blue lights",
        "No strong chemical smells",
        "Guaranteed clean when delivered",
      ],
    },
    {
      id: 2,
      title: "Energy & Balance",
      metric: "7",
      label: "Body Points Aligned",
      description: "A clean bed makes you feel calm, happy, and clear in your head.",
      icon: LotusIcon,
      accentColor: "from-linen-gold to-charcoal-ink",
      textColor: "text-linen-gold",
      bgColor: "bg-linen-gold/10",
      borderColor: "border-linen-gold/20",
      checklist: [
        "Calms your body",
        "Helps you think clearly",
        "Makes you feel happy",
        "Less worrying thoughts",
        "Better focus during the day",
        "Calm and peaceful sleep",
      ],
    },
    {
      id: 3,
      title: "Mental Peace",
      metric: "40%",
      label: "Less Stress",
      description: "Sleeping on clean sheets helps you relax and forget about daily stress.",
      icon: BrainIcon,
      accentColor: "from-linen-gold to-charcoal-ink",
      textColor: "text-linen-gold",
      bgColor: "bg-linen-gold/10",
      borderColor: "border-linen-gold/20",
      checklist: [
        "Reduces bedtime anxiety",
        "Makes you wake up happy",
        "Start your day fresh",
        "Deep, heavy sleep",
        "Reduces body stress",
        "Feels like a luxury hotel",
      ],
    },
  ];

  const chakras = [
    {
      name: "Head Focus (Crown)",
      color: "bg-charcoal-ink",
      glowColor: "shadow-charcoal-ink/30",
      effectColor: "text-charcoal-ink",
      element: "Sleep Rhythm",
      desc: "Fresh clean cotton helps your body relax so you fall asleep very fast."
    },
    {
      name: "Mind Focus (Third Eye)",
      color: "bg-linen-gold",
      glowColor: "shadow-linen-gold/30",
      effectColor: "text-linen-gold",
      element: "Peace of Mind",
      desc: "Clean sheets smell nice, which stops you from worrying at night."
    },
    {
      name: "Throat Focus (Voice)",
      color: "bg-charcoal-ink",
      glowColor: "shadow-charcoal-ink/30",
      effectColor: "text-charcoal-ink",
      element: "Clear Breathing",
      desc: "No bed bugs means your nose stays clear and you can breathe easily."
    },
    {
      name: "Heart Focus (Love)",
      color: "bg-linen-gold",
      glowColor: "shadow-linen-gold/30",
      effectColor: "text-linen-gold",
      element: "Calm Heart Rate",
      desc: "Soft sheets help your body rest calmly so your heart beats slowly and safely."
    },
    {
      name: "Stomach Focus (Power)",
      color: "bg-charcoal-ink",
      glowColor: "shadow-charcoal-ink/30",
      effectColor: "text-charcoal-ink",
      element: "Body Energy Charge",
      desc: "Resting on a clean bed gives you full energy to work hard the next day."
    },
    {
      name: "Lower Body Focus (Creativity)",
      color: "bg-linen-gold",
      glowColor: "shadow-linen-gold/30",
      effectColor: "text-linen-gold",
      element: "Fresh Mornings",
      desc: "Waking up on fresh sheets makes you feel happy and ready for the day."
    },
    {
      name: "Base Focus (Root)",
      color: "bg-charcoal-ink",
      glowColor: "shadow-charcoal-ink/30",
      effectColor: "text-charcoal-ink",
      element: "Body Recovery",
      desc: "Safe natural sheets help your body rest and heal tired muscles."
    }
  ];

  const activePillar = pillars[activeTab];
  const ActivePillarIcon = activePillar.icon;

  // Simulator Renders
  const renderHealthSimulator = () => {
    return (
      <div className="space-y-5 p-6 bg-alabaster-linen/60 backdrop-blur-sm border border-charcoal-ink/05 rounded-2xl mb-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[10px] font-bold text-charcoal-ink/50 uppercase tracking-wider font-sans">Select Bedding State</span>
          <div className="inline-flex bg-charcoal-ink/05 p-1 rounded-full border border-charcoal-ink/05 self-start sm:self-auto">
            <button
              onClick={() => {
                setIsStandardBedding(true);
                setIsPaused(true);
              }}
              className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                isStandardBedding
                  ? "bg-charcoal-ink text-alabaster-linen shadow-sm"
                  : "text-charcoal-ink/60 hover:text-charcoal-ink"
              }`}
            >
              Normal Sheets
            </button>
            <button
              onClick={() => {
                setIsStandardBedding(false);
                setIsPaused(true);
              }}
              className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                !isStandardBedding
                  ? "bg-[#245c77] text-white shadow-sm"
                  : "text-charcoal-ink/60 hover:text-charcoal-ink"
              }`}
            >
              ClosetRush Fresh
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Dust Mite Count */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-charcoal-ink/75">Bugs in Bed (Approx.)</span>
              <span className={`font-bold transition-colors duration-300 ${isStandardBedding ? "text-red-500" : "text-[#245c77]"}`}>
                {isStandardBedding ? "10,000+ Bugs" : "0 Bugs"}
              </span>
            </div>
            <div className="h-2 w-full bg-charcoal-ink/05 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isStandardBedding ? "bg-red-500 w-full" : "bg-[#245c77] w-0"}`}
              />
            </div>
          </div>

          {/* Skin Health Rating */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-charcoal-ink/75">Skin Health Score</span>
              <span className={`font-bold transition-colors duration-300 ${isStandardBedding ? "text-red-500" : "text-[#245c77]"}`}>
                {isStandardBedding ? "35/100 (Itchy & Bad)" : "98/100 (Very Good)"}
              </span>
            </div>
            <div className="h-2 w-full bg-charcoal-ink/05 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isStandardBedding ? "bg-red-500 w-[35%]" : "bg-[#245c77] w-[98%]"}`}
              />
            </div>
          </div>

          {/* Breathing Score */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-charcoal-ink/75">Allergy Level</span>
              <span className={`font-bold transition-colors duration-300 ${isStandardBedding ? "text-red-500" : "text-[#245c77]"}`}>
                {isStandardBedding ? "Dusty (Sneeze Risk)" : "Clean & Safe"}
              </span>
            </div>
            <div className="h-2 w-full bg-charcoal-ink/05 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isStandardBedding ? "bg-red-500 w-[45%]" : "bg-[#245c77] w-full"}`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHygieneSimulator = () => {
    let survivalPercent = 99.9;
    let status = "No Hot Wash";
    let statusColor = "bg-red-500/10 text-red-600 border-red-500/20";
    let progressColor = "bg-red-500";
 
    if (washTemp >= 80) {
      survivalPercent = 0.01;
      status = "100% Germ Free (Super Hot)";
      statusColor = "bg-[#245c77]/10 text-[#245c77] border-[#245c77]/20";
      progressColor = "bg-charcoal-ink";
    } else if (washTemp >= 60) {
      survivalPercent = 0.1;
      status = "Sanitized & Clean";
      statusColor = "bg-[#245c77]/10 text-[#245c77] border-[#245c77]/20";
      progressColor = "bg-[#245c77]";
    } else if (washTemp >= 40) {
      survivalPercent = Number((65 - 3.25 * (washTemp - 40)).toFixed(1));
      status = "Warm Wash (Germs stay alive)";
      statusColor = "bg-[#245c77]/10 text-[#245c77]/80 border-[#245c77]/15";
      progressColor = "bg-[#245c77]/60";
    } else {
      survivalPercent = Number((99.9 - 1.745 * (washTemp - 20)).toFixed(1));
      status = "Cold Wash (Bugs stay alive)";
      statusColor = "bg-red-500/10 text-red-600 border-red-500/20";
      progressColor = "bg-red-500";
    }

    return (
      <div className="space-y-5 p-6 bg-alabaster-linen/60 backdrop-blur-sm border border-charcoal-ink/05 rounded-2xl mb-6 font-sans">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-charcoal-ink/50 uppercase tracking-wider">Thermal Dial</span>
          <span className={`px-3 py-1 border text-[10px] font-black uppercase tracking-wider rounded-full transition-all duration-300 ${statusColor}`}>
            {status}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-black text-charcoal-ink w-10">{washTemp}°C</span>
            <input
              type="range"
              min="20"
              max="80"
              step="5"
              value={washTemp}
              onChange={(e) => {
                setWashTemp(Number(e.target.value));
                setIsPaused(true);
              }}
              className="flex-1 accent-[#245c77] cursor-pointer h-2 bg-charcoal-ink/05 rounded-full appearance-none"
            />
            <span className="text-3xs text-charcoal-ink/40 font-bold uppercase tracking-wider">80°C Max</span>
          </div>

          <div className="flex justify-between items-center text-xs font-semibold text-charcoal-ink/75">
            <span>Germ Survival Rate:</span>
            <span className={`text-sm font-black transition-colors duration-300 ${survivalPercent < 1 ? "text-[#245c77]" : "text-red-500"}`}>
              {survivalPercent}%
            </span>
          </div>

          <div className="h-2 w-full bg-charcoal-ink/05 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${100 - survivalPercent}%` }}
            />
          </div>

          <p className="text-3xs text-charcoal-ink/50 font-semibold uppercase tracking-wider leading-relaxed">
            * We promise to wash sheets in very hot water (60°C+) to kill all bugs.
          </p>
        </div>
      </div>
    );
  };

  const renderChakraSimulator = () => {
    const activeChakraData = chakras[activeChakra];
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 p-6 bg-alabaster-linen/60 backdrop-blur-sm border border-charcoal-ink/05 rounded-2xl mb-6 min-h-[220px] font-sans shadow-sm">
        {/* Visual Chakra Column */}
        <div className="sm:col-span-4 flex flex-row sm:flex-col items-center justify-between border-b sm:border-b-0 sm:border-r border-charcoal-ink/08 pb-4 sm:pb-0 pr-0 sm:pr-4">
          <span className="text-[9px] font-bold text-charcoal-ink/40 uppercase tracking-widest sm:mb-2">Body Focus</span>
          
          <div className="relative flex flex-row sm:flex-col items-center gap-3 sm:gap-1.5 py-1">
            <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 h-0.5 sm:top-2 sm:bottom-2 sm:left-1/2 sm:w-0.5 sm:h-auto sm:right-auto sm:translate-y-0 sm:-translate-x-1/2 -z-10 bg-charcoal-ink/10" />

            {chakras.map((chakra, idx) => {
              const isSel = idx === activeChakra;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveChakra(idx);
                    setIsPaused(true);
                  }}
                  className={`w-6.5 h-6.5 rounded-full flex items-center justify-center transition-all cursor-pointer ${chakra.color} ${
                    isSel ? `scale-125 ring-2 ring-white shadow-md ${chakra.glowColor}` : "opacity-40 hover:opacity-100 scale-95"
                  }`}
                  title={chakra.name}
                >
                  <div className={`w-2 h-2 bg-white rounded-full transition-transform ${isSel ? "scale-100" : "scale-0"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Chakra Details Content */}
        <div className="sm:col-span-8 flex flex-col justify-between space-y-4">
          <div>
            <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors duration-300 ${activeChakraData.effectColor}`}>
              Body Part {7 - activeChakra} of 7 • {activeChakraData.element}
            </span>
            <h4 className="text-xs sm:text-sm font-black text-charcoal-ink mt-0.5">{activeChakraData.name}</h4>
            <p className="text-[11px] sm:text-xs text-charcoal-ink/75 mt-2 leading-relaxed font-semibold">
              {activeChakraData.desc}
            </p>
          </div>
          
          <div className="pt-3 border-t border-charcoal-ink/08 text-[9px] text-charcoal-ink/40 font-bold uppercase tracking-wider">
            <span>Click any dot to see details.</span>
          </div>
        </div>
      </div>
    );
  };

  const renderMentalSimulator = () => {
    let scent = "Lavender & Fresh";
    let stressLevel = 10;
    let deepSleep = 98;
    let statusText = "Super Fresh Bed";
    let badgeColor = "bg-[#245c77]/10 text-[#245c77] border-[#245c77]/20";
 
    if (beddingAge >= 21) {
      scent = "Smells Smelly & Sticky";
      stressLevel = Math.min(95, 55 + (beddingAge - 14) * 2.5);
      deepSleep = Math.max(25, 60 - (beddingAge - 14) * 2.2);
      statusText = "Dirty sheets (Danger)";
      badgeColor = "bg-rose-500/10 text-rose-600 border-rose-500/20";
    } else if (beddingAge >= 14) {
      scent = "Smells Dusty";
      stressLevel = 35 + (beddingAge - 7) * 2.8;
      deepSleep = 75 - (beddingAge - 7) * 2.1;
      statusText = "Needs Wash Now";
      badgeColor = "bg-[#245c77]/15 text-[#245c77]/80 border-[#245c77]/15";
    } else if (beddingAge >= 7) {
      scent = "No Smell";
      stressLevel = 15 + (beddingAge - 3) * 3.5;
      deepSleep = 90 - (beddingAge - 3) * 2.5;
      statusText = "Needs Change Soon";
      badgeColor = "bg-[#245c77]/10 text-[#245c77] border-[#245c77]/20";
    } else if (beddingAge >= 3) {
      scent = "Smells Clean";
      stressLevel = 10 + (beddingAge - 1) * 2.5;
      deepSleep = 98 - (beddingAge - 1) * 2.0;
      statusText = "Very Comfortable";
      badgeColor = "bg-[#245c77]/10 text-[#245c77] border-[#245c77]/20";
    }

    stressLevel = Math.round(stressLevel);
    deepSleep = Math.round(deepSleep);

    return (
      <div className="space-y-5 p-6 bg-alabaster-linen/60 backdrop-blur-sm border border-charcoal-ink/05 rounded-2xl mb-6 font-sans">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-charcoal-ink/50 uppercase tracking-wider">Days since sheet change</span>
          <span className={`px-3 py-1 border text-[10px] font-black uppercase tracking-wider rounded-full transition-all duration-300 ${badgeColor}`}>
            {statusText}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-black text-charcoal-ink w-16">{beddingAge} {beddingAge === 1 ? "day" : "days"}</span>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={beddingAge}
              onChange={(e) => {
                setBeddingAge(Number(e.target.value));
                setIsPaused(true);
              }}
              className="flex-1 accent-[#245c77] cursor-pointer h-2 bg-charcoal-ink/05 rounded-full appearance-none"
            />
            <span className="text-3xs text-charcoal-ink/40 font-bold uppercase tracking-wider">30 Days</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-charcoal-ink/05 shadow-sm">
              <p className="text-[8px] text-charcoal-ink/40 font-bold uppercase tracking-wider mb-1">Smell</p>
              <p className="text-2xs font-extrabold text-charcoal-ink truncate leading-none">{scent}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-charcoal-ink/05 shadow-sm">
              <p className="text-[8px] text-charcoal-ink/40 font-bold uppercase tracking-wider mb-1">Stress Level</p>
              <p className={`text-2xs font-extrabold leading-none transition-colors duration-300 ${stressLevel > 50 ? "text-rose-500" : "text-charcoal-ink"}`}>
                +{stressLevel}%
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-charcoal-ink/05 shadow-sm">
              <p className="text-[8px] text-charcoal-ink/40 font-bold uppercase tracking-wider mb-1">Sleep Quality</p>
              <p className={`text-2xs font-extrabold leading-none transition-colors duration-300 ${deepSleep < 60 ? "text-rose-500" : "text-[#245c77]"}`}>
                {deepSleep}%
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="science" className="py-24 bg-alabaster-linen border-t border-b border-charcoal-ink/08 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-linen-gold/10 text-linen-gold border border-linen-gold/20 tracking-wider text-2xs uppercase font-extrabold">
            <span>Clean Bed Facts</span>
          </div>
          <h2 className="text-section-header">Why Clean Sheets are Good for You</h2>
          <p className="text-body text-charcoal-ink/65">
            Clean sheets help you breathe easily, protect your skin, and give you daily energy.
          </p>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Side: Selectors (Grid of Cards) */}
          <div className="lg:col-span-5 space-y-4">
            {pillars.map((pillar) => {
              const IconComp = pillar.icon;
              const isSelected = activeTab === pillar.id;

              return (
                <button
                  key={pillar.id}
                  onClick={() => {
                    setActiveTab(pillar.id);
                    setIsPaused(true);
                  }}
                  className={`w-full text-left p-5 sm:p-6 border transition-all duration-300 flex items-start gap-5 relative overflow-hidden cursor-pointer rounded-2xl ${
                    isSelected
                      ? "bg-white border-[#245c77]/20 shadow-[0_15px_30px_rgba(36,92,119,0.04)] translate-x-1"
                      : "bg-white/40 border-charcoal-ink/05 hover:bg-white hover:border-[#245c77]/10 hover:shadow-[0_10px_20px_rgba(0,0,0,0.01)]"
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 bg-[#245c77] transition-transform duration-300 ${
                      isSelected ? "scale-y-100" : "scale-y-0"
                    }`}
                  />

                  <div
                    className={`p-3.5 rounded-xl transition-all duration-300 ${
                      isSelected ? "bg-[#245c77]/10 text-[#245c77] scale-105" : "bg-charcoal-ink/05 text-charcoal-ink/40"
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif font-bold text-sm sm:text-base text-charcoal-ink">{pillar.title}</h3>
                      <span className="text-[9px] font-extrabold tracking-widest text-[#245c77] uppercase bg-[#245c77]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {pillar.metric} {pillar.label}
                      </span>
                    </div>
                    <p className="text-2xs sm:text-xs text-charcoal-ink/60 line-clamp-2 leading-relaxed font-semibold">{pillar.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Side: Detailed Focus Viewer */}
          <div className="lg:col-span-7">
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="bg-white/80 backdrop-blur-md border border-white rounded-[32px] p-6 sm:p-8 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[520px] shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
            >
              <div>
                {/* Header & Icon */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3.5 bg-charcoal-ink text-alabaster-linen rounded-2xl">
                    <ActivePillarIcon className="w-6 h-6 text-linen-gold" />
                  </div>
                  <div>
                    <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-black block">Health Proof</span>
                    <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-charcoal-ink">{activePillar.title}</h3>
                  </div>
                </div>

                {/* Big Stats Banner */}
                <div className="bg-gradient-to-r from-[#245c77]/08 to-[#245c77]/02 p-6 border border-[#245c77]/10 rounded-2xl mb-8 flex items-center justify-between shadow-xs">
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold font-serif text-[#245c77]">
                      {activePillar.metric}
                    </div>
                    <div className="text-[9px] font-black text-charcoal-ink/40 uppercase tracking-widest mt-1">Cleanliness Level</div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-xs uppercase tracking-widest font-black text-charcoal-ink bg-white/80 border border-charcoal-ink/05 px-3 py-1 rounded-full">{activePillar.label}</span>
                    <p className="text-3xs text-charcoal-ink/40 uppercase tracking-widest font-bold">True Verified Stat</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-charcoal-ink/75 leading-relaxed mb-6 font-semibold">
                  {activePillar.description}
                </p>

                {/* Live Simulator Widget Panel */}
                {activeTab === 0 && renderHealthSimulator()}
                {activeTab === 1 && renderHygieneSimulator()}
                {activeTab === 2 && renderChakraSimulator()}
                {activeTab === 3 && renderMentalSimulator()}

                {/* Checklist Title */}
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#245c77] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#245c77]" /> Core Benefits
                </h4>

                {/* Grid Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {activePillar.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#245c77]/10 text-[#245c77] flex items-center justify-center shrink-0">
                        <CheckIcon className="w-3 h-3" />
                      </div>
                      <span className="text-2xs sm:text-xs text-charcoal-ink/75 font-semibold uppercase tracking-wider leading-none">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Trigger */}
              <div className="mt-8 pt-6 border-t border-charcoal-ink/08 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-3xs text-charcoal-ink/40 font-bold tracking-widest">simple tips for healthy living</span>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1 text-2xs text-[#245c77] hover:text-charcoal-ink transition-all duration-300 hover:translate-x-1"
                >
                  Learn More
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
