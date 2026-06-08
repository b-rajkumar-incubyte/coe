import { Injectable } from "@nestjs/common";
import type { Task } from "./types";

@Injectable()
export class TaskService {
    private tasks: Map<number, Task> = new Map();

    getAll(): Task[] {
        return [...this.tasks.values()].map((task) => ({...task}));
    }
}