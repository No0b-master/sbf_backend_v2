import https from "https";

const INFOBIP_API_KEY = "be826a86a17f791be3f42eda9584ffce-0a64fe4d-2db8-40d2-9df9-cd662394bbdb";

/**
 * Helper for InfoBip 2FA SMS
 * Steps:
 * 1. Create application
 * 2. Create message template
 * 3. Send PIN
 * 4. Verify PIN
 */
export class Infobip2FA {
  static baseOptions(path, method = "POST") {
    return {
      method,
      hostname: "api.infobip.com",
      path,
      headers: {
        Authorization: `App ${INFOBIP_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
  }

  static makeRequest(options, bodyData) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString();
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve(body);
          }
        });
      });
      req.on("error", (err) => reject(err));
      if (bodyData) req.write(JSON.stringify(bodyData));
      req.end();
    });
  }

  /** Step 1 – Create a 2FA Application */
  static async createApplication(name = "2FA App Test") {
    const options = this.baseOptions("/2fa/2/applications");
    const body = {
      name,
      enabled: true,
      configuration: {
        pinAttempts: 10,
        allowMultiplePinVerifications: true,
        pinTimeToLive: "15m",
        verifyPinLimit: "1/3s",
        sendPinPerApplicationLimit: "100/1d",
        sendPinPerPhoneNumberLimit: "10/1d",
      },
    };
    const res = await this.makeRequest(options, body);
    console.log("✅ Application created:", res);
    return res;
  }

  /** Step 2 – Create a Message Template */
  static async createTemplate(appId) {
    const options = this.baseOptions(`/2fa/2/applications/${appId}/messages`);
    const body = {
      pinType: "NUMERIC",
      messageText: "Your OTP is {{pin}}",
      pinLength: 6,
      senderId: "ServiceSMS",
    };
    const res = await this.makeRequest(options, body);
    console.log("✅ Template created:", res);
    return res;
  }

  /** Step 3 – Send a PIN to a phone number */
  static async sendPin(applicationId, messageId, recipient, sender = "447491163443") {
    const options = this.baseOptions("/2fa/2/pin");
    const body = {
      applicationId,
      messageId,
      from: sender,
      to: recipient,
    };
    const res = await this.makeRequest(options, body);
    console.log("✅ PIN sent:", res);
    return res;
  }

  /** Step 4 – Verify the PIN code entered by user */
  static async verifyPin(pinId, pinCode) {
    const options = this.baseOptions(`/2fa/2/pin/${pinId}/verify`);
    const body = { pin: pinCode };
    const res = await this.makeRequest(options, body);
    console.log("✅ PIN verification response:", res);
    return res;
  }
}
