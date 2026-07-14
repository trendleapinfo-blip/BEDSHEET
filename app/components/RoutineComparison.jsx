"use client";
 
import React from "react";
import { 
  Clock, 
  Trash2, 
  Wind, 
  Moon, 
  Package, 
  Coffee, 
  CheckCircle2, 
  Sparkles,
  Zap
} from "lucide-react";
 
export default function RoutineComparison() {
  const traditionalTimeline = [
    {
      time: "09:00 AM",
      title: "The Strip & Sort",
      desc: "Remove dirty bedding. Sort heavy cotton sheets from light clothes. Start the first laundry cycle.",
      badge: "Chore Start",
      badgeBg: "bg-rose-50 text-rose-600 border-rose-100",
      icon: Trash2,
      iconColor: "text-rose-500",
      bgColor: "bg-white"
    },
    {
      time: "11:00 AM",
      title: "The Drying Maze",
      desc: "Wet, heavy sheets draped over chairs, doors, and balconies. Clutters your living space for hours.",
      badge: "Space Cluttered",
      badgeBg: "bg-amber-50 text-amber-600 border-amber-100",
      icon: Wind,
      iconColor: "text-amber-500",
      bgColor: "bg-white"
    },
    {
      time: "03:00 PM",
      title: "The Ironing Battle",
      desc: "Struggling to iron massive sheets. Tugging deep elastics to fit mattress corners.",
      badge: "Hassle Factor",
      badgeBg: "bg-amber-50 text-amber-600 border-amber-100",
      icon: Zap,
      iconColor: "text-amber-500",
      bgColor: "bg-white"
    },
    {
      time: "06:00 PM",
      title: "Half Weekend Lost",
      desc: "Hours wasted sorting, drying, and folding. Exhausted before the evening even begins.",
      badge: "Weekend Wasted",
      badgeBg: "bg-rose-50 text-rose-600 border-rose-100",
      icon: Clock,
      iconColor: "text-rose-500",
      bgColor: "bg-white"
    }
  ];
 
  const closetrushTimeline = [
    {
      time: "09:00 AM",
      title: "Doorstep Fresh Swap",
      desc: "Courier swaps last fortnight's dirty sheets for a sealed package of 60°C hot-washed, sanitized sheets.",
      badge: "Fortnight Swap",
      badgeBg: "bg-[#1A4F54]/10 text-[#1A4F54] border-[#1A4F54]/20",
      icon: Package,
      iconColor: "text-[#1A4F54]",
      bgColor: "bg-white border-[#1A4F54]/10"
    },
    {
      time: "09:05 AM",
      title: "Reclaim Your Saturday",
      desc: "Go out for brunch, grab coffee with friends, read a book, or visit the spa. Your weekend is 100% yours.",
      badge: "Free Time",
      badgeBg: "bg-[#1A4F54]/10 text-[#1A4F54] border-[#1A4F54]/20",
      icon: Coffee,
      iconColor: "text-[#1A4F54]",
      bgColor: "bg-white border-[#1A4F54]/10"
    },
    {
      time: "04:00 PM",
      title: "Zero Wrinkle Fitting",
      desc: "Bedding is pre-pressed and features 360° heavy-duty elastic bands. Hugs the mattress snugly in 2 minutes.",
      badge: "Zero Effort",
      badgeBg: "bg-[#1A4F54]/10 text-[#1A4F54] border-[#1A4F54]/20",
      icon: CheckCircle2,
      iconColor: "text-[#1A4F54]",
      bgColor: "bg-white border-[#1A4F54]/10"
    },
    {
      time: "10:00 PM",
      title: "Hotel Luxury Sleep",
      desc: "Fall asleep on crisp, sanitized sheets. Zero chemical allergens, dust-free and smelling fresh.",
      badge: "Premium Comfort",
      badgeBg: "bg-[#C5A376]/20 text-[#C5A376] border-[#C5A376]/30",
      icon: Sparkles,
      iconColor: "text-[#C5A376]",
      bgColor: "bg-[#0B1315] border-[#0B1315] text-[#FAF9F6]"
    }
  ];
 
  return (
    <div className="w-full font-sans select-none space-y-12">
      {/* Intro Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center border-b border-[#0D1518]/08 pb-8 text-[#0D1518]">
        <div className="p-6 bg-rose-500/03 border border-rose-500/10 rounded-2xl space-y-1">
          <span className="text-3xs uppercase tracking-widest text-rose-500 font-bold block">Traditional Routine</span>
          <p className="font-serif text-3xl font-bold text-[#0D1518]">8 Hours Wasted</p>
          <p className="text-3xs text-[#0D1518]/50 font-bold uppercase tracking-wider">4 washes & iron chores every month</p>
        </div>
        <div className="p-6 bg-[#C5A376]/05 border border-[#C5A376]/20 rounded-2xl space-y-1">
          <span className="text-3xs uppercase tracking-widest text-[#C5A376] font-bold block">ClosetRush Standard</span>
          <p className="font-serif text-3xl font-bold text-[#C5A376]">0 Minutes Spent</p>
          <p className="text-3xs text-[#0D1518]/50 font-bold uppercase tracking-wider">Automated swaps on your schedule</p>
        </div>
      </div>
 
      {/* Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative">
        {/* Desktop Vertical Center Divider */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#0D1518]/08 -translate-x-1/2" />
 
        {/* Traditional Timeline Column */}
        <div className="space-y-8 relative">
          <div className="flex items-center gap-3 border-b border-[#0D1518]/08 pb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0D1518]/80">
              Month Without ClosetRush
            </h3>
          </div>
 
          <div className="relative border-l border-[#0D1518]/08 pl-6 ml-3 space-y-8">
            {traditionalTimeline.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative group">
                  {/* Timeline bullet node */}
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  </span>
 
                  {/* Timeline Card */}
                  <div className={`p-6 border border-[#0D1518]/06 rounded-2xl shadow-xs transition-all duration-450 hover:shadow-md hover:-translate-y-1 hover:border-rose-300 ${item.bgColor}`}>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                        {item.time}
                      </span>
                      <span className={`px-2 py-0.5 border text-[9px] font-extrabold uppercase tracking-wider rounded-full leading-none ${item.badgeBg}`}>
                        {item.badge}
                      </span>
                    </div>
 
                    <div className="flex items-start gap-4 mt-3">
                      <div className="p-2.5 bg-slate-50 border border-[#0D1518]/05 rounded-xl text-[#0D1518] shrink-0">
                        <Icon className={`w-5 h-5 ${item.iconColor}`} />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-black text-[#0D1518] uppercase tracking-wider">
                          {item.title}
                        </h4>
                        <p className="text-2xs sm:text-xs text-[#0D1518]/60 leading-relaxed font-semibold">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
 
        {/* ClosetRush Timeline Column */}
        <div className="space-y-8 relative">
          <div className="flex items-center gap-3 border-b border-[#0D1518]/08 pb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A376] animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#C5A376]">
              Month With ClosetRush
            </h3>
          </div>
 
          <div className="relative border-l border-[#0D1518]/08 pl-6 ml-3 space-y-8">
            {closetrushTimeline.map((item, idx) => {
              const Icon = item.icon;
              const isDark = item.bgColor.includes("bg-[#0B1315]");
              return (
                <div key={idx} className="relative group">
                  {/* Timeline bullet node */}
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#1A4F54] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A4F54]" />
                  </span>
 
                  {/* Timeline Card */}
                  <div className={`p-6 border shadow-xs transition-all duration-450 hover:shadow-lg hover:-translate-y-1 ${
                    isDark 
                      ? "bg-[#0B1315] border-[#0B1315] text-[#FAF9F6] hover:border-black shadow-lg" 
                      : `hover:border-[#1A4F54]/30 rounded-2xl ${item.bgColor}`
                  } ${!isDark ? "rounded-2xl border-[#0D1518]/06" : "rounded-2xl"}`}>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${isDark ? "text-white/40" : "text-gray-400"}`}>
                        {item.time}
                      </span>
                      <span className={`px-2 py-0.5 border text-[9px] font-extrabold uppercase tracking-wider rounded-full leading-none ${item.badgeBg}`}>
                        {item.badge}
                      </span>
                    </div>
 
                    <div className="flex items-start gap-4 mt-3">
                      <div className={`p-2.5 border rounded-xl shrink-0 ${isDark ? "bg-white/05 border-white/10" : "bg-[#1A4F54]/05 border-[#1A4F54]/10"}`}>
                        <Icon className={`w-5 h-5 ${item.iconColor}`} />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? "text-[#C5A376]" : "text-[#0D1518]"}`}>
                          {item.title}
                        </h4>
                        <p className={`text-2xs sm:text-xs leading-relaxed font-semibold ${isDark ? "text-white/70" : "text-[#0D1518]/65"}`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
 
      {/* Bottom Summary Callout */}
      <div className="bg-[#C5A376]/05 border border-[#C5A376]/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[#0D1518] rounded-2xl">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#0D1518] flex items-center justify-center md:justify-start gap-2">
            <Moon className="w-4 h-4 text-[#C5A376]" /> Sleep Fresh. Effortlessly.
          </h4>
          <p className="text-2xs text-[#0D1518]/60 leading-relaxed font-semibold">
            Join thousands of smart subscribers who reclaimed their weekends and sleep on pristine hotel-grade bedding.
          </p>
        </div>
        <a 
          href="#pricing"
          className="px-6 py-3.5 bg-[#0B1315] hover:bg-[#C5A376] hover:text-[#0B1315] text-white font-bold text-xs uppercase tracking-widest transition-all rounded-full shrink-0 cursor-pointer shadow-md"
        >
          Explore Membership Options →
        </a>
      </div>
    </div>
  );
}
