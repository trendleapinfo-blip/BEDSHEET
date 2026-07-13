import nodemailer from "nodemailer";

/**
 * Dynamic SMTP Transporter
 * Automatically configured for Gmail SMTP by default, fallback support for other relays.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === "false" ? false : true, // true for port 465
  auth: {
    user: process.env.SMTP_USER || "trendleap.info@gmail.com",
    pass: process.env.SMTP_PASS || "qxzqmzjjdqxzoabf",
  },
});

const fromEmail = process.env.SMTP_FROM || "trendleap.info@gmail.com";

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
    from: `"ClosetRush" <${fromEmail}>`,
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

/**
 * Send a beautiful HTML order confirmation email to the user
 * @param {string} to  - recipient email
 * @param {object} orderDetails - order information
 */
export async function sendOrderConfirmationEmail(to, orderDetails) {
  const {
    userName,
    bundleOrderId,
    bundleName,
    orderType,
    subscriptionType,
    price,
    securityDeposit,
    gst,
    discount,
    totalPrice,
    deliveryAddress,
    startDate,
    duration
  } = orderDetails;

  const isBuy = orderType === "BUY";

  // Format dates nicely
  const formattedDate = new Date(startDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Next Bed Sheet Arrival Logic
  let arrivalTitle = "Next Sheet Swap Service";
  let arrivalDescription = "";

  if (isBuy) {
    arrivalTitle = "Estimated Delivery Timeline";
    arrivalDescription = `Your premium vacuum-sealed, thermodynamically sanitized linen set is being prepared at our fulfillment center. It will be dispatched via express courier and will arrive at your address within <strong>3-5 business days</strong>. This is a direct retail purchase.`;
  } else if (subscriptionType === "weekly") {
    arrivalTitle = "Weekly Bedding Swap Schedule";
    arrivalDescription = `Our professional hygiene swap staff will visit your delivery address every <strong>7 days</strong>. On your swap day, our specialist will strip your bed, handle the dirty sheets, and lay down freshly sanitized organic linen.`;
  } else {
    arrivalTitle = "Monthly Fresh Linen Kit";
    arrivalDescription = `Your next fresh linen kit is scheduled for delivery in <strong>30 days</strong>. We will drop off the fresh kit and collect your used linens. Please pack your dirty sheets in your custom ClosetRush laundry bag before our dispatch agent arrives.`;
  }

  const mailOptions = {
    from: `"ClosetRush" <${fromEmail}>`,
    to,
    subject: `Order Confirmed: ${bundleOrderId} - ClosetRush`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ClosetRush Order Confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F0E8;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F0E8;padding:40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e5e0d5;max-width:600px;width:100%;box-shadow:0 4px 12px rgba(0,0,0,0.03);">

          <!-- Brand Header -->
          <tr>
            <td style="background-color:#0F172A;padding:32px 40px;text-align:center;">
              <span style="font-size:24px;font-weight:800;letter-spacing:4px;color:#B2905F;font-family:Georgia,serif;text-transform:uppercase;">
                ClosetRush
              </span>
            </td>
          </tr>

          <!-- Success Banner -->
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;">
              <div style="width:56px;height:56px;background-color:#F0FDF4;border:2px solid #BBF7D0;border-radius:50%;display:inline-block;line-height:56px;text-align:center;margin-bottom:20px;">
                <span style="font-size:28px;color:#15803D;font-weight:bold;">✓</span>
              </div>
              <h1 style="margin:0 0 10px;font-size:24px;font-weight:700;color:#0F172A;font-family:Georgia,serif;">
                Order Confirmed!
              </h1>
              <p style="margin:0;font-size:14px;color:#555;line-height:1.6;font-weight:500;">
                Hi ${userName}, your ${isBuy ? 'purchase' : 'subscription'} has been successfully placed. Here are your order details:
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e5e0d5;margin:0;" />
            </td>
          </tr>

          <!-- Order Summary Section -->
          <tr>
            <td style="padding:30px 40px;">
              <h3 style="margin:0 0 16px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#B2905F;font-family:Georgia,serif;">
                Order Summary
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;line-height:2.0;color:#444;">
                <tr>
                  <td width="40%" style="font-weight:bold;color:#666;">Order ID:</td>
                  <td width="60%" style="font-weight:bold;color:#0F172A;">${bundleOrderId}</td>
                </tr>
                <tr>
                  <td style="font-weight:bold;color:#666;">Bundle Item:</td>
                  <td style="color:#0F172A;">${bundleName}</td>
                </tr>
                <tr>
                  <td style="font-weight:bold;color:#666;">Order Type:</td>
                  <td style="color:#0F172A;text-transform:uppercase;font-weight:700;">${orderType}</td>
                </tr>
                <tr>
                  <td style="font-weight:bold;color:#666;">Service Duration:</td>
                  <td style="color:#0F172A;">${duration}</td>
                </tr>
                <tr>
                  <td style="font-weight:bold;color:#666;">Start Date:</td>
                  <td style="color:#0F172A;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="font-weight:bold;color:#666;vertical-align:top;padding-top:4px;">Delivery Address:</td>
                  <td style="color:#0F172A;line-height:1.4;padding-top:4px;">${deliveryAddress}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Next Bedsheet Arrival Info Block -->
          <tr>
            <td style="padding:0 40px 10px;">
              <div style="background-color:#F5F0E8;border-left:4px solid #B2905F;padding:20px;margin-bottom:20px;">
                <h4 style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0F172A;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">
                  ⏰ ${arrivalTitle}
                </h4>
                <p style="margin:0;font-size:12.5px;color:#555;line-height:1.6;">
                  ${arrivalDescription}
                </p>
              </div>
            </td>
          </tr>

          <!-- Pricing Table -->
          <tr>
            <td style="padding:20px 40px 30px;">
              <h3 style="margin:0 0 16px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#B2905F;font-family:Georgia,serif;">
                Payment Details
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;line-height:1.8;color:#444;border-collapse:collapse;">
                <tr style="border-bottom:1px solid #f1f1f1;">
                  <td style="padding:8px 0;color:#666;">Base Price:</td>
                  <td align="right" style="padding:8px 0;font-weight:bold;color:#0F172A;">₹${price}</td>
                </tr>
                <tr style="border-bottom:1px solid #f1f1f1;">
                  <td style="padding:8px 0;color:#666;">GST (18%):</td>
                  <td align="right" style="padding:8px 0;font-weight:bold;color:#0F172A;">₹${gst}</td>
                </tr>
                <tr style="border-bottom:1px solid #f1f1f1;">
                  <td style="padding:8px 0;color:#666;">Security Deposit:</td>
                  <td align="right" style="padding:8px 0;font-weight:bold;color:#0F172A;">₹${securityDeposit}</td>
                </tr>
                ${discount > 0 ? `
                <tr style="border-bottom:1px solid #f1f1f1;color:#16A34A;">
                  <td style="padding:8px 0;">Coupon Discount:</td>
                  <td align="right" style="padding:8px 0;font-weight:bold;">-₹${discount}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding:12px 0 0;font-size:15px;font-weight:bold;color:#0F172A;">Total Paid Amount:</td>
                  <td align="right" style="padding:12px 0 0;font-size:18px;font-weight:900;color:#B2905F;">₹${totalPrice}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e5e0d5;margin:0;" />
            </td>
          </tr>

          <!-- Need Help banner -->
          <tr>
            <td style="padding:30px 40px;text-align:center;">
              <h4 style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0F172A;font-family:Georgia,serif;">
                Have questions or need to reschedule?
              </h4>
              <p style="margin:0;font-size:12px;color:#666;line-height:1.6;">
                You can easily reschedule swaps or create support requests directly in your Customer Dashboard, or email us at 
                <a href="mailto:support@closetrush.in" style="color:#B2905F;text-decoration:none;font-weight:bold;">support@closetrush.in</a>
              </p>
            </td>
          </tr>

          <!-- Footer Bar -->
          <tr>
            <td style="background-color:#0F172A;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:11px;color:#aaa;font-weight:600;">
                © ${new Date().getFullYear()} ClosetRush. All rights reserved.
              </p>
              <p style="margin:0;font-size:11px;">
                <a href="https://closetrush.in" style="color:#B2905F;text-decoration:none;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">closetrush.in</a>
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
