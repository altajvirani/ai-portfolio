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
  channel: 'client-direct';
  message: string;
  mailtoUrl: string;
  gmailUrl: string;
  outlookUrl: string;
  yahooUrl: string;
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

export function buildOutlookComposeUrl(
  recipient: string,
  data: { name: string; email: string; subject: string; message: string },
): string {
  const body = `From: ${data.name} (${data.email})\n\n${data.message}`;
  return `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(recipient)}&subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
}

export function buildYahooComposeUrl(
  recipient: string,
  data: { name: string; email: string; subject: string; message: string },
): string {
  const body = `From: ${data.name} (${data.email})\n\n${data.message}`;
  return `https://compose.mail.yahoo.com/?to=${encodeURIComponent(recipient)}&subj=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
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
        channel: 'client-direct',
        message: validation.error || 'Invalid form submission.',
        mailtoUrl: `mailto:${recipient}`,
        gmailUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}`,
        outlookUrl: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(recipient)}`,
        yahooUrl: `https://compose.mail.yahoo.com/?to=${encodeURIComponent(recipient)}`,
        error: validation.error,
      },
    };
  }

  const data = validation.sanitized;
  const submissionId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const mailtoUrl = buildMailtoUrl(recipient, data);
  const gmailUrl = buildGmailComposeUrl(recipient, data);
  const outlookUrl = buildOutlookComposeUrl(recipient, data);
  const yahooUrl = buildYahooComposeUrl(recipient, data);

  const delivered = false;
  const channel: ContactSubmissionResponse['channel'] = 'client-direct';

  return {
    status: 200,
    body: {
      ok: true,
      id: submissionId,
      delivered,
      channel,
      message: delivered
        ? `Your message has been sent directly to ${recipient}.`
        : `Your message has been prepared for ${recipient}. Choose your preferred email client below to send it directly from your address.`,
      mailtoUrl,
      gmailUrl,
      outlookUrl,
      yahooUrl,
    },
  };
}
