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
  Clock,
  QrCode,
  Printer,
  Download,
  Trash2,
  Edit,
  UserCheck
} from "lucide-react";

export default function WarehouseDashboard() {
  const [sessionUser, setSessionUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Data lists
  const [categoriesList, setCategoriesList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [bundlesList, setBundlesList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // WMS Scanner / Config States
  const [scanInput, setScanInput] = useState("");
  const [activeBundleIdForSkus, setActiveBundleIdForSkus] = useState("");
  const [editingSkus, setEditingSkus] = useState([]);
  const [scannerAction, setScannerAction] = useState("scan_dispatch"); // "scan_dispatch" | "scan_return"
  const [qrOrder, setQrOrder] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrLoading, setQrLoading] = useState(false);

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

  // Verify Warehouse Manager / Admin Session
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        // Allow BOTH admin and warehouse roles to access the WMS panel for easy testing/operation
        if (data.authenticated && (data.user.role === "warehouse" || data.user.role === "admin")) {
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

  // Fetch Inventory, Orders, and WMS Bundles Data
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

      const bundlesRes = await fetch("/api/admin/bundles");
      if (bundlesRes.ok) {
        const bundlesData = await bundlesRes.json();
        setBundlesList(bundlesData.bundles || []);
      }
    } catch (err) {
      console.error("Error fetching WMS data:", err);
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

  // Set default category in forms on load
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

  // WMS: Create a physical bundle for an order
  const handleCreateBundle = async (orderId) => {
    try {
      const res = await fetch("/api/admin/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      });
      if (res.ok) {
        alert("WMS physical bundle generated successfully!");
        fetchData();
      } else {
        const err = await res.json();
        alert("Failed to create bundle: " + (err.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create bundle: " + err.message);
    }
  };

  // WMS: Update assigned item SKU codes inside bundle
  const handleUpdateSkus = async (bundleId, items) => {
    try {
      const res = await fetch("/api/admin/bundles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_skus", bundleId, items })
      });
      if (res.ok) {
        alert("SKUs registered and bundle packed successfully!");
        setActiveBundleIdForSkus("");
        setEditingSkus([]);
        fetchData();
      } else {
        const err = await res.json();
        alert("Failed to assign SKUs: " + (err.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to assign SKUs: " + err.message);
    }
  };

  // WMS: Barcode/QR scanning simulation
  const handleScanSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!scanInput.trim()) return;

    try {
      const res = await fetch("/api/admin/bundles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: scannerAction, bundleId: scanInput.trim() })
      });
      if (res.ok) {
        const statusText = scannerAction === "scan_dispatch" ? "Dispatched out of Warehouse" : "Collected and Sent to Laundry";
        alert(`Scan Successful: ${scanInput} has been ${statusText}`);
        setScanInput("");
        fetchData();
      } else {
        const err = await res.json();
        alert("Scan Failed: " + (err.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Scan Failed: " + err.message);
    }
  };

  // WMS: Advance returned linen through laundry steps
  const handleLaundryAdvance = async (bundleId, nextStage) => {
    try {
      const res = await fetch("/api/admin/bundles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_laundry", bundleId, laundryStatus: nextStage })
      });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert("Failed to update laundry status: " + (err.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update laundry status: " + err.message);
    }
  };

  // WMS: Cancel / Delete bundle and release allocated inventory stock
  const handleDeleteBundle = async (bundleId) => {
    if (!confirm("Are you sure you want to cancel/delete this bundle and return assigned items to available stock?")) return;
    try {
      const res = await fetch(`/api/admin/bundles?bundleId=${bundleId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Bundle cancelled and inventory released.");
        fetchData();
      } else {
        const err = await res.json();
        alert("Failed to delete bundle: " + (err.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete bundle: " + err.message);
    }
  };

  // Logistics QR Code Generator using public API
  const generateQR = async (order, bundleId) => {
    setQrOrder(order);
    setQrDataUrl("");
    setQrLoading(true);

    const text = [
      "CLOSETRUSH WMS LABELS",
      "--------------------",
      `ORDER ID : ${order.bundleOrderId}`,
      `BUNDLE ID: ${bundleId}`,
      `CUSTOMER : ${order.userName || "—"}`,
      `PHONE    : ${order.phone || "—"}`,
      `BED TYPE : ${order.bundleName}`,
      `COLOR    : ${order.deliveryAddress?.split("|")[1] || "Classic White"}`,
      `ADDRESS  : ${order.deliveryAddress?.split("|")[0] || "—"}`,
      "--------------------",
      "Scan at dock to Dispatch / Scan on return to Laundry"
    ].join("\n");

    try {
      const encoded = encodeURIComponent(text);
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encoded}&color=0d1117&bgcolor=ffffff&margin=10&format=png`;
      setQrDataUrl(url);
    } catch (e) {
      console.error("QR creation failed:", e);
    } finally {
      setQrLoading(false);
    }
  };

  const handlePrintQR = () => {
    const printWindow = window.open("", "_blank", "width=500,height=700");
    const order = qrOrder;
    const bundle = bundlesList.find(b => b.orderId === order._id.toString());
    printWindow.document.write(`
      <html><head><title>WMS label — ${bundle?.bundleId}</title>
      <style>
        body { font-family: 'Courier New', monospace; padding: 32px; background: #fff; color: #0d1117; }
        .header { font-size: 18px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
        .sub { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
        .qr { text-align: center; margin: 16px 0; }
        .qr img { width: 220px; height: 220px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 16px; }
        td { padding: 5px 8px; border-bottom: 1px solid #eee; }
        td:first-child { font-weight: 700; color: #555; width: 110px; text-transform: uppercase; font-size: 9px; letter-spacing: 1px; }
        td:last-child { font-weight: 600; color: #0d1117; }
        .footer { margin-top: 20px; font-size: 9px; color: #aaa; text-align: center; text-transform: uppercase; letter-spacing: 2px; }
      </style></head><body>
      <div class="header">ClosetRush WMS</div>
      <div class="sub">Logistics stick tag — scan on routing</div>
      <div class="qr"><img src="${qrDataUrl}" /></div>
      <table>
        <tr><td>Order ID</td><td>${order.bundleOrderId}</td></tr>
        <tr><td>Bundle ID</td><td>${bundle?.bundleId}</td></tr>
        <tr><td>Customer</td><td>${order.userName || "—"}</td></tr>
        <tr><td>Phone</td><td>${order.phone || "—"}</td></tr>
        <tr><td>Bed Type</td><td>${order.bundleName}</td></tr>
        <tr><td>Color</td><td>${order.deliveryAddress?.split("|")[1] || "Classic White"}</td></tr>
        <tr><td>Address</td><td>${order.deliveryAddress?.split("|")[0] || "—"}</td></tr>
      </table>
      <div class="footer">ClosetRush | Clean Sheets, Delivered.</div>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl || !qrOrder) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `WMS_TAG_${qrOrder.bundleOrderId}.png`;
    a.click();
  };

  // Stock Transfer Actions
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
        alert(`Successfully added ${qty} items to available stock!`);
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
          <p className="text-xs font-bold tracking-widest uppercase text-charcoal-ink/40">Verifying WMS Session...</p>
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
            You are not authorized to view the Warehouse WMS panel. Please log in using a Warehouse Manager or System Admin account.
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

  // Sidebar Tabs Configuration
  const sidebarTabs = [
    { name: "Dashboard", icon: Layers },
    { name: "Bundle Pack Registry", icon: Package },
    { name: "Thermodynamic Laundry", icon: RefreshCw },
    { name: "Intake & Transfers", icon: ArrowRightLeft },
    { name: "Cancellations Monitor", icon: ShieldAlert }
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
              WMS panel
            </span>
          </div>
 
          {/* User Profile */}
          <div className="p-4 mx-3 my-4 bg-white/05 border border-white/10 rounded-none flex items-center gap-3">
            <div className="h-10 w-10 rounded-none bg-linen-gold text-white flex items-center justify-center font-bold text-sm uppercase font-serif">
              {sessionUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{sessionUser.name}</h4>
              <p className="text-[9px] text-linen-gold font-extrabold uppercase tracking-wider">{sessionUser.role}</p>
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer border border-transparent ${
                    isActive
                      ? "bg-white/10 text-white border-linen-gold/30"
                      : "text-white/60 hover:bg-white/05 hover:text-white"
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
          {sessionUser.role === "admin" && (
            <Link
              href="/admin"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider text-linen-gold hover:bg-white/05 transition-all border border-linen-gold/30"
            >
              <UserCheck className="h-4.5 w-4.5 text-linen-gold" />
              <span>Back to Admin Panel</span>
            </Link>
          )}
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
            <span className="text-charcoal-ink/40 font-bold text-xs uppercase tracking-wider">WMS</span>
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
                <h1 className="text-2xl font-serif font-bold text-charcoal-ink mb-1">Warehouse Dashboard Overview</h1>
                <p className="text-xs text-charcoal-ink/60 max-w-xl font-medium font-sans">
                  Coordinate dispatch packages, scan logistics tags, track dynamic inventory allocations and thermodynamic laundry sanitation cycles.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-charcoal-ink/10 rounded-none p-5 hover:border-charcoal-ink/15 transition-all shadow-xs">
                  <span className="text-charcoal-ink/50 text-2xs font-bold uppercase tracking-widest block">Total Fabric Stock</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-charcoal-ink">{totalStockSum}</span>
                  </div>
                  <p className="text-3xs text-charcoal-ink/40 mt-2 font-semibold uppercase tracking-wider">Linen units tracked inside MongoDB</p>
                </div>
                <div className="bg-white border border-charcoal-ink/10 rounded-none p-5 hover:border-charcoal-ink/15 transition-all shadow-xs">
                  <span className="text-charcoal-ink/50 text-2xs font-bold uppercase tracking-widest block">Clean Available Stock</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-charcoal-ink text-linen-gold">{availableStockSum}</span>
                  </div>
                  <p className="text-3xs text-charcoal-ink/40 mt-2 font-semibold uppercase tracking-wider">Fabric ready to be packed and dispatched</p>
                </div>
                <div className="bg-white border border-charcoal-ink/10 rounded-none p-5 hover:border-charcoal-ink/15 transition-all shadow-xs">
                  <span className="text-charcoal-ink/50 text-2xs font-bold uppercase tracking-widest block">Active Rented Load</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-charcoal-ink">{rentedStockSum}</span>
                  </div>
                  <p className="text-3xs text-charcoal-ink/40 mt-2 font-semibold uppercase tracking-wider">Linen bundles currently out with clients</p>
                </div>
                <div className="bg-white border border-charcoal-ink/10 rounded-none p-5 hover:border-charcoal-ink/15 transition-all shadow-xs">
                  <span className="text-charcoal-ink/50 text-2xs font-bold uppercase tracking-widest block">Dirty Laundry Intake</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-charcoal-ink text-rose-500">{laundryStockSum}</span>
                  </div>
                  <p className="text-3xs text-charcoal-ink/40 mt-2 font-semibold uppercase tracking-wider">Awaiting thermodynamic sanitation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual inventory status bars */}
                <div className="lg:col-span-7 bg-white border border-charcoal-ink/10 rounded-none p-6 space-y-6 shadow-sm">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-charcoal-ink uppercase tracking-wider">Linen Category Stocks Distribution</h3>
                    <p className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider mt-0.5">Physical Fabric status logs in real-time</p>
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
                          
                          <div className="h-3.5 w-full bg-charcoal-ink/08 rounded-none overflow-hidden flex border border-charcoal-ink/05">
                            <div style={{ width: `${availPct}%` }} className="bg-linen-gold h-full" title={`Available: ${cat.availableStock}`} />
                            <div style={{ width: `${rentedPct}%` }} className="bg-charcoal-ink/40 h-full" title={`Rented: ${cat.rentedStock}`} />
                            <div style={{ width: `${laundryPct}%` }} className="bg-rose-500 h-full" title={`Laundry: ${cat.laundryStock}`} />
                          </div>
                          
                          <div className="flex gap-4 text-3xs font-bold tracking-wider uppercase text-charcoal-ink/50">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-linen-gold" /> Available: {cat.availableStock}</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-charcoal-ink/40" /> Rented: {cat.rentedStock}</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-rose-500" /> Laundry: {cat.laundryStock}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="lg:col-span-5 bg-white border border-charcoal-ink/10 rounded-none p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-charcoal-ink uppercase tracking-wider flex items-center gap-1.5 text-amber-600"><AlertTriangle className="w-4 h-4" /> Low Stock Alerts</h3>
                    <p className="text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-wider mt-0.5">Linen categories falling below safety buffers</p>
                  </div>
                  <div className="space-y-3">
                    {categoriesList.filter(c => c.availableStock < 20).map(cat => (
                      <div key={cat._id} className="p-3 bg-amber-500/05 border border-amber-500/25 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-extrabold text-slate-800">{cat.name}</p>
                          <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mt-0.5">Avail: {cat.availableStock} / Min Buffer: 20</p>
                        </div>
                        <span className="text-[9px] bg-amber-500 text-white font-black px-2 py-0.5 uppercase">Low</span>
                      </div>
                    ))}
                    {categoriesList.filter(c => c.availableStock < 20).length === 0 && (
                      <p className="text-2xs text-slate-450 italic">All bedding categories satisfy logistics stock buffers.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUNDLE PACK REGISTRY */}
          {activeTab === "Bundle Pack Registry" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white border border-charcoal-ink/10 rounded-none p-6 shadow-sm">
                <div>
                  <h2 className="text-lg font-serif font-bold text-charcoal-ink">New Orders & WMS Bundles Generator</h2>
                  <p className="text-xs text-charcoal-ink/50 font-semibold mt-0.5">Generate physical tracking bundles for subscription orders and configure SKU bar-codes.</p>
                </div>
                <div className="bg-linen-gold/15 text-linen-gold py-1.5 px-4 rounded-none text-2xs font-bold border border-linen-gold/25 uppercase tracking-wider">
                  Orders Count: {ordersList.length}
                </div>
              </div>

              <div className="space-y-4">
                {ordersList.map(order => {
                  const matchingBundle = bundlesList.find(b => b.orderId === order._id.toString());
                  return (
                    <div key={order._id} className="bg-white border border-charcoal-ink/10 rounded-none p-6 hover:border-linen-gold transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-2xs font-bold text-linen-gold bg-linen-gold/15 px-2.5 py-0.5 rounded-none border border-linen-gold/25 tracking-wider uppercase">
                            {order.bundleOrderId}
                          </span>
                          <span className={`px-2 py-0.5 rounded-none text-3xs font-extrabold tracking-wider uppercase border ${
                            order.orderType === "BUY" ? "bg-purple-50 text-purple-650 border-purple-200" : "bg-blue-50 text-blue-650 border-blue-200"
                          }`}>
                            {order.orderType || "RENT"}
                          </span>
                          {order.status === "CANCELLED" && (
                            <span className="px-2 py-0.5 rounded-none text-3xs font-black bg-rose-500 text-white uppercase tracking-wider">Cancelled</span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-charcoal-ink font-serif">{order.bundleName}</h3>
                          <p className="text-2xs text-charcoal-ink/55 font-bold uppercase mt-1">Color: {order.deliveryAddress?.split("|")[1] || "Classic White"} | Address: {order.deliveryAddress?.split("|")[0] || "—"}</p>
                          <p className="text-[11px] text-charcoal-ink/75 font-semibold mt-0.5">Client: {order.userName || "—"} ({order.phone || "—"})</p>
                        </div>

                        {matchingBundle && (
                          <div className="mt-4 bg-slate-50 p-4 border border-slate-200/80 space-y-3.5 max-w-xl">
                            <div className="flex justify-between items-center">
                              <span className="text-3xs font-extrabold text-slate-500 uppercase">WMS Bundle ID: <strong className="text-slate-800 font-mono text-[10px]">{matchingBundle.bundleId}</strong></span>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                                matchingBundle.status === 'CREATED' ? 'bg-slate-50 text-slate-650 border-slate-200' :
                                matchingBundle.status === 'READY_TO_DISPATCH' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                matchingBundle.status === 'DISPATCHED' ? 'bg-teal-50 text-teal-705 border-teal-200' :
                                matchingBundle.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-707 border-emerald-200' :
                                matchingBundle.status === 'SENT_TO_LAUNDRY' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                matchingBundle.status === 'IN_LAUNDRY' ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' :
                                'bg-slate-100 text-slate-450'
                              }`}>{matchingBundle.status}</span>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-slate-200/50">
                              {matchingBundle.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex justify-between items-center text-[11px]">
                                  <span className="font-bold text-slate-600">{item.itemType}</span>
                                  {activeBundleIdForSkus === matchingBundle.bundleId ? (
                                    <input
                                      type="text"
                                      value={editingSkus[itemIdx]?.sku || ""}
                                      onChange={(e) => {
                                        const updated = [...editingSkus];
                                        updated[itemIdx] = { ...updated[itemIdx], sku: e.target.value };
                                        setEditingSkus(updated);
                                      }}
                                      className="bg-white border border-slate-200 rounded py-0.5 px-2 font-bold font-mono text-[10px] w-52 focus:outline-none focus:border-teal-500"
                                    />
                                  ) : (
                                    <span className="font-mono font-bold text-slate-800">{item.sku}</span>
                                  )}
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2 pt-2 justify-end">
                              {activeBundleIdForSkus === matchingBundle.bundleId ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setActiveBundleIdForSkus("")}
                                    className="px-3 py-1.5 bg-transparent hover:bg-slate-100 text-slate-500 text-3xs font-extrabold uppercase rounded-lg transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSkus(matchingBundle.bundleId, editingSkus)}
                                    className="px-3 py-1.5 bg-teal-650 hover:bg-teal-700 text-white text-3xs font-extrabold uppercase rounded-lg transition-colors cursor-pointer"
                                  >
                                    Save SKUs & Pack
                                  </button>
                                </>
                              ) : (
                                <>
                                  {matchingBundle.status === "CREATED" && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveBundleIdForSkus(matchingBundle.bundleId);
                                        setEditingSkus(matchingBundle.items);
                                      }}
                                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-3xs font-extrabold uppercase rounded-lg transition-colors cursor-pointer"
                                    >
                                      Assign SKU Barcodes
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 flex gap-2 w-full md:w-auto">
                        {!matchingBundle ? (
                          order.status !== "CANCELLED" && (
                            <button
                              type="button"
                              onClick={() => handleCreateBundle(order._id.toString())}
                              className="py-3 px-5 bg-teal-600 hover:bg-teal-700 text-white text-2xs font-black uppercase tracking-wider rounded-none transition-all cursor-pointer shadow-md"
                            >
                              Generate WMS Bundle
                            </button>
                          )
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => generateQR(order, matchingBundle.bundleId)}
                              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-650 rounded-none transition-all cursor-pointer"
                              title="Print Logistics QR label"
                            >
                              <QrCode className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBundle(matchingBundle.bundleId)}
                              className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-none transition-all cursor-pointer"
                              title="Cancel Bundle / Release Stock"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                {ordersList.length === 0 && (
                  <p className="text-center py-10 bg-white border border-charcoal-ink/10 text-slate-400 font-bold uppercase tracking-widest text-xs">No active database orders found.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DOCKS SCAN TERMINAL */}
          {activeTab === "Docks Scan Terminal" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-md border border-slate-800 space-y-6">
                <div className="flex items-center gap-2">
                  <QrCode className="h-6 w-6 text-linen-gold animate-pulse" />
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">Logistics Barcode Terminal</h3>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Simulate a barcode/QR gun scanning physically printed bundle labels at warehouse docks.
                </p>
                
                <form onSubmit={handleScanSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Select Scan Event Action</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-800 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setScannerAction("scan_dispatch")}
                        className={`py-3.5 text-[10px] font-extrabold uppercase rounded-lg transition-colors cursor-pointer ${
                          scannerAction === "scan_dispatch" ? "bg-teal-650 text-white" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Scan Out (Dispatch)
                      </button>
                      <button
                        type="button"
                        onClick={() => setScannerAction("scan_return")}
                        className={`py-3.5 text-[10px] font-extrabold uppercase rounded-lg transition-colors cursor-pointer ${
                          scannerAction === "scan_return" ? "bg-rose-650 text-white" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Scan In (Return/Wash)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Bundle ID to Scan</label>
                    <select
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-linen-gold cursor-pointer"
                    >
                      <option value="">— Select Target Bundle —</option>
                      {bundlesList.map(b => (
                        <option key={b.bundleId} value={b.bundleId}>{b.bundleId} ({b.bedType} - {b.status})</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={!scanInput}
                    className={`w-full py-4 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                      scannerAction === "scan_dispatch"
                        ? "bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
                        : "bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
                    }`}
                  >
                    {scannerAction === "scan_dispatch" ? "Simulate Dispatch Scan" : "Simulate Return Scan"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: THERMODYNAMIC LAUNDRY */}
          {activeTab === "Thermodynamic Laundry" && (
            <div className="space-y-6">
              <div className="bg-white border border-charcoal-ink/10 rounded-none p-6 shadow-sm">
                <h3 className="font-extrabold text-slate-900 text-sm">Thermodynamic Laundry Disinfection Cycle</h3>
                <p className="text-2xs text-slate-450 mt-1">Linen returned from customers undergoes 60°C+ thermodynamic heat sanitation cycles.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bundlesList.filter(b => b.status === "SENT_TO_LAUNDRY" || b.status === "IN_LAUNDRY").map(b => {
                  const activeItemStage = b.items[0]?.laundryStatus || "PENDING_WASH";
                  return (
                    <div key={b.bundleId} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-black text-slate-900 text-xs uppercase">{b.bundleId}</span>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{b.bedType}</p>
                        </div>
                        <span className="text-[9px] bg-amber-50 text-amber-700 font-extrabold uppercase px-2 py-0.5 rounded border border-amber-200">
                          {activeItemStage.replace("_", " ")}
                        </span>
                      </div>

                      {/* Stepper Pipeline */}
                      <div className="flex justify-between items-center gap-1 py-4 border-t border-b border-slate-100">
                        {[
                          { stage: "PENDING_WASH", name: "Wash Pnd" },
                          { stage: "WASHING", name: "60°C Wash" },
                          { stage: "SANITIZING", name: "UV Sanit." },
                          { stage: "STEAM_PRESSING", name: "Pressing" },
                          { stage: "VACUUM_PACKING", name: "Seal Pack" },
                          { stage: "CLEAN_STOCK", name: "Completed" }
                        ].map((step, idx, arr) => {
                          const isCurrent = activeItemStage === step.stage;
                          const isPassed = arr.findIndex(x => x.stage === activeItemStage) > idx;
                          return (
                            <div key={step.stage} className="flex-1 flex flex-col items-center relative">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black z-10 ${
                                isCurrent ? "bg-amber-550 text-white animate-pulse" :
                                isPassed ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-400"
                              }`}>
                                {isPassed ? "✓" : idx + 1}
                              </div>
                              <span className="text-[7px] text-slate-450 font-bold uppercase tracking-tighter mt-1 text-center truncate w-full">{step.name}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Action to advance stage */}
                      <div>
                        {activeItemStage !== "CLEAN_STOCK" && (
                          <button
                            type="button"
                            onClick={() => {
                              const stages = ["PENDING_WASH", "WASHING", "SANITIZING", "STEAM_PRESSING", "VACUUM_PACKING", "CLEAN_STOCK"];
                              const currentIdx = stages.indexOf(activeItemStage);
                              const nextStage = stages[currentIdx + 1] || "CLEAN_STOCK";
                              handleLaundryAdvance(b.bundleId, nextStage);
                            }}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white text-2xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            Advance to Next Laundry Stage
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {bundlesList.filter(b => b.status === "SENT_TO_LAUNDRY" || b.status === "IN_LAUNDRY").length === 0 && (
                  <p className="text-2xs text-slate-400 italic bg-white border border-charcoal-ink/10 p-6 rounded-none shadow-sm col-span-full">No linen bundles currently in laundry sanitation pipeline.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: INTAKE & TRANSFERS */}
          {activeTab === "Intake & Transfers" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Transfer Form Panel */}
              <div className="bg-white border border-charcoal-ink/10 rounded-none p-6 space-y-6 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowRightLeft className="h-5 w-5 text-linen-gold" />
                    <h2 className="text-lg font-serif font-bold text-charcoal-ink">Operational Stock Transfer</h2>
                  </div>
                  <p className="text-xs text-charcoal-ink/50 font-semibold mt-0.5">Perform linen transfers between physical status logs</p>
                </div>

                <form onSubmit={handleStockTransfer} className="space-y-4">
                  <div>
                    <label className="text-3xs font-black uppercase text-charcoal-ink/50 tracking-wider mb-1.5 block">Linen Category</label>
                    <select
                      value={transferForm.categoryId}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full bg-white border border-charcoal-ink/15 rounded-none p-3 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold font-bold cursor-pointer"
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
                        className="w-full bg-white border border-charcoal-ink/15 rounded-none p-3 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold font-bold cursor-pointer"
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
                        className="w-full bg-white border border-charcoal-ink/15 rounded-none p-3 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold font-bold cursor-pointer"
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
                      className="w-full bg-white border border-charcoal-ink/15 rounded-none p-3 text-xs text-charcoal-ink focus:outline-none focus:border-linen-gold font-bold cursor-pointer"
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

                  <div className="text-3xs font-bold text-charcoal-ink/60 bg-alabaster-linen p-4 rounded-none border border-charcoal-ink/10 leading-relaxed font-sans">
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

          {/* TAB 6: CANCELLATIONS MONITOR */}
          {activeTab === "Cancellations Monitor" && (
            <div className="space-y-6">
              <div className="bg-white border border-charcoal-ink/10 rounded-none p-6 shadow-sm">
                <h3 className="font-extrabold text-slate-900 text-sm">Cancellations & Return Monitoring</h3>
                <p className="text-2xs text-slate-450 mt-1">Review orders that have been cancelled to ensure inventory is correctly returned to stock.</p>
              </div>

              <div className="space-y-4">
                {ordersList.filter(o => o.status === "CANCELLED").map(order => {
                  const matchingBundle = bundlesList.find(b => b.orderId === order._id.toString());
                  return (
                    <div key={order._id} className="p-5 bg-rose-50/30 border border-rose-200/50 rounded-2xl flex justify-between items-center text-xs">
                      <div className="space-y-1">
                        <span className="font-black text-rose-800 text-2xs uppercase tracking-wider">{order.bundleOrderId}</span>
                        <p className="text-[10px] text-slate-500 font-bold">Linen Set: {order.bundleName}</p>
                        {matchingBundle ? (
                          <p className="text-[10px] text-amber-700 font-bold">WMS Bundle ID: {matchingBundle.bundleId} ({matchingBundle.status})</p>
                        ) : (
                          <p className="text-[10px] text-slate-455 italic">No bundle generated</p>
                        )}
                      </div>

                      {matchingBundle && (
                        <button
                          type="button"
                          onClick={() => handleDeleteBundle(matchingBundle.bundleId)}
                          className="py-2.5 px-4 bg-rose-650 hover:bg-rose-700 text-white text-3xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                        >
                          Release Bundle Stock
                        </button>
                      )}
                    </div>
                  );
                })}
                {ordersList.filter(o => o.status === "CANCELLED").length === 0 && (
                  <p className="text-2xs text-slate-400 italic bg-white border border-charcoal-ink/10 p-6 rounded-none shadow-sm">No cancelled orders found.</p>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* QR Label Printer modal overlay */}
      {qrOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-charcoal-ink/10 rounded-none w-full max-w-sm p-0 shadow-2xl relative text-charcoal-ink my-8">
            
            {/* Modal header */}
            <div className="p-6 border-b border-black/05 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-charcoal-ink/40">Logistics sticker tag</span>
              <button
                onClick={() => setQrOrder(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Label Print Frame */}
            <div className="p-8 flex flex-col items-center">
              {qrLoading ? (
                <div className="w-[280px] h-[280px] flex items-center justify-center bg-slate-50 border border-slate-200">
                  <RefreshCw className="h-8 w-8 animate-spin text-linen-gold" />
                </div>
              ) : qrDataUrl ? (
                <div className="w-[280px] h-[280px] border border-charcoal-ink/10 bg-white p-2">
                  <img src={qrDataUrl} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-[280px] h-[280px] flex items-center justify-center bg-slate-50 border border-dashed border-slate-300 text-slate-400 text-xs">
                  Failed to generate QR
                </div>
              )}

              <p className="mt-3 text-[10px] text-charcoal-ink/40 font-bold uppercase tracking-widest text-center">
                Scan to verify bundle details
              </p>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={handlePrintQR}
                disabled={!qrDataUrl}
                className="flex-1 py-3 px-4 bg-charcoal-ink hover:bg-charcoal-ink/90 text-white text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 rounded-none"
              >
                <Printer className="h-4 w-4" /> Print QR
              </button>
              <button
                onClick={handleDownloadQR}
                disabled={!qrDataUrl}
                className="flex-1 py-3 px-4 bg-linen-gold hover:bg-[#9a7c5a] text-white text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 rounded-none"
              >
                <Download className="h-4 w-4" /> Download PNG
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
