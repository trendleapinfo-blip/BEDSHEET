"use client";

import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up.
    setDeferredPrompt(null);
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
  };

  if (isInstalled || !deferredPrompt) {
    return null; // Don't show anything if already installed or not supported/ready
  }

  return (
    <button
      onClick={handleInstallClick}
      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest rounded-full text-[#032026] bg-[#05D4B5] hover:bg-white hover:text-[#032026] hover:border-[#05D4B5] border border-[#05D4B5] transition-all duration-300 shadow-md shadow-[#05D4B5]/20 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
      title="Install ClosetRush App"
    >
      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <span className="hidden sm:inline">Install App</span>
      <span className="inline sm:hidden">Install</span>
    </button>
  );
}
