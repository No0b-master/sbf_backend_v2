export function otpEmail(name, otp) {
  return {
    subject: `🔑 Your SBF OTP Code`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          
          <!-- Logos section -->
          <div style="padding: 20px; display: flex; align-items: center; justify-content: space-between;">
            <img src="https://sbfindia.org/wp-content/uploads/2022/09/New-Project-13.png" alt="SBF Logo" style="height: 60px;" />
            <img src="http://vision2026.org.in/media/1119/vision-2026-web.png?width=462&height=181" alt="Vision 2026 Logo" style="height: 60px;" />
          </div>

          <!-- Message -->
          <div style="padding: 30px; color: #333333;">
            <h2 style="color: #218838;">Hello, ${name}!</h2>
            <p>Here is your One Time Password (OTP) to complete your action:</p>
            <h1 style="color: #fd7e14; font-size: 36px; text-align: center; letter-spacing: 5px;">${otp}</h1>
            <p style="margin-top: 20px;">This OTP is valid for <strong>10 minutes</strong>. Do not share this with anyone.</p>
            <p style="margin-top: 30px;">Warm regards,<br><strong style="color: #218838;">SBF Team</strong></p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 14px; color: #555;">
            <p style="margin: 4px;"><strong>📞</strong> +91-011-41500705</p>
            <p style="margin: 4px;"><strong>✉️</strong> info@sbfindia.org | pr@sbfindia.org</p>
            <p style="margin: 4px;"><strong>📍</strong> Society for Bright Future, E-89 Hari Kothi Lane, Abul Fazal Enclave, Jamia Nagar, New Delhi, India</p>
            <p style="margin-top: 10px; font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Society for Bright Future. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };
}
