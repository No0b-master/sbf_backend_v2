import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../models/index.mjs';
import { registrationEmail } from "../utils/emailTemplates/registrationEmail.mjs";
import { otpEmail } from "../utils/emailTemplates/otpEmail.mjs";
import { sendEmail } from '../utils/emailService.mjs';
import {passwordChangedEmail} from '../utils/emailTemplates/passwordResetEmail.mjs'
import { Op } from 'sequelize';
dotenv.config();
const User = db.User;



// Helper function to detect if input is email or phone
function getIdentifierType(identifier) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,15}$/; // Adjust based on your phone format
  
  if (emailRegex.test(identifier)) {
    return 'email';
  } else if (phoneRegex.test(identifier)) {
    return 'phoneNumber';
  }
  return null;
}

export async function registerUser(req, res) {
  try {
    const { name, email, phoneNumber, password } = req.body;

    if (!name || (!email && !phoneNumber) || !password) {
      return res.status(400).json({ 
        status: false, 
        message: 'Name, password, and either email or phone number are required' 
      });
    }

    // Check if user already exists with email or phone
    const whereClause = {};
    if (email) whereClause.email = email;
    if (phoneNumber) whereClause.phoneNumber = phoneNumber;

    const existingUser = await User.findOne({ 
      where: {
        [Op.or]: [
          email ? { email } : null,
          phoneNumber ? { phoneNumber } : null
        ].filter(Boolean)
      }
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Phone number';
      return res.status(200).json({ 
        status: false, 
        message: `${field} already exists` 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const SBF_id = 'SBF' + Math.floor(1000 + Math.random() * 9000);

    const newUser = await User.create({
      name,
      email: email || null,
      phoneNumber: phoneNumber || null,
      password: hashedPassword,
      SBF_id
    });

    // Trigger email in background (non-blocking) - only if email provided
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
        phoneNumber: newUser.phoneNumber,
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
    const { identifier, password } = req.body; // Use 'identifier' instead of 'email'

    if (!identifier || !password) {
      return res.status(400).json({ 
        status: false, 
        message: 'Email/Phone number and password are required' 
      });
    }

    // Detect if identifier is email or phone
    const identifierType = getIdentifierType(identifier);
    
    if (!identifierType) {
      return res.status(200).json({ 
        status: false, 
        message: 'Invalid email or phone number format' 
      });
    }

    // Find user by email or phone
    const user = await User.findOne({ 
      where: { [identifierType]: identifier } 
    });

    if (!user) {
      return res.status(200).json({ status: false, message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(200).json({ status: false, message: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
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
        phoneNumber: user.phoneNumber,
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
    const { identifier, newPassword } = req.body; // Use 'identifier' instead of 'email'

    if (!identifier || !newPassword) {
      return res.status(400).json({ 
        status: false, 
        message: "Email/Phone number and new password are required" 
      });
    }

    // Detect if identifier is email or phone
    const identifierType = getIdentifierType(identifier);
    
    if (!identifierType) {
      return res.status(400).json({ 
        status: false, 
        message: 'Invalid email or phone number format' 
      });
    }

    // Find user by email or phone
    const user = await User.findOne({ 
      where: { [identifierType]: identifier } 
    });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    // Send email notification only if user has email
    if (user && user.email) {
      (async () => {
        try {
          const { subject, html } = passwordChangedEmail(user.name, "local");
          await sendEmail(user.email, subject, html);
        } catch (err) {
          console.error(`Failed to send password change email:`, err.message);
        }
      })();
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