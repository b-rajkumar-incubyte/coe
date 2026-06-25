import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) {}

    async register({ name, email, password }: RegisterDto) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new ConflictException("Email is already registered");
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await this.prisma.user.create({
            data: { name, email, password: passwordHash },
        });

        const accessToken = await this.signToken(user.id, user.email);
        return { accessToken, user: { id: user.id, name: user.name, email: user.email } };
    }

    async login({ email, password }: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        const passwordMatches = user && (await bcrypt.compare(password, user.password));
        if (!passwordMatches) {
            throw new UnauthorizedException("Invalid email or password");
        }

        const accessToken = await this.signToken(user.id, user.email);
        return { accessToken, user: { id: user.id, name: user.name, email: user.email } };
    }

    private signToken(userId: number, email: string) {
        return this.jwt.signAsync({ sub: userId, email });
    }
}
