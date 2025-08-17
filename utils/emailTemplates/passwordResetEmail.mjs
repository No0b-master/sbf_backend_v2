export function passwordResetEmail(name, otp) {
  return {
    subject: `🔐 Password Reset Request`,
    html: `
      <div style="font-family: Arial; background-color: #f6f9fc; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px;">
          <h3>Hello ${name},</h3>
          <p>We received a request to reset your password. Please use the below OTP for validation:</p>
          <p style="background-color: #004080; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block;">${otp}</p>
          <p>If you didn’t request this, please ignore this email.</p>
          <p>Sincerely,<br>SBF Team</p>
        </div>
      </div>
    `
  };
}

export function passwordChangedEmail(name) {
  return {
    subject: `🔒 Your Password Has Been Changed - SBF Volunteer`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

          <!-- Logos -->
          <div style="padding: 20px; display: flex; align-items: center; justify-content: space-between;">
            <img src="https://sbfindia.org/wp-content/uploads/2022/09/New-Project-13.png" alt="SBF Logo" style="height: 60px;" />
            <img src="http://vision2026.org.in/media/1119/vision-2026-web.png?width=462&height=181" alt="Vision 2026 Logo" style="height: 60px;" />
          </div>

          <!-- Message -->
          <div style="padding: 30px; color: #333333;">
            <h2 style="color: #004080;">Hello, ${name}!</h2>
            <p>This is to confirm that the password for your <strong>Society for Bright Future</strong> volunteer account has been <strong>successfully changed</strong>.</p>
            <p>If you made this change, no further action is required.</p>
            <p style="color: #b00020; font-weight: bold;">If you did NOT make this change, please reset your password immediately and contact our support team.</p>
            <p style="margin-top: 30px;">Stay secure,<br><strong style="color: #004080;">SBF Volunteer Team</strong></p>
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
