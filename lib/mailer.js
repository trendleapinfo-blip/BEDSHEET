import nodemailer from "nodemailer";

/**
 * Brevo (Sendinblue) SMTP transporter
 * Uses SMTP relay — free tier allows 300 emails/day
 */
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS via STARTTLS
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,   // Your Brevo account email
    pass: process.env.BREVO_SMTP_KEY,     // SMTP key from Brevo dashboard
  },
});

/**
 * Send a plain OTP email
 * @param {string} to  - recipient email
 * @param {string} otp - 6-digit code
 * @param {string} purpose - "reset_password" | "login" | "signup"
 */
export async function sendOtpEmail(to, otp, purpose = "verification") {
  const purposeLabel = {
    reset_password: "Password Reset",
    login: "Login Verification",
    signup: "Email Verification",
  }[purpose] || "Verification";

  const mailOptions = {
    from: `"ClosetRush" <${process.env.BREVO_FROM_EMAIL}>`,
    to,
    subject: `Your ClosetRush ${purposeLabel} Code: ${otp}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ClosetRush OTP</title>
</head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e0d5;max-width:520px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0F172A;padding:28px 40px;text-align:center;">
              <span style="font-size:22px;font-weight:800;letter-spacing:4px;color:#B2905F;font-family:Georgia,serif;text-transform:uppercase;">
                ClosetRush
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 28px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#B2905F;">
                ${purposeLabel}
              </p>
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#1a1a2e;font-family:Georgia,serif;line-height:1.3;">
                Your verification code
              </h1>
              <p style="margin:0 0 28px;font-size:14px;color:#555;line-height:1.6;">
                Use the code below to complete your ${purposeLabel.toLowerCase()}. 
                This code expires in <strong>5 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background:#F5F0E8;border:2px solid #B2905F;padding:24px;text-align:center;margin-bottom:28px;">
                <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#0F172A;font-family:'Courier New',monospace;">
                  ${otp}
                </span>
              </div>

              <p style="margin:0 0 8px;font-size:12px;color:#888;line-height:1.6;">
                If you did not request this code, you can safely ignore this email. 
                Your account remains secure.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e5e0d5;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#aaa;font-weight:600;">
                © ${new Date().getFullYear()} ClosetRush. All rights reserved. •
                <a href="https://closetrush.in" style="color:#B2905F;text-decoration:none;">closetrush.in</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };

  await transporter.sendMail(mailOptions);
}
