# MENOOWEL Overhaul Plan — Backend, Auth, Admin, Self-Hosted Deploy

## Context
MENOOWEL is currently a static client-only Vite SPA (catalogs hard-coded as TS, presets/history in
localStorage), deployed on Vercel. We're evolving it into a full product: a managed backend with an
admin panel for all data, user accounts (email + Google), and self-hosting on the Firuworks Contabo
server. A native mobile app will come later and must consume the **same API**.

## Locked decisions
- **Backend:** custom **NestJS + Prisma**, on the shared **PostgreSQL 17** (`postgres-shared`).
- **Admin:** separate SPA at **admin.menoowel.com**.
- **Catalogs (waters/beans/grinders/drippers/filters/recipes/processes):** moved to DB, seeded from
  the current generated data; web & mobile fetch via API (cached). Admin edits them.
- **Domains:** `menoowel.com` (web) + `api.menoowel.com` + `admin.menoowel.com`, all on Coolify.
  Retire Vercel.
- **Auth:** JWT access + refresh (bearer; mobile-ready) + Google OAuth. Home page stays public.

## Target architecture — npm-workspaces monorepo (in `firumanusia/coffee-lab`)
```
package.json            # workspaces: ["apps/*","packages/*"]
apps/
  web/                  # current SPA, moved here; fetches API; auth-aware
  admin/                # new Vite React admin SPA (admin-role only)
  api/                  # NestJS API + Prisma
packages/
  shared/               # TS types, prediction model (predict/sca), seed catalogs
                        # — reused by web, admin, and the future mobile app
scripts/                # existing data generator + raw CSVs (feed the seed)
```
Rationale: shared types + prediction live once and are consumed by web, admin, and mobile. Coolify
deploys each app via its base directory.

## Data model (Prisma / Postgres `menoowel` db)
- **User**: id, email (unique), passwordHash?, googleId?, name, role (`user`|`admin`), timestamps.
- **Catalogs**: Water, Bean, Grinder, Dripper, PaperFilter, Recipe, Process — columns mirror the
  current generated interfaces; pours/cup-profile stored as typed columns or JSON where natural.
- **Preset**: id, userId, name, config (JSON), createdAt.
- **BrewLog**: id, userId, name, config (JSON), result (JSON), feedback (JSON), createdAt.
- **RefreshToken**: id, userId, tokenHash, expiresAt, revoked — for refresh rotation/revocation.

## API (NestJS, versioned `/v1`)
- **Auth:** `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `GET /auth/me`,
  `GET /auth/google` + `/auth/google/callback`. Argon2 password hashing. Access JWT ~15m, refresh
  ~30d (httpOnly cookie for web; JSON for mobile). Roles guard.
- **Catalogs (public GET, admin-only writes):** `/waters /beans /grinders /drippers /filters
  /recipes /processes` — list/read open; `POST/PATCH/DELETE` require `admin`.
- **User data (auth required, owner-scoped):** `/presets` CRUD, `/brew-logs` CRUD.
- **`GET /health`** for Coolify health checks.
- OpenAPI (Swagger) at `/docs` — doubles as the mobile contract.
- CORS allowlist: menoowel.com, admin.menoowel.com (+ localhost dev).

## Web app changes (`apps/web`)
- Data layer: replace static imports with a typed API client + cache (TanStack Query). Prediction
  stays client-side using fetched catalogs. Keep a graceful loading/fallback state.
- Auth: AuthProvider + login/register/Google modal. Home and the studio remain usable **anonymously**
  (localStorage presets/history as today). When logged in, presets & brew logs sync to the API
  (one-time "import your local data?" offer).
- Lazy-loaded heavy data (grinders) now comes from API anyway.

## Admin SPA (`apps/admin`) — react-admin (proven boilerplate)
- Built on **react-admin** (marmelab): a thin **dataProvider** mapping to our REST `/v1`, an
  **authProvider** wired to our JWT auth, and one `<Resource>` per catalog (auto list/edit/create
  with search/filter), plus a Users resource for role management. Admin-only.
- **Single users table, role-based:** there is one `User` table; `role` (`user`|`admin`) governs
  access. Admins are ordinary users too — they can sign in and use **menoowel.com** like anyone;
  the `admin` role additionally grants the admin app + catalog write endpoints. No separate admin
  account store.

## Seeding (low-churn)
The data generator (`scripts/generate_data.py`) also emits **JSON** into `packages/shared/catalog/`;
the API seed reads those JSON files. This avoids extracting the web's TS modules now — the web keeps
its current data imports until Phase 4 swaps them for API calls. (Shared TS types/prediction for the
mobile app can be extracted later when mobile work begins.)

## Deployment (Coolify on Contabo `207.180.218.247`)
1. **DB:** SSH in; create `menoowel` Postgres db + user on `postgres-shared` (per DEPLOYMENT.md §5A).
2. **API:** Coolify resource → repo `coffee-lab`, base dir `apps/api`, Nixpacks/Dockerfile, port 3000,
   domain `api.menoowel.com`, "Connect to Predefined Network" (`coolify`) to reach `postgres-shared`.
   Env: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `GOOGLE_CLIENT_ID/SECRET`,
   `CORS_ORIGINS`, `NODE_ENV`. Run `prisma migrate deploy` + seed on release.
3. **Web:** Coolify resource → base dir `apps/web`, domain `menoowel.com` (+ `www`). Env: `VITE_API_URL=https://api.menoowel.com/v1`, `VITE_GOOGLE_CLIENT_ID`.
4. **Admin:** Coolify resource → base dir `apps/admin`, domain `admin.menoowel.com`.
5. **DNS (Hostinger API):** A (and AAAA) records for `menoowel.com`, `www`, `api`, `admin` →
   `207.180.218.247` / `2a02:c207:2334:256::1`. Traefik issues Let's Encrypt certs.
6. Verify HTTPS, health, login, catalog fetch, admin CRUD end-to-end.

## What I need from you (external, I can't do)
- **Google OAuth client** in Google Cloud Console (I'll give exact redirect URIs + scopes):
  authorized origins `https://menoowel.com`, `https://admin.menoowel.com`; redirect
  `https://api.menoowel.com/v1/auth/google/callback`. Send me the Client ID + Secret (I'll store in
  an untracked env, never committed).
- Confirm **retiring Vercel** for menoowel.com.
- **Rotate the Hostinger API key** after we finish (it was shared in chat). I'll keep it only in a
  local git-ignored secrets file.

## Phased execution (each phase = commit; checkpoint before outward actions)
1. **Monorepo restructure** — move web → `apps/web`, add workspaces, extract `packages/shared`
   (types + prediction + seed catalogs). App still runs locally. *(local, reversible)*
2. **API scaffold** — NestJS + Prisma schema + migrations + seed from shared catalogs; catalog
   read endpoints; `/health`; Swagger. Runs locally against a local/tunelled Postgres. *(local)*
3. **Auth** — register/login/refresh/logout/me + Google OAuth + roles guard + admin write guards.
4. **Web integration** — API client + TanStack Query; swap static data for API; AuthProvider + login
   UI; server-sync presets/brew-logs when logged in.
5. **Admin SPA** — CRUD for all catalogs + users.
6. **Deploy** *(CHECKPOINT — your OK first)* — create DB, deploy API/web/admin on Coolify, set
   Hostinger DNS, wire Google creds, verify. Then retire Vercel.

## Verification
- Local: `npm run dev` per app; API `/docs` reachable; seed populates catalogs; web loads catalogs
  from API; login + presets/logs sync; admin CRUD mutates and reflects on web.
- Prod: each domain HTTPS-green; `GET api.menoowel.com/v1/health` ok; register/login/Google work;
  admin edits a catalog and it appears on menoowel.com; mobile-readiness = the same `/v1` API + Swagger.
```
