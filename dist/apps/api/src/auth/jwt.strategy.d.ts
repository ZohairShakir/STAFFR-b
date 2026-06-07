import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: {
        sub: string;
        email: string;
    }): unknown;
}
export {};
//# sourceMappingURL=jwt.strategy.d.ts.map