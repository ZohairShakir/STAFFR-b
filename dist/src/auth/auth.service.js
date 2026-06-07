"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const web_api_1 = require("@slack/web-api");
const ioredis_1 = __importDefault(require("ioredis"));
const events_gateway_1 = require("../gateway/events.gateway");
const slack_service_1 = require("../slack/slack.service");
let AuthService = class AuthService {
    configService;
    jwtService;
    prisma;
    gateway;
    slackService;
    redis;
    constructor(configService, jwtService, prisma, gateway, slackService) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.gateway = gateway;
        this.slackService = slackService;
        const redisUrl = this.configService.get('REDIS_URL');
        this.redis = redisUrl ? new ioredis_1.default(redisUrl) : new ioredis_1.default();
    }
    // Exchanges auth code for Slack user tokens & profile data, upserting the user in DB
    async handleSlackLogin(code) {
        const clientId = this.configService.get('SLACK_CLIENT_ID') || '';
        const clientSecret = this.configService.get('SLACK_CLIENT_SECRET') || '';
        const redirectUri = `${this.configService.get('API_URL')}/auth/slack/callback`;
        const slackClient = new web_api_1.WebClient();
        try {
            // Exchange code for tokens
            const result = await slackClient.oauth.v2.access({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri,
            });
            if (!result.ok) {
                throw new Error(`Slack OAuth failed: ${result.error}`);
            }
            // Read user context. Slack identity scopes provide this:
            // identity.basic, identity.email, identity.avatar
            const authedUser = result.authed_user;
            if (!authedUser) {
                throw new Error('Slack OAuth completed but authed_user is undefined');
            }
            // Get profile info using authed_user.access_token
            const userProfileClient = new web_api_1.WebClient(authedUser.access_token);
            // Under newer Slack web client, identity requires parameter options or assertion
            const identity = await userProfileClient.users.identity({});
            if (!identity.ok || !identity.user) {
                throw new Error(`Slack identity fetch failed: ${identity.error || 'No user info returned'}`);
            }
            const slackId = identity.user.id || '';
            const name = identity.user.name || '';
            const email = identity.user.email || '';
            const avatar = identity.user.image_512 || identity.user.image_192 || null;
            // Check if this is the first user in the system. If so, make them Super Admin.
            const userCount = await this.prisma.user.count();
            const defaultRole = userCount === 0 ? client_1.UserRole.SUPER_ADMIN : client_1.UserRole.TEAM_MEMBER;
            // Upsert User by slackId
            const user = await this.prisma.user.upsert({
                where: { slackId },
                update: { name, avatar },
                create: {
                    slackId,
                    name,
                    email: email || undefined,
                    avatar,
                    role: defaultRole,
                },
            });
            // Notify Super Admins about new user via Slack DMs + WebSocket
            if (defaultRole === client_1.UserRole.TEAM_MEMBER) {
                this.notifySuperAdminsNewUser(user);
            }
            // Generate credentials
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken();
            // Store refresh token in Redis: key = refresh:{userId}, value = refreshToken, expiry = 7d (604800s)
            await this.redis.set(`refresh:${user.id}`, refreshToken, 'EX', 604800);
            return { user, accessToken, refreshToken };
        }
        catch (error) {
            console.error('Slack OAuth error:', error);
            throw new common_1.InternalServerErrorException(error.message || 'OAuth authentication failed');
        }
    }
    generateAccessToken(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN') || '15m',
        });
    }
    generateRefreshToken() {
        const payload = {};
        return this.jwtService.sign(payload, {
            secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN') || '7d',
        });
    }
    async rotateTokens(oldRefreshToken, userId) {
        const stored = await this.redis.get(`refresh:${userId}`);
        if (!stored || stored !== oldRefreshToken) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken();
        await this.redis.set(`refresh:${user.id}`, refreshToken, 'EX', 604800);
        return { accessToken, refreshToken };
    }
    async logout(userId) {
        await this.redis.del(`refresh:${userId}`);
    }
    async notifySuperAdminsNewUser(newUser) {
        try {
            const admins = await this.prisma.user.findMany({
                where: { role: client_1.UserRole.SUPER_ADMIN },
                select: { id: true, slackId: true },
            });
            const text = `New user joined STAFFR: *${newUser.name}* (${newUser.email || 'no email'}).`;
            for (const admin of admins) {
                if (admin.slackId) {
                    try {
                        await this.slackService.sendDM(admin.slackId, text);
                    }
                    catch { }
                }
            }
            this.gateway.emitEvent('user.created', {
                userId: newUser.id,
                name: newUser.name,
                role: newUser.role,
            });
        }
        catch (err) {
            console.error('Failed to notify admins of new user:', err);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway,
        slack_service_1.SlackService])
], AuthService);
//# sourceMappingURL=auth.service.js.map