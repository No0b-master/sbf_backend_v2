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
      return res.status(200).json({ status: false, message: 'Name and password are required' });
    }

    if (!email && !phone) {
      return res.status(200).json({ status: false, message: 'Email or phone is required' });
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
      return res.status(200).json({ status: false, message: 'Email/Phone not verified' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const SBF_id = 'SBF' + Math.floor(1000 + Math.random() * 9000);

    const newUser = await User.create({
      name,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
      SBF_id,
      authMethod: 'normal'
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
      return res.status(200).json({ status: false, message: 'Password is required' });
    }

    if (!email && !phone) {
      return res.status(200).json({ status: false, message: 'Email or phone is required' });
    }

    if (email && phone) {
      return res.status(200).json({ status: false, message: 'Provide either email or phone, not both' });
    }

    let user;
    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (phone) {
      user = await User.findOne({ where: { phone } });
    }

    if (!user) {
      return res.status(200).json({ status: false, message: 'User not found' });
    }

    if (user.authMethod === 'google') {
      return res.status(200).json({ status: false, message: 'This account uses Google sign in. Please continue with Google.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(200).json({ status: false, message: 'Invalid password' });
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
        state: user.state,
        authMethod: user.authMethod
      },
      token
    });

  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({ status: false, message: 'Login failed' });
  }
}

export async function googleAuth(req, res) {
  try {
    const { email, name, action } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : null;
    const mode = (action || '').toString().trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(200).json({ status: false, message: 'Email is required' });
    }

    if (!['register', 'login'].includes(mode)) {
      return res.status(200).json({ status: false, message: 'Action must be either register or login' });
    }

    const existingUser = await User.findOne({ where: { email: normalizedEmail } });

    if (mode === 'register') {
      if (existingUser) {
        return res.status(200).json({ status: false, message: 'User already exists' });
      }

      const derivedName = name?.trim() || normalizedEmail.split('@')[0] || 'Google User';
      const SBF_id = 'SBF' + Math.floor(1000 + Math.random() * 9000);

      const newUser = await User.create({
        name: derivedName,
        email: normalizedEmail,
        password: null,
        SBF_id,
        authMethod: 'google'
      });

      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          phone: newUser.phone,
          userType: newUser.userType,
          SBF_id: newUser.SBF_id
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        status: true,
        message: 'Google registration successful',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          SBF_id: newUser.SBF_id,
          userType: newUser.userType,
          state: newUser.state,
          authMethod: newUser.authMethod
        },
        token
      });
    }

    if (mode === 'login') {
      if (!existingUser) {
        return res.status(200).json({ status: false, message: 'you need to register yourself first' });
      }

      if (existingUser.authMethod !== 'google') {
        return res.status(200).json({ status: false, message: 'This account was registered with email/phone. Please use normal login.' });
      }

      const token = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
          phone: existingUser.phone,
          userType: existingUser.userType,
          SBF_id: existingUser.SBF_id
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        status: true,
        message: 'Google login successful',
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
          SBF_id: existingUser.SBF_id,
          userType: existingUser.userType,
          state: existingUser.state,
          authMethod: existingUser.authMethod
        },
        token
      });
    }

    return res.status(200).json({ status: false, message: 'Invalid Google auth action' });
  } catch (error) {
    console.error('Error in googleAuth:', error);
    return res.status(500).json({ status: false, message: 'Google authentication failed' });
  }
}


export async function changePassword(req, res) {
  try {
    const { email, phone, newPassword } = req.body;
    const hasEmail = !!email && email !== 'null';
    const hasPhone = !!phone && phone !== 'null';

    if ((!hasEmail && !hasPhone) || !newPassword) {
      return res.status(200).json({ status: false, message: "Email or phone and new password are required" });
    }

    let user;
    if (hasEmail) {
      user = await User.findOne({ where: { email } });
    } else {
      user = await User.findOne({ where: { phone } });
    }

    if (!user) {
      return res.status(200).json({ status: false, message: "User not found" });
    }

    if (user.authMethod === 'google') {
      return res.status(200).json({ status: false, message: "Google account password cannot be changed here" });
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

export async function forgotPassword(req, res) {
  try {
    const { email, phone, newPassword } = req.body;
    const hasEmail = !!email && email !== 'null';
    const hasPhone = !!phone && phone !== 'null';

    if ((!hasEmail && !hasPhone) || !newPassword) {
      return res.status(200).json({ status: false, message: "Email or phone and new password are required" });
    }

    let user;
    if (hasEmail) {
      user = await User.findOne({ where: { email } });
    } else {
      user = await User.findOne({ where: { phone } });
    }

    if (!user) {
      return res.status(200).json({ status: false, message: "User not found" });
    }

    if (user.authMethod === 'google') {
      return res.status(200).json({ status: false, message: "Google account password cannot be reset here" });
    }

    let verifiedRecord;
    if (hasEmail) {
      verifiedRecord = await db.EmailVerifications.findOne({ where: { email, verified: true } });
    } else {
      verifiedRecord = await db.PhoneVerifications.findOne({ where: { phone, verified: true } });
    }

    if (!verifiedRecord) {
      return res.status(200).json({ status: false, message: "Please verify OTP before resetting password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    await verifiedRecord.update({ verified: false });

    if (user.email) {
      const { subject, html } = passwordChangedEmail(user.name, "local");
      await sendEmail(user.email, subject, html);
    }

    return res.status(200).json({
      status: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ status: false, message: "Forgot password failed" });
  }
}