import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Bundle from "@/models/Bundle";
import bcrypt from "bcryptjs";

export async function GET() {
  return executeCleanSeed();
}

export async function POST() {
  return executeCleanSeed();
}

async function executeCleanSeed() {
  try {
    await dbConnect();

    // STEP 1: WIPE ALL EXTRA MOCK DATA FROM DATABASE
    await User.deleteMany({});
    await Order.deleteMany({});
    await Bundle.deleteMany({});

    // STEP 2: CREATE ADMIN ACCOUNT
    const adminHashedPassword = await bcrypt.hash("adminpassword", 10);
    const adminUser = await User.create({
      name: "ClosetRush Admin",
      email: "admin@closetrush.com",
      mobile: "9999999999",
      password: adminHashedPassword,
      address: "ClosetRush HQ, Delhi NCR",
      accountType: "Individual User",
      role: "admin",
      status: "ACTIVE"
    });

    // STEP 3: CREATE 4 REAL CUSTOMER ACCOUNTS
    const customerPassword = await bcrypt.hash("closetrush123", 10);

    const customersInfo = [
      {
        sNo: 1,
        name: "Karanbeer Singh",
        email: "karanbeeru801@gmail.com",
        mobile: "9091939129",
        bookingDate: new Date("2026-07-11T00:00:00.000Z"),
        bundleName: "Double Bed Bedsheet",
        duration: "1 Month",
        durationMonths: 1,
        calculatedRent: 500,
        depositCharged: 800,
        gst: 90,
        finalPrice: 1390,
        totalAmount: 1390,
        deliveryAddress: "The Peepul Stay 2 PG, Sector 69, Gurugram, Haryana – 122101",
        subscriptionStatus: "Pending",
        depositStatus: "Pending",
        status: "DELIVERED",
        dispatchStatus: "DISPATCHED",
        bundleOrderId: "CR-2026-0711-KBS",
        wmsBundleId: "WMS-BNDL-2026-KBS-01",
        hasPaidDeposit: true
      },
      {
        sNo: 2,
        name: "Shourya Agrawal",
        email: "shourya52003@gmail.com",
        mobile: "9058789666",
        bookingDate: new Date("2026-07-01T00:00:00.000Z"),
        bundleName: "Double Bed Bedsheet",
        duration: "1 Month",
        durationMonths: 1,
        calculatedRent: 500,
        depositCharged: 800,
        gst: 90,
        finalPrice: 1390,
        totalAmount: 1390,
        deliveryAddress: "Ravinder PG, Sector 69, Gurugram, Haryana – 122101",
        subscriptionStatus: "Pending",
        depositStatus: "Pending",
        status: "DELIVERED",
        dispatchStatus: "DISPATCHED",
        bundleOrderId: "CR-2026-0701-SA",
        wmsBundleId: "WMS-BNDL-2026-SA-02",
        hasPaidDeposit: true
      },
      {
        sNo: 3,
        name: "Roshan Kumar Yadav",
        email: "roshanyadav44@gmail.com",
        mobile: "9311428047",
        bookingDate: new Date("2026-06-13T00:00:00.000Z"),
        bundleName: "Single Bed Bundle",
        duration: "1 Month",
        durationMonths: 1,
        calculatedRent: 300,
        depositCharged: 500,
        gst: 54,
        finalPrice: 854,
        totalAmount: 854,
        deliveryAddress: "Shree Shyam PG, Sohna, Gurugram, Haryana – 122103",
        subscriptionStatus: "Completed",
        depositStatus: "Refund Completed",
        status: "DELIVERED",
        dispatchStatus: "DISPATCHED",
        bundleOrderId: "CR-2026-0613-RKY",
        wmsBundleId: "WMS-BNDL-2026-RKY-03",
        hasPaidDeposit: true
      },
      {
        sNo: 4,
        name: "Himanshu Kumar Rai",
        email: "himanshukumarrai290@gmail.com",
        mobile: "8081423638",
        bookingDate: new Date("2026-06-13T00:00:00.000Z"),
        bundleName: "Single Bed Bundle",
        duration: "1 Month",
        durationMonths: 1,
        calculatedRent: 300,
        depositCharged: 500,
        gst: 54,
        finalPrice: 854,
        totalAmount: 854,
        deliveryAddress: "Our Homes 8, The County by Trisara, Sohna, Haryana – 122103",
        subscriptionStatus: "Completed",
        depositStatus: "Refund Completed",
        status: "DELIVERED",
        dispatchStatus: "DISPATCHED",
        bundleOrderId: "CR-2026-0613-HKR",
        wmsBundleId: "WMS-BNDL-2026-HKR-04",
        hasPaidDeposit: true
      }
    ];

    const createdUsers = [];
    const createdOrders = [];
    const createdWmsBundles = [];

    for (const data of customersInfo) {
      // 1. Create User
      const user = await User.create({
        name: data.name,
        email: data.email.toLowerCase(),
        mobile: data.mobile,
        password: customerPassword,
        address: data.deliveryAddress,
        accountType: "Individual User",
        role: "user",
        status: "ACTIVE",
        hasPaidDeposit: data.hasPaidDeposit,
        selectedPlan: {
          bedType: data.bundleName,
          planName: data.bundleName,
          price: data.calculatedRent,
          duration: data.duration,
          securityDeposit: data.depositCharged,
          gst: data.gst,
          totalPrice: data.finalPrice,
          startDate: data.bookingDate
        }
      });
      createdUsers.push(user);

      // 2. Create Order
      const order = await Order.create({
        bundleOrderId: data.bundleOrderId,
        wmsBundleId: data.wmsBundleId,
        userId: user._id.toString(),
        userName: data.name,
        phone: data.mobile,
        email: data.email.toLowerCase(),
        bundleName: data.bundleName,
        duration: data.duration,
        durationMonths: data.durationMonths,
        calculatedRent: data.calculatedRent,
        depositCharged: data.depositCharged,
        gst: data.gst,
        depositStatus: data.depositStatus,
        subscriptionStatus: data.subscriptionStatus,
        finalPrice: data.finalPrice,
        totalAmount: data.totalAmount,
        deliveryAddress: data.deliveryAddress,
        status: data.status,
        dispatchStatus: data.dispatchStatus,
        dispatchedAt: data.bookingDate,
        orderType: "RENT",
        orderCategory: "B2C",
        startDate: data.bookingDate
      });
      createdOrders.push(order);

      // 3. Create WMS Bundle Document
      const wmsBundle = await Bundle.create({
        bundleId: data.wmsBundleId,
        orderId: data.bundleOrderId,
        parentOrderId: data.bundleOrderId,
        customerName: data.name,
        bedType: data.bundleName,
        color: "Pure White Organic Cotton",
        status: "DISPATCHED",
        items: [
          {
            sku: `SKU-${data.sNo}-SHT-01`,
            itemType: "Bedsheet",
            laundryStatus: "CLEAN_STOCK",
            qrCode: `QR-SHT-${data.bundleOrderId}-01`
          },
          {
            sku: `SKU-${data.sNo}-PLW-01`,
            itemType: "Pillow Cover",
            laundryStatus: "CLEAN_STOCK",
            qrCode: `QR-PLW-${data.bundleOrderId}-01`
          }
        ]
      });
      createdWmsBundles.push(wmsBundle);
    }

    return NextResponse.json({
      success: true,
      message: "Database cleanly wiped and re-seeded with ONLY 1 Admin + 4 Customer Accounts & WMS Dispatched Orders!",
      adminAccount: {
        email: adminUser.email,
        role: adminUser.role
      },
      customerCount: createdUsers.length,
      ordersCount: createdOrders.length,
      wmsBundlesCount: createdWmsBundles.length,
      users: createdUsers.map(u => ({ id: u._id, name: u.name, email: u.email })),
      orders: createdOrders.map(o => ({
        bundleOrderId: o.bundleOrderId,
        wmsBundleId: o.wmsBundleId,
        userName: o.userName,
        bundleName: o.bundleName,
        finalPrice: o.finalPrice,
        status: o.status,
        dispatchStatus: o.dispatchStatus,
        depositStatus: o.depositStatus,
        subscriptionStatus: o.subscriptionStatus
      }))
    });

  } catch (error) {
    console.error("Clean seed error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
