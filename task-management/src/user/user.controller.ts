import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    getUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @Post()
    createWithTask(@Body() body: { name: string; email: string; taskTitle: string }) {
        return this.userService.createWithTask(body.name, body.email, body.taskTitle);
    }
}
