import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards, ValidationPipe } from "@nestjs/common";
import { TaskService } from "./task.service";
import type { Task } from "../../generated/prisma/client";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";


@UseGuards(JwtAuthGuard)
@Controller("/task")
export class TaskController {

    constructor(private readonly taskService: TaskService){}

    @Get(':id')
    getTask(@Param('id', ParseIntPipe) taskId: number, @CurrentUser() user: JwtPayload) {
        return this.taskService.get(taskId, user.sub);
    }

    @Get()
    getAll(
        @CurrentUser() user: JwtPayload,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page:number,
        @Query('size', new DefaultValuePipe(25), ParseIntPipe) limit:number) {
        return this.taskService.getAll(user.sub, page, limit);
    }

    @Post()
    createTask(@Body(new ValidationPipe()) taskDetails: CreateTaskDto, @CurrentUser() user: JwtPayload) {
        return this.taskService.createTask(taskDetails, user.sub);
    }

    @Delete(":id")
    @HttpCode(204)
    deleteTask(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: JwtPayload): Promise<void> {
        return this.taskService.deleteTask(id, user.sub);
    }

    @Patch(":id")
    updateTask(
        @Param("id", ParseIntPipe) id: number,
        @Body(new ValidationPipe({ transform: true })) dto: UpdateTaskDto,
        @CurrentUser() user: JwtPayload,
    ): Promise<Task> {
        return this.taskService.updateTask(id, dto, user.sub);
    }
}