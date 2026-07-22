import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const targetDir = path.join(process.cwd(), "public", "sounds");
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetFilePath = path.join(targetDir, "relaxing-piano.mp3");

    // If file already exists and is larger than 100KB, skip download
    if (fs.existsSync(targetFilePath) && fs.statSync(targetFilePath).size > 100000) {
      return NextResponse.json({ success: true, message: "File already exists and is valid." });
    }

    const audioUrl = "https://www.no-copyright-music.com/wp-content/uploads/2021/09/OnAPianoCloud.mp3";
    const response = await fetch(audioUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(targetFilePath, Buffer.from(buffer));

    return NextResponse.json({ success: true, message: "Audio downloaded successfully!" });
  } catch (error) {
    console.error("Audio download error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
