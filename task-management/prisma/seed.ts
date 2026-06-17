import { PrismaClient, TaskStatus } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    const alice = await prisma.user.upsert({
        where: { email: 'alice@example.com' },
        update: {},
        create: { name: 'Alice', email: 'alice@example.com' },
    });

    const bob = await prisma.user.upsert({
        where: { email: 'bob@example.com' },
        update: {},
        create: { name: 'Bob', email: 'bob@example.com' },
    });

    await prisma.task.createMany({
        skipDuplicates: true,
        data: [
            { title: 'Set up CI pipeline', status: TaskStatus.DONE, userId: alice.id },
            { title: 'Write API docs', status: TaskStatus.IN_PROGRESS, userId: alice.id },
            { title: 'Add rate limiting', status: TaskStatus.NOT_STARTED, userId: bob.id },
            { title: 'Review pull requests', status: TaskStatus.IN_PROGRESS, userId: bob.id },
            { title: 'Fix login bug', status: TaskStatus.NOT_STARTED, userId: alice.id },
        ],
    });

    console.log('Seeded: 2 users, 5 tasks');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
