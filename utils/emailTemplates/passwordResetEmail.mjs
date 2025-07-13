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
