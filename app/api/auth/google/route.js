import { NextResponse } from "next/server";

export async function GET() {
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const redirect_uri = process.env.GOOGLE_CALLBACK_URL;

  if (!client_id || !redirect_uri) {
    return NextResponse.json(
      { error: "Google OAuth Client ID or Callback URL is missing in server configuration." },
      { status: 500 }
    );
  }

  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: redirect_uri,
    client_id: client_id,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  const targetUrl = `${rootUrl}?${qs.toString()}`;

  return NextResponse.redirect(targetUrl);
}
