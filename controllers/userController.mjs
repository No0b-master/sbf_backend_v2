import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../models/index.mjs';
import { registrationEmail } from "../utils/emailTemplates/registrationEmail.mjs";
import { otpEmail } from "../utils/emailTemplates/otpEmail.mjs";
import { sendEmail } from '../utils/emailService.mjs';

dotenv.config();
const User = db.User;



export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(200).json({ status: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const SBF_id = 'SBF' + Math.floor(1000 + Math.random() * 9000);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      SBF_id
    });

    // Trigger email in background (non-blocking)
    (async () => {
      try {
        const { subject, html } = registrationEmail(name);
        await sendEmail(email, subject, html);
      } catch (err) {
        console.error(`Failed to send welcome email to ${email}:`, err.message);
      }
    })();

    // Respond immediately
    return res.status(201).json({
      status: true,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
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
