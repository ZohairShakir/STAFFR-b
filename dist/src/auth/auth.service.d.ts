import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { EventsGateway } from '../gateway/events.gateway';
import { SlackService } from '../slack/slack.service';
export declare class AuthService {
    private readonly configService;
    private readonly jwtService;
    private readonly prisma;
    private readonly gateway;
    private readonly slackService;
    private redis;
    constructor(configService: ConfigService, jwtService: JwtService, prisma: PrismaService, gateway: EventsGateway, slackService: SlackService);
    handleSlackLogin(code: string): Promise<{
        user: {
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
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
    private notifySuperAdminsNewUser;
}
//# sourceMappingURL=auth.service.d.ts.map