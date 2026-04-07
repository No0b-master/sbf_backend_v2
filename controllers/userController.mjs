import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../models/index.mjs';
import { registrationEmail } from "../utils/emailTemplates/registrationEmail.mjs";
import { otpEmail } from "../utils/emailTemplates/otpEmail.mjs";
import { sendEmail } from '../utils/emailService.mjs';
import {passwordChangedEmail} from '../utils/emailTemplates/passwordResetEmail.mjs'

dotenv.config();
const User = db.User;



export async function registerUser(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ status: false, message: 'Name and password are required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ status: false, message: 'Email or phone is required' });
    }

    // Check for existing user by email or phone
    const existingEmail = email ? await User.findOne({ where: { email } }) : null;
    const existingPhone = phone ? await User.findOne({ where: { phone } }) : null;

    if (existingEmail || existingPhone) {
      return res.status(200).json({ status: false, message: 'User already exists' });
    }

    // Check if provided fields are verified
    let verified = true;
    if (email) {
      const emailVer = await db.EmailVerifications.findOne({ where: { email, verified: true } });
      if (!emailVer) verified = false;
    }
    if (phone) {
      const phoneVer = await db.PhoneVerifications.findOne({ where: { phone, verified: true } });
      if (!phoneVer) verified = false;
    }

    if (!verified) {
      return res.status(400).json({ status: false, message: 'Email/Phone not verified' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const SBF_id = 'SBF' + Math.floor(1000 + Math.random() * 9000);

    const newUser = await User.create({
      name,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
      SBF_id
    });

    // Trigger email in background (non-blocking) if email provided
    if (email) {
      (async () => {
        try {
          const { subject, html } = registrationEmail(name);
          await sendEmail(email, subject, html);
        } catch (err) {
          console.error(`Failed to send welcome email to ${email}:`, err.message);
        }
      })();
    }

    // Respond immediately
    return res.status(201).json({
      status: true,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        SBF_id: newUser.SBF_id
      }
    });

  } catch (error) {
    console.error('Error in registerUser:', error);
    return res.status(500).json({ status: false, message: 'Registration failed' });
  }
}


export async function loginUser(req, res) {
  try {
    const { email, phone, password } = req.body;

    if (!password) {
      return res.status(400).json({ status: false, message: 'Password is required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ status: false, message: 'Email or phone is required' });
    }

    if (email && phone) {
      return res.status(400).json({ status: false, message: 'Provide either email or phone, not both' });
    }

    let user;
    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (phone) {
      user = await User.findOne({ where: { phone } });
    }

    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: false, message: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        SBF_id: user.SBF_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      status: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        SBF_id: user.SBF_id,
        userType: user.userType,
        state: user.state
      },
      token
    });

  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({ status: false, message: 'Login failed' });
  }
}



export async function changePassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ status: false, message: "Email and new password are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
      if (user && user.email) {
          const { subject, html } = passwordChangedEmail(user.name, "local");
          await sendEmail(user.email, subject, html);
        }

    return res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Error in changePassword:", error);
    return res.status(500).json({ status: false, message: "Password update failed" });
  }
}