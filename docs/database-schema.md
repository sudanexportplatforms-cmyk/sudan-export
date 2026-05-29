# Database Schema

All tables are defined in `lib/db/src/schema/` using Drizzle ORM with PostgreSQL. The schema is pushed via `drizzle-kit push`.

---

## Table Index

| Table | File | Purpose |
|---|---|---|
| `users` | `users.ts` | Platform user accounts (linked to Clerk) |
| `companies` | `companies.ts` | Buyer and supplier company profiles |
| `products` | `products.ts` | Commodity/product catalog |
| `rfqs` | `rfqs.ts` | Requests for Quotation |
| `rfq_items` | `rfqs.ts` | Line items within an RFQ |
| `quotations` | `quotations.ts` | Supplier quotation responses |
| `quotation_items` | `quotations.ts` | Line items within a quotation |
| `messages` | `messages.ts` | In-app messaging between users |
| `notifications` | `notifications.ts` | In-app notification feed |
| `documents` | `documents.ts` | Uploaded files (company docs, certificates) |
| `email_logs` | `email_logs.ts` | Audit log for all outbound email notifications |

---

## `users`

Stores platform accounts. Each user is identified by their Clerk user ID (`clerk_id`), which is the primary foreign key used throughout the system.

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | Internal auto-increment |
| `clerk_id` | text UNIQUE | Clerk user ID — used as FK in rfqs, quotations, etc. |
| `email` | text | User email address |
| `first_name` | text | |
| `last_name` | text | |
| `role` | enum | `buyer` \| `supplier` \| `admin` |
| `status` | enum | `pending` \| `active` \| `suspended` |
| `phone` | text | Optional contact number |
| `country` | text | User's country |
| `company_id` | integer | FK → `companies.id` (nullable) |
| `avatar_url` | text | Profile picture URL |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | Auto-updated on save |

---

## `companies`

Company profiles submitted by buyers and suppliers. Require admin verification before a supplier can receive RFQ notifications.

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `name` | text | Company legal name |
| `type` | enum | `buyer` \| `supplier` \| `both` |
| `owner_id` | text | FK → `users.clerk_id` |
| `country` | text | Country of registration |
| `city` | text | |
| `address` | text | |
| `registration_number` | text | Business registration number |
| `tax_id` | text | |
| `website` | text | |
| `description` | text | Short company description |
| `verification_status` | enum | `pending` \| `approved` \| `rejected` |
| `verified_at` | timestamptz | Set when admin approves |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

## `products`

The commodity catalog. Seeded with 5 core Sudanese export commodities; admins can add more.

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `name` | text UNIQUE | Product/commodity name |
| `category` | text | Product category grouping |
| `description` | text | |
| `unit` | text | Default trading unit (MT, KG, etc.) |
| `origin` | text | Country of origin |
| `hs_code` | text | Harmonised System tariff code |
| `image_url` | text | Catalog image |
| `is_active` | boolean | Whether visible in catalog (default `true`) |
| `created_at` | timestamptz | |

---

## `rfqs`

Requests for Quotation created by buyers. One RFQ can have multiple items (products) and receive multiple quotations.

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `reference_number` | text UNIQUE | Human-readable ID, e.g. `RFQ-20260001` |
| `title` | text | Short description of the requirement |
| `status` | enum | See [RFQ Status Flow](rfq-workflow.md) |
| `buyer_id` | text | FK → `users.clerk_id` |
| `destination_country` | text | Delivery destination |
| `delivery_port` | text | Port of delivery |
| `payment_terms` | text | e.g. `LC`, `TT`, `CAD` |
| `incoterms` | text | e.g. `CIF`, `FOB`, `EXW` |
| `delivery_deadline` | text | Expected delivery date |
| `valid_until` | text | Date after which no new quotes accepted |
| `notes` | text | Additional requirements or comments |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### RFQ Status Values
`draft` → `open` → `quoting` → `shortlisted` → `awarded` → `closed` | `cancelled`

---

## `rfq_items`

Line items within an RFQ. Each item specifies a product, quantity, and optional target price.

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `rfq_id` | integer | FK → `rfqs.id` |
| `product_id` | integer | FK → `products.id` |
| `quantity` | numeric(12,3) | Required quantity |
| `unit` | text | Unit of measure (MT, KG, bags, etc.) |
| `target_price` | numeric(12,2) | Optional buyer target price per unit |
| `specifications` | text | Additional spec notes |
| `created_at` | timestamptz | |

---

## `quotations`

A supplier's response to an RFQ. One RFQ can receive many quotations; only one can be awarded.

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `rfq_id` | integer | FK → `rfqs.id` |
| `supplier_id` | text | FK → `users.clerk_id` |
| `status` | enum | `draft` \| `submitted` \| `shortlisted` \| `awarded` \| `rejected` |
| `total_amount` | numeric(14,2) | Total quoted value |
| `currency` | text | ISO 4217 currency code (default `USD`) |
| `valid_until` | text | Quote validity date |
| `delivery_time` | text | Estimated delivery time |
| `payment_terms` | text | Supplier's payment terms |
| `notes` | text | Additional notes or conditions |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

## `quotation_items`

Line-item breakdown of a quotation, matching the RFQ items.

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `quotation_id` | integer | FK → `quotations.id` |
| `rfq_item_id` | integer | FK → `rfq_items.id` |
| `quantity` | numeric(12,3) | Quantity offered |
| `unit` | text | Unit of measure |
| `unit_price` | numeric(12,2) | Price per unit |
| `total_price` | numeric(14,2) | `quantity × unit_price` |
| `currency` | text | ISO 4217 |
| `specifications` | text | Product spec compliance notes |
| `created_at` | timestamptz | |

---

## `messages`

In-app messages between buyers and suppliers, scoped to a specific RFQ.

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `rfq_id` | integer | FK → `rfqs.id` (conversation context) |
| `sender_id` | text | FK → `users.clerk_id` |
| `recipient_id` | text | FK → `users.clerk_id` |
| `content` | text | Message body |
| `read_at` | timestamptz | Null = unread |
| `created_at` | timestamptz | |

---

## `notifications`

In-app notification feed. Created by server-side events (RFQ updates, quotation changes, etc.).

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `user_id` | text | FK → `users.clerk_id` |
| `type` | text | Event type string |
| `title` | text | Short notification headline |
| `message` | text | Longer description |
| `entity_type` | text | `rfq` \| `quotation` \| `company` \| `user` |
| `entity_id` | integer | ID of the related entity |
| `read` | boolean | Whether the user has seen it |
| `created_at` | timestamptz | |

---

## `documents`

Company and user document uploads (certificates, licences, phytosanitary docs, etc.).

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `uploaded_by` | text | FK → `users.clerk_id` |
| `company_id` | integer | FK → `companies.id` (nullable) |
| `type` | text | Document type (e.g. `export_licence`) |
| `name` | text | Filename displayed to users |
| `url` | text | Storage URL |
| `mime_type` | text | MIME type |
| `size_bytes` | integer | File size |
| `created_at` | timestamptz | |

---

## `email_logs`

Audit trail for every outbound email notification. Used by the admin Email Logs dashboard.

| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `recipient_email` | text | Destination email address |
| `event_type` | enum | `rfq_opened` \| `quotation_submitted` \| `quotation_awarded` \| `rfq_closed` \| `rfq_cancelled` \| `company_approved` \| `company_rejected` |
| `entity_type` | enum | `rfq` \| `quotation` \| `company` |
| `entity_id` | integer | ID of the triggering entity |
| `status` | enum | `pending` \| `sent` \| `failed` \| `skipped` |
| `error_message` | text | Error detail when `failed` |
| `sent_at` | timestamptz | Set when Resend confirms delivery |
| `created_at` | timestamptz | |

**Deduplication:** Before inserting a new log, the system checks for an existing row with the same `(event_type, entity_id, recipient_email)` combination. If found, the email is not re-queued.
