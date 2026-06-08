import { Injectable } from "@nestjs/common";
import type { Task } from "./types";
import { CreateTaskDto } from "./dto/create-task.dto";

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
            status: "Not started"
        }

        this.tasks.set(id, task);

        return id;
    }
}