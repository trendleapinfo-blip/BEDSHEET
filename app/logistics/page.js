"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Truck,
  Navigation,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  RefreshCw,
  LogOut,
  Home,
  Layers,
  Clock,
  ShieldAlert,
  Calendar,
  Search,
  ExternalLink
} from "lucide-react";

export default function LogisticsDashboard() {
  const [sessionUser, setSessionUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Run Sheet");

  // Data lists
  const [ordersList, setOrdersList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Verify Logistics Partner Session
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user.role === "logistics") {
          setSessionUser(data.user);
        } else {
          setSessionUser(null);
        }
      }
    } catch (err) {
      console.error("Session verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Delivery Orders Data
  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const ordersRes = await fetch("/api/admin/orders");
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrdersList(ordersData.orders || []);
      }
    } catch (err) {
      console.error("Error fetching logistics orders:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    if (sessionUser) {
      fetchData();
    }
  }, [sessionUser]);

  // Delivery Status Action
  const updateDeliveryStatus = async (orderId, newStatus) => {
    const confirmation = window.confirm(`Are you sure you want to mark this shipment as ${newStatus}?`);
    if (!confirmation) return;

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus })
      });

      if (res.ok) {
        if (newStatus === "DELIVERED") {
          alert("Shipment Delivered! WMS Bundle updated successfully.");
        } else if (newStatus === "CANCELLED") {
          alert("Shipment Cancelled. Bundle routed to Thermodynamic Laundry for safety.");
        } else {
          alert(`Shipment status updated to ${newStatus} successfully!`);
        }
        fetchData();
      } else {
        const data = await res.json();
        alert("Status update failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Status update failed: " + err.message);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-alabaster-linen text-charcoal-ink">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-10 w-10 animate-spin text-linen-gold" />
          <p className="text-xs font-bold tracking-widest uppercase text-charcoal-ink/40">Verifying Logistics Session...</p>
        </div>
      </div>
    );
  }

  // Guard: Unauthorized role
  if (!sessionUser) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-alabaster-linen px-4 text-center text-charcoal-ink">
        <div className="max-w-md bg-white border border-charcoal-ink/10 rounded-none p-8 shadow-2xl">
          <ShieldAlert className="mx-auto h-16 w-16 text-rose-500 mb-4 animate-pulse" />
          <h1 className="text-2xl font-serif font-bold mb-2 tracking-tight text-charcoal-ink">Access Denied</h1>
          <p className="text-charcoal-ink/60 text-xs mb-6 leading-relaxed font-semibold">
            You are not authorized to view the Logistics Partner Panel. Please log in with a registered Logistics Partner account.
          </p>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="flex-1 text-center py-3.5 px-6 rounded-none bg-linen-gold hover:bg-charcoal-ink text-white font-bold text-xs uppercase tracking-widest transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/"
              className="flex-1 text-center py-3.5 px-6 rounded-none bg-transparent hover:bg-charcoal-ink/05 text-charcoal-ink font-bold text-xs uppercase tracking-widest transition-all border border-charcoal-ink/20"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Statistics counters
  const totalShipments = ordersList.length;
  const pendingDeliveries = ordersList.filter(o => o.status === "ACTIVE" || o.status === "PENDING").length;
  const completedDeliveries = ordersList.filter(o => o.status === "DELIVERED").length;
  const cancelledDeliveries = ordersList.filter(o => o.status === "CANCELLED").length;

  // Filter & Search Logic
  const filteredOrders = ordersList.filter(order => {
    // Status Filter
    if (statusFilter !== "ALL" && order.status !== statusFilter) {
      return false;
    }
    // Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const orderIdMatch = order.bundleOrderId?.toLowerCase().includes(query);
      const nameMatch = order.userName?.toLowerCase().includes(query);
      const phoneMatch = order.phone?.toLowerCase().includes(query);
      const addressMatch = order.deliveryAddress?.toLowerCase().includes(query);
      return orderIdMatch || nameMatch || phoneMatch || addressMatch;
    }
    return true;
  });

  // Helper function to build Google Maps navigation query URL
  const getMapsUrl = (address) => {
    if (!address || address === "—") return "#";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  const sidebarTabs = [
    { name: "Run Sheet", icon: Truck },
    { name: "Statistics", icon: Layers }
  ];

  return (
    <div className="flex h-screen bg-alabaster-linen text-charcoal-ink font-sans antialiased overflow-hidden">
           {/* SIDEBAR */}
      <aside className="w-64 bg-charcoal-ink border-r border-charcoal-ink/08 flex flex-col justify-between shrink-0 z-20 text-white">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-white/08 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-serif font-bold bg-gradient-to-r from-linen-gold to-white bg-clip-text text-transparent">
                ClosetRush
              </span>
            </Link>
            <span className="text-[9px] font-bold bg-linen-gold/15 text-linen-gold border border-linen-gold/25 px-1.5 py-0.5 rounded-none uppercase tracking-wider">
              Logistics
            </span>
          </div>
 
          {/* User Profile */}
          <div className="p-4 mx-3 my-4 bg-white/05 border border-white/10 rounded-none flex items-center gap-3">
            <div className="h-10 w-10 rounded-none bg-linen-gold text-white flex items-center justify-center font-bold text-sm uppercase font-serif">
              {sessionUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{sessionUser.name}</h4>
              <p className="text-[10px] text-linen-gold font-extrabold uppercase tracking-wider">Logi Partner</p>
            </div>
          </div>

          {/* Tabs */}
          <nav className="px-3 space-y-1">
            {sidebarTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-white/10 text-white border border-linen-gold/30"
                      : "text-white/60 hover:bg-white/05 hover:text-white border border-transparent"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-linen-gold" : "text-white/40"}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/08 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider text-white/50 hover:bg-white/05 hover:text-white transition-all"
          >
            <Home className="h-4.5 w-4.5 text-white/40" />
            <span>Go to Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider text-rose-455 hover:bg-rose-950/20 hover:text-rose-300 transition-all cursor-pointer border border-transparent hover:border-rose-950/40"
          >
            <LogOut className="h-4.5 w-4.5 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 bg-alabaster-linen overflow-y-auto text-charcoal-ink font-sans">
               {/* Top Navbar */}
        <header className="h-16 border-b border-charcoal-ink/08 px-8 flex items-center justify-between shrink-0 bg-white/85 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-charcoal-ink/40 font-bold text-xs uppercase tracking-wider">Logistics</span>
            <span className="text-charcoal-ink/20 text-xs">/</span>
            <span className="text-charcoal-ink font-bold text-xs uppercase tracking-wider">{activeTab}</span>
          </div>
 
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              disabled={isRefreshing}
              className="py-1.5 px-3 rounded-none bg-white hover:bg-alabaster-linen text-charcoal-ink/80 border border-charcoal-ink/10 text-2xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-55"
            >
              <RefreshCw className={`h-3 w-3 text-charcoal-ink/50 ${isRefreshing ? "animate-spin" : ""}`} />
              Sync Runs
            </button>
            <span className="h-4 w-px bg-charcoal-ink/10" />
            <div className="text-2xs font-bold uppercase tracking-wider text-charcoal-ink/40">
              Courier Hub: <span className="text-linen-gold font-extrabold">Dispatch Office</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* TAB 1: RUN SHEET */}
          {activeTab === "Run Sheet" && (
            <div className="space-y-6">
              
              {/* Welcome Banner / Overview cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Total Shipments */}
                <div className="bg-white border border-charcoal-ink/10 rounded-none p-5 shadow-sm">
                  <span className="text-charcoal-ink/45 text-3xs font-bold uppercase tracking-widest block mb-1">Total Delivery Runs</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl font-serif font-bold text-charcoal-ink">{totalShipments}</span>
                    <Truck className="h-5 w-5 text-linen-gold" />
                  </div>
                </div>

                {/* Pending Shipments */}
                <div className="bg-white border border-charcoal-ink/10 rounded-none p-5 shadow-sm">
                  <span className="text-charcoal-ink/45 text-3xs font-bold uppercase tracking-widest block mb-1">Pending Dispatches</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl font-serif font-bold text-amber-600">{pendingDeliveries}</span>
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>

                {/* Completed Runs */}
                <div className="bg-white border border-charcoal-ink/10 rounded-none p-5 shadow-sm">
                  <span className="text-charcoal-ink/45 text-3xs font-bold uppercase tracking-widest block mb-1">Successful Deliveries</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl font-serif font-bold text-linen-gold">{completedDeliveries}</span>
                    <CheckCircle className="h-5 w-5 text-linen-gold" />
                  </div>
                </div>

                {/* Cancelled Runs */}
                <div className="bg-white border border-charcoal-ink/10 rounded-none p-5 shadow-sm">
                  <span className="text-charcoal-ink/45 text-3xs font-bold uppercase tracking-widest block mb-1">Returned/Cancelled</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl font-serif font-bold text-rose-600">{cancelledDeliveries}</span>
                    <XCircle className="h-5 w-5 text-rose-650" />
                  </div>
                </div>

              </div>

              {/* Filters & Search Header */}
              <div className="bg-white border border-charcoal-ink/10 rounded-none p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-ink/40">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, Customer, Address..."
                    className="w-full bg-white border border-charcoal-ink/15 rounded-none py-2 pl-10 pr-4 text-xs text-charcoal-ink placeholder-charcoal-ink/35 focus:outline-none focus:border-linen-gold transition-colors font-bold"
                  />
                </div>

                {/* Status Tabs */}
                <div className="flex bg-alabaster-linen p-1 rounded-none border border-charcoal-ink/10 w-full md:w-auto overflow-x-auto">
                  {["ALL", "PENDING", "ACTIVE", "DELIVERED", "CANCELLED"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`py-1.5 px-3 rounded-none text-3xs font-bold uppercase tracking-widest whitespace-nowrap cursor-pointer transition-all ${
                        statusFilter === status
                          ? "bg-linen-gold text-white shadow-md"
                          : "text-charcoal-ink/50 hover:bg-charcoal-ink/05 hover:text-charcoal-ink"
                      }`}
                    >
                      {status === "ALL" ? "All Runs" : status}
                    </button>
                  ))}
                </div>

              </div>

              {/* Run Sheet Table / List */}
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isPending = order.status === "PENDING";
                  const isActive = order.status === "ACTIVE";
                  const isDelivered = order.status === "DELIVERED";
                  const isCancelled = order.status === "CANCELLED";

                  return (
                    <div key={order._id} className="bg-white border border-charcoal-ink/10 rounded-none p-6 hover:border-linen-gold transition-all space-y-4 shadow-sm">
                      
                      {/* Top Row: Info Pills */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-2xs font-bold text-linen-gold bg-linen-gold/15 px-2.5 py-0.5 rounded-none border border-linen-gold/25 tracking-wider uppercase">
                            {order.bundleOrderId}
                          </span>
                          <span className={`px-2 py-0.5 rounded-none text-3xs font-extrabold tracking-wider uppercase border ${
                            order.orderType === "BUY"
                              ? "bg-purple-50 text-purple-650 border-purple-200"
                              : "bg-blue-50 text-blue-650 border-blue-200"
                          }`}>
                            {order.orderType || "RENT"}
                          </span>
                          <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-none text-[10px] font-bold uppercase tracking-wider border ${
                            isDelivered
                              ? "bg-linen-gold/15 text-linen-gold border-linen-gold/20"
                              : isCancelled
                              ? "bg-rose-500/15 text-rose-600 border-rose-500/20"
                              : isPending
                              ? "bg-amber-500/15 text-amber-600 border border-amber-500/20"
                              : "bg-blue-500/15 text-blue-600 border border-blue-500/20"
                          }`}>
                            {order.status === "ACTIVE" ? "DISPATCHED / IN TRANSIT" : order.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-3xs text-charcoal-ink/40 font-bold uppercase tracking-widest">
                          <Calendar className="h-3.5 w-3.5 text-charcoal-ink/30" />
                          <span>Start: {order.startDate ? new Date(order.startDate).toLocaleDateString() : "—"}</span>
                        </div>
                      </div>

                      {/* Middle Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        
                        {/* Delivery Specs */}
                        <div className="md:col-span-8 space-y-2">
                          <h3 className="text-sm font-serif font-bold text-charcoal-ink">{order.bundleName}</h3>
                          <div className="text-xs text-charcoal-ink/60 space-y-1 font-semibold">
                            <p className="text-[10px] text-linen-gold font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-linen-gold"></span>
                              Task: {order.orderType === "BUY" ? "Direct Sale Handover (Verify & Collect Sign)" : (order.subscriptionType === "weekly" ? "Weekly Sheet Change service" : "Monthly Kit swap")}
                            </p>
                            <p className="flex items-center gap-1.5">
                              <span>Customer:</span>
                              <strong className="text-charcoal-ink">{order.userName || "—"}</strong>
                            </p>
                            
                            {/* Address navigation Helper */}
                            <p className="flex items-start gap-1.5 leading-relaxed pt-0.5">
                              <MapPin className="h-4 w-4 text-charcoal-ink/30 shrink-0 mt-0.5" />
                              <span>{order.deliveryAddress || "—"}</span>
                              {order.deliveryAddress && order.deliveryAddress !== "—" && (
                                <a
                                  href={getMapsUrl(order.deliveryAddress)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-linen-gold hover:text-charcoal-ink inline-flex items-center gap-0.5 text-3xs font-extrabold uppercase tracking-widest shrink-0 pt-0.5 transition-colors"
                                >
                                  Navigate <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Customer Quick Dial & Cost info */}
                        <div className="md:col-span-4 flex flex-col md:items-end gap-2.5">
                          <div className="md:text-right">
                            <span className="text-3xs text-charcoal-ink/40 font-bold uppercase tracking-widest leading-none">Final price</span>
                            <h4 className="text-base font-bold text-charcoal-ink mt-1">₹{order.finalPrice}</h4>
                          </div>

                          {/* Quick dial button if phone is set */}
                          {order.phone && order.phone !== "—" && (
                            <a
                              href={`tel:${order.phone}`}
                              className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-none bg-alabaster-linen hover:bg-white border border-charcoal-ink/10 text-charcoal-ink/80 hover:text-charcoal-ink text-2xs font-extrabold tracking-wider uppercase transition-colors"
                            >
                              <Phone className="h-3.5 w-3.5 text-linen-gold" />
                              Call: {order.phone}
                            </a>
                          )}
                        </div>

                      </div>

                      {/* Bottom Row Actions (Only visible for Active/Pending runs) */}
                      {(isPending || isActive) && (
                        <div className="border-t border-charcoal-ink/08 pt-4 flex flex-wrap gap-3">
                          <button
                            onClick={() => updateDeliveryStatus(order._id, "DELIVERED")}
                            className="py-2.5 px-4 rounded-none bg-charcoal-ink hover:bg-linen-gold text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Mark Delivered
                          </button>
                          
                          <button
                            onClick={() => updateDeliveryStatus(order._id, "CANCELLED")}
                            className="py-2.5 px-4 rounded-none bg-transparent hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <XCircle className="h-4 w-4" />
                            Mark Cancelled / Returned
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <div className="text-center py-12 bg-white border border-charcoal-ink/10 rounded-none text-charcoal-ink/40 text-xs font-bold uppercase tracking-widest shadow-sm">
                    No shipments matched the current search filters.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: STATISTICS */}
          {activeTab === "Statistics" && (
            <div className="space-y-6 bg-white border border-charcoal-ink/10 rounded-none p-8 shadow-sm">
              <div>
                <h2 className="text-lg font-serif font-bold text-charcoal-ink">Operational Metrics</h2>
                <p className="text-xs text-charcoal-ink/50 font-semibold mt-0.5">Analysis of shipment runs and success ratios</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                
                {/* Delivery Success Ratio */}
                <div className="bg-alabaster-linen border border-charcoal-ink/10 rounded-none p-6 space-y-2">
                  <span className="text-charcoal-ink/40 text-3xs font-bold uppercase tracking-widest">Delivery Success Rate</span>
                  <h3 className="text-3xl font-serif font-bold text-linen-gold">
                    {totalShipments > 0 ? Math.round((completedDeliveries / totalShipments) * 100) : 0}%
                  </h3>
                  <p className="text-[10px] text-charcoal-ink/50 leading-relaxed font-semibold">Percentage of completed delivery runs relative to all leases logged</p>
                </div>

                {/* Active Transit */}
                <div className="bg-alabaster-linen border border-charcoal-ink/10 rounded-none p-6 space-y-2">
                  <span className="text-charcoal-ink/40 text-3xs font-bold uppercase tracking-widest">Active In Transit</span>
                  <h3 className="text-3xl font-serif font-bold text-amber-600">{pendingDeliveries}</h3>
                  <p className="text-[10px] text-charcoal-ink/50 leading-relaxed font-semibold">Runs pending handover or currently in delivery courier transit</p>
                </div>

                {/* Cancelled/Returned */}
                <div className="bg-alabaster-linen border border-charcoal-ink/10 rounded-none p-6 space-y-2">
                  <span className="text-charcoal-ink/40 text-3xs font-bold uppercase tracking-widest">Cancellation Ratio</span>
                  <h3 className="text-3xl font-serif font-bold text-rose-600">
                    {totalShipments > 0 ? Math.round((cancelledDeliveries / totalShipments) * 100) : 0}%
                  </h3>
                  <p className="text-[10px] text-charcoal-ink/50 leading-relaxed font-semibold">Returned bundles due to customer cancellations or unavailable destinations</p>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
