import { Injectable, NotFoundException } from "@nestjs/common";
import { Task, TaskStatus } from "./types";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TaskService {
    private previousId: number = 0;
    private tasks: Map<number, Task> = new Map();

    getAll(): Task[] {
        return [...this.tasks.values()].map((task) => ({...task}));
    }

    createTask(taskDetails: CreateTaskDto): number {
        const id = this.previousId + 1;
        this.previousId = id;
        const task: Task = {
            id,
            title: taskDetails.title,
            description: taskDetails.description,
            status: TaskStatus.NOT_STARTED,
        }

        this.tasks.set(id, task);

        return id;
    }

    deleteTask(id: number): void {
        if (!this.tasks.has(id)) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        this.tasks.delete(id);
    }

    updateTask(id: number, dto: UpdateTaskDto): Task {
        const existing = this.tasks.get(id);
        if (!existing) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        const changes = Object.fromEntries(
            Object.entries(dto).filter(([, v]) => v !== undefined)
        );
        const updated: Task = { ...existing, ...changes };
        this.tasks.set(id, updated);
        return { ...updated };
    }
}