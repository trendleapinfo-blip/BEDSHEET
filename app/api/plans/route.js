import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Plan from "@/models/Plan";
import DurationDiscount from "@/models/DurationDiscount";

export async function GET() {
  try {
    await dbConnect();

    // Fetch the pristine data from the new schema
    const rawPlans = await Plan.find({}).lean();
    const rawDiscounts = await DurationDiscount.find({}).sort({ durationMonths: 1 }).lean();

    // If database isn't seeded correctly, return empty instead of crashing
    if (!rawPlans || rawPlans.length === 0) {
      return NextResponse.json({ success: true, plans: [] }, { headers: { "Cache-Control": "no-store, max-age=0" } });
    }

    const legacyMappedPlans = [];

    rawPlans.forEach(plan => {
      // Create a set of duration options for each plan tier and bedType based on the discounts table
      rawDiscounts.forEach(discountObj => {
        const dMonths = discountObj.durationMonths;
        const dPercent = discountObj.discountPercent;
        
        let planName = plan.tier === "Premium" ? `${plan.bedType === "single" ? "Single" : "Double"} Bed Premium` : `${plan.bedType === "single" ? "Single" : "Double"} Bed Basic`;
        let bedTypeLabel = `Bedsheet + Pillow (${plan.bedType === "single" ? "Single" : "Double"})`;
        let sizeLabel = plan.bedType === "single" ? "6x3 ft" : "6x5 ft";
        
        let calculatedPrice = plan.monthlyRate * dMonths;
        let originalPrice = null;
        let discountBadge = null;

        if (dPercent > 0) {
          originalPrice = calculatedPrice;
          calculatedPrice = Math.round(originalPrice * (1 - (dPercent / 100)));
          discountBadge = `${dPercent}% off`;
        }

        legacyMappedPlans.push({
          _id: `${plan._id}_${dMonths}`, // Mock ID
          bedType: bedTypeLabel,
          size: sizeLabel,
          name: planName,
          duration: dMonths === 1 ? "1 Month" : `${dMonths} Months`,
          price: calculatedPrice,
          originalPrice: originalPrice,
          discount: discountBadge,
          popular: dMonths >= 6 && plan.tier === "Premium",
          badge: dMonths >= 6 ? "Best Value" : null,
          features: [
            `${dMonths === 1 ? "1" : dMonths} Swaps (${plan.tier === "Premium" ? "Weekly" : "Monthly"})`,
            "Premium Quality",
            "Free Doorstep Logistics"
          ],
          cta: "Choose Plan"
        });
      });
    });

    return NextResponse.json({ success: true, plans: legacyMappedPlans }, {
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (error) {
    console.error("Fetch plans error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
