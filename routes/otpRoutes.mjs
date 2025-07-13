// routes/emailVerificationRoutes.js
import express from 'express';
import { sendOtpToEmail } from '../controllers/otp/sendOtpController.mjs';
import { validateEmailOtp } from '../controllers/otp/validateOtp.mjs';

const router = express.Router();

router.post('/send-otp', sendOtpToEmail);
router.post('/verify-otp', validateEmailOtp);

export default router;
