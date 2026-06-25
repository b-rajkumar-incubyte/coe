import { Body, Controller, Get, HttpCode, Post, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import type { JwtPayload } from "./jwt-auth.guard";
import { CurrentUser } from "./current-user.decorator";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    register(@Body(new ValidationPipe()) dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post("login")
    @HttpCode(200)
    login(@Body(new ValidationPipe()) dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Get("me")
    @UseGuards(JwtAuthGuard)
    me(@CurrentUser() user: JwtPayload) {
        return { id: user.sub, email: user.email };
    }
}
