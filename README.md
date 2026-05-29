# Sudan Export — B2B Agricultural Trade Platform

A full-stack B2B marketplace connecting Sudanese agricultural exporters and suppliers with international buyers. Supports an end-to-end RFQ (Request for Quotation) workflow with company verification, quotation management, in-app messaging, document management, and an admin oversight portal.

---

## Overview

| Property | Value |
|---|---|
| **Brand** | #1F5D3B (green), #C9A24A (gold) |
| **Roles** | `buyer`, `supplier`, `admin` |
| **Core Commodities** | Sesame, Gum Arabic, Groundnuts, Hibiscus, Cotton |
| **Auth** | Clerk (cookie-based, proxied through API server) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite, Wouter routing, shadcn/ui, Tailwind CSS |
| **Backend** | Node.js 24, Express 5, TypeScript 5.9 |
| **Database** | PostgreSQL + Drizzle ORM |
| **Auth** | Clerk (OpenID Connect, proxied) |
| **API Contract** | OpenAPI 3.1 → Orval codegen → typed React Query hooks + Zod schemas |
| **Email** | Resend API (optional — gracefully skipped if not configured) |
| **Package Manager** | pnpm workspaces (monorepo) |
| **Build** | esbuild (server CJS bundle), Vite (frontend) |
| **Validation** | Zod v4, drizzle-zod |

---

## Repository Structure

```
sudan-export/
├── artifacts/
│   ├── api-server/          # Express 5 API server
│   │   └── src/
│   │       ├── routes/      # Route handlers by domain
│   │       ├── lib/         # emailQueue, emailSender, emailTemplates, logger
│   │       └── middlewares/ # requireAuth, clerkProxyMiddleware
│   └── sudan-export/        # React + Vite frontend
│       └── src/
│           ├── pages/       # buyer/, supplier/, admin/, public/, auth/
│           └── components/  # UI components, layout/PortalLayout
├── lib/
│   ├── db/                  # Drizzle ORM schema + migrations
│   │   └── src/schema/      # One file per domain table
│   ├── api-spec/            # OpenAPI 3.1 YAML (source of truth)
│   └── api-client-react/    # Generated React Query hooks + Zod schemas
└── scripts/                 # Utility and seed scripts
```

---

## User Roles

### Buyer
- Create and manage RFQs (Requests for Quotation)
- Review and compare quotations from suppliers
- Award quotations to winning suppliers
- Upload and manage company documents
- In-app messaging with suppliers

### Supplier
- Browse open RFQs from international buyers
- Submit competitive quotations with line-item pricing
- Track quotation status (submitted → shortlisted → awarded)
- Manage company profile and documents
- Receive email notifications for new RFQs

### Admin
- Full platform oversight dashboard with aggregate stats
- Approve or reject company verifications
- Manage all users (view, suspend, role inspection)
- View all RFQs, quotations, and documents across the platform
- Monitor email notification logs with retry capability

---

## Setup Instructions

### Prerequisites

- Node.js 24+
- pnpm 10+
- PostgreSQL 15+ (connection string in `DATABASE_URL`)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd sudan-export
pnpm install
```

### 2. Set environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env
```

See [Environment Variables](#environment-variables) below for all required values.

### 3. Push the database schema

```bash
pnpm --filter @workspace/db run push
```

### 4. (Optional) Seed test data

```bash
pnpm --filter @workspace/scripts run seed
```

### 5. Run locally

```bash
# Terminal 1 — API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend (auto-assigned port)
pnpm --filter @workspace/sudan-export run dev
```

Or on Replit, start the configured workflows from the Run panel.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Express session signing secret (32+ random chars) |
| `CLERK_PUBLISHABLE_KEY` | Prod | Clerk publishable key (dev: auto-detected from domain) |
| `CLERK_SECRET_KEY` | Prod | Clerk secret key for server-side auth |
| `RESEND_API_KEY` | Optional | Resend API key for email delivery; emails are skipped if absent |
| `EMAIL_FROM` | Optional | Sender address, e.g. `Sudan Export <noreply@sudanexport.com>` |
| `APP_BASE_URL` | Optional | Public base URL used in email links (default: `https://sudan-export.replit.app`) |
| `PORT` | Runtime | Injected by Replit workflows; do not set manually |

---

## How to Run Locally

```bash
# Install all workspace dependencies
pnpm install

# Push DB schema (first time or after schema changes)
pnpm --filter @workspace/db run push

# Seed test data
pnpm --filter @workspace/scripts run seed

# Start API server
pnpm --filter @workspace/api-server run dev

# Start frontend
pnpm --filter @workspace/sudan-export run dev

# Full typecheck
pnpm run typecheck

# Regenerate API client from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen
```

---

## How to Deploy

### On Replit

1. Open the **Deploy** tab in your Repl.
2. Set all required environment variables as **Secrets**.
3. The build command (`pnpm --filter @workspace/api-server run build`) and start command (`node dist/index.mjs`) are pre-configured in the artifact's `artifact.toml`.
4. Click **Deploy** — Replit handles TLS, health checks, and zero-downtime restarts.

### On any host (e.g. Railway, Render, Fly.io)

```bash
# Build
pnpm --filter @workspace/api-server run build

# Migrate database (run once before first deploy and after schema changes)
pnpm --filter @workspace/db run push

# Start
node artifacts/api-server/dist/index.mjs
```

The frontend is a static Vite build:

```bash
pnpm --filter @workspace/sudan-export run build
# Serve the dist/ folder from any static host or CDN
```

---

## Documentation

| Document | Contents |
|---|---|
| [`docs/database-schema.md`](docs/database-schema.md) | All tables, columns, and relationships |
| [`docs/api-routes.md`](docs/api-routes.md) | Complete API route reference |
| [`docs/auth-and-roles.md`](docs/auth-and-roles.md) | Auth flow, role gating, middleware |
| [`docs/rfq-workflow.md`](docs/rfq-workflow.md) | End-to-end RFQ lifecycle |
| [`docs/email-notifications.md`](docs/email-notifications.md) | Email queue, templates, and Resend setup |
| [`docs/deployment.md`](docs/deployment.md) | Production checklist and troubleshooting |

---

## Health Check

```
GET /api/healthz         → { status: "ok" }
GET /api/health/detailed → DB status, email worker status, uptime
```

---

## License

Private — all rights reserved.
