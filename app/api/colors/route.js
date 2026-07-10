import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ProductColor from "@/models/ProductColor";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const bedType = searchParams.get("bedType");
    
    let query = {};
    if (bedType) {
      query.bedType = bedType;
    }
    
    let colors = await ProductColor.find(query).lean();
    
    // Auto-seed default colors and image paths if collection is completely empty
    if (colors.length === 0 && !bedType) {
      colors = await ProductColor.create([
        // Single bedding colors
        { bedType: "Bedsheet + Pillow (Single)", colorName: "Classic White", hexCode: "#FFFFFF", images: ["/cat_single.png", "/banner_1.png"] },
        { bedType: "Bedsheet + Pillow (Single)", colorName: "Deep Teal", hexCode: "#245c77", images: ["/cat_single.png", "/banner_1.png"] },
        { bedType: "Bedsheet + Pillow (Single)", colorName: "Linen Gold", hexCode: "#A89276", images: ["/cat_single.png", "/banner_1.png"] },
        
        // Double bedding colors
        { bedType: "Bedsheet + Pillow (Double)", colorName: "Classic White", hexCode: "#FFFFFF", images: ["/cat_double.png", "/banner_1.png"] },
        { bedType: "Bedsheet + Pillow (Double)", colorName: "Deep Teal", hexCode: "#245c77", images: ["/cat_double.png", "/banner_1.png"] },
        { bedType: "Bedsheet + Pillow (Double)", colorName: "Slate Gray", hexCode: "#64748B", images: ["/cat_double.png", "/banner_1.png"] },
        
        // Curtains colors
        { bedType: "Curtains", colorName: "Classic White", hexCode: "#FFFFFF", images: ["/cat_curtains.png", "/banner_1.png"] },
        { bedType: "Curtains", colorName: "Linen Gold", hexCode: "#A89276", images: ["/cat_curtains.png", "/banner_1.png"] },
        
        // Quilts colors
        { bedType: "Quilts", colorName: "Classic White", hexCode: "#FFFFFF", images: ["/cat_quilt.png", "/banner_1.png"] },
        { bedType: "Quilts", colorName: "Lavender Mist", hexCode: "#E9E3FF", images: ["/cat_quilt.png", "/banner_1.png"] },
        
        // Blankets colors
        { bedType: "Blankets", colorName: "Slate Gray", hexCode: "#64748B", images: ["/cat_blankets.png", "/banner_1.png"] },
        { bedType: "Blankets", colorName: "Deep Teal", hexCode: "#245c77", images: ["/cat_blankets.png", "/banner_1.png"] },
      ]);
    }
    
    return NextResponse.json({ success: true, colors });
  } catch (error) {
    console.error("Fetch product colors error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { id, bedType, colorName, hexCode, images } = await request.json();
    
    if (!bedType || !colorName || !hexCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    let color;
    if (id) {
      color = await ProductColor.findById(id);
      if (color) {
        color.bedType = bedType;
        color.colorName = colorName;
        color.hexCode = hexCode;
        color.images = images || [];
        await color.save();
      } else {
        return NextResponse.json({ error: "Color configuration not found" }, { status: 404 });
      }
    } else {
      // Create new
      color = await ProductColor.create({
        bedType,
        colorName,
        hexCode,
        images: images || [],
      });
    }
    
    return NextResponse.json({ success: true, color });
  } catch (error) {
    console.error("Save product color error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Missing color configuration ID" }, { status: 400 });
    }
    
    await ProductColor.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product color error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
