"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bed,
  Layers,
  Truck,
  ShieldCheck,
  Check,
  X,
  User as UserIcon,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Lock,
  Sparkles,
  AlertCircle,
  RefreshCw,
  FileText,
  Building,
  ArrowRight,
  ChevronRight,
  ClipboardList,
  Download,
  Maximize,
  ListChecks,
  ChevronDown
} from "lucide-react";
import Navbar from "../components/Navbar";

const BED_SIZES = [
  { id: "6x3", name: "6x3 (Single)", label: "Single" },
  { id: "6x4", name: "6x4 (Double)", label: "Double" },
  { id: "6x5", name: "6x5 (Queen)", label: "Queen" },
  { id: "6x6", name: "6x6 (King)", label: "King" }
];

export default function ShopPage() {
  const router = useRouter();

  // Configuration States (Rentickle Configurator)
  const [customerType, setCustomerType] = useState("B2C"); // "B2C" (Individual) | "B2B" (Business)
  const [selectedBedType, setSelectedBedType] = useState("Bedsheet + Pillow (Double)");
  const [color, setColor] = useState("Classic White");
  const [selectedDuration, setSelectedDuration] = useState("1 Month");
  const [planType, setPlanType] = useState("Monthly"); // "Monthly" | "Advance"

  // User session state
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [plans, setPlans] = useState([]);
  const [productColors, setProductColors] = useState([]);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [settings, setSettings] = useState(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
          if (data.settings.paymentStyles && data.settings.paymentStyles.length > 0) {
            const hasMonthly = data.settings.paymentStyles.some(s => s.id === "Monthly");
            setPlanType(hasMonthly ? "Monthly" : data.settings.paymentStyles[0].id);
          }
        }
      }
    } catch (err) {
      console.error("Fetch settings error in shop:", err);
    }
  };

  const fetchColors = async () => {
    try {
      const res = await fetch("/api/colors");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.colors) {
          setProductColors(data.colors);
        }
      }
    } catch (err) {
      console.error("Fetch product colors error in shop:", err);
    }
  };

  // Fetch plans from database
  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.plans) {
          setPlans(data.plans);
        }
      }
    } catch (err) {
      console.error("Fetch plans error in shop:", err);
    } finally {
      setLoadingPlans(false);
    }
  };

  // Fetch user session
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          // Auto-fill profile states from user details
          setProfileName(data.user.name || "");
          setProfileEmail(data.user.email || "");
          setProfilePhone(data.user.mobile || "");
          setProfileAddress(data.user.address || "");
          setProfilePincode(data.user.pincode || "");

          // B2B Auto-fills
          setB2bOwnerName(data.user.name || "");
          setB2bContactPerson(data.user.name || "");
          setB2bPropertyName((data.user.name || "") + " Hospitality");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSession(false);
    }
  };

  useEffect(() => {
    fetchSession();
    fetchPlans();
    fetchColors();
    fetchSettings();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type");
      if (type === "B2B") {
        setCustomerType("B2B");
      }
    }
    // Load Razorpay checkout script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // Sync selectedBedType when plans load
  useEffect(() => {
    if (plans.length > 0) {
      const uniqueBedTypes = Array.from(new Set(plans.map(p => p.bedType)));
      if (uniqueBedTypes.length > 0 && !uniqueBedTypes.includes(selectedBedType)) {
        setSelectedBedType(uniqueBedTypes[0]);
      }
    }
  }, [plans]);

  // Sync selectedDuration when selectedBedType changes
  useEffect(() => {
    if (plans.length > 0) {
      const activeDurations = plans
        .filter(p => p.bedType === selectedBedType)
        .map(p => p.duration);
      if (activeDurations.length > 0) {
        if (!activeDurations.includes(selectedDuration)) {
          setSelectedDuration(activeDurations[0]);
        }
      }
    }
  }, [selectedBedType, plans]);

  const getFallbackColors = () => {
    const isSingle = selectedBedType.toLowerCase().includes("single");
    const isDouble = selectedBedType.toLowerCase().includes("double");
    const isBlanket = selectedBedType.toLowerCase().includes("blanket");
    const isQuilt = selectedBedType.toLowerCase().includes("quilt");

    if (isBlanket) {
      return [
        { colorName: "Slate Gray", hexCode: "#64748B", images: ["/cat_blankets.png", "/banner_1.png"] },
        { colorName: "Deep Teal", hexCode: "#245c77", images: ["/cat_blankets.png", "/banner_1.png"] }
      ];
    } else if (isQuilt) {
      return [
        { colorName: "Classic White", hexCode: "#FFFFFF", images: ["/cat_quilt.png", "/banner_1.png"] },
        { colorName: "Lavender Mist", hexCode: "#E9E3FF", images: ["/cat_quilt.png", "/banner_1.png"] }
      ];
    } else if (isSingle) {
      return [
        { colorName: "Classic White", hexCode: "#FFFFFF", images: ["/cat_single.png", "/banner_1.png"] },
        { colorName: "Deep Teal", hexCode: "#245c77", images: ["/cat_single.png", "/banner_1.png"] },
        { colorName: "Linen Gold", hexCode: "#A89276", images: ["/cat_single.png", "/banner_1.png"] }
      ];
    } else {
      return [
        { colorName: "Classic White", hexCode: "#FFFFFF", images: ["/cat_double.png", "/banner_1.png"] },
        { colorName: "Deep Teal", hexCode: "#245c77", images: ["/cat_double.png", "/banner_1.png"] }
      ];
    }
  };

  const availableColors = productColors.filter(c => c.bedType === selectedBedType);
  const activeColorsToRender = availableColors.length > 0 ? availableColors : getFallbackColors();

  // Sync color selection and activeImgIdx when bedType or productColors load
  useEffect(() => {
    if (activeColorsToRender.length > 0) {
      const colorNames = activeColorsToRender.map(c => c.colorName);
      if (!colorNames.includes(color)) {
        setColor(activeColorsToRender[0].colorName);
        setActiveImgIdx(0);
      }
    }
  }, [selectedBedType, productColors]);

  // Sync image index when color changes
  useEffect(() => {
    setActiveImgIdx(0);
  }, [color]);

  const getBedSizeLabel = (type) => {
    // Category name comes directly from database — display as-is
    return type;
  };

  const getTenureDetails = (dur) => {
    const matchingPlan = plans.find(p => p.bedType === selectedBedType && p.duration === dur);
    const discountText = matchingPlan?.discount || null;

    let displayName = dur;
    if (dur === "1 Month") displayName = "Monthly";
    else if (dur === "3 Months") displayName = "Quarterly";
    else if (dur === "12 Months") displayName = "Yearly";

    return { displayName, discountText };
  };





  // Step Tracker State
  // Steps: 1. Configure/Browse, 2. Registration/Login, 3. Complete Profile, 4. Checkout/RFQ, 5. Order Confirmation
  const [activeStep, setActiveStep] = useState(1);

  // Step 2: Auth Form States
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"
  const [authMethod, setAuthMethod] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Step 3: Complete Profile States
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileCity, setProfileCity] = useState("Delhi NCR");
  const [profilePincode, setProfilePincode] = useState("");

  // B2B Business Profile Fields
  const [b2bOwnerName, setB2bOwnerName] = useState("");
  const [b2bPropertyName, setB2bPropertyName] = useState("");
  const [b2bContactPerson, setB2bContactPerson] = useState("");
  const [b2bGSTNumber, setB2bGSTNumber] = useState("");

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  // B2B RFQ Specifications
  const [b2bRoomsCount, setB2bRoomsCount] = useState(10);
  const [b2bBedsCount, setB2bBedsCount] = useState(15);
  const [b2bBedType, setB2bBedType] = useState("Double");
  const [b2bBedsheetReqs, setB2bBedsheetReqs] = useState(["White Bedsheet", "Premium Cotton"]);

  // Step 4: Checkout / Review RFQ States
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("Pending"); // "Pending" | "Paid" | "Failed"
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Step 5: Confirmation States
  const [orderId, setOrderId] = useState("");
  const [b2bQuoteId, setB2bQuoteId] = useState("");
  const [b2bQuoteStatus, setB2bQuoteStatus] = useState("PENDING");
  const [b2bQuotePrice, setB2bQuotePrice] = useState(0);

  // E-Sign states
  const [showESignModal, setShowESignModal] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [signatureType, setSignatureType] = useState("draw");

  // Calculate dynamic B2C pricing based on selection
  const getB2CPricing = () => {
    const isSingle = selectedBedType.toLowerCase().includes("single");
    const depositAmt = settings
      ? (isSingle ? settings.singleBedDeposit : settings.doubleBedDeposit)
      : (isSingle ? 500 : 800);

    const activePaymentStyles = settings?.paymentStyles && settings.paymentStyles.length > 0
      ? settings.paymentStyles
      : [
        { id: "Monthly", name: "Standard Monthly", description: "Requires refundable security deposit of ₹{deposit}", depositMultiplier: 1 },
        { id: "Advance", name: "Advance Plan", description: "Pay full subscription upfront. Zero security deposit required.", depositMultiplier: 0 }
      ];
    const activeStyle = activePaymentStyles.find(s => s.id === planType) || activePaymentStyles[0];
    const depositMultiplier = activeStyle ? (activeStyle.depositMultiplier !== undefined ? activeStyle.depositMultiplier : 1) : 1;

    // Zero deposit implies Premium tier, otherwise Basic
    const expectedTier = depositMultiplier === 0 ? "Premium" : "Basic";

    const matchedPlan = plans.find(p =>
      p.bedType === selectedBedType &&
      p.duration === selectedDuration &&
      p.name.includes(expectedTier)
    );
    const planExists = !!matchedPlan;

    if (!matchedPlan) {
      return { subtotal: 0, couponDiscount: 0, discountedBase: 0, gst: 0, deposit: 0, total: 0, planExists: false };
    }

    const durationNumMatch = matchedPlan.duration.match(/\d+/);
    const multiplier = durationNumMatch ? parseInt(durationNumMatch[0], 10) : 1;

    const subtotal = matchedPlan.price;

    let couponDiscount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === "percentage") {
        couponDiscount = Math.round(subtotal * (appliedCoupon.discountValue / 100));
      } else {
        couponDiscount = appliedCoupon.discountValue;
      }
    }

    const discountedBase = Math.max(0, subtotal - couponDiscount);
    const gst = Math.round(discountedBase * 0.18);

    const deposit = Math.round(Number(depositAmt || 0) * depositMultiplier);
    const total = discountedBase + gst + deposit;

    return { subtotal, couponDiscount, discountedBase, gst, deposit, total, planExists };
  };

  const b2cPricing = getB2CPricing();

  const uniqueBedTypes = plans.length > 0 ? Array.from(new Set(plans.map(p => p.bedType))) : ["Bedsheet + Pillow (Single)", "Bedsheet + Pillow (Double)", "Curtains", "Quilts", "Blankets"];
  const availableDurationsForBed = plans.length > 0
    ? Array.from(new Set(plans.filter(p => p.bedType === selectedBedType).map(p => p.duration)))
    : ["1 Month", "3 Months", "12 Months"];



  // Send OTP handler
  const handleSendOtp = async () => {
    setAuthError("");
    setAuthSuccess("");
    const target = email || mobile;
    if (!target) {
      setAuthError("Email or Mobile is required to send verification code.");
      return;
    }
    setAuthLoading(true);
    try {
      const purpose = authMode === "signup" ? "signup" : "login";
      const payload = {};
      if (target.includes("@")) {
        payload.email = target;
      } else {
        payload.mobile = target;
      }
      payload.purpose = purpose;

      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setAuthSuccess("Verification code sent successfully.");
        if (data.code) {
          setDevOtp(data.code);
        }
      } else {
        setAuthError(data.error || "Failed to send code.");
      }
    } catch (err) {
      setAuthError("Network error occurred.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth Submit handler (Login or Signup)
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);

    try {
      if (authMode === "login") {
        let res, data;
        if (authMethod === "email") {
          res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });
        } else {
          res = await fetch("/api/auth/otp/verify-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              [email.includes("@") ? "email" : "mobile"]: email,
              code: otpCode
            })
          });
        }
        data = await res.json();
        if (res.ok) {
          setAuthSuccess("Logged in successfully!");
          setUser(data.user);
          setProfileName(data.user.name || "");
          setProfileEmail(data.user.email || "");
          setProfilePhone(data.user.mobile || "");
          setProfileAddress(data.user.address || "");
          setTimeout(() => {
            setActiveStep(3); // Go to Profile Completion step
            setAuthSuccess("");
          }, 1000);
        } else {
          setAuthError(data.error || "Authentication failed.");
        }
      } else {
        // Signup Mode
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            mobile,
            password,
            accountType: customerType === "B2C" ? "Individual User" : "Commercial Partner",
            otpCode: otpCode || undefined
          })
        });
        const data = await res.json();
        if (res.ok) {
          if (data.verificationRequired) {
            setOtpSent(true);
            setAuthSuccess("Verification code sent! Enter code to complete signup.");
            if (data.code) {
              setDevOtp(data.code);
            }
          } else {
            setAuthSuccess("Registered successfully!");
            setUser(data.user);
            setProfileName(data.user.name || "");
            setProfileEmail(data.user.email || "");
            setProfilePhone(data.user.mobile || "");
            setProfileAddress(data.user.address || "");
            setTimeout(() => {
              setActiveStep(3);
              setAuthSuccess("");
            }, 1000);
          }
        } else {
          setAuthError(data.error || "Signup failed.");
        }
      }
    } catch (err) {
      setAuthError("Network error occurred.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Complete Profile Submit handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSaving(true);

    try {
      const payload = {
        name: profileName,
        email: profileEmail,
        mobile: profilePhone,
        address: `${profileAddress}, ${profileCity} - ${profilePincode}`,
        accountType: customerType === "B2C" ? "Individual User" : "Commercial Partner"
      };

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setActiveStep(4); // Go to Checkout/RFQ
      } else {
        setProfileError(data.error || "Failed to save profile.");
      }
    } catch (err) {
      setProfileError("Network error saving profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  // Apply Coupon handler
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError("");
    setCouponSuccess("");
    try {
      const res = await fetch("/api/user/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: couponCode.trim(),
          subtotal: b2cPricing.subtotal
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon({
          couponCode: data.couponCode,
          discountType: data.discountType,
          discountValue: data.discountValue,
          discount: data.discount
        });
        setCouponSuccess(`Coupon code '${data.couponCode}' applied! Discount: ₹${data.discount}`);
      } else {
        setAppliedCoupon(null);
        setCouponError(data.error || "Invalid coupon code.");
      }
    } catch (err) {
      setCouponError("Error validating coupon code.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  // B2C Plan Checkout submit
  const handleB2CCheckout = async () => {
    setCheckoutError("");
    setCheckoutLoading(true);

    try {
      // 1. Create Razorpay order on backend
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalPrice: b2cPricing.total })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to initialize payment gateway.");
      }

      const sizeLabel = selectedBedType.charAt(0).toUpperCase() + selectedBedType.slice(1);
      const activePaymentStyles = settings?.paymentStyles && settings.paymentStyles.length > 0
        ? settings.paymentStyles
        : [
          { id: "Monthly", name: "Standard Monthly", depositMultiplier: 1 },
          { id: "Advance", name: "Advance Plan", depositMultiplier: 0 }
        ];
      const activeStyle = activePaymentStyles.find(s => s.id === planType) || activePaymentStyles[0];
      const itemTier = (activeStyle && activeStyle.depositMultiplier === 0) ? "PREMIUM" : "BASIC";

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ClosetRush",
        description: `${sizeLabel} Sheets (${selectedDuration})`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            setCheckoutLoading(true);
            // 3. Verify payment on backend
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: {
                bedType: selectedBedType,
                planName: `${sizeLabel} Bed sheets (${selectedDuration} swap cycle)`,
                price: b2cPricing.subtotal,
                duration: selectedDuration,
                subscriptionType: "monthly",
                securityDeposit: b2cPricing.deposit,
                gst: b2cPricing.gst,
                totalPrice: b2cPricing.total,
                address: `${profileAddress}, ${profileCity} - ${profilePincode}`,
                mobile: profilePhone,
                color,
                isCustom: color !== "Classic White",
                couponCode: appliedCoupon ? appliedCoupon.couponCode : null,
                discount: b2cPricing.couponDiscount,
                orderType: "RENT",
                itemTier,
              }
            };
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(verifyPayload)
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setOrderId(response.razorpay_payment_id);
              setActiveStep(5);
            } else {
              setCheckoutError(verifyData.error || "Payment verification failed.");
            }
          } catch (verifyErr) {
            setCheckoutError("Failed to verify payment. Please contact support.");
          } finally {
            setCheckoutLoading(false);
          }
        },
        prefill: {
          name: orderData.user.name,
          email: orderData.user.email,
          contact: profilePhone || orderData.user.mobile,
        },
        theme: { color: "#0F172A" },
        modal: {
          ondismiss: function () {
            setCheckoutLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Razorpay error:", err);
      setCheckoutError(err.message || "Something went wrong connecting to Razorpay.");
      setCheckoutLoading(false);
    }
  };

  // B2B RFQ Quote submit
  const handleB2BQuoteSubmit = async () => {
    setCheckoutError("");
    setCheckoutLoading(true);

    try {
      const requirementsText = b2bBedsheetReqs.join(", ");
      const payload = {
        propertyName: b2bPropertyName,
        ownerName: b2bOwnerName,
        contactPerson: b2bContactPerson,
        mobile: profilePhone,
        email: profileEmail,
        gstNumber: b2bGSTNumber,
        propertyAddress: `${profileAddress}, ${profileCity} - ${profilePincode}`,
        roomsCount: b2bRoomsCount,
        bedsCount: b2bBedsCount,
        bedType: b2bBedType,
        bedsheetRequirements: b2bBedsheetReqs,
        businessType: "Hotel/PG/Hostel",
        bundleSelections: `${b2bBedType} Bed sheets, setup count: ${b2bBedsCount}`,
        message: `Quotation requested for Property Name: ${b2bPropertyName}. Requirements: ${requirementsText}. GST: ${b2bGSTNumber || 'None'}.`,
        estimatedTotal: b2bBedsCount * 250
      };

      const res = await fetch("/api/user/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setB2bQuoteId(data.quote._id);
        setB2bQuoteStatus("PENDING");
        setActiveStep(5); // Quote submitted screen
      } else {
        setCheckoutError(data.error || "Failed to submit quotation request.");
      }
    } catch (err) {
      setCheckoutError("Network error submitting RFQ.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Simulate Sales/Admin preparing quotation
  const handleSimulateAdminOffer = async () => {
    if (!b2bQuoteId) return;
    try {
      const mockPrice = b2bBedsCount * 200 + 400; // custom bulk discount price
      const res = await fetch("/api/admin/quotes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: b2bQuoteId,
          status: "QUOTE SENT",
          priceQuote: mockPrice
        })
      });
      if (res.ok) {
        setB2bQuoteStatus("QUOTE SENT");
        setB2bQuotePrice(mockPrice);
        alert("Simulated Sales Agent response: quotation generated and sent to B2B user!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // B2B user accepting proposal
  const handleB2BAcceptQuote = async () => {
    try {
      const res = await fetch("/api/user/quote", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: b2bQuoteId,
          status: "ACCEPTED"
        })
      });
      if (res.ok) {
        setB2bQuoteStatus("ACCEPTED");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // B2B user paying quote
  const handleB2BPayQuote = async () => {
    try {
      const res = await fetch("/api/user/quote", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: b2bQuoteId,
          status: "CONFIRMED"
        })
      });
      if (res.ok) {
        setB2bQuoteStatus("CONFIRMED");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // E-Sign Canvas Event Listeners
  useEffect(() => {
    if (showESignModal && signatureType === "draw") {
      const canvas = document.getElementById("sig-canvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let drawing = false;
      const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: clientX - rect.left,
          y: clientY - rect.top
        };
      };

      const start = (e) => {
        drawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      };
      const move = (e) => {
        if (!drawing) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      };
      const stop = () => { drawing = false; };

      canvas.addEventListener("mousedown", start);
      canvas.addEventListener("mousemove", move);
      window.addEventListener("mouseup", stop);

      canvas.addEventListener("touchstart", start);
      canvas.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("touchend", stop);

      return () => {
        canvas.removeEventListener("mousedown", start);
        canvas.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", stop);
        canvas.removeEventListener("touchstart", start);
        canvas.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", stop);
      };
    }
  }, [showESignModal, signatureType]);

  const handleClearSignature = () => {
    const canvas = document.getElementById("sig-canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleB2BEsignSubmit = async () => {
    if (!signatureName.trim()) {
      alert("Please enter your name to verify the signature.");
      return;
    }

    let signatureImg = "";
    if (signatureType === "draw") {
      const canvas = document.getElementById("sig-canvas");
      if (canvas) {
        signatureImg = canvas.toDataURL();
      }
    } else {
      signatureImg = `TYPED:${signatureName}`;
    }

    try {
      const res = await fetch("/api/user/quote", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: b2bQuoteId,
          status: "ACCEPTED",
          signatureData: signatureImg,
          signedBy: signatureName
        })
      });
      if (res.ok) {
        setB2bQuoteStatus("ACCEPTED");
        setShowESignModal(false);
      } else {
        const err = await res.json();
        alert("E-sign failed: " + err.error);
      }
    } catch (err) {
      console.error(err);
      alert("Network error executing e-signature.");
    }
  };

  const currentColorObj = activeColorsToRender.find(c => c.colorName === color) || activeColorsToRender[0];
  const galleryImages = currentColorObj && currentColorObj.images && currentColorObj.images.length > 0
    ? currentColorObj.images
    : [selectedBedType.toLowerCase().includes("single") ? "/cat_single.png" : "/cat_double.png"];

  const mainImage = galleryImages[activeImgIdx] || galleryImages[0];

  if (loadingSession || loadingPlans) {
    return (
      <div className="min-h-screen bg-[#FCFBF9] text-charcoal-ink flex flex-col items-center justify-center font-sans antialiased">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes waveLiquid {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
          .liquid-wave {
            position: absolute;
            top: 45%;
            left: 50%;
            width: 220%;
            height: 220%;
            background: linear-gradient(to bottom, rgba(197, 163, 118, 0.2), rgba(197, 163, 118, 0.35));
            border-radius: 38%;
            animation: waveLiquid 8s infinite linear;
          }
          .liquid-wave-secondary {
            position: absolute;
            top: 40%;
            left: 50%;
            width: 210%;
            height: 210%;
            background: linear-gradient(to bottom, rgba(13, 21, 24, 0.04), rgba(13, 21, 24, 0.08));
            border-radius: 40%;
            animation: waveLiquid 12s infinite linear;
          }
        `}} />

        <div className="text-center space-y-10 max-w-md px-6">
          {/* Circular Liquid Washer Container */}
          <div className="relative w-36 h-36 mx-auto bg-white border border-[#C5A376]/20 shadow-md rounded-full overflow-hidden flex items-center justify-center">
            {/* Morphing Liquid Waves */}
            <div className="liquid-wave" />
            <div className="liquid-wave-secondary" />
            
            {/* Modern Floating Bed Icon */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-2 animate-pulse">
              <Bed className="w-12 h-12 text-charcoal-ink" />
              <span className="text-[10px] font-black uppercase tracking-widest text-charcoal-ink/60">Sanitizing</span>
            </div>
          </div>

          <div className="space-y-4">
            <img
              src="/image.png"
              alt="ClosetRush Logo"
              className="h-14 w-auto mx-auto object-contain shrink-0"
            />
            <h1 className="font-serif font-bold text-2xl uppercase tracking-widest text-charcoal-ink">
              CLOSET RUSH
            </h1>
            
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#C5A376] font-black uppercase tracking-widest block animate-pulse">
                Thermodynamic Sanitization Active
              </span>
              <p className="text-xs text-charcoal-ink/50 font-semibold uppercase tracking-widest leading-relaxed">
                Swapping & washing fresh organic linens...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-charcoal-ink font-sans antialiased flex flex-col justify-between">
      {/* Navigation */}
      <div>
        <Navbar user={user} loading={loadingSession} handleLogout={handleLogout} />
        <div className="h-[80px]" />
      </div>

      {/* Main Container */}
      <main className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {/* Step Indicator Header */}
        <div className="mb-12 max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between text-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-charcoal-ink/10 -translate-y-1/2 z-0" />

            {[
              { num: 1, text: "Configure" },
              { num: 2, text: "Register" },
              { num: 3, text: "Profile" },
              { num: 4, text: customerType === "B2C" ? "Checkout" : "RFQ Review" },
              { num: 5, text: "Confirmation" }
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs uppercase tracking-wider transition-all duration-300 border-2 ${activeStep >= s.num
                      ? "bg-charcoal-ink text-white border-charcoal-ink shadow-md"
                      : "bg-[#FCFBF9] text-charcoal-ink/40 border-charcoal-ink/15"
                    }`}
                >
                  {activeStep > s.num ? <Check className="w-5 h-5 text-[#C5A376]" /> : s.num}
                </div>
                <span className={`text-[9px] uppercase tracking-widest font-black mt-2.5 hidden md:block ${activeStep >= s.num ? "text-charcoal-ink font-bold" : "text-charcoal-ink/30"
                  }`}>
                  {s.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: CONFIGURE BEDDING SYSTEM */}
        {activeStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Product Image Gallery */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white border border-charcoal-ink/10 p-6 rounded-none shadow-sm space-y-6">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A376] bg-[#C5A376]/10 px-3.5 py-1.5 border border-[#C5A376]/20">
                    {customerType === "B2C" ? "Premium Bedding Rentals" : "Bulk B2B Linen Supply"}
                  </span>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-charcoal-ink leading-tight mt-4">
                    {selectedBedType} Linen Set
                  </h2>
                </div>

                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FCFBF9] border border-charcoal-ink/10">
                  <img
                    src={mainImage}
                    alt="Bed Sheets"
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  {(!currentColorObj || !currentColorObj.images || currentColorObj.images.length === 0) && (
                    <div
                      className="absolute inset-0 mix-blend-multiply opacity-20 pointer-events-none"
                      style={{ backgroundColor: currentColorObj?.hexCode || "#FFFFFF" }}
                    />
                  )}
                </div>

                {/* Image Gallery Thumbnails Row */}
                {galleryImages.length > 1 && (
                  <div className="flex gap-2.5 justify-center">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImgIdx(idx)}
                        className={`w-14 h-11 border overflow-hidden transition-all cursor-pointer ${activeImgIdx === idx ? "border-[#C5A376] ring-1 ring-[#C5A376] scale-105" : "border-charcoal-ink/10 hover:border-charcoal-ink/20"
                          }`}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-3 pt-6 border-t border-charcoal-ink/10">
                  <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">Linen Kit Package Contents</span>
                  <div className="bg-[#FCFBF9] p-3.5 border border-charcoal-ink/10 text-3xs text-charcoal-ink/80 space-y-2 uppercase tracking-wider font-extrabold mb-4 font-sans">
                    {selectedBedType.toLowerCase().includes("single") ? (
                      <>
                        <p className="flex justify-between"><span>Premium Bed Sheets:</span> <span className="text-charcoal-ink font-black">4 Single Sheets</span></p>
                        <p className="flex justify-between"><span>Sanitized Pillow Covers:</span> <span className="text-charcoal-ink font-black">4 Pillow Covers</span></p>
                      </>
                    ) : (
                      <>
                        <p className="flex justify-between"><span>Premium Bed Sheets:</span> <span className="text-charcoal-ink font-black">4 Double Sheets</span></p>
                        <p className="flex justify-between"><span>Sanitized Pillow Covers:</span> <span className="text-charcoal-ink font-black">8 Pillow Covers</span></p>
                      </>
                    )}
                    <p className="flex justify-between"><span>Thread Count (TC):</span> <span className="text-[#C5A376] font-black">400 TC Organic Cotton</span></p>
                  </div>

                  <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">Sanitary and Delivery Inclusions</span>
                  <ul className="space-y-3.5 text-3xs font-extrabold uppercase tracking-widest text-charcoal-ink/70">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#C5A376]" />
                      <span>Thermodynamic UV-C Sterilized</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#C5A376]" />
                      <span>Free Doorstep Swap Logistics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Configurator Panel */}
            <div className="lg:col-span-7 bg-white border border-charcoal-ink/10 p-6 sm:p-8 shadow-sm space-y-8">
              {/* Switcher Customer type: B2C vs B2B */}
              <div className="space-y-2">
                <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">Choose Plan Channel</span>
                <div className="grid grid-cols-2 bg-[#FCFBF9] p-1 border border-charcoal-ink/10">
                  <button
                    onClick={() => setCustomerType("B2C")}
                    className={`py-3 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${customerType === "B2C" ? "bg-charcoal-ink text-white" : "text-charcoal-ink/40 hover:text-charcoal-ink"
                      }`}
                  >
                    B2C Individual Customer
                  </button>
                  <button
                    onClick={() => setCustomerType("B2B")}
                    className={`py-3 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${customerType === "B2B" ? "bg-charcoal-ink text-white" : "text-charcoal-ink/40 hover:text-charcoal-ink"
                      }`}
                  >
                    B2B Hotels / PGs / Hostels
                  </button>
                </div>
              </div>

              {/* Bed Sizes */}
              <div className="space-y-2">
                <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">Type (Select Bed Dimensions)</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {uniqueBedTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedBedType(type)}
                      className={`py-3 px-2 border text-center transition-all cursor-pointer text-[10px] font-black uppercase tracking-widest ${selectedBedType === type
                          ? "bg-charcoal-ink text-white border-charcoal-ink"
                          : "bg-[#FCFBF9] border-charcoal-ink/10 hover:border-charcoal-ink/30"
                        }`}
                    >
                      {getBedSizeLabel(type)}
                    </button>
                  ))}
                </div>
              </div>



              {/* B2C specific options: Tenure Slider & planType */}
              {customerType === "B2C" ? (
                <>
                  {/* Tenure */}
                  <div className="space-y-2">
                    <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">Subscription Duration Tenure</span>
                    <div className="grid grid-cols-3 gap-2">
                      {availableDurationsForBed.map((dur) => {
                        const { displayName, discountText } = getTenureDetails(dur);
                        return (
                          <button
                            key={dur}
                            onClick={() => setSelectedDuration(dur)}
                            className={`py-3 px-2 border text-center transition-all cursor-pointer ${selectedDuration === dur
                                ? "bg-charcoal-ink text-white border-charcoal-ink"
                                : "bg-[#FCFBF9] border-charcoal-ink/10 hover:border-charcoal-ink/25"
                              }`}
                          >
                            <span className="text-[10px] font-black uppercase block tracking-widest">{displayName}</span>
                            {discountText && (
                              <span className="text-[8px] font-bold text-[#C5A376] block mt-0.5">{discountText}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Plan Type */}
                  <div className="space-y-3">
                    <span className="text-3xs uppercase tracking-widest text-charcoal-ink/40 font-bold block">Plan Payment Style</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(settings?.paymentStyles && settings.paymentStyles.length > 0
                        ? settings.paymentStyles
                        : [
                          { id: "Monthly", name: "Standard Monthly", description: "Requires refundable security deposit of ₹{deposit}", depositMultiplier: 1 },
                          { id: "Advance", name: "Advance Plan", description: "Pay full subscription upfront. Zero security deposit required.", depositMultiplier: 0 }
                        ]
                      ).map((style) => {
                        const isSingle = selectedBedType.toLowerCase().includes("single");
                        const depositAmt = settings
                          ? (isSingle ? settings.singleBedDeposit : settings.doubleBedDeposit)
                          : (isSingle ? 500 : 800);
                        const finalDeposit = Math.round(depositAmt * (style.depositMultiplier !== undefined ? style.depositMultiplier : 1));

                        let desc = style.description || "";
                        if (desc.includes("₹{deposit}")) {
                          desc = desc.replace("₹{deposit}", `₹${finalDeposit}`);
                        } else {
                          desc = desc.replace("{deposit}", `₹${finalDeposit}`);
                        }

                        const isSelected = planType === style.id;
                        const isZeroDeposit = style.depositMultiplier === 0;

                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setPlanType(style.id)}
                            className={`group p-5 border text-left flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-xs cursor-pointer relative overflow-hidden rounded-none ${isSelected
                                ? "bg-charcoal-ink text-white border-charcoal-ink"
                                : "bg-white border-charcoal-ink/10 hover:border-charcoal-ink/25"
                              }`}
                          >
                            {isZeroDeposit && (
                              <div className="absolute top-0 right-0">
                                <span className="bg-emerald-600 text-white text-[7px] px-2 py-0.5 font-bold uppercase tracking-widest">
                                  Zero Deposit
                                </span>
                              </div>
                            )}
                            {style.id === "Advance" && !isZeroDeposit && (
                              <div className="absolute top-0 right-0">
                                <span className="bg-[#C5A376] text-white text-[7px] px-2 py-0.5 font-bold uppercase tracking-widest">
                                  Popular
                                </span>
                              </div>
                            )}
                            <div className="space-y-1">
                              <span className={`text-[10px] font-black uppercase tracking-widest block ${isSelected ? "text-[#C5A376]" : "text-charcoal-ink"}`}>
                                {style.name}
                              </span>
                              <span className={`text-3xs mt-1 font-semibold leading-relaxed block ${isSelected ? "text-white/60" : "text-charcoal-ink/50"}`}>
                                {desc}
                              </span>
                              <span className={`text-3xs font-extrabold uppercase tracking-widest block mt-2 border-t pt-1.5 ${isSelected ? "text-[#C5A376] border-white/10" : "text-[#C5A376] border-charcoal-ink/10"}`}>
                                {style.id === "Monthly" || style.name.toLowerCase().includes("monthly")
                                  ? "➔ All 4 sheets delivered together at once"
                                  : "➔ Get 1 new fresh sheet swap every week"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                /* B2B Intro Notice */
                <div className="p-5 border border-[#C5A376]/20 bg-[#C5A376]/05 text-charcoal-ink space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-[#C5A376]">
                    <Building className="w-4 h-4" /> B2B Bulk Proposal Route
                  </div>
                  <p className="text-3xs text-charcoal-ink/65 leading-relaxed font-semibold">
                    For businesses like Hostels, PGs, and Hotels. Instead of standard monthly checkout rates, we process corporate applications via RFQ proposals. Provide property counts in next steps to request a volume-based discount quote.
                  </p>
                </div>
              )}

              {/* Footer configurator: Pricing or RFQ button */}
              <div className="pt-6 border-t border-charcoal-ink/10">
                {customerType === "B2C" ? (
                  plans.length === 0 ? (
                    <div className="bg-amber-50 border border-amber-100 p-5 rounded-none text-xs mb-6 text-amber-800 font-bold uppercase tracking-wider">
                      Subscription plans are currently unavailable. Please check back later.
                    </div>
                  ) : !b2cPricing.planExists ? (
                    <div className="bg-amber-50 border border-amber-100 p-5 rounded-none text-xs mb-6 text-amber-800 font-bold uppercase tracking-wider">
                      The selected combination ({getBedSizeLabel(selectedBedType)} - {selectedDuration}) is currently unavailable.
                    </div>
                  ) : (
                    <div className="bg-[#FCFBF9] p-5 rounded-none space-y-3.5 text-xs mb-6 border border-charcoal-ink/10">
                      <div className="flex justify-between items-baseline font-bold text-charcoal-ink uppercase tracking-widest text-3xs">
                        <span>Upfront Plan Cost ({getTenureDetails(selectedDuration).displayName})</span>
                        <span className="text-xs font-black">₹{b2cPricing.subtotal}</span>
                      </div>
                      {b2cPricing.deposit > 0 && (
                        <div className="flex justify-between text-3xs text-charcoal-ink/75 font-bold uppercase tracking-widest">
                          <span>Security Deposit (Refundable)</span>
                          <span>+ ₹{b2cPricing.deposit}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-3xs text-charcoal-ink/40 font-bold uppercase tracking-widest">
                        <span>GST flat tax (18%)</span>
                        <span>+ ₹{b2cPricing.gst}</span>
                      </div>
                      <div className="border-t border-charcoal-ink/10 pt-3.5 flex justify-between items-baseline font-black uppercase text-2xs tracking-widest text-[#C5A376]">
                        <span>Total Checkout Upfront</span>
                        <span className="text-lg font-black text-charcoal-ink font-serif">₹{b2cPricing.total}</span>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="bg-[#FCFBF9] p-5 border border-charcoal-ink/10 text-3xs mb-6 flex justify-between items-center font-bold text-charcoal-ink uppercase tracking-widest">
                    <span>B2B pricing range</span>
                    <span className="text-[#C5A376] text-xs font-black">Custom volume quotes</span>
                  </div>
                )}

                {customerType === "B2C" && !user && (
                  <div className="mb-4 flex items-center justify-center gap-1.5 text-center text-rose-650 bg-rose-50 border border-rose-100 p-3 rounded-none">
                    <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                      Note: User login is required & mandatory to subscribe
                    </span>
                  </div>
                )}

                <button
                  disabled={customerType === "B2C" && (plans.length === 0 || !b2cPricing.planExists)}
                  onClick={() => {
                    if (user) {
                      setActiveStep(3); // Already logged in, go to Complete Profile
                    } else {
                      setActiveStep(2); // Go to Login/Register step
                    }
                  }}
                  className="w-full py-4 bg-charcoal-ink hover:bg-[#C5A376] hover:text-white text-[#FCFBF9] hover:text-[#FCFBF9] font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {customerType === "B2C" ? "Rent bedding set" : "Request quotation proposal"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: REGISTRATION / LOGIN */}
        {activeStep === 2 && (
          <div className="max-w-md mx-auto bg-white border border-charcoal-ink/10 p-8 shadow-sm">
            <div className="mb-6 bg-rose-50 border border-rose-100 p-3.5 flex items-center gap-2 text-rose-650 rounded-none">
              <Lock className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-widest leading-relaxed">
                Security Policy: User login is required & mandatory to subscribe to bedding sets.
              </span>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-xl font-bold font-serif uppercase tracking-tight text-charcoal-ink">
                {authMode === "login" ? "Customer Login" : "Create Account"}
              </h2>
              <p className="text-3xs text-charcoal-ink/40 uppercase tracking-widest font-black mt-1">
                Select your credentials to authenticate and finalize subscription
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3.5 bg-red-50 text-red-650 border border-red-150 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3.5 bg-emerald-50 text-emerald-650 border border-emerald-150 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                {authSuccess}
              </div>
            )}

            {devOtp && (
              <div className="mb-4 p-3 bg-amber-50/60 border border-amber-250/20 text-[#C5A376] text-3xs font-black flex items-center justify-between">
                <span>[Dev Mode] Verification Code: <strong className="text-charcoal-ink text-[11px]">{devOtp}</strong></span>
                <button
                  onClick={() => setOtpCode(devOtp)}
                  className="px-2 py-0.5 bg-[#C5A376] text-white text-[9px] uppercase tracking-wider font-extrabold cursor-pointer"
                >
                  Autofill
                </button>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <label className="block text-3xs font-black text-charcoal-ink/50 uppercase tracking-widest mb-1.5">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-ink/40">
                      <UserIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-11 pr-4 py-3 bg-[#FCFBF9] border border-charcoal-ink/15 text-charcoal-ink text-xs focus:outline-none focus:border-linen-gold font-bold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-3xs font-black text-charcoal-ink/50 uppercase tracking-widest mb-1.5">
                  {authMethod === "email" ? "Email Address" : "Mobile Phone"}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-ink/40">
                    {authMethod === "email" ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  </span>
                  <input
                    type={authMethod === "email" ? "email" : "tel"}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={authMethod === "email" ? "email@example.com" : "10-digit phone number"}
                    className="w-full pl-11 pr-4 py-3 bg-[#FCFBF9] border border-charcoal-ink/15 text-charcoal-ink text-xs focus:outline-none focus:border-linen-gold font-bold"
                  />
                </div>
              </div>

              {authMode === "signup" && (
                <div>
                  <label className="block text-3xs font-black text-charcoal-ink/50 uppercase tracking-widest mb-1.5">Phone Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-ink/40">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength="10"
                      pattern="[0-9]{10}"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit mobile number"
                      className="w-full pl-11 pr-4 py-3 bg-[#FCFBF9] border border-charcoal-ink/15 text-charcoal-ink text-xs focus:outline-none focus:border-linen-gold font-bold"
                    />
                  </div>
                </div>
              )}

              {authMethod === "email" && (
                <div>
                  <label className="block text-3xs font-black text-charcoal-ink/50 uppercase tracking-widest mb-1.5">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-ink/40">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-11 pr-4 py-3 bg-[#FCFBF9] border border-charcoal-ink/15 text-charcoal-ink text-xs focus:outline-none focus:border-linen-gold font-bold"
                    />
                  </div>
                </div>
              )}

              {authMethod === "otp" && otpSent && (
                <div>
                  <label className="block text-3xs font-black text-charcoal-ink/50 uppercase tracking-widest mb-1.5">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter verification code"
                    className="w-full px-4 py-3 bg-[#FCFBF9] border border-charcoal-ink/15 text-charcoal-ink text-xs focus:outline-none focus:border-linen-gold font-bold text-center tracking-[0.5em]"
                  />
                </div>
              )}

              {/* Conditional submit/otp actions */}
              {authMethod === "otp" && !otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={authLoading}
                  className="w-full py-3.5 bg-charcoal-ink hover:bg-[#C5A376] hover:text-white text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {authLoading ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : "Send OTP code"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-charcoal-ink hover:bg-[#C5A376] hover:text-white text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {authLoading ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : (authMode === "login" ? "Login to account" : "Complete Registration")}
                </button>
              )}
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-charcoal-ink/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold text-charcoal-ink/40 uppercase tracking-widest">
                <span className="bg-white px-3">OR</span>
              </div>
            </div>

            {/* Google authentication button */}
            <a
              href="/api/auth/google"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-charcoal-ink/15 text-charcoal-ink font-bold text-xs uppercase tracking-widest hover:bg-[#FCFBF9] transition-colors shadow-xs cursor-pointer"
            >
              <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.354 0 3.373 2.736 1.5 6.71l3.766 3.055z" />
                <path fill="#34A853" d="M16.04 15.345c-1.077.732-2.432 1.164-4.04 1.164a6.837 6.837 0 0 1-6.734-4.855L1.5 14.71C3.373 18.682 7.354 21.418 12 21.418c3.118 0 5.964-1.09 8.055-2.973l-4.015-3.1z" />
                <path fill="#4285F4" d="M23.836 12.236c0-.8-.073-1.573-.209-2.318H12v4.51h6.636a5.673 5.673 0 0 1-2.463 3.718l4.014 3.1c2.345-2.164 3.65-5.345 3.65-9.01z" />
                <path fill="#FBBC05" d="M5.266 14.236a6.89 6.89 0 0 1-.355-2.236c0-.782.127-1.536.355-2.236L1.5 6.71A11.97 11.97 0 0 0 .5 12c0 1.9.445 3.7 1.236 5.29l3.53-3.054z" />
              </svg>
              Sign up with Google (Recommended)
            </a>

            {/* Toggle Login vs Register */}
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setAuthMode(authMode === "login" ? "signup" : "login");
                  setAuthError("");
                  setAuthSuccess("");
                  setOtpSent(false);
                  setDevOtp("");
                }}
                className="text-2xs font-extrabold text-[#C5A376] uppercase tracking-widest hover:underline cursor-pointer"
              >
                {authMode === "login" ? "Need an account? Sign up here" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: COMPLETE PROFILE */}
        {activeStep === 3 && (
          <div className="max-w-xl mx-auto bg-white border border-charcoal-ink/10 p-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold font-serif uppercase tracking-tight text-charcoal-ink">
                Complete Customer Profile
              </h2>
              <p className="text-3xs text-charcoal-ink/40 uppercase tracking-widest font-black mt-1">
                Provide accurate delivery coordinates and billing identifiers
              </p>
            </div>

            {profileError && (
              <div className="mb-4 p-3.5 bg-red-50 text-red-650 border border-red-155 text-xs font-semibold">
                {profileError}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-black text-charcoal-ink/50 uppercase tracking-widest mb-1.5">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-ink/40">
                      <UserIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3 bg-[#FCFBF9] border border-charcoal-ink/15 text-charcoal-ink text-xs focus:outline-none focus:border-linen-gold font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-3xs font-black text-charcoal-ink/50 uppercase tracking-widest mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-ink/40">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-[#FCFBF9] border border-charcoal-ink/15 text-charcoal-ink text-xs focus:outline-none focus:border-linen-gold font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-black text-charcoal-ink/50 uppercase tracking-widest mb-1.5">Mobile Phone</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-ink/40">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength="10"
                      pattern="[0-9]{10}"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit mobile number"
                      className="w-full pl-11 pr-4 py-3 bg-[#FCFBF9] border border-charcoal-ink/15 text-charcoal-ink text-xs focus:outline-none focus:border-linen-gold font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-3xs font-black text-charcoal-ink/50 uppercase tracking-widest mb-1.5">Service Region City</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-ink/40">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <select
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-[#FCFBF9] border border-charcoal-ink/15 text-charcoal-ink text-xs focus:outline-none focus:border-linen-gold font-bold appearance-none cursor-pointer"
                    >
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Gurugram">Gurugram</option>
                      <option value="Noida">Noida</option>
                      <option value="Faridabad">Faridabad</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-ink/40 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-3xs font-black text-charcoal-ink/50 uppercase tracking-widest mb-1.5">Zip Pincode</label>
                <input
                  type="text"
                  required
                  maxLength="6"
                  pattern="[0-9]{6}"
                  value={profilePincode}
                  onChange={(e) => setProfilePincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 110001 (Must start with 11, 12, or 13)"
                  className="w-full px-4 py-3 bg-[#FCFBF9] border border-charcoal-ink/15 text-charcoal-ink text-xs focus:outline-none focus:border-linen-gold font-bold"
                />
              </div>

              <div>
                <label className="block text-3xs font-black text-charcoal-ink/50 uppercase tracking-widest mb-1.5">Linen Delivery Address Details</label>
                <textarea
                  required
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  placeholder="House/Room No, Building Name, Street Address, Landmark..."
                  rows="3"
                  className="w-full px-4 py-3 bg-[#FCFBF9] border border-charcoal-ink/15 text-charcoal-ink text-xs focus:outline-none focus:border-linen-gold font-semibold resize-none"
                />
              </div>

              {/* B2B Commercial Fields */}
              {customerType === "B2B" && (
                <div className="pt-4 border-t border-charcoal-ink/10 space-y-4">
                  <h4 className="text-xs font-serif font-bold text-[#C5A376] uppercase tracking-wider">B2B Commercial Properties Details</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-3xs font-black text-charcoal-ink/50 uppercase tracking-widest mb-1.5">Commercial Property/Hotel Name</label>
                      <input
                        type="text"
                        required={customerType === "B2B"}
                        value={b2bPropertyName}
                        onChange={(e) => setB2bPropertyName(e.target.value)}
                        placeholder="e.g. ClosetRush Inn"
                        className="w-full px-4 py-3 bg-[#FCFBF9] border border-charcoal-ink/15 text-charcoal-ink text-xs focus:outline-none focus:border-linen-gold font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-3xs font-black text-charcoal-ink/50 uppercase tracking-widest mb-1.5">Business GSTIN (Optional)</label>
                      <input
                        type="text"
                        value={b2bGSTNumber}
                        onChange={(e) => setB2bGSTNumber(e.target.value)}
                        placeholder="e.g. 07AAAAA1111A1Z1"
                        className="w-full px-4 py-3 bg-[#FCFBF9] border border-charcoal-ink/15 text-charcoal-ink text-xs focus:outline-none focus:border-linen-gold font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={profileSaving}
                className="w-full py-3.5 bg-charcoal-ink hover:bg-[#C5A376] hover:text-white text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {profileSaving ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : "Save Profile & Continue"}
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: CHECKOUT / REVIEW RFQ */}
        {activeStep === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Side: Order Config Preview */}
            <div className="lg:col-span-7 bg-white border border-charcoal-ink/10 p-6 sm:p-8 shadow-sm space-y-8">
              <div>
                <h2 className="text-xl font-bold font-serif uppercase tracking-tight text-charcoal-ink">
                  {customerType === "B2C" ? "Confirm Subscription Setup" : "Review Request for Quotation"}
                </h2>
                <p className="text-3xs text-charcoal-ink/40 uppercase tracking-widest font-black mt-1">
                  Double check selected parameters before initiating transaction
                </p>
              </div>

              {checkoutError && (
                <div className="p-3.5 bg-red-50 text-red-650 border border-red-150 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  {checkoutError}
                </div>
              )}

              {customerType === "B2C" ? (
                /* B2C Preview */
                <div className="space-y-6">
                  <div className="bg-[#FCFBF9] border border-charcoal-ink/10 p-5 rounded-none space-y-4">
                    <h3 className="text-xs font-serif font-bold text-charcoal-ink uppercase tracking-wider border-b border-charcoal-ink/10 pb-2">Subscription Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider block">Linen Package</span>
                        <strong className="text-charcoal-ink font-bold">{selectedBedType}</strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider block">Duration Tenure</span>
                        <strong className="text-charcoal-ink font-bold">{selectedDuration}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider block">Payment Model</span>
                        <strong className="text-[#C5A376] font-bold uppercase">{planType}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Promo Coupons Form */}
                  <div className="bg-[#FCFBF9] border border-charcoal-ink/10 p-5 rounded-none space-y-4">
                    <h3 className="text-xs font-serif font-bold text-charcoal-ink uppercase tracking-wider border-b border-charcoal-ink/10 pb-2">Apply Promo Code</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="ENTER COUPON CODE"
                        className="flex-grow px-4 py-3 bg-white border border-charcoal-ink/15 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold font-bold uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || !couponCode.trim()}
                        className="px-6 bg-charcoal-ink hover:bg-[#C5A376] text-white hover:text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {validatingCoupon ? "Checking..." : "Apply"}
                      </button>
                    </div>
                    {couponError && <p className="text-3xs text-rose-600 font-extrabold uppercase mt-1">{couponError}</p>}
                    {couponSuccess && <p className="text-3xs text-emerald-600 font-extrabold uppercase mt-1">{couponSuccess}</p>}
                  </div>
                </div>
              ) : (
                /* B2B Preview */
                <div className="space-y-6">
                  <div className="bg-[#FCFBF9] border border-charcoal-ink/10 p-5 rounded-none space-y-6">
                    <h3 className="text-xs font-serif font-bold text-charcoal-ink uppercase tracking-wider border-b border-charcoal-ink/10 pb-2">Properties & Swaps Requirements</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-[#C5A376]" /> Rooms
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={b2bRoomsCount}
                          onChange={(e) => setB2bRoomsCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-4 py-2.5 bg-white border border-charcoal-ink/15 text-charcoal-ink font-bold text-xs focus:outline-none focus:border-linen-gold"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-[#C5A376]" /> Beds
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={b2bBedsCount}
                          onChange={(e) => setB2bBedsCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-4 py-2.5 bg-white border border-charcoal-ink/15 text-charcoal-ink font-bold text-xs focus:outline-none focus:border-linen-gold"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Maximize className="w-3.5 h-3.5 text-[#C5A376]" /> Bed Type
                        </span>
                        <div className="relative">
                          <select
                            value={b2bBedType}
                            onChange={(e) => setB2bBedType(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 bg-white border border-charcoal-ink/15 text-charcoal-ink font-bold text-xs focus:outline-none focus:border-linen-gold appearance-none cursor-pointer"
                          >
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Queen">Queen</option>
                            <option value="King">King</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-ink/40 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Bed Requirement Checklist */}
                    <div className="pt-2">
                      <span className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                        <ListChecks className="w-3.5 h-3.5 text-[#C5A376]" /> Configuration Needs
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {["White Bedsheet", "Premium Cotton", "Pillow Covers", "Comforter"].map((req) => {
                          const isChecked = b2bBedsheetReqs.includes(req);
                          return (
                            <button
                              key={req}
                              type="button"
                              onClick={() => {
                                if (isChecked) {
                                  setB2bBedsheetReqs(b2bBedsheetReqs.filter(r => r !== req));
                                } else {
                                  setB2bBedsheetReqs([...b2bBedsheetReqs, req]);
                                }
                              }}
                              className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 cursor-pointer border ${isChecked
                                  ? "bg-charcoal-ink text-white border-charcoal-ink shadow-xs"
                                  : "bg-[#FCFBF9] text-charcoal-ink/50 border-charcoal-ink/15 hover:border-charcoal-ink/20"
                                }`}
                            >
                              {isChecked && <Check className="w-3 h-3 text-[#C5A376]" />} {req}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Invoice & Summary */}
            <div className="lg:col-span-5 space-y-6">
              {customerType === "B2C" ? (
                <div className="bg-charcoal-ink text-white p-6 shadow-md space-y-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#C5A376]">
                      Payment Invoice
                    </h4>
                    <span className="text-3xs text-white/40 uppercase tracking-widest font-bold">Billing summary</span>
                  </div>

                  <div className="space-y-3.5 text-3xs font-bold uppercase tracking-wider text-white/70">
                    <div className="flex justify-between">
                      <span>Base Rental Amount:</span>
                      <span className="text-white">₹{b2cPricing.subtotal}</span>
                    </div>

                    {b2cPricing.couponDiscount > 0 && (
                      <div className="flex justify-between text-[#C5A376]">
                        <span>Coupon Discount ({appliedCoupon?.couponCode}):</span>
                        <span>-₹{b2cPricing.couponDiscount}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>GST flat tax (18%):</span>
                      <span className="text-white">₹{b2cPricing.gst}</span>
                    </div>

                    {b2cPricing.deposit > 0 && (
                      <div className="flex justify-between">
                        <span>Security Deposit (Refundable):</span>
                        <span className="text-white">₹{b2cPricing.deposit}</span>
                      </div>
                    )}

                    <div className="border-t border-white/10 my-4 pt-4 flex justify-between items-baseline">
                      <span className="text-2xs font-black text-white uppercase tracking-widest">
                        Total Upfront Payable:
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-[#C5A376] font-serif">
                          ₹{b2cPricing.total}
                        </span>
                        <span className="text-white/40 text-3xs font-bold uppercase tracking-widest block mt-0.5">
                          / {getTenureDetails(selectedDuration).displayName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleB2CCheckout}
                    disabled={checkoutLoading}
                    className="w-full py-4 bg-[#C5A376] hover:bg-[#b89569] text-charcoal-ink hover:text-white font-bold text-xs uppercase tracking-widest shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {checkoutLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-charcoal-ink" />
                    ) : (
                      <Lock className="w-4 h-4 text-charcoal-ink" />
                    )}
                    {checkoutLoading ? "Processing transaction..." : "Confirm & Pay Now"}
                  </button>
                </div>
              ) : (
                /* B2B Pricing Invoice Mock */
                <div className="bg-charcoal-ink text-white p-6 shadow-md space-y-6 relative overflow-hidden">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#C5A376] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#C5A376]" /> RFQ Estimate
                    </h4>
                    <span className="text-[8px] px-2 py-0.5 bg-white/5 border border-white/10 text-white/50 uppercase tracking-widest font-bold">Rate Card</span>
                  </div>

                  <div className="space-y-4 text-3xs font-bold uppercase tracking-wider text-white/70">
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-none border border-white/5">
                      <span>Rate per bed/mo:</span>
                      <span className="text-white font-black font-serif">₹250</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-none border border-white/5">
                      <span>Properties Count:</span>
                      <span className="text-white font-black font-serif">1</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-none border border-white/5">
                      <span>Beds/Units Selected:</span>
                      <span className="text-white font-black font-serif">{b2bBedsCount}</span>
                    </div>

                    <div className="my-4 pt-6 flex flex-col items-center justify-center bg-white/5 border border-white/10 p-6">
                      <span className="text-[9px] font-black text-[#C5A376] uppercase tracking-widest mb-2">
                        Estimated Monthly Price
                      </span>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-black text-white font-serif">
                          ₹{b2bBedsCount * 250}
                        </span>
                        <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest pb-1">
                          / month
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleB2BQuoteSubmit}
                    disabled={checkoutLoading}
                    className="w-full py-4 bg-[#C5A376] hover:bg-[#b89569] text-charcoal-ink hover:text-white font-black text-xs uppercase tracking-widest shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {checkoutLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin text-charcoal-ink" />
                    ) : (
                      <ClipboardList className="w-5 h-5 text-charcoal-ink" />
                    )}
                    {checkoutLoading ? "Submitting RFQ..." : "Submit RFQ Application"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION OUTCOMES */}
        {activeStep === 5 && (
          <div className="max-w-2xl mx-auto py-10">
            {customerType === "B2C" ? (
              /* B2C ORDER CONFIRMATION */
              <div className="bg-white border border-charcoal-ink/10 p-8 text-center shadow-sm space-y-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-250 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-emerald-600 text-3xs font-black uppercase tracking-widest">Transaction Successful</span>
                  <h2 className="text-2xl font-bold font-serif text-charcoal-ink">Order Confirmed!</h2>
                  <p className="text-3xs text-charcoal-ink/40 font-bold uppercase tracking-wider">Order ID: <strong className="text-charcoal-ink">{orderId}</strong></p>
                </div>

                <div className="p-4 bg-[#FCFBF9] border border-charcoal-ink/10 text-3xs leading-relaxed font-semibold text-left text-charcoal-ink/80 space-y-2 uppercase tracking-wider">
                  <p className="font-extrabold uppercase text-charcoal-ink text-[10px] tracking-widest border-b border-charcoal-ink/10 pb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Dispatch Notifications</p>
                  <p>✔ <strong>Email confirmation sent to:</strong> {profileEmail}</p>
                  <p>✔ <strong>SMS dispatch scheduled for:</strong> {profilePhone}</p>
                  <p>✔ <strong>Invoice PDF prepared for download</strong></p>
                </div>

                <div className="pt-6 border-t border-charcoal-ink/10 flex flex-col sm:flex-row gap-4">
                  <a
                    href={`/api/user/quote/pdf?orderId=${orderId}`}
                    download
                    className="flex-1 py-3 px-6 bg-[#C5A376] hover:bg-charcoal-ink text-charcoal-ink hover:text-white font-bold text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download PDF Invoice
                  </a>
                  <Link
                    href="/dashboard"
                    className="flex-1 py-3 px-6 bg-charcoal-ink hover:bg-[#C5A376] text-white hover:text-charcoal-ink font-bold text-xs uppercase tracking-widest transition-all text-center"
                  >
                    Go to User Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              /* B2B RFQ STATUS TRACKER & SIMULATOR */
              <div className="bg-white border border-charcoal-ink/10 p-8 shadow-sm space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-250 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <ClipboardList className="w-8 h-8" />
                  </div>
                  <span className="text-blue-600 text-3xs font-black uppercase tracking-widest">RFQ Submitted</span>
                  <h2 className="text-2xl font-bold font-serif text-charcoal-ink">Quotation Request Filed</h2>
                  <p className="text-xs text-charcoal-ink/50 leading-relaxed font-medium max-w-md mx-auto">
                    Your Request for Quotation is stored in the database. Sales and Admin staff will audit details and compile a volume-based discount proposal shortly.
                  </p>
                </div>

                {/* RFQ Status Tracker Visualizer */}
                <div className="bg-[#FCFBF9] border border-charcoal-ink/10 p-6 space-y-6">
                  <h4 className="text-3xs uppercase tracking-widest font-black text-charcoal-ink/40 block border-b border-charcoal-ink/10 pb-2">Active RFQ Tracker (Live status: {b2bQuoteStatus})</h4>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
                    {[
                      { st: "PENDING", label: "1. Review" },
                      { st: "QUOTE SENT", label: "2. Quote Sent" },
                      { st: "ACCEPTED", label: "3. Accepted" },
                      { st: "CONFIRMED", label: "4. Confirmed" }
                    ].map((step, idx) => {
                      const isActive = b2bQuoteStatus === step.st;
                      const isDone = (idx === 0) ||
                        (idx === 1 && ["QUOTE SENT", "ACCEPTED", "CONFIRMED"].includes(b2bQuoteStatus)) ||
                        (idx === 2 && ["ACCEPTED", "CONFIRMED"].includes(b2bQuoteStatus)) ||
                        (idx === 3 && b2bQuoteStatus === "CONFIRMED");
                      return (
                        <div key={step.st} className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] border transition-all ${isDone
                              ? "bg-charcoal-ink text-white border-charcoal-ink"
                              : "bg-white text-charcoal-ink/30 border-charcoal-ink/10"
                              }`}
                          >
                            {isDone ? "✔" : idx + 1}
                          </div>
                          <span className={`text-[9px] uppercase tracking-widest font-extrabold mt-1.5 ${isActive ? "text-[#C5A376]" : (isDone ? "text-charcoal-ink" : "text-charcoal-ink/30")
                            }`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pricing feedback if quote sent */}
                  {b2bQuotePrice > 0 && (
                    <div className="p-4 bg-charcoal-ink text-white rounded-none border border-slate-800 text-center space-y-2">
                      <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Prepared B2B Pricing Proposal</p>
                      <h3 className="text-2xl font-serif font-black text-[#C5A376]">₹{b2bQuotePrice.toLocaleString()}</h3>
                      <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Includes complete sateen sheets setup for {b2bBedsCount} units</p>
                    </div>
                  )}

                  {/* Real Workflow Actions */}
                  <div className="p-4 bg-[#C5A376]/05 border border-[#C5A376]/20 space-y-3">
                    {b2bQuoteStatus === "PENDING" && (
                      <div className="text-center p-3 border border-dashed border-charcoal-ink/20 rounded bg-white/50">
                        <p className="text-[10px] font-bold text-charcoal-ink/50 uppercase tracking-widest">
                          ⏳ Waiting for Admin to prepare your quotation...
                        </p>
                      </div>
                    )}

                    {b2bQuoteStatus === "QUOTE SENT" && (
                      <button
                        onClick={() => setShowESignModal(true)}
                        className="w-full py-3 bg-charcoal-ink text-[#C5A376] hover:bg-black font-extrabold text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4" /> View & E-Sign Quotation Contract
                      </button>
                    )}

                    {b2bQuoteStatus === "ACCEPTED" && (
                      <button
                        onClick={handleB2BPayQuote}
                        className="w-full py-3 bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 animate-pulse"
                      >
                        <Lock className="w-4 h-4" /> Proceed to Secure Payment
                      </button>
                    )}

                    {b2bQuoteStatus === "CONFIRMED" && (
                      <div className="text-center p-4 bg-emerald-50 text-emerald-700 text-xs font-bold flex flex-col items-center justify-center gap-2 border border-emerald-250">
                        <Check className="w-6 h-6 bg-emerald-600 text-white p-1 rounded-full" />
                        <span className="uppercase tracking-widest text-[10px]">B2B Order Confirmed and Dispatched!</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  {(b2bQuoteStatus === "ACCEPTED" || b2bQuoteStatus === "CONFIRMED") && (
                    <a
                      href={`/api/user/quote/pdf?quoteId=${b2bQuoteId}`}
                      download
                      className="flex-1 py-3 px-6 bg-[#C5A376] hover:bg-charcoal-ink text-charcoal-ink hover:text-white font-bold text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Download signed PDF Contract
                    </a>
                  )}
                  <Link
                    href="/dashboard"
                    className="flex-1 py-3 px-6 bg-charcoal-ink hover:bg-[#C5A376] text-white hover:text-charcoal-ink font-bold text-xs uppercase tracking-widest text-center"
                  >
                    Go to B2B Dashboard Hub
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* E-SIGN MODAL */}
      {showESignModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#FCFBF9] border border-charcoal-ink/10 shadow-2xl w-full max-w-lg overflow-hidden text-charcoal-ink">
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-ink/15 bg-charcoal-ink text-white">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-[#C5A376]" />
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest">E-Sign quotation proposal</h3>
                  <p className="text-[10px] text-white/50 font-semibold">Review terms and sign below</p>
                </div>
              </div>
              <button
                onClick={() => setShowESignModal(false)}
                className="p-1.5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-[#FCFBF9] border border-charcoal-ink/10 p-4 text-3xs font-semibold leading-relaxed space-y-2 uppercase tracking-wider">
                <p className="font-extrabold uppercase text-[10px] text-[#C5A376] tracking-widest border-b border-charcoal-ink/10 pb-1.5">Corporate Contract Summary</p>
                <p><strong>Property Name:</strong> {b2bPropertyName}</p>
                <p><strong>Items:</strong> {b2bBedType} Bed Setup for {b2bBedsCount} Beds</p>
                <p><strong>Proposed Monthly Rate:</strong> Rs.{b2bQuotePrice.toLocaleString()}</p>
                <p className="text-[9px] text-charcoal-ink/50 italic leading-relaxed normal-case">By signing this contract, you authorize ClosetRush to deploy sanitized bedding swaps under commercial rental terms.</p>
              </div>

              <div className="space-y-4">
                {/* Switch Sign Type */}
                <div className="flex border-b border-charcoal-ink/10">
                  <button
                    type="button"
                    onClick={() => setSignatureType("draw")}
                    className={`flex-1 pb-2 text-[10px] font-black uppercase tracking-widest text-center border-b-2 cursor-pointer transition-all ${signatureType === "draw" ? "border-charcoal-ink text-charcoal-ink" : "border-transparent text-charcoal-ink/40"
                      }`}
                  >
                    Draw Signature
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureType("type")}
                    className={`flex-1 pb-2 text-[10px] font-black uppercase tracking-widest text-center border-b-2 cursor-pointer transition-all ${signatureType === "type" ? "border-charcoal-ink text-charcoal-ink" : "border-transparent text-charcoal-ink/40"
                      }`}
                  >
                    Type Signature
                  </button>
                </div>

                {signatureType === "draw" ? (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-charcoal-ink/40 uppercase tracking-widest">Draw Signature in Canvas</label>
                    <canvas
                      id="sig-canvas"
                      width="450"
                      height="120"
                      className="border border-dashed border-charcoal-ink/15 w-full h-[120px] bg-white cursor-crosshair touch-none"
                    />
                    <button
                      type="button"
                      onClick={handleClearSignature}
                      className="text-3xs text-rose-600 font-extrabold uppercase hover:underline cursor-pointer"
                    >
                      Clear Drawing
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-charcoal-ink/40 uppercase tracking-widest">Type Your Full Name</label>
                    <input
                      type="text"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      placeholder="e.g. Johnathan Doe"
                      className="w-full px-4 py-3 bg-[#FCFBF9] border border-charcoal-ink/15 text-charcoal-ink focus:outline-none focus:border-linen-gold text-xs font-bold font-serif italic"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-charcoal-ink/40 uppercase tracking-widest mb-1.5">Authorized Signatory Name</label>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="Enter full legal name"
                    className="w-full px-4 py-3 bg-white border border-charcoal-ink/15 text-charcoal-ink focus:outline-none focus:border-linen-gold text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-4">
              <button
                type="button"
                onClick={() => setShowESignModal(false)}
                className="flex-1 py-3 px-4 bg-transparent border border-charcoal-ink/20 text-charcoal-ink text-xs font-extrabold uppercase tracking-widest transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleB2BEsignSubmit}
                className="flex-1 py-3 px-4 bg-charcoal-ink hover:bg-[#C5A376] hover:text-white text-white text-xs font-extrabold uppercase tracking-widest transition-all cursor-pointer"
              >
                Approve & Sign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer layout */}
      <footer className="bg-charcoal-ink text-white/40 text-[9px] font-bold uppercase tracking-widest py-8 border-t border-white/05 text-center">
        <div className="max-w-[1380px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="flex items-center gap-3">
            <img src="/image.png" alt="ClosetRush Logo" className="h-10 w-auto object-contain bg-white p-1 rounded-sm shrink-0" />
            © 2026 ClosetRush Inc. secure checkout routing.
          </span>
          <span className="flex items-center gap-1.5 text-[#C5A376]"><ShieldCheck className="w-4 h-4" /> Thermodynamic sanitization standard compliant</span>
        </div>
      </footer>
    </div>
  );
}
