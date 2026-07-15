import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.EMAIL_USER;
const GMAIL_PASS = process.env.EMAIL_PASS;
const RECEIVER = 'thessjazz718@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_PASS },
});

export async function POST(request) {
  try {
    const { from_name, message } = await request.json();
    if (!from_name || !message) {
      return NextResponse.json({ ok: false, error: 'Name and message required.' }, { status: 400 });
    }

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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Wish mail error:', err.message);
    return NextResponse.json({ ok: false, error: 'Could not send email.' }, { status: 500 });
  }
}
