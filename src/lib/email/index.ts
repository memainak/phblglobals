import nodemailer from 'nodemailer';
import { Enquiry, DistributorEnquiry } from '@/types';

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return null;
}

const transporter = getTransporter();
const plantEmail = process.env.PLANT_NOTIFICATION_EMAIL || 'phblkn@gmail.com';
const fromEmail = process.env.SMTP_FROM_EMAIL || '"PHBL Laboratories" <no-reply@phblglobals.com>';

export async function sendEnquiryNotification(enquiry: Enquiry) {
  if (!transporter) {
    console.log('[Email Mock] Notification to plant:', {
      to: plantEmail,
      subject: `[New Enquiry] ${enquiry.type} - ${enquiry.name}`,
      data: enquiry,
    });
    return;
  }

  try {
    // 1. Email to Plant Operations Desk
    await transporter.sendMail({
      from: fromEmail,
      to: plantEmail,
      subject: `[New Web Enquiry: ${enquiry.type}] from ${enquiry.name}`,
      text: `
New Commercial/Clinical Enquiry Received:
Type: ${enquiry.type}
Name: ${enquiry.name}
Email: ${enquiry.email}
Phone: ${enquiry.phone}
Product: ${enquiry.productName || 'N/A'}

Message:
${enquiry.message}

Received: ${enquiry.createdAt}
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #1F4D3A; margin-top: 0;">New Enquiry Received: ${enquiry.type}</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; font-weight: bold;">Name:</td><td>${enquiry.name}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td>${enquiry.email}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${enquiry.phone}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Product:</td><td>${enquiry.productName || 'N/A'}</td></tr>
          </table>
          <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
          <p><strong>Message / Requirement:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 12px; margin: 0; border-left: 3px solid #1F4D3A;">
            ${enquiry.message}
          </blockquote>
          <p style="font-size: 11px; color: #777; margin-top: 20px;">
            Purusottam Homoeo Bikash Laboratory (Bonded) — Drug Mfg Lic: HL-792 M
          </p>
        </div>
      `,
    });

    // 2. Auto-acknowledgement to user
    await transporter.sendMail({
      from: fromEmail,
      to: enquiry.email,
      subject: `Acknowledgement: Your enquiry to PHBL Laboratories`,
      text: `Dear ${enquiry.name},\n\nThank you for reaching out to Purusottam Homoeo Bikash Laboratory (Bonded). We have received your ${enquiry.type} inquiry.\n\nOur technical or commercial desk will review your details and respond within 24 business hours.\n\nHelpline: 9800011545\nEmail: phblkn@gmail.com\n\nSincerely,\nPHBL Team`,
    });
  } catch (err) {
    console.error('Error dispatching enquiry email notification:', err);
  }
}

export async function sendDistributorNotification(dist: DistributorEnquiry) {
  if (!transporter) {
    console.log('[Email Mock] Distributor application to plant:', {
      to: plantEmail,
      subject: `[New Distributor Application] ${dist.firmName} (${dist.state})`,
      data: dist,
    });
    return;
  }

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: plantEmail,
      subject: `[Distributor Application] ${dist.firmName} - ${dist.city}, ${dist.state}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #1F4D3A; margin-top: 0;">New Wholesale Distributor Application</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; font-weight: bold;">Firm Name:</td><td>${dist.firmName}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Contact Person:</td><td>${dist.contactPerson}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td>${dist.email}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${dist.phone}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">GSTIN:</td><td><code>${dist.gstin}</code></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Drug License:</td><td><code>${dist.drugLicenseNo}</code></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Territory:</td><td>${dist.territoryOfInterest}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Monthly Volume:</td><td>${dist.monthlyVolumeEstimate}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Years in Trade:</td><td>${dist.yearsInTrade}</td></tr>
          </table>
          <p style="font-size: 11px; color: #777; margin-top: 20px;">
            Purusottam Homoeo Bikash Laboratory (Bonded) — Directorate of Commercial Operations
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Error dispatching distributor notification:', err);
  }
}
