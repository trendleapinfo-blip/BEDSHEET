import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import BrandSettings from "@/models/BrandSettings";

export async function GET() {
  try {
    await dbConnect();
    let settings = await BrandSettings.findOne();
    if (!settings) {
      settings = await BrandSettings.create({
        brandName: "ClosetRush",
        installBannerText: "Add to home screen for a better experience",
        installBannerActive: true,
        primaryColor: "#0F172A",
        accentColor: "#245c77",
        contactEmail: "support@closetrush.com",
        singleBedDeposit: 500,
        doubleBedDeposit: 800,
      });
    }
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Fetch Settings Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { brandName, heroImage, installBannerText, installBannerActive, primaryColor, accentColor, contactEmail, availableColors, singleBedDeposit, doubleBedDeposit, paymentStyles } = await request.json();

    let settings = await BrandSettings.findOne();
    if (settings) {
      settings.brandName = brandName !== undefined ? brandName : settings.brandName;
      settings.heroImage = heroImage !== undefined ? heroImage : settings.heroImage;
      settings.installBannerText = installBannerText !== undefined ? installBannerText : settings.installBannerText;
      settings.installBannerActive = installBannerActive !== undefined ? installBannerActive : settings.installBannerActive;
      settings.primaryColor = primaryColor !== undefined ? primaryColor : settings.primaryColor;
      settings.accentColor = accentColor !== undefined ? accentColor : settings.accentColor;
      settings.contactEmail = contactEmail !== undefined ? contactEmail : settings.contactEmail;
      settings.availableColors = availableColors !== undefined ? availableColors : settings.availableColors;
      settings.singleBedDeposit = singleBedDeposit !== undefined ? Number(singleBedDeposit) : settings.singleBedDeposit;
      settings.doubleBedDeposit = doubleBedDeposit !== undefined ? Number(doubleBedDeposit) : settings.doubleBedDeposit;
      if (paymentStyles !== undefined) settings.paymentStyles = paymentStyles;
      await settings.save();
    } else {
      settings = await BrandSettings.create({
        brandName,
        installBannerText,
        installBannerActive,
        primaryColor,
        accentColor,
        contactEmail,
        availableColors,
        singleBedDeposit: Number(singleBedDeposit || 500),
        doubleBedDeposit: Number(doubleBedDeposit || 800),
        paymentStyles
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Save Settings Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
