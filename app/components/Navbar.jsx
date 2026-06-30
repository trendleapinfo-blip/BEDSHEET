"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MenuIcon, CloseIcon } from "./Icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "The Realization", href: "#home" },
    { name: "The Science", href: "#science" },
    { name: "The Experience", href: "#experience" },
    { name: "Value Visualizer", href: "/value-visualizer", isRoute: true },
    { name: "The Membership", href: "#pricing" },
  ];

  const handleScrollTo = (e, href, isRoute) => {
    setIsOpen(false);
    if (isRoute) {
      return;
    }
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // height of fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      window.location.href = "/" + href;
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-alabaster-linen/80 backdrop-blur-md border-b border-charcoal-ink/08 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <a
              href="#home"
              onClick={(e) => handleScrollTo(e, "#home")}
              className="flex items-center space-x-2 text-linen-gold font-serif text-xl sm:text-2xl font-bold tracking-[0.1em] uppercase transition-transform hover:scale-102"
            >
              <span>ClosetRush</span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.isRoute) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-charcoal-ink/80 font-medium text-xs tracking-wider uppercase transition-colors duration-300 hover:text-linen-gold"
                  >
                    {item.name}
                  </Link>
                );
              }
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href, false)}
                  className="text-charcoal-ink/80 font-medium text-xs tracking-wider uppercase transition-colors duration-300 hover:text-linen-gold"
                >
                  {item.name}
                </a>
              );
            })}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center space-x-6">
            {!loading && user ? (
              <div className="flex items-center space-x-4">
                {user.role === "warehouse" ? (
                  <Link
                    href="/warehouse"
                    className="inline-flex items-center justify-center px-4 py-2 bg-charcoal-ink text-alabaster-linen hover:bg-linen-gold text-2xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer"
                  >
                    Warehouse
                  </Link>
                ) : user.role === "logistics" ? (
                  <Link
                    href="/logistics"
                    className="inline-flex items-center justify-center px-4 py-2 bg-charcoal-ink text-alabaster-linen hover:bg-linen-gold text-2xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer"
                  >
                    Logistics
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-4 py-2 bg-charcoal-ink text-alabaster-linen hover:bg-linen-gold text-2xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center justify-center px-4 py-2 border border-charcoal-ink/20 text-charcoal-ink hover:bg-charcoal-ink hover:text-alabaster-linen text-2xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-charcoal-ink/70 font-semibold text-xs uppercase tracking-wider">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-4 py-2 border border-charcoal-ink/10 text-2xs font-bold uppercase tracking-wider rounded-none text-charcoal-ink/60 hover:border-charcoal-ink/30 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-charcoal-ink/80 hover:text-linen-gold font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-6 py-2.5 border border-charcoal-ink text-xs font-bold uppercase tracking-widest rounded-none text-alabaster-linen bg-charcoal-ink hover:bg-linen-gold hover:border-linen-gold transition-all duration-300 hover:-translate-y-0.5"
                >
                  Subscribe
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-none text-charcoal-ink hover:text-linen-gold focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden absolute top-full inset-x-0 bg-alabaster-linen border-b border-charcoal-ink/08 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-4 pb-6 space-y-3 bg-alabaster-linen">
          {navItems.map((item) => {
            if (item.isRoute) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-xs font-bold uppercase tracking-wider text-charcoal-ink/80 hover:text-linen-gold transition-all"
                >
                  {item.name}
                </Link>
              );
            }
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href, false)}
                className="block px-3 py-2 text-xs font-bold uppercase tracking-wider text-charcoal-ink/80 hover:text-linen-gold transition-all"
              >
                {item.name}
              </a>
            );
          })}
          <div className="pt-4 border-t border-charcoal-ink/08 px-3 space-y-2">
            {!loading && user ? (
              <div className="flex flex-col space-y-2">
                {user.role === "warehouse" ? (
                  <Link
                    href="/warehouse"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-alabaster-linen bg-charcoal-ink hover:bg-linen-gold transition-all"
                  >
                    Warehouse
                  </Link>
                ) : user.role === "logistics" ? (
                  <Link
                    href="/logistics"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-alabaster-linen bg-charcoal-ink hover:bg-linen-gold transition-all"
                  >
                    Logistics
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-alabaster-linen bg-charcoal-ink hover:bg-linen-gold transition-all"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-charcoal-ink bg-transparent border border-charcoal-ink/20 hover:bg-charcoal-ink/10 transition-all"
                  >
                    Admin Panel
                  </Link>
                )}
                <span className="block px-3 py-1 text-2xs uppercase tracking-wider font-semibold text-charcoal-ink/50">
                  Logged in as {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-charcoal-ink bg-transparent border border-charcoal-ink/10 hover:bg-charcoal-ink/05 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-charcoal-ink bg-transparent border border-charcoal-ink/10 hover:bg-charcoal-ink/05 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-alabaster-linen bg-charcoal-ink hover:bg-linen-gold transition-all"
                >
                  Subscribe
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
