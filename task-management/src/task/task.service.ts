import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) {}

    async getAll(page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [tasks, total] = await this.prisma.$transaction([
            this.prisma.task.findMany({skip,take: limit,include: {user: true}}),
            this.prisma.task.count()
        ]);

        return {
            tasks,
            total,
            page, 
            limit
        }
    }

    createTask(dto: CreateTaskDto) {
        return this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
            },
        });
    }

    async deleteTask(id: number): Promise<void> {
        await this.prisma.task.delete({ where: { id } }).catch(this.handleNotFound(id));
    }

    async updateTask(id: number, dto: UpdateTaskDto) {
        return this.prisma.task.update({
            where: { id },
            data: dto,
        }).catch(this.handleNotFound(id));
    }

    private handleNotFound(id: number) {
        return (err: unknown) => {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
                throw new NotFoundException(`Task with id ${id} not found`);
            }
            throw err;
        };
    }
}