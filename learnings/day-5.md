## PostgreSQL & Prisma — Adding a Database Layer

Day 5 replaced the in-memory `Map` in the Task Management API with a real PostgreSQL database. The session covered what an ORM is, how Prisma models and migrations work, and how to connect Prisma to a NestJS application cleanly.

---

## What an ORM Does

An ORM (Object-Relational Mapper) sits between the application and the database. It lets you interact with the database using the same language and types as the rest of the application instead of writing raw SQL strings. The trade-off is a layer of abstraction that can hide what queries are actually running — which is worth keeping in mind as queries grow more complex.

Prisma specifically is schema-first: the database structure is defined in a schema file, and both the migration SQL and the TypeScript client are generated from it. This means the database schema, the generated types, and the application code all stay in sync automatically.

---

## The Prisma Schema

The schema file (`prisma/schema.prisma`) is the single source of truth for the data model. It describes three things: the generator (what to produce), the datasource (which database to connect to), and the models (the actual tables and their fields).

Models map to database tables. Each field maps to a column. Prisma provides annotations — `@id`, `@default()`, `@updatedAt` — to express database-level behaviour like primary keys, default values, and auto-managed timestamps. The `?` suffix on a field marks it nullable. These annotations read almost like documentation but produce real SQL constraints in the migration.

Enums in the schema become native PostgreSQL enum types. PostgreSQL stores enum values as strings but enforces membership at the database level — inserting an unlisted value fails before the application even sees a response. This is stronger than a plain text column validated only in application code, where a misconfigured service could bypass it. The trade-off is that altering a PostgreSQL enum after the fact is more involved than changing a `VARCHAR` — adding values is possible but removing or renaming them requires care.

---

## Migrations

A migration is a versioned SQL script that describes a schema change. When the schema file is updated, Prisma compares it against the database's current state and generates the SQL needed to bring them in sync. That SQL is saved as a file in `prisma/migrations/` with a timestamp prefix and a human-readable name, and then applied to the database.

The separation matters: the generated SQL file is committed to git alongside the code that depends on it. This means every developer and every deployment environment can replay the exact same sequence of changes to arrive at the same database state. Migrations are the database equivalent of version control — they make schema changes reproducible and auditable.

`prisma migrate dev` is the command for local development. It generates the migration, applies it, and regenerates the Prisma Client in one step. In production, `prisma migrate deploy` is used instead — it applies existing migrations without generating new ones, which is the safe behaviour for an automated environment.

---

## Prisma Client

`prisma generate` reads the schema and produces a type-safe client in the output directory. The client knows about every model, every field, and every relation — so `prisma.task.create({ data: { titlee: "..." } })` fails at compile time, not at runtime. This shifts a class of database errors from production incidents to development-time feedback.

The generated client is a singleton that manages a connection pool. It is not created per request — one instance services the entire application. In NestJS, this maps naturally to a singleton service. Wrapping the client in a `PrismaService` that hooks into the application's lifecycle (`OnModuleInit`, `OnModuleDestroy`) ensures the connection opens when the app starts and closes cleanly when it shuts down.

Marking the module `@Global()` means it only needs to be registered once in `AppModule`. Any feature module can inject `PrismaService` directly without re-importing the module — the NestJS DI container already knows about it.

---

## Environment Variables in NestJS

NestJS does not auto-load `.env` files. The Prisma CLI does — through `prisma.config.ts` — but that file is only executed by CLI commands like `migrate` and `generate`. The running NestJS application never touches it.

Without explicit dotenv loading, `process.env.DATABASE_URL` is `undefined` when `PrismaService` is instantiated, and the database adapter silently fails to connect. The fix is a side-effect import at the very top of `main.ts`, before any other module loads. Order matters here because NestJS instantiates all providers during `NestFactory.create()`, so the environment must be populated before that call runs.

---

## CRUD with Prisma

Prisma Client methods map closely to SQL operations — `findMany`, `findUnique`, `create`, `update`, `delete`. All of them return Promises because all database I/O is asynchronous. NestJS resolves Promises returned from controller methods automatically, so a controller can simply return a Prisma call without `await` and NestJS will handle it before sending the response.

The important constraint is that the Promise must be returned. If a controller calls an async service method but neither returns nor awaits it, the Promise runs detached from the request lifecycle. Any exception it throws — including a not-found error — bypasses the exception filters entirely and becomes an unhandled rejection. The controller has already sent a response at that point and the error has nowhere to go.

---

## Prisma Error Handling

Prisma throws `PrismaClientKnownRequestError` for predictable database-level errors. Each error has a code — `P2025` means a record required for the operation was not found, which is what `update` and `delete` throw when the `where` clause matches no rows.

Catching `P2025` and translating it to a `NotFoundException` keeps the not-found logic in the service and avoids a pre-flight `findUnique` query before every update or delete. Any error that is not `P2025` is re-thrown without modification, so unexpected database failures still surface as 500s rather than being silently swallowed.
