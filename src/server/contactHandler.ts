import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
}

export interface ContactSubmissionResponse {
  ok: boolean;
  id: string;
  delivered: boolean;
  channel: 'resend' | 'smtp' | 'formsubmit' | 'inbox-queue';
  message: string;
  mailtoUrl: string;
  gmailUrl: string;
  error?: string;
}

const DEFAULT_RECIPIENT = 'altajatwork@gmail.com';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactPayload(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, error: 'Invalid request payload.' };
  }

  const record = raw as Record<string, unknown>;
  const name = typeof record.name === 'string' ? record.name.trim() : '';
  const email = typeof record.email === 'string' ? record.email.trim() : '';
  const subject = typeof record.subject === 'string' ? record.subject.trim() : '';
  const message = typeof record.message === 'string' ? record.message.trim() : '';

  if (name.length < 2) {
    return { valid: false, error: 'Please enter your name (at least 2 characters).' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  if (message.length < 5) {
    return { valid: false, error: 'Please enter a message (at least 5 characters).' };
  }

  return {
    valid: true,
    sanitized: {
      name: name.slice(0, 120),
      email: email.slice(0, 160),
      subject: (subject || `Portfolio Inquiry from ${name}`).slice(0, 180),
      message: message.slice(0, 4000),
    },
  };
}

export function buildMailtoUrl(
  recipient: string,
  data: { name: string; email: string; subject: string; message: string },
): string {
  const body = `From: ${data.name} (${data.email})\n\n${data.message}`;
  return `mailto:${recipient}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
}

export function buildGmailComposeUrl(
  recipient: string,
  data: { name: string; email: string; subject: string; message: string },
): string {
  const body = `From: ${data.name} (${data.email})\n\n${data.message}`;
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
}

async function persistSubmissionRecord(record: Record<string, unknown>): Promise<void> {
  try {
    const dir = path.join(process.cwd(), 'data');
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, 'contact-inquiries.jsonl');
    await fs.appendFile(file, JSON.stringify(record) + '\n', 'utf-8');
  } catch (err) {
    console.warn('Unable to write local inquiry log:', err);
  }
}

export async function dispatchContactSubmission(
  payload: unknown,
  originHeader?: string,
): Promise<{ status: number; body: ContactSubmissionResponse }> {
  const validation = validateContactPayload(payload);
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL || DEFAULT_RECIPIENT;

  if (!validation.valid || !validation.sanitized) {
    return {
      status: 400,
      body: {
        ok: false,
        id: '',
        delivered: false,
        channel: 'inbox-queue',
        message: validation.error || 'Invalid form submission.',
        mailtoUrl: `mailto:${recipient}`,
        gmailUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}`,
        error: validation.error,
      },
    };
  }

  const data = validation.sanitized;
  const submissionId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const mailtoUrl = buildMailtoUrl(recipient, data);
  const gmailUrl = buildGmailComposeUrl(recipient, data);

  let delivered = false;
  let channel: ContactSubmissionResponse['channel'] = 'inbox-queue';

  // 1. Try Resend API if configured
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && resendKey.trim()) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
          to: [recipient],
          reply_to: data.email,
          subject: `[Portfolio] ${data.subject}`,
          text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
        }),
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) {
        delivered = true;
        channel = 'resend';
      }
    } catch (err) {
      console.warn('Resend relay failed:', err);
    }
  }

  // 2. Try SMTP via Nodemailer if configured
  if (
    !delivered &&
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    try {
      const port = Number(process.env.SMTP_PORT || '587');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      await transporter.sendMail({
        from: `"${data.name} via Portfolio" <${process.env.SMTP_USER}>`,
        to: recipient,
        replyTo: data.email,
        subject: `[Portfolio] ${data.subject}`,
        text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
      });
      delivered = true;
      channel = 'smtp';
    } catch (err) {
      console.warn('SMTP relay failed:', err);
    }
  }

  // 3. Try FormSubmit AJAX endpoint if reachable & activated
  if (!delivered) {
    try {
      const referer = originHeader || process.env.APP_URL || 'https://altajvirani.dev';
      const res = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Origin: referer,
          Referer: referer,
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          _subject: data.subject,
          message: data.message,
          _template: 'table',
        }),
        signal: AbortSignal.timeout(4500),
      });
      if (res.ok) {
        const json = (await res.json().catch(() => ({}))) as { success?: string | boolean };
        if (json.success === true || json.success === 'true') {
          delivered = true;
          channel = 'formsubmit';
        }
      }
    } catch {
      // Offline / restricted sandbox falls back cleanly to persisted queue + direct mail client links
    }
  }

  await persistSubmissionRecord({
    id: submissionId,
    timestamp: new Date().toISOString(),
    delivered,
    channel,
    recipient,
    ...data,
  });

  return {
    status: 200,
    body: {
      ok: true,
      id: submissionId,
      delivered,
      channel,
      message: delivered
        ? `Your message has been sent directly to ${recipient}.`
        : `Your message has been prepared for ${recipient}. Use Send via Gmail or Open Mail App below to deliver it directly.`,
      mailtoUrl,
      gmailUrl,
    },
  };
}
