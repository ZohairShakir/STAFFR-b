import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: {
        sub: string;
        email: string;
    }): Promise<{
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string | null;
        avatar: string | null;
        createdAt: Date;
    }>;
}
export {};
//# sourceMappingURL=jwt.strategy.d.ts.map