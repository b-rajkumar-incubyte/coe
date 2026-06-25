import { ConflictException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async register({ name, email, password }: RegisterDto) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new ConflictException("Email is already registered");
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await this.prisma.user.create({
            data: { name, email, password: passwordHash },
        });

        return { id: user.id, name: user.name, email: user.email };
    }
}
