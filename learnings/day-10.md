## Authentication, Authorization & Deploying a Two-Service App

Day 10 added real auth to the Task Management app and shipped it to production. The backend gained JWT auth, password hashing, route guards, and per-user data scoping; the frontend gained login/register pages, httpOnly-cookie token storage, route protection, and logout; and the whole thing went live on Railway (backend + Postgres) and Vercel (frontend). The throughline: **authentication is who you are, authorization is what you can touch, and the two are separate layers** — and the architecture you choose has direct deployment consequences.

---

## Hashing vs signing — two different one-way tricks

Passwords and tokens both use cryptography, but for opposite reasons:

- **Passwords are hashed** with bcrypt — a deliberately slow, one-way function. You never store or recover the original; at login you `bcrypt.compare(plaintext, storedHash)`, which re-derives the hash using the salt baked into the stored value (the `$2b$10$…` prefix is algorithm + cost + salt, which is why there's no separate salt column).
- **Tokens are signed**, not encrypted. A JWT is `header.payload.signature`, all Base64 — **anyone can read the payload**. Security comes from the signature: it's the payload hashed with a server-only secret, so the data is *visible but tamper-proof*. Change `sub` to impersonate someone and the signature no longer matches.

This makes the server **stateless**: it doesn't store sessions, it just verifies the signature on each request. The secret restarting/scaling doesn't matter; a valid token keeps working.

---

## Guards and the request lifecycle

A NestJS **guard** implements `CanActivate` and runs *before* the route handler (and before validation pipes): return `true` to proceed, throw to reject. The JWT guard pulls the `Bearer` token off the `Authorization` header, verifies it with the same secret that signed it, and stashes the decoded payload on `request.user`.

Two takeaways:
- **Hand-rolled beat the framework here.** A ~30-line guard using `JwtService` was clearer than `passport-jwt`'s strategy machinery. Passport is the production-standard and worth recognizing, but for "protect routes with a guard" it's indirection you don't need.
- **`@UseGuards(JwtAuthGuard)` at the class level** protects every route in one line.

---

## Authentication ≠ authorization

The guard proves *identity*. It doesn't decide *what you can see*. That's a separate layer:
- A `@CurrentUser()` param decorator (`createParamDecorator`) reads `request.user` into a typed method argument — sugar over the data the guard placed there. Guard + decorator are a pair.
- Every task query is scoped by `userId`: stamp it on create, filter `findMany`/`count` on read, and check ownership before update/delete.

**404, not 403, for someone else's resource.** Returning `403 Forbidden` confirms the resource *exists*; `404` reveals nothing, so an attacker probing `/task/1`, `/task/2`… can't map which ids are real. Don't leak existence.

---

## Where to store a token in the browser

| | `localStorage` | **httpOnly cookie** |
|---|---|---|
| Readable by JS | yes → XSS can steal it | **no** |
| Readable by Server Components | no | yes (`await cookies()`) |

The httpOnly cookie wins because it's invisible to JavaScript — the entire "XSS steals the token" class of attack disappears. The cost (client JS can't read it) is a non-issue here: every fetch is server-side, so the **server** reads the cookie and the client never needs the token in hand.

The elegant part is the **two-hop split**: the cookie lives on the browser↔Vercel hop (first-party, same-origin, `sameSite: lax`), and the token is forwarded as an `Authorization: Bearer` header on the Vercel-server↔backend hop. The browser never holds the token *and* never calls the backend directly.

---

## Server Actions are RPC disguised as a form POST

Calling a `"use server"` function from the client doesn't hit a route you defined. The browser POSTs to the **current page's URL** with a `Next-Action: <hash>` header — the hash, not the function name, selects which server function runs; the args travel serialized in the body. So `/login` showing up in the network tab is the *page* URL, not the function name, and the action is dispatched by header.

---

## Next 16 broke things tutorials still get wrong

- **`cookies()` is async** — `await cookies()` then `.get`/`.set`/`.delete`. Next 14 was synchronous; old tutorials omit the `await` and break here.
- **Middleware is now Proxy.** `middleware.ts` → `proxy.ts`, `export function middleware` → `proxy`. Same Edge mechanics, renamed in Next 16.
- The proxy is an **optimistic** gate: it only checks the cookie *exists* (it can't verify the signature — no access to the secret). Real security is still the backend guard. A `matcher` scopes it to `/tasks/*` so `/login` and static assets stay public (and you avoid a redirect loop).

---

## Local → production is a parity problem

Deploying = replacing local conveniences with explicit, always-valid config:

- **Hardcoded URLs → one env var.** Three `localhost:8001` strings collapsed into `process.env.API_URL` (with a localhost fallback) — only possible because all backend calls went through one `apiFetch` wrapper. Server-side only, so no `NEXT_PUBLIC_` (keeps it out of the client bundle).
- **Secrets live in the host, not the repo.** `.env` is gitignored; `JWT_SECRET`/`DATABASE_URL` go in the Railway/Vercel dashboards.
- **Build once, don't watch.** `nest build` + `node dist/src/main`, `next build`. Prisma's client must be generated at build (`prisma generate`); migrations apply with **`prisma migrate deploy`** (apply-only, never reset) — the production-safe command.
- **Architecture simplifies deployment.** Because the browser never calls the backend directly, CORS is effectively dead config and cookies stay first-party. The server-to-server design paid off at deploy time.

---

## The deployment gotchas (each cost real debugging)

- **Monorepo root directory.** The repo root has no `package.json`; the builders couldn't detect an app until Root Directory was set to `task-management` (Railway) and `task-management/frontend` (Vercel).
- **Pin the Node version** (`engines.node` + `.nvmrc`) so the build env matches local.
- **`502` = app crashed on boot.** `start:prod` was `migrate deploy && node …`; when `DATABASE_URL` was missing, `migrate deploy` failed and `&&` stopped the app from ever starting.
- **`500: secretOrPrivateKey must have a value`** = `JWT_SECRET` unset on the host. Tellingly, register's DB write *succeeded* before this threw — proof the database was fine and only the env var was missing.
- **Wrong start path.** `nest build` emitted `dist/src/main.js` (not `dist/main.js`, because files outside `src/` raised the rootDir). Caught locally before it became a deploy crash.

---

## Security lessons that surfaced along the way

- **`include: { user: true }` is a footgun.** It returns *every* column of the relation — so the day a `password` column was added, the task list started leaking the hash. Either `select` explicit fields or don't include it. Adding a column has blast radius beyond the table it's on.
- **Adding a required column ripples.** Making `password` non-null broke every existing insert path (seed, the old user endpoint) at compile time — the dev-time version of the production migration problem (add nullable → backfill → enforce).
- **Fail loudly on missing config.** A missing `JWT_SECRET` surfaced as a generic 500 deep in a request; config that the whole app depends on is worth validating at startup.

**The throughline:** layers. Hashing protects the password, signing protects the token, the guard protects the route, scoping protects the data, and the proxy is just UX on top of a guard that does the real work. Each layer does one job, and security is what's left when you don't rely on any single one of them.
