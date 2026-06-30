"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("email"); // "email" or "mobile"
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP and Reset States
  const [loginMode, setLoginMode] = useState("password"); // "password", "otp", "reset"
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Check for oauth errors from redirect
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      if (oauthError === "oauth_denied") {
        setError("Google authentication was denied.");
      } else if (oauthError === "email_not_provided") {
        setError("Email was not provided by Google account.");
      } else if (oauthError === "token_exchange_failed") {
        setError("Failed to exchange tokens with Google.");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect === "pricing") {
      const bedType = searchParams.get("bedType");
      const planName = searchParams.get("planName");
      const price = searchParams.get("price");
      const duration = searchParams.get("duration");
      localStorage.setItem(
        "checkout_pending",
        JSON.stringify({ bedType, planName, price, duration })
      );
    }
  }, [searchParams]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    setError("");
    setSuccess("");
    const target = activeTab === "email" ? email : mobile;
    if (!target) {
      setError(`Please enter your ${activeTab === "email" ? "email address" : "mobile number"} first.`);
      return;
    }
    if (activeTab === "mobile" && target.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [activeTab]: target,
          purpose: loginMode === "reset" ? "reset_password" : "login",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send verification code.");
      }

      setSuccess("Verification code sent successfully.");
      setOtpSent(true);
      setCountdown(60);
      if (data.code) {
        setDevOtp(data.code);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const target = activeTab === "email" ? email : mobile;

    try {
      if (loginMode === "password") {
        const payload = { password };
        if (activeTab === "email") {
          if (!email) {
            setError("Email is required.");
            setLoading(false);
            return;
          }
          payload.email = email.toLowerCase();
        } else {
          if (!mobile || mobile.length !== 10) {
            setError("Please enter a valid 10-digit mobile number.");
            setLoading(false);
            return;
          }
          payload.mobile = mobile;
        }

        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Login failed");
        }

        setSuccess("Logged in successfully! Redirecting...");
        handleRedirect(data.user);
      } else if (loginMode === "otp") {
        if (!otpCode) {
          setError("Verification code is required.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/otp/verify-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            [activeTab]: target,
            code: otpCode,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Verification failed");
        }

        setSuccess("Logged in successfully! Redirecting...");
        handleRedirect(data.user);
      } else if (loginMode === "reset") {
        if (!otpCode || !newPassword) {
          setError("Verification code and new password are required.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/otp/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            [activeTab]: target,
            code: otpCode,
            newPassword,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to reset password.");
        }

        setSuccess("Password reset successfully! Redirecting to password login...");
        setDevOtp("");
        setOtpSent(false);
        setOtpCode("");
        setNewPassword("");
        setTimeout(() => {
          setLoginMode("password");
          setSuccess("");
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = (user) => {
    setTimeout(() => {
      const redirect = searchParams.get("redirect");
      if (redirect === "pricing") {
        const bedType = searchParams.get("bedType");
        const planName = searchParams.get("planName");
        const price = searchParams.get("price");
        const duration = searchParams.get("duration");
        router.push(`/?redirect=pricing&bedType=${bedType}&planName=${planName}&price=${price}&duration=${duration}`);
      } else if (user && user.role === "admin") {
        router.push("/admin");
      } else if (user && user.role === "warehouse") {
        router.push("/warehouse");
      } else if (user && user.role === "logistics") {
        router.push("/logistics");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    }, 1500);
  };

  return (
    <div className="bg-white rounded-none p-8 md:p-10 shadow-sm border border-charcoal-ink/10 max-w-[480px] w-full">
      
      {/* Title indicating mode */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-serif font-bold text-charcoal-ink">
          {loginMode === "password" && "Password Login"}
          {loginMode === "otp" && "Direct OTP Login"}
          {loginMode === "reset" && "Reset Forgotten Password"}
        </h2>
        <p className="text-2xs uppercase tracking-wider text-charcoal-ink/65 font-bold mt-1.5">
          {loginMode === "password" && "Enter password to access your account"}
          {loginMode === "otp" && "Verification code will be sent to your inbox"}
          {loginMode === "reset" && "Verify code to set a new password"}
        </p>
      </div>

      {/* Tab Selector for Email vs Mobile */}
      <div className="flex bg-alabaster-linen p-1 mb-6 border border-charcoal-ink/08 rounded-none">
        <button
          type="button"
          onClick={() => {
            setActiveTab("email");
            setError("");
            setOtpSent(false);
            setDevOtp("");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-2xs font-bold uppercase tracking-wider transition-all duration-300 rounded-none cursor-pointer ${
            activeTab === "email"
              ? "bg-charcoal-ink text-alabaster-linen"
              : "text-charcoal-ink/60 hover:text-charcoal-ink"
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("mobile");
            setError("");
            setOtpSent(false);
            setDevOtp("");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-2xs font-bold uppercase tracking-wider transition-all duration-300 rounded-none cursor-pointer ${
            activeTab === "mobile"
              ? "bg-charcoal-ink text-alabaster-linen"
              : "text-charcoal-ink/60 hover:text-charcoal-ink"
          }`}
        >
          Mobile
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-none bg-red-50 text-red-600 text-2xs uppercase tracking-wider font-bold border border-red-100 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 rounded-none bg-emerald-50 text-emerald-600 text-2xs uppercase tracking-wider font-bold border border-emerald-100 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}

      {/* Developer helper banner for OTP code */}
      {devOtp && (
        <div className="mb-6 p-4 rounded-none bg-linen-gold/10 border border-linen-gold/20 text-linen-gold text-2xs font-bold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-linen-gold animate-ping"></span>
            <span>[Dev Helper] Sent OTP: <strong className="text-charcoal-ink">{devOtp}</strong></span>
          </div>
          <button 
            type="button" 
            onClick={() => setOtpCode(devOtp)}
            className="text-[10px] bg-linen-gold hover:bg-charcoal-ink text-white px-2.5 py-1 rounded-none font-extrabold uppercase transition-colors shrink-0 cursor-pointer"
          >
            Autofill
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email or Mobile Input */}
        {activeTab === "email" ? (
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal-ink/40">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="email"
                required
                value={email}
                disabled={loading || (otpSent && loginMode !== "password")}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-charcoal-ink/15 rounded-none text-charcoal-ink placeholder-charcoal-ink/30 focus:outline-none focus:border-linen-gold transition-colors text-xs disabled:bg-alabaster-linen disabled:text-charcoal-ink/40"
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal-ink/40">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                maxLength="10"
                value={mobile}
                disabled={loading || (otpSent && loginMode !== "password")}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter your 10-digit mobile number"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-charcoal-ink/15 rounded-none text-charcoal-ink placeholder-charcoal-ink/30 focus:outline-none focus:border-linen-gold transition-colors text-xs disabled:bg-alabaster-linen disabled:text-charcoal-ink/40"
              />
            </div>
          </div>
        )}

        {/* Conditional Rendering of Fields based on Mode & OTP status */}
        
        {/* Mode A: Password Login */}
        {loginMode === "password" && (
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal-ink/40">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-charcoal-ink/15 rounded-none text-charcoal-ink placeholder-charcoal-ink/30 focus:outline-none focus:border-linen-gold transition-colors text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-charcoal-ink/40 hover:text-charcoal-ink transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Mode B & C: OTP sent fields */}
        {otpSent && (loginMode === "otp" || loginMode === "reset") && (
          <div className="space-y-4">
            {/* OTP Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal-ink/40">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-6.118 3.597m.124 10.337A11.954 11.954 0 0112 21.056c1.572 0 3.078-.302 4.462-.848M15 12H9m3 3V9" />
                </svg>
              </span>
              <input
                type="text"
                required
                maxLength="6"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit verification code"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-charcoal-ink/15 rounded-none text-charcoal-ink placeholder-charcoal-ink/30 focus:outline-none focus:border-linen-gold transition-colors text-xs"
              />
            </div>

            {/* If Reset Mode, also require new password */}
            {loginMode === "reset" && (
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal-ink/40">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-charcoal-ink/15 rounded-none text-charcoal-ink placeholder-charcoal-ink/30 focus:outline-none focus:border-linen-gold transition-colors text-xs"
                />
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        {/* If OTP Mode/Reset Mode and OTP not sent yet, show "Send OTP" button */}
        {!otpSent && (loginMode === "otp" || loginMode === "reset") ? (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-none bg-charcoal-ink hover:bg-linen-gold text-alabaster-linen font-bold text-xs uppercase tracking-widest transition-colors duration-305 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Verification Code
              </>
            )}
          </button>
        ) : (
          /* Main Submit Button (Handles Password Login, OTP verify, or Reset verify) */
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-none bg-charcoal-ink hover:bg-linen-gold text-alabaster-linen font-bold text-xs uppercase tracking-widest transition-colors duration-305 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {loginMode === "password" && `Login with ${activeTab === "email" ? "Email" : "Mobile"}`}
                {loginMode === "otp" && "Verify & Login"}
                {loginMode === "reset" && "Reset Password & Login"}
              </>
            )}
          </button>
        )}

        {/* Resend code countdown timer */}
        {otpSent && (loginMode === "otp" || loginMode === "reset") && (
          <div className="text-center mt-2">
            {countdown > 0 ? (
              <span className="text-2xs font-semibold text-charcoal-ink/50">Resend code in {countdown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-2xs font-bold text-linen-gold hover:underline cursor-pointer"
              >
                Resend Verification Code
              </button>
            )}
          </div>
        )}
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-charcoal-ink/08"></div>
        </div>
        <div className="relative flex justify-center text-[10px] font-bold text-charcoal-ink/40 uppercase tracking-widest">
          <span className="bg-white px-4">OR</span>
        </div>
      </div>

      {/* Mode Switchers */}
      <div className="flex flex-col gap-3.5 items-center justify-center text-xs font-bold text-charcoal-ink/60">
        {loginMode === "password" ? (
          <button
            type="button"
            onClick={() => {
              setLoginMode("otp");
              setError("");
              setSuccess("");
              setOtpSent(false);
              setDevOtp("");
            }}
            className="text-linen-gold hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            {/* Phone/OTP Icon */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Sign in using OTP code instead
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setLoginMode("password");
              setError("");
              setSuccess("");
              setOtpSent(false);
              setDevOtp("");
            }}
            className="text-linen-gold hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            {/* Key/Lock Icon */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-5 8a2 2 0 110-4 2 2 0 010 4zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Sign in using Password instead
          </button>
        )}

        {/* Google Authentication (Only visible in normal login states) */}
        {loginMode !== "reset" && (
          <Link
            href="/api/auth/google"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-none bg-white border border-charcoal-ink/15 text-charcoal-ink font-bold text-xs uppercase tracking-wider hover:bg-alabaster-linen transition-colors shadow-sm cursor-pointer mt-1"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.354 0 3.373 2.736 1.5 6.71l3.766 3.055z"
              />
              <path
                fill="#34A853"
                d="M16.04 15.345c-1.077.732-2.432 1.164-4.04 1.164a6.837 6.837 0 0 1-6.734-4.855L1.5 14.71C3.373 18.682 7.354 21.418 12 21.418c3.118 0 5.964-1.09 8.055-2.973l-4.015-3.1z"
              />
              <path
                fill="#4285F4"
                d="M23.836 12.236c0-.8-.073-1.573-.209-2.318H12v4.51h6.636a5.673 5.673 0 0 1-2.463 3.718l4.014 3.1c2.345-2.164 3.65-5.345 3.65-9.01z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 14.236a6.89 6.89 0 0 1-.355-2.236c0-.782.127-1.536.355-2.236L1.5 6.71A11.97 11.97 0 0 0 .5 12c0 1.9.445 3.7 1.236 5.29l3.53-3.054z"
              />
            </svg>
            Continue with Google
          </Link>
        )}
      </div>

      {/* Footer Links */}
      <div className="mt-8 space-y-4 text-center">
        <p className="text-xs font-bold text-charcoal-ink/60">
          Don't have an account?{" "}
          <Link href="/signup" className="text-linen-gold hover:underline font-extrabold">
            Sign up for free
          </Link>
        </p>

        <p className="text-2xs font-bold text-charcoal-ink/50 leading-relaxed px-4">
          Are you a Warehouse Manager or Logistics Partner?{" "}
          <Link href="/signup/staff" className="text-linen-gold hover:underline font-extrabold">
            Register here
          </Link>
        </p>

        {loginMode !== "reset" && (
          <div>
            <button
              type="button"
              onClick={() => {
                setLoginMode("reset");
                setError("");
                setSuccess("");
                setOtpSent(false);
                setDevOtp("");
              }}
              className="text-2xs font-bold text-charcoal-ink/40 hover:text-linen-gold transition-colors hover:underline cursor-pointer"
            >
              Forgot your password?
            </button>
          </div>
        )}

        {loginMode === "reset" && (
          <div>
            <button
              type="button"
              onClick={() => {
                setLoginMode("password");
                setError("");
                setSuccess("");
                setOtpSent(false);
                setDevOtp("");
              }}
              className="text-2xs font-extrabold text-linen-gold hover:underline cursor-pointer"
            >
              ← Back to login
            </button>
          </div>
        )}

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-2xs uppercase tracking-wider font-extrabold text-charcoal-ink/50 hover:text-charcoal-ink transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-alabaster-linen py-16 px-4 font-sans">
      <div className="w-full flex-grow flex flex-col justify-center items-center">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal-ink tracking-tight">
            Welcome Back
          </h1>
          <p className="text-2xs uppercase tracking-widest font-extrabold text-linen-gold">
            Sign in to your ClosetRush account
          </p>
        </div>

        {/* Login Card */}
        <Suspense
          fallback={
            <div className="bg-white rounded-none p-10 shadow-sm border border-charcoal-ink/10 max-w-[480px] w-full min-h-[400px] flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 text-linen-gold" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </div>

      {/* Footer Details */}
      <div className="w-full flex justify-center items-center gap-8 mt-12 text-2xs uppercase tracking-wider font-extrabold text-charcoal-ink/40">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-linen-gold"></span>
          Secure Login
        </span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-linen-gold"></span>
          Privacy Protected
        </span>
      </div>
    </div>
  );
}

