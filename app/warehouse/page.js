"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  RefreshCw,
  LogOut,
  Home,
  Truck,
  Layers,
  ShieldAlert,
  Check,
  X,
  ArrowRightLeft,
  Plus,
  Play,
  TrendingUp,
  AlertTriangle,
  Clock
} from "lucide-react";

export default function WarehouseDashboard() {
  const [sessionUser, setSessionUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Data lists
  const [categoriesList, setCategoriesList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Forms
  const [transferForm, setTransferForm] = useState({
    categoryId: "",
    fromState: "laundryStock",
    toState: "availableStock",
    qty: 10
  });

  const [addInventoryForm, setAddInventoryForm] = useState({
    categoryId: "",
    qty: 50
  });

  // Verify Warehouse Manager Session
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user.role === "warehouse") {
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

  // Fetch Inventory and Orders Data
  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const catRes = await fetch("/api/admin/categories");
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategoriesList(catData.categories || []);
      }

      const ordersRes = await fetch("/api/admin/orders");
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrdersList(ordersData.orders || []);
      }
    } catch (err) {
      console.error("Error fetching warehouse data:", err);
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

  // Set default category in form once list is loaded
  useEffect(() => {
    if (categoriesList.length > 0) {
      if (!transferForm.categoryId) {
        setTransferForm(prev => ({ ...prev, categoryId: categoriesList[0]._id }));
      }
      if (!addInventoryForm.categoryId) {
        setAddInventoryForm(prev => ({ ...prev, categoryId: categoriesList[0]._id }));
      }
    }
  }, [categoriesList]);

  // Stock Transfer Action
  const handleStockTransfer = async (e) => {
    e.preventDefault();
    const cat = categoriesList.find(c => c._id === transferForm.categoryId);
    if (!cat) return;

    const qty = Number(transferForm.qty);
    if (qty <= 0) {
      alert("Transfer quantity must be greater than 0");
      return;
    }

    const currentFromVal = cat[transferForm.fromState] || 0;
    if (currentFromVal < qty) {
      alert(`Insufficient stock in ${transferForm.fromState}. Currently has only ${currentFromVal} units.`);
      return;
    }

    const updatedFrom = currentFromVal - qty;
    const updatedTo = (cat[transferForm.toState] || 0) + qty;

    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: cat._id,
          [transferForm.fromState]: updatedFrom,
          [transferForm.toState]: updatedTo
        })
      });

      if (res.ok) {
        alert(`Successfully transferred ${qty} items!`);
        fetchData();
      } else {
        const data = await res.json();
        alert("Stock transfer failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Stock transfer failed: " + err.message);
    }
  };

  // Add New Inventory Action
  const handleAddInventory = async (e) => {
    e.preventDefault();
    const cat = categoriesList.find(c => c._id === addInventoryForm.categoryId);
    if (!cat) return;

    const qty = Number(addInventoryForm.qty);
    if (qty <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    const newTotalStock = (cat.totalStock || 0) + qty;
    const newAvailableStock = (cat.availableStock || 0) + qty;

    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: cat._id,
          totalStock: newTotalStock,
          availableStock: newAvailableStock
        })
      });

      if (res.ok) {
        alert(`Successfully added ${qty} items to total and available stock!`);
        fetchData();
      } else {
        const data = await res.json();
        alert("Adding inventory failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Adding inventory failed: " + err.message);
    }
  };

  // Prepare & Dispatch Order Action
  const handleDispatchOrder = async (orderId) => {
    try {
      // Transition PENDING orders to ACTIVE (meaning dispatched/active lease)
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: "ACTIVE" })
      });

      if (res.ok) {
        alert("Order packed & handed over to logistics successfully!");
        fetchData();
      } else {
        const data = await res.json();
        alert("Dispatch failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Dispatch failed: " + err.message);
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
          <p className="text-xs font-bold tracking-widest uppercase text-charcoal-ink/40">Verifying Warehouse Session...</p>
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
            You are not authorized to view the Warehouse Management Panel. Please log in with a registered Warehouse Manager account.
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

  // Metrics calculations
  const totalStockSum = categoriesList.reduce((acc, c) => acc + (c.totalStock || 0), 0);
  const availableStockSum = categoriesList.reduce((acc, c) => acc + (c.availableStock || 0), 0);
  const rentedStockSum = categoriesList.reduce((acc, c) => acc + (c.rentedStock || 0), 0);
  const laundryStockSum = categoriesList.reduce((acc, c) => acc + (c.laundryStock || 0), 0);
  const pendingOrders = ordersList.filter(o => o.status === "PENDING");

  // Sidebar Tabs Configuration
  const sidebarTabs = [
    { name: "Dashboard", icon: Layers },
    { name: "Stock Overview", icon: Package },
    { name: "Linen Operations", icon: ArrowRightLeft },
    { name: "Dispatched Orders", icon: Truck }
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
              Warehouse
            </span>
          </div>
 
          {/* User Profile */}
          <div className="p-4 mx-3 my-4 bg-white/05 border border-white/10 rounded-none flex items-center gap-3">
            <div className="h-10 w-10 rounded-none bg-linen-gold text-white flex items-center justify-center font-bold text-sm uppercase font-serif">
              {sessionUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{sessionUser.name}</h4>
              <p className="text-[10px] text-linen-gold font-extrabold uppercase tracking-wider">Manager</p>
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
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider text-rose-450 hover:bg-rose-950/20 hover:text-rose-300 transition-all cursor-pointer border border-transparent hover:border-rose-950/40"
          >
            <LogOut className="h-4.5 w-4.5 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
 
      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 bg-alabaster-linen overflow-y-auto text-charcoal-ink">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-charcoal-ink/08 px-8 flex items-center justify-between shrink-0 bg-white/85 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-charcoal-ink/40 font-bold text-xs uppercase tracking-wider">Warehouse</span>
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
              Sync Data
            </button>
            <span className="h-4 w-px bg-charcoal-ink/10" />
            <div className="text-2xs font-bold uppercase tracking-wider text-charcoal-ink/40">
              Station IP: <span className="text-linen-gold font-extrabold">Active Lease</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === "Dashboard" && (
            <div className="space-y-8">
              
              {/* Welcome Banner */}
              <div className="relative bg-white border border-charcoal-ink/10 rounded-none p-6 overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-linen-gold/5 rounded-full blur-3xl opacity-50" />
                <h1 className="text-2xl font-serif font-bold text-charcoal-ink mb-1">Station Overview</h1>
                <p className="text-xs text-charcoal-ink/60 max-w-xl font-medium">
                  Real-time monitoring of organic cotton linen. Coordinate dispatch queues, clean laundry intake, and overall warehouse availability.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Stock */}
                <div className="bg-white border border-charcoal-ink/10 rounded-none p-5 hover:border-charcoal-ink/15 transition-all shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-charcoal-ink/50 text-2xs font-bold uppercase tracking-widest">Total Stock Units</span>
                    <span className="bg-linen-gold/15 text-linen-gold p-1.5 rounded-none border border-linen-gold/25">
                      <Layers className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-charcoal-ink">{totalStockSum}</span>
                    <span className="text-2xs font-bold text-linen-gold flex items-center gap-0.5 uppercase tracking-wider">
                      <TrendingUp className="h-3 w-3" /> Tracked
                    </span>
                  </div>
                  <p className="text-3xs text-charcoal-ink/40 mt-2 font-semibold uppercase tracking-wider">Sum of all linen categories in system</p>
                </div>
 
                {/* Available Stock */}
                <div className="bg-white border border-charcoal-ink/10 rounded-none p-5 hover:border-charcoal-ink/15 transition-all shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-charcoal-ink/50 text-2xs font-bold uppercase tracking-widest">Available for Rent</span>
                    <span className="bg-linen-gold/15 text-linen-gold p-1.5 rounded-none border border-linen-gold/25">
                      <Package className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-charcoal-ink">{availableStockSum}</span>
                    <span className="text-3xs font-bold bg-linen-gold/15 text-linen-gold py-0.5 px-1.5 rounded-none uppercase tracking-wider">
                      {totalStockSum > 0 ? Math.round((availableStockSum / totalStockSum) * 100) : 0}% Active
                    </span>
                  </div>
                  <p className="text-3xs text-charcoal-ink/40 mt-2 font-semibold uppercase tracking-wider">Ready to pack and dispatch to orders</p>
                </div>
 
                {/* Laundry Stock */}
                <div className="bg-white border border-charcoal-ink/10 rounded-none p-5 hover:border-charcoal-ink/15 transition-all shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-charcoal-ink/50 text-2xs font-bold uppercase tracking-widest">In Laundry Cycle</span>
                    <span className="bg-linen-gold/15 text-linen-gold p-1.5 rounded-none border border-linen-gold/25">
                      <RefreshCw className="h-4 w-4 animate-spin-slow" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-charcoal-ink">{laundryStockSum}</span>
                    <span className="text-3xs font-bold bg-rose-500/10 text-rose-500 py-0.5 px-1.5 rounded-none border border-rose-500/20 uppercase tracking-wider">
                      Needs Wash
                    </span>
                  </div>
                  <p className="text-3xs text-charcoal-ink/40 mt-2 font-semibold uppercase tracking-wider">Sanitation washing at 60°C+</p>
                </div>
 
                {/* Pending Orders */}
                <div className="bg-white border border-charcoal-ink/10 rounded-none p-5 hover:border-charcoal-ink/15 transition-all shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-charcoal-ink/50 text-2xs font-bold uppercase tracking-widest">Pending Dispatches</span>
                    <span className="bg-amber-500/10 text-amber-500 p-1.5 rounded-none border border-amber-500/20">
                      <Truck className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-charcoal-ink">{pendingOrders.length}</span>
                    <span className="text-3xs text-amber-500 font-bold bg-amber-500/10 py-0.5 px-1.5 rounded-none uppercase tracking-wider flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" /> Awaiting Pack
                    </span>
                  </div>
                  <p className="text-3xs text-charcoal-ink/40 mt-2 font-semibold uppercase tracking-wider">Requires stock checkout and seal</p>
                </div>
 
              </div>>

              {/* Quick operations & stats grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Visual inventory status bars */}
                <div className="lg:col-span-7 bg-white border border-charcoal-ink/10 rounded-none p-6 space-y-6 shadow-sm">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-charcoal-ink uppercase tracking-wider">Linen Stock Allocation</h3>
                    <p className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider mt-0.5">Active distribution of linen categories</p>
                  </div>
 
                  <div className="space-y-4">
                    {categoriesList.map(cat => {
                      const maxStock = cat.totalStock || 100;
                      const availPct = Math.min(100, Math.round(((cat.availableStock || 0) / maxStock) * 100));
                      const laundryPct = Math.min(100, Math.round(((cat.laundryStock || 0) / maxStock) * 100));
                      const rentedPct = Math.min(100, Math.round(((cat.rentedStock || 0) / maxStock) * 100));
 
                      return (
                        <div key={cat._id} className="space-y-2 border-b border-charcoal-ink/08 pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between text-xs font-bold text-charcoal-ink/80">
                            <span>{cat.name}</span>
                            <span className="text-2xs text-charcoal-ink/40 font-bold">Total: {cat.totalStock}</span>
                          </div>
                          
                          {/* Segmented Stock Bar */}
                          <div className="h-3 w-full bg-charcoal-ink/08 rounded-none overflow-hidden flex border border-charcoal-ink/05">
                            <div 
                              style={{ width: `${availPct}%` }} 
                              className="bg-linen-gold h-full hover:opacity-90 transition-all" 
                              title={`Available: ${cat.availableStock}`}
                            />
                            <div 
                              style={{ width: `${rentedPct}%` }} 
                              className="bg-charcoal-ink/40 h-full hover:opacity-90 transition-all" 
                              title={`Rented: ${cat.rentedStock}`}
                            />
                            <div 
                              style={{ width: `${laundryPct}%` }} 
                              className="bg-rose-500 h-full hover:opacity-90 transition-all" 
                              title={`Laundry: ${cat.laundryStock}`}
                            />
                          </div>
                          
                          <div className="flex gap-4 text-3xs font-bold tracking-wider uppercase text-charcoal-ink/50">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-linen-gold" /> Avail: {cat.availableStock}</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-charcoal-ink/40" /> Rented: {cat.rentedStock}</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-rose-500" /> Laundry: {cat.laundryStock}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action card: Quick inventory intake */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Stock Transfers */}
                  <div className="bg-white border border-charcoal-ink/10 rounded-none p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowRightLeft className="h-4.5 w-4.5 text-linen-gold" />
                      <h3 className="text-sm font-serif font-bold text-charcoal-ink uppercase tracking-wider">Quick Stock Transfer</h3>
                    </div>
                    <p className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider mb-6">Transition linen items between operational states</p>

                    <form onSubmit={handleStockTransfer} className="space-y-4">
                      <div>
                        <label className="text-3xs font-black uppercase text-charcoal-ink/50 tracking-wider mb-1 block">Linen Item</label>
                        <select
                          value={transferForm.categoryId}
                          onChange={(e) => setTransferForm(prev => ({ ...prev, categoryId: e.target.value }))}
                          className="w-full bg-white border border-charcoal-ink/15 rounded-none p-2.5 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold transition-colors font-bold"
                        >
                          {categoriesList.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-3xs font-black uppercase text-charcoal-ink/50 tracking-wider mb-1 block">From State</label>
                          <select
                            value={transferForm.fromState}
                            onChange={(e) => setTransferForm(prev => ({ ...prev, fromState: e.target.value }))}
                            className="w-full bg-white border border-charcoal-ink/15 rounded-none p-2.5 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold transition-colors font-bold"
                          >
                            <option value="availableStock">Available</option>
                            <option value="rentedStock">Rented</option>
                            <option value="laundryStock">Laundry</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-3xs font-black uppercase text-charcoal-ink/50 tracking-wider mb-1 block">To State</label>
                          <select
                            value={transferForm.toState}
                            onChange={(e) => setTransferForm(prev => ({ ...prev, toState: e.target.value }))}
                            className="w-full bg-white border border-charcoal-ink/15 rounded-none p-2.5 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold transition-colors font-bold"
                          >
                            <option value="availableStock">Available</option>
                            <option value="rentedStock">Rented</option>
                            <option value="laundryStock">Laundry</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-3xs font-black uppercase text-charcoal-ink/50 tracking-wider mb-1 block">Transfer Quantity</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={transferForm.qty}
                          onChange={(e) => setTransferForm(prev => ({ ...prev, qty: e.target.value }))}
                          className="w-full bg-white border border-charcoal-ink/15 rounded-none p-2.5 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold transition-colors font-bold"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-none bg-charcoal-ink hover:bg-linen-gold text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                        Execute Transfer
                      </button>
                    </form>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: STOCK OVERVIEW */}
          {activeTab === "Stock Overview" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center bg-white border border-charcoal-ink/10 rounded-none p-6 shadow-sm">
                <div>
                  <h2 className="text-lg font-serif font-bold text-charcoal-ink">Linen Inventory Database</h2>
                  <p className="text-xs text-charcoal-ink/50 font-semibold mt-0.5">Track total, available, rented and laundry counts</p>
                </div>
                <div className="h-10 w-10 bg-linen-gold/15 text-linen-gold rounded-none border border-linen-gold/25 flex items-center justify-center font-bold font-serif">
                  {categoriesList.length}
                </div>
              </div>

              {/* Table Card */}
              <div className="bg-white border border-charcoal-ink/10 rounded-none overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-charcoal-ink">
                    <thead>
                      <tr className="bg-alabaster-linen border-b border-charcoal-ink/10 text-charcoal-ink/50 text-3xs font-bold uppercase tracking-widest">
                        <th className="py-4 px-6">Category Name</th>
                        <th className="py-4 px-4 text-center">Available Stock</th>
                        <th className="py-4 px-4 text-center">Rented Stock</th>
                        <th className="py-4 px-4 text-center">Laundry Stock</th>
                        <th className="py-4 px-4 text-center">Total Stock</th>
                        <th className="py-4 px-6 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal-ink/08 text-xs font-medium">
                      {categoriesList.map(cat => {
                        const isLowStock = (cat.availableStock || 0) < 15;
                        return (
                          <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4.5 px-6 font-bold text-charcoal-ink">
                              <div className="flex items-center">
                                <span>{cat.name}</span>
                                {isLowStock && (
                                  <span className="ml-2 inline-flex items-center gap-0.5 text-3xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 py-0.5 px-1.5 rounded-none uppercase tracking-wider">
                                    <AlertTriangle className="h-2.5 w-2.5" /> Low Stock
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4.5 px-4 text-center font-bold text-linen-gold bg-linen-gold/10">
                              {cat.availableStock || 0}
                            </td>
                            <td className="py-4.5 px-4 text-center font-bold text-charcoal-ink/70">
                              {cat.rentedStock || 0}
                            </td>
                            <td className="py-4.5 px-4 text-center font-bold text-rose-500 bg-red-50/50">
                              {cat.laundryStock || 0}
                            </td>
                            <td className="py-4.5 px-4 text-center font-bold text-charcoal-ink">
                              {cat.totalStock || 0}
                            </td>
                            <td className="py-4.5 px-6 text-right">
                              <span className={`inline-flex items-center gap-1 py-1 px-2.5 rounded-none text-3xs font-bold uppercase tracking-wider border ${
                                cat.status === "ACTIVE" 
                                  ? "bg-linen-gold/15 text-linen-gold border-linen-gold/25" 
                                  : "bg-charcoal-ink/08 text-charcoal-ink/40 border border-charcoal-ink/10"
                              }`}>
                                <span className={`w-1.5 h-1.5 ${cat.status === "ACTIVE" ? "bg-linen-gold" : "bg-charcoal-ink/30"}`} />
                                {cat.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: LINEN OPERATIONS */}
          {activeTab === "Linen Operations" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Transfer Form Panel */}
              <div className="bg-white border border-charcoal-ink/10 rounded-none p-6 space-y-6 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowRightLeft className="h-5 w-5 text-linen-gold" />
                    <h2 className="text-lg font-serif font-bold text-charcoal-ink">Operational Stock Transfer</h2>
                  </div>
                  <p className="text-xs text-charcoal-ink/50 font-semibold mt-0.5">Perform linen transfers between physical state logs</p>
                </div>

                <form onSubmit={handleStockTransfer} className="space-y-4">
                  <div>
                    <label className="text-3xs font-black uppercase text-charcoal-ink/50 tracking-wider mb-1.5 block">Linen Category</label>
                    <select
                      value={transferForm.categoryId}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full bg-white border border-charcoal-ink/15 rounded-none p-3 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold font-bold"
                    >
                      {categoriesList.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-3xs font-black uppercase text-charcoal-ink/50 tracking-wider mb-1.5 block">From Location Log</label>
                      <select
                        value={transferForm.fromState}
                        onChange={(e) => setTransferForm(prev => ({ ...prev, fromState: e.target.value }))}
                        className="w-full bg-white border border-charcoal-ink/15 rounded-none p-3 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold font-bold"
                      >
                        <option value="availableStock">Available Stock</option>
                        <option value="rentedStock">Rented Stock</option>
                        <option value="laundryStock">Laundry Stock</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-3xs font-black uppercase text-charcoal-ink/50 tracking-wider mb-1.5 block">To Location Log</label>
                      <select
                        value={transferForm.toState}
                        onChange={(e) => setTransferForm(prev => ({ ...prev, toState: e.target.value }))}
                        className="w-full bg-white border border-charcoal-ink/15 rounded-none p-3 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold font-bold"
                      >
                        <option value="availableStock">Available Stock</option>
                        <option value="rentedStock">Rented Stock</option>
                        <option value="laundryStock">Laundry Stock</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-3xs font-black uppercase text-charcoal-ink/50 tracking-wider mb-1.5 block">Transfer Quantity</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={transferForm.qty}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, qty: e.target.value }))}
                      className="w-full bg-white border border-charcoal-ink/15 rounded-none p-3 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-none bg-charcoal-ink hover:bg-linen-gold text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    Confirm Stock Update
                  </button>
                </form>
              </div>

              {/* Add New Inventory Panel */}
              <div className="bg-white border border-charcoal-ink/10 rounded-none p-6 space-y-6 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Plus className="h-5 w-5 text-charcoal-ink/65" />
                    <h2 className="text-lg font-serif font-bold text-charcoal-ink">Receive New Fabric Stock</h2>
                  </div>
                  <p className="text-xs text-charcoal-ink/50 font-semibold mt-0.5">Log new fabrics received directly from manufacturer partners</p>
                </div>

                <form onSubmit={handleAddInventory} className="space-y-4">
                  <div>
                    <label className="text-3xs font-black uppercase text-charcoal-ink/50 tracking-wider mb-1.5 block">Select Linen Category</label>
                    <select
                      value={addInventoryForm.categoryId}
                      onChange={(e) => setAddInventoryForm(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full bg-white border border-charcoal-ink/15 rounded-none p-3 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold font-bold"
                    >
                      {categoriesList.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-3xs font-black uppercase text-charcoal-ink/50 tracking-wider mb-1.5 block">Quantity Added</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={addInventoryForm.qty}
                      onChange={(e) => setAddInventoryForm(prev => ({ ...prev, qty: e.target.value }))}
                      className="w-full bg-white border border-charcoal-ink/15 rounded-none p-3 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold font-bold"
                    />
                  </div>

                  <div className="text-3xs font-bold text-charcoal-ink/60 bg-alabaster-linen p-4 rounded-none border border-charcoal-ink/10 leading-relaxed">
                    <p className="uppercase mb-1 text-linen-gold flex items-center gap-1 font-extrabold"><AlertTriangle className="h-3 w-3" /> System Note:</p>
                    Adding new stock increments the Category's **Total Stock** and **Available Stock** simultaneously. Ensure items are physically packed and scanned in the warehouse bay.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-none bg-charcoal-ink hover:bg-linen-gold text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Record Intake Stock
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 4: DISPATCHED ORDERS */}
          {activeTab === "Dispatched Orders" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center bg-white border border-charcoal-ink/10 rounded-none p-6 shadow-sm">
                <div>
                  <h2 className="text-lg font-serif font-bold text-charcoal-ink">Preparations & Dispatches</h2>
                  <p className="text-xs text-charcoal-ink/50 font-semibold mt-0.5">Prepare orders for handover to Logistics Partner</p>
                </div>
                <div className="bg-linen-gold/15 text-linen-gold py-1.5 px-4 rounded-none text-2xs font-bold border border-linen-gold/25 uppercase tracking-wider">
                  {pendingOrders.length} Pending Packaging
                </div>
              </div>

              {/* Order List */}
              <div className="space-y-4">
                {ordersList.filter(o => o.status === "PENDING" || o.status === "ACTIVE").map(order => {
                  const isPending = order.status === "PENDING";
                  return (
                    <div key={order._id} className="bg-white border border-charcoal-ink/10 rounded-none p-5 hover:border-linen-gold transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                      <div className="space-y-2 max-w-xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-2xs font-bold text-linen-gold bg-linen-gold/15 px-2.5 py-0.5 rounded-none border border-linen-gold/25 tracking-wider uppercase">
                            {order.bundleOrderId}
                          </span>
                          <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-none text-[10px] font-bold uppercase tracking-wider border ${
                            isPending 
                              ? "bg-amber-500/15 text-amber-500 border border-amber-500/20" 
                              : "bg-linen-gold/15 text-linen-gold border border-linen-gold/20"
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-charcoal-ink">{order.bundleName}</h3>
                        <p className="text-xs text-charcoal-ink/60 font-semibold">Customer: <strong className="text-charcoal-ink">{order.userName || "—"}</strong> ({order.email || "—"})</p>
                        <p className="text-xs text-charcoal-ink/50 leading-relaxed font-semibold">Delivery Destination: {order.deliveryAddress || "—"}</p>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-2.5 w-full md:w-auto">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-charcoal-ink/40 uppercase tracking-widest leading-none">Price lease</p>
                          <p className="text-sm font-bold text-charcoal-ink mt-1">₹{order.finalPrice}</p>
                        </div>

                        {isPending ? (
                          <button
                            onClick={() => handleDispatchOrder(order._id)}
                            className="w-full md:w-auto py-2 px-4.5 rounded-none bg-charcoal-ink hover:bg-linen-gold text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Check className="h-4 w-4" />
                            Package & Dispatch
                          </button>
                        ) : (
                          <span className="text-[10px] text-linen-gold font-bold uppercase tracking-wider flex items-center gap-1.5 bg-linen-gold/10 p-2 rounded-none border border-linen-gold/20">
                            <Truck className="h-3.5 w-3.5" /> Dispatched to Logistics
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {ordersList.filter(o => o.status === "PENDING" || o.status === "ACTIVE").length === 0 && (
                  <div className="text-center py-12 bg-white border border-charcoal-ink/10 rounded-none text-charcoal-ink/40 text-xs font-bold uppercase tracking-widest shadow-sm">
                    No active or pending dispatch orders in log.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </main>

    </div>
  );
}
