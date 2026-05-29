# RFQ Workflow

This document describes the full lifecycle of a Request for Quotation (RFQ) on the Sudan Export platform — from creation by a buyer through to awarding and closing.

---

## Overview

```
Buyer creates RFQ
       ↓
   Status: open  ──→  Email sent to all approved suppliers
       ↓
   Suppliers submit quotations
       ↓
   Status: quoting  (auto-set when first quote arrives)
       ↓
   Buyer reviews quotations
       ↓
   Status: shortlisted  (optional, buyer marks preferred quotes)
       ↓
   Buyer awards one quotation
       ↓
   Status: awarded  ──→  Email sent to winning supplier
       ↓
   Status: closed  (buyer closes after deal completion)
```

At any point, the buyer can also cancel the RFQ:
```
   Status: cancelled  ──→  Email sent to buyer + all quoting suppliers
```

---

## Status Reference

| Status | Description | Who Can Set |
|---|---|---|
| `draft` | RFQ saved but not yet published | Buyer |
| `open` | Published and accepting quotations | System (on creation) |
| `quoting` | At least one quotation received | System (on first quote) |
| `shortlisted` | Buyer has shortlisted preferred quotes | Buyer |
| `awarded` | One quotation selected as winner | System (on award) |
| `closed` | Deal complete, RFQ archived | Buyer |
| `cancelled` | RFQ withdrawn, no award made | Buyer / Admin |

---

## Step-by-Step Flow

### 1. Buyer Creates an RFQ

**Route:** `POST /api/rfqs`

The buyer fills in:
- **Title** — e.g. "500 MT Sesame Seeds for Q3 2026"
- **Destination country** and **delivery port**
- **Payment terms** (L/C, T/T, CAD, etc.)
- **Incoterms** (CIF, FOB, EXW, etc.)
- **Valid until** date — deadline for receiving quotations
- **Delivery deadline** — required delivery date
- **Notes** — additional specifications or requirements
- **Items** — one or more products with quantity, unit, and optional target price

On creation:
- A unique **reference number** is generated (`RFQ-YYYYXXXX`)
- Status is set to `open`
- Email notifications are dispatched to all **approved suppliers** (fire-and-forget)

---

### 2. Suppliers View Open RFQs

**Route:** `GET /api/rfqs`

Suppliers can browse all RFQs with status `open` or `quoting`. They see:
- Reference number, title, destination
- Product requirements and quantities
- Valid until / delivery deadline
- Number of existing quotations

Only suppliers whose company has been **verified (approved)** by an admin receive email notifications for new RFQs. All suppliers can browse and quote regardless of verification status.

---

### 3. Supplier Submits a Quotation

**Route:** `POST /api/rfqs/:rfqId/quotations`

The supplier provides:
- **Line items** — for each RFQ item: quantity, unit, unit price, total price, currency
- **Total amount** — overall quotation value
- **Currency** — ISO 4217 (default USD)
- **Valid until** — quote validity date
- **Delivery time** — estimated shipping/delivery time
- **Payment terms** — supplier's preferred terms
- **Notes** — any conditions or caveats

On submission:
- Quotation status is set to `submitted`
- RFQ status is updated to `quoting` (if still `open`)
- Email notification is sent to the buyer (fire-and-forget)

**Business rule:** A supplier can submit multiple quotations for the same RFQ (revisions).

---

### 4. Buyer Reviews Quotations

**Route:** `GET /api/rfqs/:rfqId/quotations`

The buyer views all received quotations with enriched supplier info (company name, country, verified status). They can:
- Compare prices, delivery times, and payment terms side by side
- Mark promising quotes as `shortlisted`
- Exchange messages with suppliers via `POST /api/messages`

---

### 5. Buyer Awards a Quotation

**Route:** `PATCH /api/quotations/:quotationId/status`  
**Body:** `{ "status": "awarded" }`

When the buyer awards a quotation:
1. The selected quotation status → `awarded`
2. All other quotations on the same RFQ → `rejected`
3. The RFQ status → `awarded`
4. Email notification dispatched to the winning supplier

**Only one quotation can be awarded per RFQ.** The system does not currently prevent awarding multiple, but the email and dashboard treat the awarded status as singular.

---

### 6. Buyer Closes or Cancels

**Route:** `PATCH /api/rfqs/:rfqId/status`

| Action | New Status | Email Notifications |
|---|---|---|
| Deal done, archive | `closed` | Buyer + all quoting suppliers |
| Withdraw RFQ | `cancelled` | Buyer + all quoting suppliers |

---

## Reference Number Format

Reference numbers are generated at creation time:

```
RFQ-YYYYXXXX
```

- `YYYY` — current year
- `XXXX` — random 4-digit number (0000–9999)

Example: `RFQ-20260047`

---

## Email Notifications Triggered

| Event | Recipients |
|---|---|
| RFQ created (status → `open`) | All approved suppliers |
| Quotation submitted | Buying company user |
| Quotation awarded | Winning supplier |
| RFQ closed | Buyer + all suppliers who submitted quotes |
| RFQ cancelled | Buyer + all suppliers who submitted quotes |

See [`email-notifications.md`](email-notifications.md) for full details.

---

## Admin Oversight

Admins have read-only access to all RFQs and quotations via:
- `GET /api/dashboard/admin-stats` — aggregate counts
- `GET /api/rfqs` — all RFQs
- `GET /api/quotations` — all quotations

Admins can also manually update RFQ or quotation status if needed.
