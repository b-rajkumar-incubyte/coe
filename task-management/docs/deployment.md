# Deployment

The Task Management app runs as two independently deployed services:

- **Backend** (NestJS + Prisma) → **Railway**, with a managed PostgreSQL database
- **Frontend** (Next.js) → **Vercel**

Both deploy automatically from the `main` branch of the GitHub repo
(`b-rajkumar-incubyte/coe`). This is a monorepo: the backend lives at the repo
path `task-management/` and the frontend at `task-management/frontend/`.

## Architecture

```
Browser ──► Vercel (Next.js server) ──► Railway (NestJS) ──► Postgres
           reads httpOnly cookie       verifies Bearer JWT
```

The browser only ever talks to Vercel. All backend calls happen **server-side**
(Server Components / Server Actions) via the `apiFetch` wrapper, which reads the
JWT from an httpOnly cookie and forwards it to the backend as
`Authorization: Bearer <token>`.

Two consequences worth remembering:
- **No CORS dependency.** The backend never receives cross-origin *browser*
  requests, so CORS config is not load-bearing.
- **Cookies stay first-party.** The token cookie is set by Vercel for its own
  domain and read by the Vercel server, so `sameSite: "lax"` works — no
  `sameSite: "none"` needed.

## Live URLs

- Frontend: https://task-management-two-tau-34.vercel.app
- Backend:  https://coe-production.up.railway.app

---

## Backend — Railway

### Service settings
- **Root Directory:** `task-management` (the backend is not at the repo root).
- **Builder:** Nixpacks (configured via `railway.json`).
- **Build command:** `npm run build` → `prisma generate && nest build`
- **Start command:** `npm run start:prod` → `prisma migrate deploy && node dist/src/main`

`railway.json` (committed at `task-management/railway.json`) pins the build and
start commands so the deploy is reproducible.

### Database
Add a **PostgreSQL** plugin to the Railway project and link it to the backend
service. Railway injects `DATABASE_URL` automatically (use the reference
variable so it stays on the private network).

Migrations run on every deploy via the start command (`prisma migrate deploy`).
This only *applies* committed migrations — it never generates or resets them.

### Environment variables
| Variable | Source | Notes |
|---|---|---|
| `DATABASE_URL` | Postgres plugin reference | `${{Postgres.DATABASE_URL}}` — do not paste by hand |
| `JWT_SECRET` | set manually | any long random string; must stay stable (changing it invalidates all issued tokens) |
| `PORT` | provided by Railway | `main.ts` already reads `process.env.PORT` |

Generate a secret with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Node version
Pinned to Node 24 via `engines.node` in `package.json` and `.nvmrc`, so the
build environment matches local development.

---

## Frontend — Vercel

### Project settings
- **Root Directory:** `task-management/frontend`
- **Framework preset:** Next.js (auto-detected; build/output settings are automatic).

### Environment variables
| Variable | Value | Notes |
|---|---|---|
| `API_URL` | `https://coe-production.up.railway.app` | the Railway backend URL. **Not** `NEXT_PUBLIC_` — it is server-side only and stays out of the client bundle |

Locally, `API_URL` is unset and the code falls back to `http://localhost:8001`
(see `frontend/src/lib/api.ts`), so dev works with no extra config.

---

## Deploying changes

Both services redeploy automatically on push to `main`:

```bash
git push        # → triggers Railway (backend) and Vercel (frontend) builds
```

Adding or changing an environment variable in either dashboard also triggers a
fresh deploy.

## Smoke test

After a backend deploy:
```bash
BASE="https://coe-production.up.railway.app"

# Register a user (proves DB + migrations + bcrypt + JWT)
curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"smoke@example.com","password":"supersecret"}'

# Unauthenticated task access must be rejected
curl -s "$BASE/task" -w "\n%{http_code}\n"   # → 401
```

After a frontend deploy: open the Vercel URL, register or log in, and confirm
you land on `/tasks` with your own tasks.

---

## Gotchas we hit (and the fixes)

| Symptom | Cause | Fix |
|---|---|---|
| Railpack: "could not determine how to build" | Root Directory left at repo root (`coe/`), which has no `package.json` | Set Root Directory to `task-management` (Railway) / `task-management/frontend` (Vercel) |
| Build fails on Node version | Builder picked a different Node than local | Pin Node via `engines.node` + `.nvmrc` |
| `502 Application failed to respond` | App crashed on boot — `migrate deploy` failed (missing `DATABASE_URL`) and `&&` short-circuited the start | Link the Postgres plugin so `DATABASE_URL` is set |
| `500` on register/login: `secretOrPrivateKey must have a value` | `JWT_SECRET` not set on Railway | Add the `JWT_SECRET` variable and redeploy |
| Would-be crash: `Cannot find module dist/main` | `nest build` emits to `dist/src/main.js` (because files outside `src/` raise the rootDir) | Start path is `node dist/src/main` |
| Password hash leaked in task list JSON | `findMany(... include: { user: true })` returns all user columns | Removed the `include` (the list is already scoped to one user) |
