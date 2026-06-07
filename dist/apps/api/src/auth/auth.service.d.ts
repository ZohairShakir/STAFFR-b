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
    handleSlackLogin(code: string): unknown;
    generateAccessToken(user: User): any;
    generateRefreshToken(): any;
    rotateTokens(oldRefreshToken: string, userId: string): unknown;
    logout(userId: string): any;
}
//# sourceMappingURL=auth.service.d.ts.map