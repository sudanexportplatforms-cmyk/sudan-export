# Deployment Guide

This document covers production deployment, environment configuration, and troubleshooting.

---

## Production Environment Variables

All of the following must be set as **Secrets** (not plain env vars) in your hosting environment before deploying.

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/sudanexport` |
| `SESSION_SECRET` | Yes | Express session signing key — must be 32+ random chars | `openssl rand -hex 32` |
| `CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key | `pk_live_xxx...` |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key | `sk_live_xxx...` |
| `RESEND_API_KEY` | Optional | Resend email delivery key | `re_xxx...` |
| `EMAIL_FROM` | Optional | Sender display name + address | `Sudan Export <noreply@sudanexport.com>` |
| `APP_BASE_URL` | Optional | Public base URL for email links | `https://sudanexport.com` |

### Clerk Key Configuration

On Replit in development, `VITE_CLERK_PUBLISHABLE_KEY` is auto-detected from the Replit domain via `publishableKeyFromHost()`. For production, you must set:
- `CLERK_PUBLISHABLE_KEY` on the API server (server-side Clerk middleware)
- `VITE_CLERK_PUBLISHABLE_KEY` on the frontend build (Vite env var, prefix required)

---

## Build Command

```bash
pnpm --filter @workspace/api-server run build
```

This uses esbuild to bundle the Express server into `artifacts/api-server/dist/index.mjs` (CJS-compatible ESM bundle with all dependencies inlined).

Frontend:
```bash
pnpm --filter @workspace/sudan-export run build
```

Outputs to `artifacts/sudan-export/dist/`.

---

## Start Command

```bash
node artifacts/api-server/dist/index.mjs
```

Environment variables must be set before running. The server reads `PORT` from the environment.

---

## Database Migration Command

Run this before every deployment when schema has changed:

```bash
pnpm --filter @workspace/db run push
```

This uses `drizzle-kit push` to apply schema changes to the connected `DATABASE_URL`. It is **not** a migration file-based system — it diffs the current schema against the live database and applies the minimal set of changes.

> **Warning:** `drizzle-kit push` will drop columns that no longer exist in the schema. Always review the diff before running in production.

For production, run against the production `DATABASE_URL`:
```bash
DATABASE_URL=postgresql://... pnpm --filter @workspace/db run push
```

---

## Deploying on Replit

1. Open the **Deploy** panel in your Repl.
2. Set all required secrets in **Secrets**.
3. Replit will run the build command, then start the server.
4. A health check is performed against `GET /api/healthz` — the deploy succeeds when it returns `200`.
5. The app is available at your `.replit.app` domain (or custom domain if configured).

**After first deploy:** Run the seed script locally against the production DB to create the initial admin user and seed products:
```bash
DATABASE_URL=<prod-url> pnpm --filter @workspace/scripts run seed
```

---

## Deploying on Railway / Render / Fly.io

### Railway

1. Connect GitHub repo to Railway.
2. Add environment variables in Railway dashboard.
3. Set build command: `pnpm --filter @workspace/api-server run build`
4. Set start command: `node artifacts/api-server/dist/index.mjs`
5. Add a PostgreSQL plugin and set `DATABASE_URL`.
6. Deploy.

### Render

1. Create a **Web Service** from your repo.
2. Build command: `pnpm install && pnpm --filter @workspace/api-server run build`
3. Start command: `node artifacts/api-server/dist/index.mjs`
4. Add environment variables.
5. Add a **PostgreSQL** database and link `DATABASE_URL`.

---

## Serving the Frontend

The React frontend is a Vite static build. For production, serve it from a CDN or static host:

- **Netlify / Vercel:** Build command `pnpm --filter @workspace/sudan-export run build`, publish directory `artifacts/sudan-export/dist/`
- **Cloudflare Pages:** Same settings
- **Nginx:** Serve `dist/` as document root with `try_files $uri /index.html` for SPA routing
- **Same server as API:** Use `express.static()` to serve the built frontend from the API server

Set `VITE_CLERK_PROXY_URL` and `VITE_CLERK_PUBLISHABLE_KEY` as build-time environment variables before building the frontend.

---

## Health Checks

The platform exposes two health endpoints:

```
GET /api/healthz         → { "status": "ok" }   (basic liveness)
GET /api/health/detailed → full status object    (DB + worker)
```

Use `/api/healthz` for load balancer / deployment health probes.

---

## Troubleshooting

### Server fails to start: `PORT environment variable is required`

The server requires a `PORT` env var. On Replit this is injected automatically. On other hosts, ensure your process manager or platform sets it:
```bash
PORT=8080 node dist/index.mjs
```

### `Error: DATABASE_URL is not set`

Ensure `DATABASE_URL` is set in your environment before starting the server. On Replit, add it as a Secret.

### Clerk returns 401 on all requests after deploy

1. Verify `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set correctly (live keys for production, test keys for staging).
2. Ensure `VITE_CLERK_PROXY_URL` points to the correct proxy path on your domain.
3. Check that the proxy domain is added to your Clerk dashboard's **Allowed Origins**.

### Emails not sending after adding `RESEND_API_KEY`

1. Verify the key starts with `re_` and has Sending permission in the Resend dashboard.
2. Verify your sending domain is verified in Resend.
3. Check the Admin → Email Logs page — `failed` rows will show the Resend error message.
4. Use the Retry button to re-attempt delivery.

### Frontend shows blank page after deploy

1. Confirm `VITE_CLERK_PUBLISHABLE_KEY` was set at **build time** (not just at runtime).
2. Confirm the `BASE_URL` Vite config matches your deployment path prefix.
3. Check browser console for `401` or `CORS` errors from the API.

### `drizzle-kit push` drops a column unexpectedly

Always run `drizzle-kit push --dry-run` (or review the diff output) before applying to production. If a column was removed from the schema by mistake, restore it in `lib/db/src/schema/` before pushing.

### Admin user cannot log in

Admin accounts are created by setting `role = 'admin'` directly in the database. Ensure the user has completed the Clerk sign-up flow first (so a `users` row exists), then update:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@yourcompany.com';
```
