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
    const { name, attending, guests, message } = await request.json();
    if (!name || !attending) {
      return NextResponse.json({ ok: false, error: 'Name and RSVP choice required.' }, { status: 400 });
    }

    const isYes = attending === 'yes';

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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('RSVP mail error:', err.message);
    return NextResponse.json({ ok: false, error: 'Could not send RSVP.' }, { status: 500 });
  }
}
