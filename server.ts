import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import fs from 'fs';
import admin from 'firebase-admin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load Firebase Config
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));

// Initialize Firebase Admin
try {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
  console.log('[ADMIN] Firebase Admin initialized');
} catch (error) {
  console.error('[ADMIN] Firebase Admin initialization error:', error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory OTP store (Email -> { otp, expires })
  const otpStore = new Map<string, { otp: string, expires: number }>();

  // Setup Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // API Routes
  app.post('/api/auth/send-otp', async (req, res) => {
    const { email: rawEmail } = req.body;
    if (!rawEmail) return res.status(400).json({ error: 'Email is required' });

    const email = rawEmail.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(email, { otp, expires });

    console.log(`[AUTH] OTP for ${email}: ${otp}`);

    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail({
          from: `"360 iT Solutions" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Your Login OTP',
          text: `Your OTP for 360 iT Solutions is: ${otp}. It expires in 5 minutes.`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #4f46e5;">360 iT Solutions</h2>
              <p>Your login OTP is:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111; margin: 20px 0;">${otp}</div>
              <p style="color: #666; font-size: 14px;">This code will expire in 5 minutes.</p>
            </div>
          `,
        });
        res.json({ success: true, message: 'OTP sent to email' });
      } else {
        res.json({ 
          success: true, 
          message: 'OTP generated (Check server console for demo)', 
          demo: true 
        });
      }
    } catch (error) {
      console.error('Email send error:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  app.post('/api/auth/verify-otp', async (req, res) => {
    const { email: rawEmail, otp } = req.body;
    if (!rawEmail) return res.status(400).json({ error: 'Email is required' });
    
    const email = rawEmail.trim().toLowerCase();
    const stored = otpStore.get(email);

    if (!stored) return res.status(400).json({ error: 'No OTP found for this email' });
    if (Date.now() > stored.expires) {
      otpStore.delete(email);
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (stored.otp === otp) {
      otpStore.delete(email);
      
      try {
        // Generate a Custom Token for this email
        // We use the email as the UID (or a hash of it) to keep it stable
        const customToken = await admin.auth().createCustomToken(email);
        res.json({ success: true, customToken });
      } catch (error) {
        console.error('Custom token error:', error);
        res.status(500).json({ error: 'Failed to generate auth token' });
      }
    } else {
      res.status(400).json({ error: 'Invalid OTP' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
