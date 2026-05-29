# Email Notification System

The platform sends transactional email notifications for key trade events. The system is built around a **fire-and-forget queue** backed by the `email_logs` database table.

> **Status: Resend API key not yet configured.** Emails are currently being logged with `status = "skipped"`. See [Enabling Email Delivery](#enabling-email-delivery) below.

---

## Architecture

```
Route Handler
     │
     ▼
notifyXxx()         ← trigger helpers in emailQueue.ts
     │  (async, non-blocking)
     ▼
queueEmail()        ← deduplication check + insert email_logs row
     │  (void — does not block the HTTP response)
     ▼
sendEmailLog()      ← builds HTML template + calls Resend API
     │
     ▼
email_logs.status   → "sent" | "failed" | "skipped"


Background Worker (every 30s)
     │
     ▼
Retries any email_logs rows stuck in "pending" for > 60 seconds
```

### Key Properties

- **Non-blocking:** `queueEmail()` is called with `void` — it never delays the HTTP response.
- **Deduplication:** Before inserting, the system checks for an existing `email_logs` row with the same `(event_type, entity_id, recipient_email)`. If found, the email is not re-queued. This prevents duplicate notifications on retries or race conditions.
- **Retry-safe:** The background worker picks up any row stuck in `pending` for more than 60 seconds and retries the send.
- **Admin visibility:** The `/admin/email-logs` page shows all logs with status filters, event type filters, and a per-row retry button.

---

## Email Events

| Event Type | Trigger | Recipients |
|---|---|---|
| `rfq_opened` | New RFQ created | All approved suppliers |
| `quotation_submitted` | Supplier submits a quotation | RFQ's buyer |
| `quotation_awarded` | Buyer awards a quotation | Winning supplier |
| `rfq_closed` | RFQ status changed to `closed` | Buyer + all quoting suppliers |
| `rfq_cancelled` | RFQ status changed to `cancelled` | Buyer + all quoting suppliers |
| `company_approved` | Admin approves company verification | Company owner |
| `company_rejected` | Admin rejects company verification | Company owner |

---

## File Structure

| File | Purpose |
|---|---|
| `artifacts/api-server/src/lib/emailQueue.ts` | Core queue logic: `queueEmail()`, trigger helpers, background worker |
| `artifacts/api-server/src/lib/emailSender.ts` | Resend API HTTP call with error handling |
| `artifacts/api-server/src/lib/emailTemplates.ts` | HTML email template builders for each event type |
| `artifacts/api-server/src/routes/email_logs.ts` | Admin API routes for listing, stats, retry |
| `lib/db/src/schema/email_logs.ts` | Database table schema |

---

## Trigger Points in Route Handlers

| Route | Trigger Called |
|---|---|
| `POST /api/rfqs` | `notifyRfqOpened(rfq.id)` |
| `PATCH /api/rfqs/:rfqId/status` (closed/cancelled) | `notifyRfqStatusChange(id, status)` |
| `POST /api/rfqs/:rfqId/quotations` | `notifyQuotationSubmitted(quotation.id)` |
| `PATCH /api/quotations/:quotationId/status` (awarded) | `notifyQuotationAwarded(updated.id)` |
| `PATCH /api/companies/:companyId/verify` | `notifyCompanyVerified(id, action === "approve")` |

---

## Email Status Values

| Status | Meaning |
|---|---|
| `pending` | Queued but not yet processed |
| `sent` | Successfully delivered via Resend API |
| `failed` | Resend API returned an error; `error_message` column has details |
| `skipped` | `RESEND_API_KEY` not configured — email intentionally not sent |

---

## Enabling Email Delivery

### 1. Create a Resend account

Sign up at [resend.com](https://resend.com) — the free tier covers 3,000 emails/month.

### 2. Add and verify your sending domain

In the Resend dashboard, go to **Domains** and add your domain (e.g. `sudanexport.com`). Follow the DNS verification steps.

### 3. Create an API key

In Resend → **API Keys**, create a key with `Sending access`.

### 4. Add the secret to the project

In Replit, open **Secrets** and add:
- `RESEND_API_KEY` → your Resend API key (starts with `re_`)

Optionally also set:
- `EMAIL_FROM` → e.g. `Sudan Export <noreply@sudanexport.com>`
- `APP_BASE_URL` → your production domain, e.g. `https://sudanexport.com`

### 5. Retry skipped emails

After adding the key and restarting the server, visit the **Admin → Email Logs** page and use the **Retry** button on any `skipped` rows to re-queue them.

---

## Background Worker

The background worker starts automatically when the API server starts (`index.ts` calls `startEmailWorker()`).

- Runs every **30 seconds**
- Finds all `email_logs` rows with `status = "pending"` older than **60 seconds**
- Re-attempts `sendEmailLog()` for each stuck row
- Updates status to `sent`, `failed`, or `skipped` accordingly

The worker logs its start to the server log:
```
[INFO] Email background worker started
```

If you see `skipped` logs accumulate, it means `RESEND_API_KEY` is not set. If you see `failed` logs, check `error_message` for the Resend API error detail.

---

## Email Templates

All templates use a shared branded layout:
- Header: `#1F5D3B` green brand bar with "SudanExpo" logo
- Content: white card with info table rows
- CTA button: green primary button linking to the relevant dashboard page
- Footer: copyright, unsubscribe note

Templates are built as pure HTML strings by functions in `emailTemplates.ts`. Each function accepts a `EmailTemplateData` object and returns `{ subject, html }`.
