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
      badgeBg: "bg-red-50 text-red-600 border-red-150",
      icon: Trash2,
      iconColor: "text-red-500",
      bgColor: "bg-white"
    },
    {
      time: "11:00 AM",
      title: "The Drying Maze",
      desc: "Wet, heavy sheets draped over chairs, doors, and balconies. Clutters your living space for hours.",
      badge: "Space Cluttered",
      badgeBg: "bg-orange-50 text-orange-600 border-orange-150",
      icon: Wind,
      iconColor: "text-orange-500",
      bgColor: "bg-white"
    },
    {
      time: "03:00 PM",
      title: "The Ironing Battle",
      desc: "Struggling to iron massive king-size sheets. Tugging deep elastics to fit mattress corners.",
      badge: "Hassle Factor",
      badgeBg: "bg-orange-50 text-orange-600 border-orange-150",
      icon: Zap,
      iconColor: "text-orange-500",
      bgColor: "bg-white"
    },
    {
      time: "06:00 PM",
      title: "Half Weekend Lost",
      desc: "Hours wasted sorting, drying, and folding. Exhausted before the evening even begins.",
      badge: "Weekend Wasted",
      badgeBg: "bg-red-50 text-red-600 border-red-150",
      icon: Clock,
      iconColor: "text-red-500",
      bgColor: "bg-white"
    }
  ];
 
  const closetrushTimeline = [
    {
      time: "09:00 AM",
      title: "Doorstep Fresh Swap",
      desc: "Courier swaps last fortnight's dirty sheets for a sealed package of 60°C hot-washed, sanitized sheets.",
      badge: "Fortnight Swap",
      badgeBg: "bg-linen-gold/10 text-linen-gold border-linen-gold/20",
      icon: Package,
      iconColor: "text-linen-gold",
      bgColor: "bg-white border-linen-gold/10"
    },
    {
      time: "09:05 AM",
      title: "Reclaim Your Saturday",
      desc: "Go out for brunch, grab coffee with friends, read a book, or visit the spa. Your weekend is 100% yours.",
      badge: "Free Time",
      badgeBg: "bg-linen-gold/10 text-linen-gold border-linen-gold/20",
      icon: Coffee,
      iconColor: "text-linen-gold",
      bgColor: "bg-white border-linen-gold/10"
    },
    {
      time: "04:00 PM",
      title: "Zero Wrinkle Fitting",
      desc: "Bedding is pre-pressed and features 360° heavy-duty elastic bands. Hugs the mattress snugly in 2 minutes.",
      badge: "Zero Effort",
      badgeBg: "bg-linen-gold/10 text-linen-gold border-linen-gold/20",
      icon: CheckCircle2,
      iconColor: "text-linen-gold",
      bgColor: "bg-white border-linen-gold/10"
    },
    {
      time: "10:00 PM",
      title: "Hotel Luxury Sleep",
      desc: "Fall asleep on crisp, sanitized sheets. Zero chemical allergens, dust-free and smelling fresh.",
      badge: "Premium Comfort",
      badgeBg: "bg-linen-gold/20 text-linen-gold border-linen-gold/30",
      icon: Sparkles,
      iconColor: "text-linen-gold",
      bgColor: "bg-charcoal-ink border-charcoal-ink text-white"
    }
  ];
 
  return (
    <div className="w-full font-sans select-none space-y-12">
      {/* Intro Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center border-b border-charcoal-ink/08 pb-8 text-charcoal-ink">
        <div className="p-4 bg-red-500/03 border border-red-500/10 space-y-1">
          <span className="text-3xs uppercase tracking-widest text-red-500 font-bold block">Traditional Routine</span>
          <p className="font-serif text-2xl font-bold text-charcoal-ink">8 Hours Wasted</p>
          <p className="text-3xs text-charcoal-ink/50 font-bold uppercase tracking-wider">4 washes & iron chores every month</p>
        </div>
        <div className="p-4 bg-linen-gold/05 border border-linen-gold/20 space-y-1">
          <span className="text-3xs uppercase tracking-widest text-linen-gold font-bold block">ClosetRush Standard</span>
          <p className="font-serif text-2xl font-bold text-linen-gold">0 Minutes Spent</p>
          <p className="text-3xs text-charcoal-ink/50 font-bold uppercase tracking-wider">Automated swaps on your schedule</p>
        </div>
      </div>
 
      {/* Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative">
        {/* Desktop Vertical Center Divider */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-charcoal-ink/08 -translate-x-1/2" />
 
        {/* Traditional Timeline Column */}
        <div className="space-y-8 relative">
          <div className="flex items-center gap-3 border-b border-charcoal-ink/08 pb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-charcoal-ink/80">
              Month Without ClosetRush
            </h3>
          </div>
 
          <div className="relative border-l border-charcoal-ink/08 pl-6 ml-3 space-y-8">
            {traditionalTimeline.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative group">
                  {/* Timeline bullet node */}
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  </span>
 
                  {/* Timeline Card */}
                  <div className={`p-6 border border-charcoal-ink/08 shadow-sm transition-all duration-300 hover:shadow-md hover:border-charcoal-ink/15 ${item.bgColor}`}>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="text-[10px] font-black text-charcoal-ink/40 uppercase tracking-widest leading-none">
                        {item.time}
                      </span>
                      <span className={`px-2 py-0.5 border text-[9px] font-extrabold uppercase tracking-wider rounded-none leading-none ${item.badgeBg}`}>
                        {item.badge}
                      </span>
                    </div>
 
                    <div className="flex items-start gap-4 mt-3">
                      <div className="p-2.5 bg-slate-50 border border-charcoal-ink/05 rounded-none text-charcoal-ink shrink-0">
                        <Icon className={`w-5 h-5 ${item.iconColor}`} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-charcoal-ink uppercase tracking-wider">
                          {item.title}
                        </h4>
                        <p className="text-2xs sm:text-xs text-charcoal-ink/60 leading-relaxed font-semibold">
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
          <div className="flex items-center gap-3 border-b border-charcoal-ink/08 pb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-linen-gold animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider text-linen-gold">
              Month With ClosetRush
            </h3>
          </div>
 
          <div className="relative border-l border-charcoal-ink/08 pl-6 ml-3 space-y-8">
            {closetrushTimeline.map((item, idx) => {
              const Icon = item.icon;
              const isDark = item.bgColor.includes("bg-charcoal-ink");
              return (
                <div key={idx} className="relative group">
                  {/* Timeline bullet node */}
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-linen-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="w-1.5 h-1.5 rounded-full bg-linen-gold" />
                  </span>
 
                  {/* Timeline Card */}
                  <div className={`p-6 border shadow-sm transition-all duration-300 hover:shadow-md ${
                    isDark 
                      ? "bg-charcoal-ink border-charcoal-ink text-white hover:border-black shadow-lg" 
                      : `hover:border-linen-gold/30 ${item.bgColor}`
                  }`}>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${isDark ? "text-white/40" : "text-charcoal-ink/40"}`}>
                        {item.time}
                      </span>
                      <span className={`px-2 py-0.5 border text-[9px] font-extrabold uppercase tracking-wider rounded-none leading-none ${item.badgeBg}`}>
                        {item.badge}
                      </span>
                    </div>
 
                    <div className="flex items-start gap-4 mt-3">
                      <div className={`p-2.5 border rounded-none shrink-0 ${isDark ? "bg-white/05 border-white/10" : "bg-linen-gold/05 border-linen-gold/10"}`}>
                        <Icon className={`w-5 h-5 ${item.iconColor}`} />
                      </div>
                      <div className="space-y-1">
                        <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? "text-linen-gold" : "text-charcoal-ink"}`}>
                          {item.title}
                        </h4>
                        <p className={`text-2xs sm:text-xs leading-relaxed font-semibold ${isDark ? "text-white/70" : "text-charcoal-ink/65"}`}>
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
      <div className="bg-linen-gold/05 border border-linen-gold/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-charcoal-ink">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-xs font-black uppercase tracking-wider text-charcoal-ink flex items-center justify-center md:justify-start gap-1.5">
            <Moon className="w-4 h-4 text-linen-gold animate-pulse" /> Sleep Fresh. Effortlessly.
          </h4>
          <p className="text-2xs text-charcoal-ink/60 leading-relaxed font-semibold">
            Join thousands of smart subscribers who reclaimed their weekends and sleep on pristine hotel-grade bedding.
          </p>
        </div>
        <a 
          href="#pricing"
          className="px-6 py-3 bg-charcoal-ink hover:bg-linen-gold text-white font-bold text-xs uppercase tracking-widest transition-colors shrink-0 cursor-pointer"
        >
          Explore Membership Options →
        </a>
      </div>
    </div>
  );
}
