const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');
const path       = require('path');

const app = express();
require("dotenv").config();

const GMAIL_USER = process.env.EMAIL_USER;
const GMAIL_PASS = process.env.EMAIL_PASS;

const RECEIVER = 'thessjazz718@gmail.com'; // emails arrive here ✅
const PORT     = 7006;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serves your website

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_PASS },
});

/* ── /send-wish ─────────────────────────────────────────────── */
app.post('/send-wish', async (req, res) => {
  const { from_name, message } = req.body;
  if (!from_name || !message)
    return res.status(400).json({ ok: false, error: 'Name and message required.' });

  try {
    await transporter.sendMail({
      from   : `"Nikkah Wishes 💌" <${GMAIL_USER}>`,
      to     : RECEIVER,
      subject: `💌 Wishes from ${from_name} — Ayisha & Jasel Nikkah`,
      html   : `
        <div style="font-family:Georgia,serif;max-width:520px;margin:auto;
                    border:1px solid #e8e0d0;border-radius:12px;overflow:hidden;">
          <div style="background:#3d3020;padding:24px;text-align:center;">
            <p style="color:#c9b98a;font-size:20px;margin:0;">✦ Nikkah Wishes ✦</p>
            <p style="color:#e8dcc8;font-size:13px;margin:6px 0 0;">Ayisha Thesni &amp; Jasel Fasil · July 18, 2026</p>
          </div>
          <div style="padding:28px 32px;background:#fdfaf5;">
            <p style="color:#6b5c3e;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">From</p>
            <p style="font-size:22px;color:#3d3020;margin:0 0 20px;">${from_name}</p>
            <p style="color:#6b5c3e;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">Message</p>
            <p style="font-size:16px;color:#2c2820;line-height:1.7;border-left:3px solid #c9b98a;padding-left:16px;margin:0;">${message}</p>
          </div>
          <div style="background:#f5f0e8;padding:14px;text-align:center;">
            <p style="color:#8a7a5a;font-size:11px;margin:0;">Sent via the Nikkah Invitation website</p>
          </div>
        </div>`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Wish mail error:', err.message);
    res.status(500).json({ ok: false, error: 'Could not send email.' });
  }
});

/* ── /send-rsvp ─────────────────────────────────────────────── */
app.post('/send-rsvp', async (req, res) => {
  const { name, attending, guests, message } = req.body;
  if (!name || !attending)
    return res.status(400).json({ ok: false, error: 'Name and RSVP choice required.' });

  const isYes = attending === 'yes';

  try {
    await transporter.sendMail({
      from   : `"Nikkah RSVP 📩" <${GMAIL_USER}>`,
      to     : RECEIVER,
      subject: `📩 RSVP from ${name} — ${isYes ? 'Attending ✅' : 'Not Attending ❌'}`,
      html   : `
        <div style="font-family:Georgia,serif;max-width:520px;margin:auto;
                    border:1px solid #e8e0d0;border-radius:12px;overflow:hidden;">
          <div style="background:#3d3020;padding:24px;text-align:center;">
            <p style="color:#c9b98a;font-size:20px;margin:0;">✦ RSVP Received ✦</p>
            <p style="color:#e8dcc8;font-size:13px;margin:6px 0 0;">Ayisha Thesni &amp; Jasel Fasil · July 18, 2026</p>
          </div>
          <div style="padding:28px 32px;background:#fdfaf5;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="color:#6b5c3e;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;padding:8px 0;width:110px;">Name</td>
                <td style="color:#3d3020;font-size:16px;padding:8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="color:#6b5c3e;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;padding:8px 0;">Status</td>
                <td style="font-size:15px;padding:8px 0;">${isYes ? '✅ Joyfully Attending' : '❌ Regretfully Unable'}</td>
              </tr>
              ${guests ? `<tr>
                <td style="color:#6b5c3e;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;padding:8px 0;">Guests</td>
                <td style="color:#3d3020;font-size:15px;padding:8px 0;">${guests}</td>
              </tr>` : ''}
              ${message ? `<tr>
                <td style="color:#6b5c3e;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;padding:8px 0;vertical-align:top;">Message</td>
                <td style="color:#2c2820;font-size:15px;padding:8px 0;line-height:1.6;">${message}</td>
              </tr>` : ''}
            </table>
          </div>
          <div style="background:#f5f0e8;padding:14px;text-align:center;">
            <p style="color:#8a7a5a;font-size:11px;margin:0;">Sent via the Nikkah Invitation website</p>
          </div>
        </div>`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('RSVP mail error:', err.message);
    res.status(500).json({ ok: false, error: 'Could not send RSVP.' });
  }
});

app.listen(PORT, () => console.log(`✦ Server running → http://localhost:${PORT}`));
