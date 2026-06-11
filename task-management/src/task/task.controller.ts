import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, ValidationPipe } from "@nestjs/common";
import { TaskService } from "./task.service";
import type { Task } from "./types";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";


@Controller("/task")
export class TaskController {

    constructor(private readonly taskService: TaskService){}

    @Get()
    getAll(): Task[] {
        return this.taskService.getAll();
    }

    @Post()
    createTask(@Body(new ValidationPipe()) taskDetails: CreateTaskDto): number {
        return this.taskService.createTask(taskDetails);
    }

    @Delete(":id")
    @HttpCode(204)
    deleteTask(@Param("id", ParseIntPipe) id: number): void {
        this.taskService.deleteTask(id);
    }

    @Patch(":id")
    updateTask(
        @Param("id", ParseIntPipe) id: number,
        @Body(new ValidationPipe({ transform: true })) dto: UpdateTaskDto,
    ): Task {
        return this.taskService.updateTask(id, dto);
    }
}