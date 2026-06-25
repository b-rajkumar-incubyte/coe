import { PrismaClient, TaskStatus } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    const passwordHash = await bcrypt.hash('password123', 10);

    const alice = await prisma.user.upsert({
        where: { email: 'alice@example.com' },
        update: {},
        create: { name: 'Alice', email: 'alice@example.com', password: passwordHash },
    });

    const bob = await prisma.user.upsert({
        where: { email: 'bob@example.com' },
        update: {},
        create: { name: 'Bob', email: 'bob@example.com', password: passwordHash },
    });

    await prisma.task.createMany({
        skipDuplicates: true,
        data: [
            { title: 'Set up CI pipeline', status: TaskStatus.DONE, userId: alice.id },
            { title: 'Write API docs', status: TaskStatus.IN_PROGRESS, userId: alice.id },
            { title: 'Add rate limiting', status: TaskStatus.NOT_STARTED, userId: bob.id },
            { title: 'Review pull requests', status: TaskStatus.IN_PROGRESS, userId: bob.id },
            { title: 'Fix login bug', status: TaskStatus.NOT_STARTED, userId: alice.id },
            { title: 'Set up staging environment', description: 'Mirror production config on staging server', status: TaskStatus.DONE, userId: alice.id },
            { title: 'Add input validation', description: 'Validate all API request bodies with class-validator', status: TaskStatus.DONE, userId: bob.id },
            { title: 'Write unit tests for TaskService', description: 'Cover getAll, createTask, updateTask, deleteTask', status: TaskStatus.IN_PROGRESS, userId: alice.id },
            { title: 'Set up Sentry error tracking', description: 'Integrate Sentry SDK and configure source maps', status: TaskStatus.NOT_STARTED, userId: bob.id },
            { title: 'Implement refresh token rotation', description: 'Replace long-lived tokens with rotating refresh tokens', status: TaskStatus.NOT_STARTED, userId: alice.id },
            { title: 'Add database indexes', description: 'Index userId and status columns on Task table', status: TaskStatus.DONE, userId: bob.id },
            { title: 'Migrate to Postgres connection pooling', description: 'Use PgBouncer to limit max connections under load', status: TaskStatus.IN_PROGRESS, userId: alice.id },
            { title: 'Build admin dashboard', description: 'Internal page showing task stats by user', status: TaskStatus.NOT_STARTED, userId: bob.id },
            { title: 'Add pagination to task list', description: 'Support page and size query params', status: TaskStatus.DONE, userId: alice.id },
            { title: 'Write e2e tests with Playwright', description: 'Cover task creation and status update flows', status: TaskStatus.NOT_STARTED, userId: bob.id },
            { title: 'Optimize slow queries', description: 'Profile and fix N+1 queries in task listing', status: TaskStatus.IN_PROGRESS, userId: alice.id },
            { title: 'Add soft delete for tasks', description: 'Replace hard delete with deletedAt timestamp', status: TaskStatus.NOT_STARTED, userId: bob.id },
            { title: 'Implement task assignment', description: 'Allow reassigning tasks between users', status: TaskStatus.NOT_STARTED, userId: alice.id },
            { title: 'Set up log aggregation', description: 'Ship logs to Datadog via Winston transport', status: TaskStatus.IN_PROGRESS, userId: bob.id },
            { title: 'Document deployment process', description: 'Write runbook for production deploys and rollbacks', status: TaskStatus.NOT_STARTED, userId: alice.id },
            { title: 'Add due date field to tasks', description: 'Schema migration and API changes for dueDate', status: TaskStatus.NOT_STARTED, userId: bob.id },
            { title: 'Implement task search', description: 'Full-text search on title and description fields', status: TaskStatus.NOT_STARTED, userId: alice.id },
            { title: 'Set up feature flags', description: 'Integrate LaunchDarkly for gradual feature rollouts', status: TaskStatus.NOT_STARTED, userId: bob.id },
            { title: 'Add email notifications', description: 'Send email when a task is assigned or completed', status: TaskStatus.IN_PROGRESS, userId: alice.id },
            { title: 'Conduct security audit', description: 'Review auth flows, headers, and dependency vulnerabilities', status: TaskStatus.NOT_STARTED, userId: bob.id },
        ],
    });

    console.log('Seeded: 2 users, 25 tasks');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
