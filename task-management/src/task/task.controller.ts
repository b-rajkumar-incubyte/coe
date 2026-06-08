import { Controller, Get, Post } from "@nestjs/common";
import { TaskService } from "./task.service";
import type { Task } from "./types";


@Controller("/task")
export class TaskController {

    constructor(private readonly taskService: TaskService){}

    @Get()
    getAll(): Task[] {
        return this.taskService.getAll();
    }
}