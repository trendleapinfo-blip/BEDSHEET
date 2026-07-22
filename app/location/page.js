"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function LocationPage() {
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

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0D1518] font-sans">
      <Navbar user={user} loading={loading} handleLogout={handleLogout} forceSolid={true} />
      
      <main className="pt-32 pb-24 max-w-[1200px] mx-auto px-6 sm:px-12">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#05D4B5] font-mono">
            Where We Serve
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#0D1518]">
            Our Locations
          </h1>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            ClosetRush is currently operating in select cities. We're constantly expanding our network to bring effortless bedsheet replacements to more people.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example Location Card */}
          <div className="bg-white border border-[#0D1518]/06 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-serif text-2xl font-bold text-[#0D1518] mb-2">Bangalore</h3>
            <p className="text-sm text-gray-500">Currently serving all major zones.</p>
            <div className="mt-6">
              <span className="inline-block px-3 py-1 bg-[#05D4B5]/10 text-[#05D4B5] text-xs font-bold rounded-full">
                Active Now
              </span>
            </div>
          </div>
          
          <div className="bg-white/50 border border-[#0D1518]/06 p-8 rounded-3xl">
            <h3 className="font-serif text-2xl font-bold text-[#0D1518] mb-2 text-opacity-50">Mumbai</h3>
            <p className="text-sm text-gray-400">Expanding soon to your city.</p>
            <div className="mt-6">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
                Coming Soon
              </span>
            </div>
          </div>

          <div className="bg-white/50 border border-[#0D1518]/06 p-8 rounded-3xl">
            <h3 className="font-serif text-2xl font-bold text-[#0D1518] mb-2 text-opacity-50">Delhi NCR</h3>
            <p className="text-sm text-gray-400">Expanding soon to your city.</p>
            <div className="mt-6">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
