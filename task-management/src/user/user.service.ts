import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { tasks: true },
        });
    }

    createWithTask(userName: string, userEmail: string, taskTitle: string) {
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: { name: userName, email: userEmail },
            });

            const task = await tx.task.create({
                data: { title: taskTitle, userId: user.id },
            });

            return { user, task };
        });
    }
}
