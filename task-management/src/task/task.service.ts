import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) {}

    async get(taskId: number, userId: number) {
        const task = await this.prisma.task.findFirst({ where: { id: taskId, userId } });
        if(task === null) throw new NotFoundException(`Task with id: ${taskId} not found`);

        return task;
    }

    async getAll(userId: number, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [tasks, total] = await this.prisma.$transaction([
            this.prisma.task.findMany({where: {userId},skip,take: limit}),
            this.prisma.task.count({where: {userId}})
        ]);

        return {
            tasks,
            total,
            page,
            limit
        }
    }

    createTask(dto: CreateTaskDto, userId: number) {
        return this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                userId,
            },
        });
    }

    async deleteTask(id: number, userId: number): Promise<void> {
        await this.get(id, userId);
        await this.prisma.task.delete({ where: { id } });
    }

    async updateTask(id: number, dto: UpdateTaskDto, userId: number) {
        await this.get(id, userId);
        return this.prisma.task.update({ where: { id }, data: dto });
    }
}