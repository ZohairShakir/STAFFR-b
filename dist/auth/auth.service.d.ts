import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
export declare class AuthService {
    private readonly configService;
    private readonly jwtService;
    private readonly prisma;
    private redis;
    constructor(configService: ConfigService, jwtService: JwtService, prisma: PrismaService);
    handleSlackLogin(code: string): Promise<{
        user: {
            id: string;
            slackId: string;
            email: string;
            name: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    generateAccessToken(user: User): string;
    generateRefreshToken(): string;
    rotateTokens(oldRefreshToken: string, userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
}
//# sourceMappingURL=auth.service.d.ts.map