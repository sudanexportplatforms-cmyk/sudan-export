# Authentication & Role-Based Access

## Authentication Provider: Clerk

Sudan Export uses [Clerk](https://clerk.com) for identity management. Clerk handles:

- Sign-up / sign-in (email + password, Google OAuth, etc.)
- Session cookies (HTTP-only, secure)
- JWT verification
- Multi-factor authentication (configurable)

### Proxied Clerk Architecture

Clerk's frontend SDK normally communicates directly with `clerk.accounts.dev` (or your custom domain). In this project, all Clerk requests are **proxied through the API server** at `/api/clerk`. This has two benefits:

1. Prevents CORS issues in the Replit iframe proxy environment.
2. Keeps all traffic on a single domain.

**How it works:**

```
Browser  →  /api/clerk/*  →  clerkProxyMiddleware  →  Clerk CDN
                                     ↑
                          (rewrites host + forwards cookies)
```

Configuration:
- `VITE_CLERK_PROXY_URL` — set to `/api/clerk` on the frontend so the Clerk SDK uses the proxy
- `clerkProxyMiddleware` in `artifacts/api-server/src/middlewares/clerkProxyMiddleware.ts` handles the forwarding

---

## Server-Side Auth Flow

Every protected API route calls `requireAuth` middleware before the handler.

```
Request  →  requireAuth  →  getAuth(req)  →  extracts clerkId
                                    ↓
                          sets req.userId = clerkId
                                    ↓
                          handler reads req.userId
```

**`requireAuth` middleware** (`artifacts/api-server/src/middlewares/requireAuth.ts`):
- Calls Clerk's `getAuth(req)` to verify the session cookie
- If no valid session: returns `401 Unauthorized`
- If valid: sets `req.userId` (Clerk user ID) on the request object

**Role enforcement** is done inside individual route handlers:
```typescript
const me = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkId, req.userId!) });
if (!me || me.role !== "admin") {
  res.status(403).json({ error: "Forbidden" });
  return;
}
```

---

## User Roles

| Role | Description | Set By |
|---|---|---|
| `buyer` | International buyer creating RFQs | User during onboarding |
| `supplier` | Sudanese exporter submitting quotations | User during onboarding |
| `admin` | Platform administrator | Only set directly in DB |

### How Roles Are Set

1. User signs up via Clerk.
2. On first `/api/users/me` call, a `users` row is created with the default role `buyer`.
3. During **onboarding**, the user selects `buyer` or `supplier` via `POST /api/users/me`. The server updates the role — but **cannot escalate to `admin`**. Admin role is assigned directly in the database.
4. After onboarding, the role is locked. Changing roles requires direct DB access.

### Admin Account Setup

To create an admin user:
1. Sign up normally via the app.
2. Find the user's `clerk_id` in the `users` table.
3. Run the seed script or update directly:
```sql
UPDATE users SET role = 'admin' WHERE clerk_id = 'user_xxxx...';
```
Or use the provided seed script:
```bash
pnpm --filter @workspace/scripts run seed
# Then follow the prompts to assign the admin role
```

---

## Frontend Route Protection

Client-side routes are protected by `ProtectedRoute` components that check:
1. Clerk's `isSignedIn` status
2. The user's `role` from the database (stored in React Query / context)

```
/buyer/*     → requires role = "buyer"
/supplier/*  → requires role = "supplier"
/admin/*     → requires role = "admin"
```

Unauthenticated users are redirected to `/sign-in`. Authenticated users visiting a route for the wrong role are redirected to their own portal.

**Route order matters in Wouter:** Static routes (e.g. `/buyer/rfqs/new`) must be declared before parameterized routes (e.g. `/buyer/rfqs/:rfqId`) to avoid the static segment matching as a URL parameter.

---

## Role-Based Data Filtering

The API server filters data based on the authenticated user's role:

| Resource | Buyer sees | Supplier sees | Admin sees |
|---|---|---|---|
| RFQs | Their own only | All open/quoting | All |
| Quotations | On their own RFQs | Their own only | All |
| Companies | Their own | Their own | All |
| Users | — | — | All |
| Email Logs | — | — | All |
| Documents | Their own | Their own | All |

---

## Security Notes

- **No client-side role elevation:** The server re-validates role from the DB on every request. The Clerk JWT only confirms identity, not role.
- **Admin creation requires DB access:** There is deliberately no UI to elevate a user to admin. This prevents privilege escalation via UI exploits.
- **Session cookies are HTTP-only and secure:** They cannot be read by JavaScript.
- **Clerk session expiry:** Sessions auto-refresh via the Clerk SDK. Expired sessions return `401` from the API, which triggers a client-side redirect to `/sign-in`.
