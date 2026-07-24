import { NextResponse } from "next/server";
import webpush from "web-push";
import dbConnect from "../../../../lib/db";
import User from "../../../../models/User";

webpush.setVapidDetails(
  "mailto:admin@closerush.in",
  process.env.VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

export async function POST(req) {
  try {
    await dbConnect();
    const { title, message, url, image } = await req.json();

    // Fetch all users with active push subscriptions
    const users = await User.find({ "pushSubscriptions.0": { $exists: true } });

    const payload = JSON.stringify({
      title,
      message,
      url: url || "/",
      image,
    });

    let successCount = 0;
    let failureCount = 0;

    for (const user of users) {
      for (const sub of user.pushSubscriptions) {
        try {
          await webpush.sendNotification(sub, payload);
          successCount++;
        } catch (err) {
          console.error("Error sending push notification to a sub:", err.statusCode);
          // 410 or 404 means the subscription is no longer valid
          if (err.statusCode === 410 || err.statusCode === 404) {
             // In a real production environment, you should remove stale subscriptions here
             failureCount++;
          } else {
             failureCount++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Push sent! Success: ${successCount}, Failures: ${failureCount}`,
    });
  } catch (error) {
    console.error("Failed to send broadcast:", error);
    return NextResponse.json({ success: false, error: "Broadcast failed" }, { status: 500 });
  }
}
