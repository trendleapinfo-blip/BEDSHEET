"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MenuIcon, CloseIcon } from "./Icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sectionIds = ["home", "products", "experience", "science", "pricing"];
    const options = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    const handleScroll = () => {
      if (window.scrollY < 80) {
        setActiveSection("home");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    { name: "The Catalog", href: "#products" },
    { name: "The Experience", href: "#experience" },
    { name: "The Science", href: "#science" },
    { name: "The Membership", href: "#pricing" },
    { name: "Value Visualizer", href: "/value-visualizer", isRoute: true },
    { name: "About", href: "/about", isRoute: true },
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
      className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out ${
        scrolled
          ? "top-4 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1380px] bg-alabaster-linen/90 backdrop-blur-md border border-[#245c77]/10 shadow-[0_12px_30px_rgba(15,26,28,0.08)] py-2 rounded-full"
          : "top-0 w-full max-w-none bg-transparent border-b border-transparent py-6 rounded-none"
      }`}
    >
      <div className={`transition-all duration-500 ${
        scrolled ? "w-full px-6 sm:px-10 md:px-12" : "max-w-[1380px] mx-auto w-full px-4 sm:px-6 lg:px-8"
      }`}>
        <div className="flex items-center justify-between h-10">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center whitespace-nowrap">
            <a
              href="#home"
              onClick={(e) => handleScrollTo(e, "#home")}
              className="flex items-center space-x-2 text-linen-gold font-serif text-xl sm:text-2xl font-bold tracking-[0.1em] uppercase transition-transform hover:scale-102"
            >
              <span>ClosetRush</span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className={`hidden md:flex items-center transition-all duration-500 ${
            scrolled ? "space-x-2.5 lg:space-x-3.5 xl:space-x-4.5" : "space-x-6 lg:space-x-8"
          }`}>
            {navItems.map((item) => {
              const isActive = item.href === "#" + activeSection;
              if (item.isRoute) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`font-semibold tracking-wider uppercase transition-colors duration-300 hover:text-linen-gold whitespace-nowrap ${
                      scrolled ? "text-[10px] xl:text-[11px]" : "text-xs text-charcoal-ink/80"
                    }`}
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
                  className={`relative font-semibold tracking-wider uppercase transition-all duration-300 pb-1 whitespace-nowrap ${
                    scrolled ? "text-[10px] xl:text-[11px]" : "text-xs"
                  } ${
                    isActive 
                      ? "text-linen-gold font-bold" 
                      : "text-charcoal-ink/80 hover:text-linen-gold"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-linen-gold rounded-full animate-in fade-in zoom-in duration-300" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Desktop CTA Button */}
          <div className={`hidden md:flex items-center transition-all duration-500 ${
            scrolled ? "space-x-2 lg:space-x-3" : "space-x-4 lg:space-x-6"
          }`}>
            {!loading && user ? (
              <div className={`flex items-center transition-all duration-500 ${
                scrolled ? "space-x-2 lg:space-x-3" : "space-x-4"
              }`}>
                {user.role === "warehouse" ? (
                  <Link
                    href="/warehouse"
                    className="inline-flex items-center justify-center px-4 py-2 bg-charcoal-ink text-alabaster-linen hover:bg-linen-gold text-2xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer whitespace-nowrap"
                  >
                    Warehouse
                  </Link>
                ) : user.role === "logistics" ? (
                  <Link
                    href="/logistics"
                    className="inline-flex items-center justify-center px-4 py-2 bg-charcoal-ink text-alabaster-linen hover:bg-linen-gold text-2xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer whitespace-nowrap"
                  >
                    Logistics
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-4 py-2 bg-charcoal-ink text-alabaster-linen hover:bg-[#245c77] text-2xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer whitespace-nowrap"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center justify-center px-4 py-2 border border-charcoal-ink/20 text-charcoal-ink hover:bg-charcoal-ink hover:text-alabaster-linen text-2xs font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer whitespace-nowrap"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-charcoal-ink/70 font-bold text-2xs lg:text-xs uppercase tracking-wider whitespace-nowrap">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-4 py-2 border border-charcoal-ink/10 text-2xs font-bold uppercase tracking-wider rounded-none text-charcoal-ink/60 hover:border-charcoal-ink/30 transition-all cursor-pointer whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-charcoal-ink/80 hover:text-linen-gold font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-6 py-2.5 border border-charcoal-ink text-xs font-bold uppercase tracking-widest rounded-none text-alabaster-linen bg-charcoal-ink hover:bg-linen-gold hover:border-linen-gold transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
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
        className={`md:hidden absolute top-[calc(100%+0.5rem)] inset-x-0 bg-alabaster-linen/95 backdrop-blur-md border border-charcoal-ink/08 rounded-3xl shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-4 pb-6 space-y-3 bg-alabaster-linen">
          {navItems.map((item) => {
            const isActive = item.href === "#" + activeSection;
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
                className={`block px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all border-l-2 ${
                  isActive 
                    ? "text-linen-gold border-linen-gold bg-linen-gold/05 pl-4" 
                    : "text-charcoal-ink/80 border-transparent hover:text-linen-gold hover:border-linen-gold/30"
                }`}
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
