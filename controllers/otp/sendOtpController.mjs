import dotenv from 'dotenv';
import db from '../../models/index.mjs';
import { otpEmail } from "../../utils/emailTemplates/otpEmail.mjs";
import { sendEmail } from '../../utils/emailService.mjs';

dotenv.config();

const { EmailVerifications } = db;

export async function sendOtpToEmail(req, res) {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ status: false, message: 'Email and name are required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 mins

  await EmailVerifications.upsert({ email, otp, expiresAt, verified: false });

  const { subject, html } = otpEmail(name, otp);
  sendEmail(email, subject, html) // Async fire-and-forget

  return res.status(200).json({ status: true, message: 'OTP sent to email' });
}