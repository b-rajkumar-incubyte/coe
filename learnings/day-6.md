## NestJS with Prisma — Relationships, Transactions, Pagination & Seeding

Day 6 continued the Task Management API by adding a User model with a one-to-many relationship to Tasks, querying related data, wrapping multi-step writes in transactions, adding pagination, and setting up a seed script for development data.

---

## Relationships in Prisma

A relational database expresses connections between tables through foreign keys — a column in one table that references the primary key of another. Prisma makes this explicit in the schema by declaring the relation on both sides. The `Task` model holds a nullable `userId` column as the foreign key, and the `User` model declares a `tasks` array field as the inverse side of the relation. Neither the array nor the inverse field create actual columns — they exist only so Prisma knows how to traverse the relation in queries.

Using a nullable foreign key on Task (`userId Int?`) was deliberate. The existing tasks in the database had no user assigned, so a required foreign key would have caused the migration to fail. Making it optional lets existing rows remain valid while new tasks can be linked to a user.

---

## Querying Related Data

Prisma does not automatically include related records in query results. A `findMany` on Task returns only the task's own columns — the related user is absent unless explicitly requested. The `include` option tells Prisma to join the related table and embed the result as a nested object. Tasks with no assigned user get `null` for the relation field, which is the expected behaviour for a nullable foreign key.

The same mechanism works in reverse: querying a User with `include: { tasks: true }` embeds the full list of that user's tasks inside the user object. Both directions use the same `include` option — Prisma generates the appropriate SQL JOIN in either case.

---

## Transactions

A transaction groups multiple database operations so they either all succeed or all fail together. Without a transaction, a sequence of writes has a window between each step where a failure leaves the database in a partial state — some rows committed, others not.

Prisma's interactive transaction passes a `tx` client into a callback. Any Prisma operation called through `tx` participates in the same transaction. If an exception is thrown anywhere inside the callback, Prisma automatically rolls back every operation that ran before it, leaving the database unchanged. If the callback completes without error, all operations are committed together.

`$transaction` can also accept an array of Prisma operations when the steps are independent and don't need to share results. This form is useful for running a `findMany` and a `count` in a single round-trip — both queries execute in parallel inside the transaction and the results are returned as a tuple.

---

## Pagination

Fetching every row from a table on every request becomes expensive as data grows. Pagination solves this by returning a fixed window of rows at a time. Prisma uses `skip` and `take` for this — `take` sets the page size and `skip` determines how many rows to skip from the start. The current page and page size determine the skip value: skipping `(page - 1) * limit` rows puts the window at the right position.

Returning only the page of data is not enough on its own. The caller has no way to know whether more pages exist without fetching the next page and seeing if it is empty. Including the total row count alongside the data solves this — the caller can compute the total number of pages from the count and the page size without any additional requests.

---

## Database Seeding

A seed script populates the database with known data for development. Running raw SQL inserts manually is error-prone and not repeatable — a seed script encodes the same setup as code that can be run by anyone on the team.

The key property of a seed script is idempotency: running it multiple times should produce the same result without duplicating data or throwing errors. Prisma's `upsert` operation handles this for single records — it inserts the row if it does not exist and updates it if it does. `createMany` with `skipDuplicates: true` handles it for bulk inserts. Together they make the seed script safe to run repeatedly against a database that may already contain some of the data.

The seed script runs outside NestJS — there is no DI container, no module system. It instantiates `PrismaClient` directly with the same driver adapter used in the application, loads the environment variables manually, and calls `$disconnect` in a `finally` block to close the connection cleanly when the script finishes.
