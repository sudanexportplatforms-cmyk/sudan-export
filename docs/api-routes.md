# API Routes

All routes are served from the API server (port 8080) and mounted under `/api`. The shared proxy routes `/api/*` traffic from port 80 to the API server, so clients always use relative paths.

**Auth:** Most routes require a valid Clerk session cookie. The `requireAuth` middleware extracts the Clerk user ID (`req.userId`). Routes that enforce role restrictions (`admin`, `buyer`, `supplier`) check the `users.role` field in the database.

---

## Health

### `GET /api/healthz`
Basic liveness probe. No auth required.

**Response 200:**
```json
{ "status": "ok" }
```

### `GET /api/health/detailed`
Extended health check including DB connectivity and email worker status. No auth required.

**Response 200:**
```json
{
  "status": "ok",
  "uptime": 3600.5,
  "timestamp": "2026-05-29T10:00:00.000Z",
  "database": { "status": "ok", "latencyMs": 3 },
  "emailWorker": { "status": "running", "startedAt": "2026-05-29T09:00:00.000Z" }
}
```

---

## Users — `/api/users`

### `GET /api/users/me`
Returns the current user's profile. Creates a skeleton user record on first call after Clerk sign-up (upsert).

**Auth:** Required

### `POST /api/users/me`
Create or update the current user's profile. Used during onboarding to set role, name, country, phone, etc.

**Body:** `UserProfileInput` (see OpenAPI spec)

**Auth:** Required

### `GET /api/users`
List all users. Admin only.

**Auth:** Required, admin role

### `GET /api/users/:userId`
Get a specific user by internal numeric ID.

**Auth:** Required

---

## Products — `/api/products`

### `GET /api/products`
List all active products/commodities in the catalog.

**Auth:** Not required (public)

### `GET /api/products/:productId`
Get a single product by ID.

### `POST /api/products`
Create a new product entry. Admin only.

**Body:** `ProductInput`

### `PATCH /api/products/:productId`
Update an existing product. Admin only.

---

## Companies — `/api/companies`

### `GET /api/companies`
List all companies. Admins see all; buyers/suppliers see their own.

**Auth:** Required

### `POST /api/companies`
Create a company profile. Sets `verification_status = pending`.

**Auth:** Required

### `GET /api/companies/:companyId`
Get a company by ID.

**Auth:** Required

### `PATCH /api/companies/:companyId`
Update company details.

**Auth:** Required (own company or admin)

### `PATCH /api/companies/:companyId/verify`
Approve or reject a company verification. Triggers email notification to owner.

**Auth:** Required, admin role

**Body:**
```json
{ "action": "approve" | "reject" }
```

---

## RFQs — `/api/rfqs`

### `GET /api/rfqs`
List RFQs. Buyers see their own; suppliers see all `open`/`quoting` RFQs; admins see all.

**Auth:** Required

### `POST /api/rfqs`
Create a new RFQ with line items. Sets status to `open` and triggers email notifications to all approved suppliers.

**Auth:** Required, buyer role

**Body:** `RfqInput` (includes `items[]` array)

### `GET /api/rfqs/:rfqId`
Get a single RFQ with enriched data (buyer info, product names, quotation count).

**Auth:** Required

### `PATCH /api/rfqs/:rfqId`
Update RFQ details (title, terms, deadline, etc.). Only the owning buyer can update.

**Auth:** Required, buyer role

### `PATCH /api/rfqs/:rfqId/status`
Update the RFQ status. Triggers email notifications on `closed` and `cancelled`.

**Auth:** Required

**Body:** `{ "status": "open" | "quoting" | "shortlisted" | "awarded" | "closed" | "cancelled" }`

### `GET /api/rfqs/:rfqId/quotations`
List all quotations submitted for a specific RFQ.

**Auth:** Required

---

## Quotations — `/api/quotations`

### `POST /api/rfqs/:rfqId/quotations`
Submit a quotation for an RFQ. Sets the RFQ status to `quoting` if still `open`. Triggers email to the buyer.

**Auth:** Required, supplier role

**Body:** `QuotationInput` (includes `items[]` array)

### `GET /api/quotations`
List quotations. Suppliers see their own; buyers see quotations on their RFQs; admins see all.

**Auth:** Required

### `GET /api/quotations/:quotationId`
Get a single quotation with enriched data (supplier info, item breakdown, linked RFQ).

**Auth:** Required

### `PATCH /api/quotations/:quotationId/status`
Update quotation status. Awarding a quotation (`awarded`) also sets the linked RFQ to `awarded` and triggers email to the winning supplier.

**Auth:** Required, buyer role (for award/reject)

**Body:** `{ "status": "shortlisted" | "awarded" | "rejected" }`

---

## Messages — `/api/messages`

### `GET /api/messages`
List messages for the current user (sent or received). Filter by `rfqId` query param.

**Auth:** Required

### `POST /api/messages`
Send a message to another user, scoped to an RFQ conversation.

**Auth:** Required

**Body:** `{ "rfqId": number, "recipientId": string, "content": string }`

---

## Notifications — `/api/notifications`

### `GET /api/notifications`
List unread (and recent) notifications for the current user.

**Auth:** Required

### `PATCH /api/notifications/:notificationId/read`
Mark a single notification as read.

**Auth:** Required

### `PATCH /api/notifications/read-all`
Mark all of the current user's notifications as read.

**Auth:** Required

---

## Dashboard — `/api/dashboard`

All dashboard endpoints require authentication. Role-specific stats are only accessible by the matching role.

### `GET /api/dashboard/admin-stats`
Aggregate counts: total users, companies, open RFQs, total quotation value, pending verifications.

**Auth:** Required, admin

### `GET /api/dashboard/buyer-stats`
Buyer-specific stats: active RFQs, received quotations, awarded deals.

**Auth:** Required, buyer

### `GET /api/dashboard/supplier-stats`
Supplier-specific stats: submitted quotations, win rate, active RFQs available to quote.

**Auth:** Required, supplier

### `GET /api/dashboard/recent-activity`
Recent events across the platform (latest RFQs, quotations, company verifications).

**Auth:** Required

### `GET /api/dashboard/rfq-by-status`
Count of RFQs grouped by status, for chart rendering.

**Auth:** Required

---

## Documents — `/api/documents`

### `GET /api/documents`
List documents for the current user or their company.

**Auth:** Required

### `POST /api/documents`
Register a document record (URL, type, name). File upload is handled externally; this stores the metadata.

**Auth:** Required

---

## Email Logs — `/api/email-logs`

Admin-only. Used by the Email Logs dashboard page.

### `GET /api/email-logs`
List email logs. Supports query params: `status`, `eventType`, `limit` (max 500).

**Auth:** Required, admin

### `GET /api/email-logs/stats`
Aggregate counts by status and event type.

**Auth:** Required, admin

### `POST /api/email-logs/:logId/retry`
Reset a `failed` or `skipped` log back to `pending` for the background worker to retry.

**Auth:** Required, admin
