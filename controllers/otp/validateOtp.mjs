import db from '../../models/index.mjs';

const { EmailVerifications } = db;

export async function validateEmailOtp(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ status: false, message: 'Email and OTP are required' });
  }

  const record = await EmailVerifications.findOne({ where: { email } });

  if (!record) {
    return res.status(404).json({ status: false, message: 'No OTP sent to this email' });
  }

  if (record.verified) {
    return res.status(200).json({ status: true, message: 'Email already verified' });
  }

  if (record.otp !== otp) {
    return res.status(401).json({ status: false, message: 'Invalid OTP' });
  }

  if (new Date() > record.expiresAt) {
    return res.status(410).json({ status: false, message: 'OTP expired' });
  }

  record.verified = true;
  await record.save();

  return res.status(200).json({ status: true, message: 'Email verification successful' });
}
