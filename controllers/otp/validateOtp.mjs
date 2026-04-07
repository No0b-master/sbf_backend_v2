import db from '../../models/index.mjs';

const { EmailVerifications, PhoneVerifications } = db;

export async function validateEmailOtp(req, res) {
  const { email, phone, otp } = req.body;

  if (!otp) {
    return res.status(400).json({ status: false, message: 'OTP is required' });
  }

  if (email && phone) {
    return res.status(400).json({ status: false, message: 'Provide either email or phone, not both' });
  }

  if (!email && !phone) {
    return res.status(400).json({ status: false, message: 'Email or phone is required' });
  }

  let record;
  if (email) {
    record = await EmailVerifications.findOne({ where: { email } });
  } else if (phone) {
    record = await PhoneVerifications.findOne({ where: { phone } });
  }

  if (!record) {
    return res.status(404).json({ status: false, message: 'No OTP sent to this email/phone' });
  }

  if (record.verified) {
    return res.status(200).json({ status: true, message: 'Already verified' });
  }

  if (record.otp !== otp) {
    return res.status(401).json({ status: false, message: 'Invalid OTP' });
  }

  if (new Date() > record.expiresAt) {
    return res.status(410).json({ status: false, message: 'OTP expired' });
  }

  record.verified = true;
  await record.save();

  return res.status(200).json({ status: true, message: 'Verification successful' });
}
