import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import bcrypt from "bcryptjs";

export async function GET() {
  return handleSeed();
}

export async function POST() {
  return handleSeed();
}

async function handleSeed() {
  try {
    await dbConnect();

    const defaultPassword = await bcrypt.hash("closetrush123", 10);

    const customerData = [
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
        status: "PENDING",
        bundleOrderId: "CR-2026-0711-KBS",
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
        status: "PENDING",
        bundleOrderId: "CR-2026-0701-SA",
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
        bundleOrderId: "CR-2026-0613-RKY",
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
        bundleOrderId: "CR-2026-0613-HKR",
        hasPaidDeposit: true
      }
    ];

    const seededUsers = [];
    const seededOrders = [];

    for (const data of customerData) {
      // 1. Create or Update User
      let user = await User.findOne({ email: data.email.toLowerCase() });

      if (user) {
        user.name = data.name;
        user.mobile = data.mobile;
        user.address = data.deliveryAddress;
        user.hasPaidDeposit = data.hasPaidDeposit;
        user.selectedPlan = {
          bedType: data.bundleName,
          planName: data.bundleName,
          price: data.calculatedRent,
          duration: data.duration,
          securityDeposit: data.depositCharged,
          gst: data.gst,
          totalPrice: data.finalPrice,
          startDate: data.bookingDate
        };
        await user.save();
      } else {
        user = await User.create({
          name: data.name,
          email: data.email.toLowerCase(),
          mobile: data.mobile,
          password: defaultPassword,
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
      }
      seededUsers.push(user);

      // 2. Create or Update Order
      let order = await Order.findOne({ bundleOrderId: data.bundleOrderId });

      if (order) {
        order.userId = user._id.toString();
        order.userName = data.name;
        order.phone = data.mobile;
        order.email = data.email.toLowerCase();
        order.bundleName = data.bundleName;
        order.duration = data.duration;
        order.durationMonths = data.durationMonths;
        order.calculatedRent = data.calculatedRent;
        order.depositCharged = data.depositCharged;
        order.gst = data.gst;
        order.depositStatus = data.depositStatus;
        order.subscriptionStatus = data.subscriptionStatus;
        order.finalPrice = data.finalPrice;
        order.totalAmount = data.totalAmount;
        order.deliveryAddress = data.deliveryAddress;
        order.status = data.status;
        order.startDate = data.bookingDate;
        await order.save();
      } else {
        order = await Order.create({
          bundleOrderId: data.bundleOrderId,
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
          orderType: "RENT",
          orderCategory: "B2C",
          startDate: data.bookingDate
        });
      }
      seededOrders.push(order);
    }

    return NextResponse.json({
      success: true,
      message: "Successfully seeded 4 customer records and orders into Database!",
      usersCount: seededUsers.length,
      ordersCount: seededOrders.length,
      seededUsers: seededUsers.map(u => ({ id: u._id, name: u.name, email: u.email })),
      seededOrders: seededOrders.map(o => ({
        bundleOrderId: o.bundleOrderId,
        userName: o.userName,
        bundleName: o.bundleName,
        finalPrice: o.finalPrice,
        status: o.status,
        depositStatus: o.depositStatus,
        subscriptionStatus: o.subscriptionStatus
      }))
    });

  } catch (error) {
    console.error("Error seeding customer data:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
