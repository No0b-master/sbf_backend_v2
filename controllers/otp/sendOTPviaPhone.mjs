import { Infobip2FA } from "../../middleware/infobip.mjs";

export async function sendOtpToPhone(req, res) {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({
        status: false,
        message: "Phone number is required",
      });
    }

    // Step 1: Create Application (you can store appId after first creation to reuse)
    const app = await Infobip2FA.createApplication("MyApp2FA");
    const appId = app.applicationId;

    // Step 2: Create Message Template
    const template = await Infobip2FA.createTemplate(appId);
    const messageId = template.messageId;

    // Step 3: Send PIN to user's phone
    const sent = await Infobip2FA.sendPin(appId, messageId, phone_number);
    const pinId = sent.pinId;

    // Respond to client with pinId (you’ll need this for verification)
    return res.status(200).json({
      status: true,
      message: "OTP sent successfully",
      pinId, // store this on frontend or DB for verification later
    });
  } catch (err) {
    console.error("❌ OTP send failed:", err);
    return res.status(500).json({
      status: false,
      message: "Failed to send OTP",
      error: err.message || err,
    });
  }
}
