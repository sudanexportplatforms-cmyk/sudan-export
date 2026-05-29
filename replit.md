# Sudan Export

A full-stack B2B export marketplace connecting Sudanese agricultural exporters and suppliers with international buyers. Supports three roles: buyer, supplier, and admin, with RFQ workflow, quotation management, company verification, product catalog, and an admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — express session

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (wouter routing, shadcn/ui, Tailwind CSS)
- Auth: Clerk (cookie-based, proxied through API server)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema.ts` — single source of truth for DB schema (all tables)
- `lib/api-spec/src/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/src/generated/` — auto-generated React Query hooks + Zod schemas (do not edit manually)
- `artifacts/api-server/src/routes/` — Express route handlers organized by domain
- `artifacts/sudan-export/src/pages/` — React pages organized by role (buyer/, supplier/, admin/, public/, auth/)
- `artifacts/sudan-export/src/components/layout/PortalLayout.tsx` — shared portal shell with role-aware nav

## Architecture decisions

- **Contract-first API**: OpenAPI spec → Orval codegen → typed hooks + Zod schemas used on both client and server
- **Clerk auth proxied**: Clerk middleware runs on the API server; frontend uses `VITE_CLERK_PROXY_URL` so all auth requests go through `/api/clerk`
- **Role-gated portals**: After sign-up, users complete an onboarding step that sets their role (buyer/supplier). Routes are organized by `/buyer/*`, `/supplier/*`, `/admin/*`
- **Deep imports forbidden**: All types must be imported from `@workspace/api-client-react` (top-level re-exports), never from `@workspace/api-client-react/src/generated/api.schemas`
- **5 core commodities seeded**: Sesame, Gum Arabic, Groundnuts, Hibiscus, Cotton — seeded via `lib/db/src/seed.ts`

## Product

- **Public**: Landing page, commodity catalog, about page
- **Buyer portal**: Dashboard, RFQ creation & management, quotation review & award, messaging, company profile, document upload, settings
- **Supplier portal**: Dashboard, browse open RFQs, submit quotations, messaging, company profile, documents, settings
- **Admin portal**: Dashboard with stats, user management, company verification (approve/reject), RFQ oversight

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm run typecheck:libs` before `pnpm --filter @workspace/api-server run typecheck` when adding new DB schema files
- `UserProfileInputRole` and `CompanyInputType` are both a type AND a const enum object in the generated code — import with `import type { ... }` or import as value depending on usage
- Wouter route order matters: `/buyer/rfqs/new` must come before `/buyer/rfqs/:rfqId` to avoid the static segment matching as a param
- Clerk `publishableKeyFromHost` reads from the Replit domain automatically in dev; `VITE_CLERK_PUBLISHABLE_KEY` is the fallback

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
