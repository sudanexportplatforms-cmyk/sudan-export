import { logger } from "./logger";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Sudan Export <noreply@sudanexport.com>";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface SendResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<SendResult> {
  if (!RESEND_API_KEY) {
    logger.warn({ to: opts.to, subject: opts.subject }, "RESEND_API_KEY not set — email skipped");
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      logger.error({ status: res.status, body, to: opts.to }, "Resend API error");
      return { ok: false, error: `HTTP ${res.status}: ${body}` };
    }

    const data = await res.json() as { id?: string };
    logger.info({ messageId: data.id, to: opts.to, subject: opts.subject }, "Email sent");
    return { ok: true, messageId: data.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error({ err: msg, to: opts.to }, "Email send exception");
    return { ok: false, error: msg };
  }
}
