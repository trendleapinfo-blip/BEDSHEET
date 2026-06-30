import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const src = "C:\\Users\\prasa\\.gemini\\antigravity-ide\\brain\\2067b4ba-f2c9-40dc-af8d-95398ab704d8\\hero_bedding_1780921028900.png";
    const dst = path.join(process.cwd(), "public", "hero_bedding.png");
    
    // Ensure destination directory exists
    const destDir = path.dirname(dst);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(src, dst);
    return NextResponse.json({ success: true, message: "Image copied successfully!" });
  } catch (error) {
    console.error("Copy image error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
