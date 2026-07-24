"use client";
import React, { useState, useEffect } from "react";
import { Bell, BellRing, Loader2 } from "lucide-react";

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        setIsSubscribed(true);
      }
    } catch (err) {
      console.error("Error checking push subscription:", err);
    }
  };

  const subscribeToPush = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      // 1. Request Permission
      if (Notification.permission === "denied") {
        setMessage("Notifications are blocked by your device/browser. Please go to Settings > Site Settings and allow notifications.");
        setIsLoading(false);
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMessage("Permission denied. Please allow notifications in your browser settings.");
        setIsLoading(false);
        return;
      }

      // 2. Get VAPID Public Key
      const vapidRes = await fetch("/api/vapid");
      const vapidData = await vapidRes.json();
      
      if (!vapidData.success) {
        setMessage("Failed to get push configuration.");
        setIsLoading(false);
        return;
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidData.publicKey);

      // 3. Subscribe to Push Manager
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      // 4. Send subscription to our backend
      const response = await fetch("/api/user/subscribe-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      const result = await response.json();
      if (result.success) {
        setIsSubscribed(true);
        setMessage("Successfully subscribed to notifications!");
      } else {
        setMessage(result.error || "Failed to save subscription.");
      }
    } catch (err) {
      console.error("Subscription failed:", err);
      setMessage("An error occurred during subscription.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null; // Don't show anything if push is not supported
  }

  return (
    <div className="pt-4 mt-4 border-t border-charcoal-ink/10 flex flex-col gap-2">
      {isSubscribed ? (
        <div className="w-full flex flex-col items-center justify-center gap-1 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
            <BellRing className="w-4 h-4" />
            Notifications Enabled
          </div>
          <p className="text-[9px] text-emerald-600 font-medium">You will receive important updates.</p>
        </div>
      ) : (
        <button
          onClick={subscribeToPush}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-charcoal-ink hover:bg-charcoal-ink/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Bell className="w-4 h-4" />
          )}
          {isLoading ? "Enabling..." : "Enable Notifications"}
        </button>
      )}
      {message && !isSubscribed && (
        <p className="text-[10px] text-rose-500 font-semibold text-center mt-1">{message}</p>
      )}
    </div>
  );
}
