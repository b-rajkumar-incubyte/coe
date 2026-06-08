import { Body, Controller, Get, Post } from "@nestjs/common";
import { TaskService } from "./task.service";
import type { Task } from "./types";
import { CreateTaskDto } from "./dto/create-task.dto";


@Controller("/task")
export class TaskController {

    constructor(private readonly taskService: TaskService){}

    @Get()
    getAll(): Task[] {
        return this.taskService.getAll();
    }

    @Post()
    createTask(@Body() taskDetails: CreateTaskDto): number {
        return this.taskService.createTask(taskDetails);
    }
}