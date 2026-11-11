# Global Tourism Platform (GTour)

Monorepo for the Global Tourism Platform: destination discovery, tourism services, bookings, and administration.

## Monorepo structure

- **`apps/web`** (`gtour-web`, Next.js) — public/tourist web app (`http://localhost:3000`)
- **`apps/admin`** (`gtour-admin`, Next.js) — separate admin console (`http://localhost:3001`)
- **`apps/api`** (`gtour-api`, Express + MongoDB) — REST API (`http://localhost:5000`)
- **`packages/ui`** (`@gtour/ui`) — shared UI components (Button, Field, Card, Feedback, AuthGuard, etc.)
- **`packages/utils`** (`@gtour/utils`) — shared utilities (API client, session/auth storage, `cn`, shared DTO/types/helpers)
- **`packages/shared-types`** (`@gtour/shared-types`) — shared domain/types
- **`packages/validation`** (`@gtour/validation`) — shared Zod schemas/validation

## Tech stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, TanStack Table
- **API:** Express 5, TypeScript, MongoDB/Mongoose, JWT auth, Swagger (OpenAPI)
- **Uploads:** Cloudflare R2 (S3-compatible) for image storage/retrieval (via API upload endpoint)
- **Tooling:** pnpm workspaces, Turborepo, ESLint, Prettier, Jest, Playwright

## Prerequisites

- Node.js `>= 22`
- pnpm `>= 10.11.0` (repo uses `pnpm@10.11.0`)
- MongoDB (local or MongoDB Atlas)

## Local setup

1. **Enable pnpm / install dependencies**
   ```bash
   corepack enable
   corepack prepare pnpm@10.11.0 --activate
   pnpm install
   ```

2. **Configure environment variables** (see [Environment variables](#environment-variables))
   - Copy root template: `.env.example` → `.env` and fill API/server values
   - Create `apps/web/.env.local` and `apps/admin/.env.local` for frontend `NEXT_PUBLIC_*` values

3. **Start services**
   ```bash
   # all workspace dev tasks (parallel via turbo)
   pnpm dev

   # or run individually
   pnpm dev:api     # http://localhost:5000
   pnpm dev:web     # http://localhost:3000
   pnpm dev:admin   # http://localhost:3001
   ```

4. **Open apps**
   - Web: `http://localhost:3000`
   - Admin: `http://localhost:3001` (sign in with an admin account at `/login`)
   - API health: `http://localhost:5000/health`
   - Swagger UI: `http://localhost:5000/api-docs`

## Environment variables

### API/server — root `.env`

The API loads env from root/cwd `.env` candidates. Use [`.env.example`](.env.example) as a template.

```env
# Database / server
MONGODB_URI=mongodb://localhost:27017/gtour
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development

# Allowed frontend origins (CORS)
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
# Optional: comma-separated additional origins
# CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Cloudflare R2 (image uploads)
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-r2-bucket-name
R2_PUBLIC_URL=https://your-public-r2-domain   # no trailing slash
R2_UPLOAD_PREFIX=uploads                        # optional
```

> **Restart `gtour-api`** after changing `.env`. Never commit secrets.

### Web app — `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```

### Admin app — `apps/admin/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_WEB_URL=http://localhost:3000
```

> `NEXT_PUBLIC_*` values are exposed to the browser and read at Next dev/build time — restart/rebuild the affected app after changes.

## Scripts (root)

```bash
pnpm dev            # run workspace dev tasks in parallel
pnpm dev:web        # web app only
pnpm dev:admin      # admin app only
pnpm dev:api        # API only

pnpm build          # build all
pnpm typecheck      # typecheck all
pnpm lint           # lint all
pnpm test           # tests
pnpm test:watch
pnpm test:coverage
pnpm test:e2e
pnpm format
pnpm format:check
pnpm clean
```

## Features / notes

- **Auth:** JWT-based auth/session handling; protected routes; admin access control.
- **Admin (separate app):** users management (view profile, suspend/activate), destinations CRUD/archive, categories & locations CRUD, profile management, professional dashboard UI with filterable/paginated tables.
- **Image uploads:** `POST /api/v1/uploads/image` uploads to Cloudflare R2 and returns a public URL (used by destination/profile image flows). Legacy `/uploads` static serving remains for previously stored local files.
- **CORS:** API allows configured origins (`FRONTEND_URL`, `ADMIN_URL`, `CORS_ORIGINS`) so both web (`:3000`) and admin (`:3001`) can call the API in development.
- **Sessions (dev):** browser storage is per-origin, so web (`localhost:3000`) and admin (`localhost:3001`) have separate sessions; sign in to each as needed.

## Troubleshooting

- **CORS error from admin (`localhost:3001`) to API:** ensure `ADMIN_URL=http://localhost:3001` (or include it in `CORS_ORIGINS`) in root `.env` and restart the API.
- **404 for an API/image URL:** verify `NEXT_PUBLIC_API_URL` points to the running API (`/api/v1`), the API is started, and (for images) `R2_PUBLIC_URL`/bucket public access is configured correctly.
- **`chext_driver.js` / “Permissions policy violation: unload…” in console:** typically emitted by a browser extension, not by this app; try an incognito window without extensions to confirm.
- **MongoDB connection issues:** verify `MONGODB_URI`, credentials/network access (Atlas IP allowlist), and that MongoDB is reachable; check API startup logs.

## API documentation

With the API running: **Swagger UI** at `http://localhost:5000/api-docs` (OpenAPI spec served by the API).
