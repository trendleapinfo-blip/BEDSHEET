import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      console.error("Google OAuth returned error:", error);
      return NextResponse.redirect(new URL("/login?error=oauth_denied", request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=no_code", request.url));
    }

    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uri = process.env.GOOGLE_CALLBACK_URL;

    // Exchange code for token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: "authorization_code",
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Token exchange failed:", tokenData);
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", request.url));
    }

    const { access_token } = tokenData;

    // Fetch user info from Google API
    const userinfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    );
    const profile = await userinfoResponse.json();

    if (!profile.email) {
      return NextResponse.redirect(new URL("/login?error=email_not_provided", request.url));
    }

    await dbConnect();

    // 1. Find user by googleId
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // 2. If not found by googleId, check by email
      user = await User.findOne({ email: profile.email.toLowerCase() });

      if (user) {
        // Link googleId to existing account
        user.googleId = profile.id;
        await user.save();
      } else {
        // 3. Register a new user
        user = await User.create({
          name: profile.name,
          email: profile.email.toLowerCase(),
          googleId: profile.id,
          accountType: "Individual User", // Default type
          address: "",
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Set Cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    // Redirect user to home page
    return NextResponse.redirect(new URL("/", request.url));
  } catch (err) {
    console.error("Google OAuth Callback Error:", err);
    return NextResponse.redirect(new URL("/login?error=callback_internal_error", request.url));
  }
}
