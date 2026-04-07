import dotenv from 'dotenv';
import db from '../../models/index.mjs';
import { otpEmail } from "../../utils/emailTemplates/otpEmail.mjs";
import { sendEmail } from '../../utils/emailService.mjs';
import axios from 'axios';

dotenv.config();

const { EmailVerifications, PhoneVerifications } = db;

export async function sendOtpToEmail(req, res) {
  const { email, phone, name } = req.body;

  console.log(req.body);
  

  if (!name) {
    return res.status(400).json({ status: false, message: 'Name is required' });
  }

  if (email && phone) {
    return res.status(400).json({ status: false, message: 'Provide either email or phone, not both' });
  }

  if (!email && !phone) {
    return res.status(400).json({ status: false, message: 'Email or phone is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 mins

  if (email) {
    await EmailVerifications.upsert({ email, otp, expiresAt, verified: false });

    const { subject, html } = otpEmail(name, otp);
    sendEmail(email, subject, html); // Async fire-and-forget

    return res.status(200).json({ status: true, message: 'OTP sent to email' });
  } else if (phone) {
    await PhoneVerifications.upsert({ phone, otp, expiresAt, verified: false });

    // Send SMS using fast2SMS
    try {
      const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
        route: 'dlt',
        sender_id: 'SBFAPP',
        message: '210626',
        variables_values: `${otp}|`,
        flash: 0,
        numbers: phone,
      }, {
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.return) {
        return res.status(200).json({ status: true, message: 'OTP sent to phone' });
      } else {
        return res.status(500).json({ status: false, message: 'Failed to send SMS' });
      }
    } catch (error) {
      console.error('SMS sending error:', error);
      return res.status(500).json({ status: false, message: 'Failed to send SMS' });
    }
  }
}