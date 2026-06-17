# Task Management App — PostgreSQL & Prisma Curriculum

## Tech Stack
- **Runtime**: Node.js + NestJS (existing)
- **Database**: PostgreSQL (via Docker)
- **ORM**: Prisma
- **Skill Level**: Intermediate

---

## Module 1: PostgreSQL & Prisma Setup
Goal: PostgreSQL running locally and Prisma connected to it with a Task model

- [x] Step 1.1: Run PostgreSQL via Docker
- [x] Step 1.2: Install Prisma CLI and initialise
- [x] Step 1.3: Configure DATABASE_URL in .env
- [x] Step 1.4: Define Task model in Prisma schema
- [x] Step 1.5: Run first migration
- [x] Step 1.6: Generate and verify Prisma Client

---

## Module 2: Connect NestJS to Prisma
Goal: A reusable PrismaService available across the NestJS app

- [x] Step 2.1: Create PrismaService (lifecycle-aware NestJS wrapper)
- [x] Step 2.2: Register PrismaModule as a global module
- [x] Step 2.3: Verify database connection on app start

---

## Module 3: Replace In-Memory Storage with Prisma CRUD
Goal: All TasksService methods backed by the database

- [x] Step 3.1: Inject PrismaService into TasksService
- [x] Step 3.2: Implement findAll — read all tasks
- [x] Step 3.3: Implement findOne — read single task with 404 handling
- [x] Step 3.4: Implement create — insert a task
- [x] Step 3.5: Implement update — partial update with Prisma
- [x] Step 3.6: Implement remove — delete with existence check
- [x] Step 3.7: Centralise Prisma error handling (P2025 not-found, etc.)

---

## Module 4: User Model & Relationships
Goal: User model with one-to-many Tasks, queryable with Prisma includes

- [x] Step 4.1: Add User model to Prisma schema
- [x] Step 4.2: Define the one-to-many relation (User → Tasks)
- [x] Step 4.3: Run migration for User + relation fields
- [x] Step 4.4: Fetch tasks with their owner (include/select)
- [x] Step 4.5: Fetch a user with all their tasks (nested reads)
- [x] Step 4.6: Wrap multi-step writes in a Prisma transaction

---

## Module 5: Pagination & Database Seeding
Goal: Paginated task list and repeatable seed data for development

- [x] Step 5.1: Add skip/take pagination to GET /tasks
- [x] Step 5.2: Return pagination metadata (total, page, limit)
- [x] Step 5.3: Write a Prisma seed script (prisma/seed.ts)
- [x] Step 5.4: Configure seed in package.json and run it
