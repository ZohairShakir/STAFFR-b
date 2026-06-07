import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly _configService;
    private readonly prisma;
    constructor(_configService: ConfigService, prisma: PrismaService);
    validate(payload: {
        sub: string;
        email: string;
    }): Promise<{
        id: string;
        slackId: string;
        email: string;
        name: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
}
export {};
//# sourceMappingURL=jwt.strategy.d.ts.map