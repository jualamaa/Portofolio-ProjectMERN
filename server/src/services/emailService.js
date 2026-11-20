import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { escapeHtml } from '../validators/contactValidator.js';

let transporter = null;

function getTransporter() {
    if (transporter) return transporter;

    const { host, port, user, pass } = env.smtp;
    if (!host || !user || !pass) {
        return null;
    }

    transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass,
        },
    });

    return transporter;
}

export async function sendContactNotificationEmail({ name, email, subject, message }) {
    const mailer = getTransporter();
    const recipient = env.smtp.adminEmail || env.smtp.user;

    if (!mailer || !recipient) {
        console.warn(
            '[Email Service] SMTP credentials not configured. Message saved to MongoDB without email dispatch.'
        );
        return { sent: false, reason: 'smtp_unconfigured' };
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

    const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #F2F0EA; padding: 32px 16px; color: #242629;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #D6D3CB; padding: 32px;">
        <p style="font-family: monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #657568; margin: 0 0 8px 0;">
          JOSEPH.DEV // NEW INQUIRY
        </p>
        <h2 style="font-size: 20px; margin: 0 0 24px 0; border-bottom: 1px solid #E5E2DA; padding-bottom: 16px;">
          ${safeSubject}
        </h2>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 6px 0; color: #657568; width: 90px; font-family: monospace; font-size: 12px;">SENDER</td>
            <td style="padding: 6px 0; font-weight: 600;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #657568; font-family: monospace; font-size: 12px;">EMAIL</td>
            <td style="padding: 6px 0;"><a href="mailto:${safeEmail}" style="color: #242629;">${safeEmail}</a></td>
          </tr>
        </table>

        <div style="background-color: #F8F7F4; border-left: 3px solid #657568; padding: 16px 20px; font-size: 14px; line-height: 1.65;">
          ${safeMessage}
        </div>

        <p style="font-family: monospace; font-size: 11px; color: #7A7D82; margin-top: 28px; margin-bottom: 0;">
          Reply directly to this email to respond to ${safeName}, or manage this message in your Admin Dashboard.
        </p>
      </div>
    </div>
  `;

    await mailer.sendMail({
        from: `"JOSEPH.DEV Portfolio" <${env.smtp.user}>`,
        to: recipient,
        replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
        subject: `[Portfolio Contact] ${subject}`,
        text: `New message from ${name} (${email})\nSubject: ${subject}\n\n${message}`,
        html: htmlBody,
    });

    return { sent: true };
}