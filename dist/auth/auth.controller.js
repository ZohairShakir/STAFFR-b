"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const get_user_decorator_1 = require("../common/decorators/get-user.decorator");
const jwt = __importStar(require("jsonwebtoken"));
let AuthController = class AuthController {
    configService;
    authService;
    constructor(configService, authService) {
        this.configService = configService;
        this.authService = authService;
    }
    slackRedirect(res) {
        const clientId = this.configService.get('SLACK_CLIENT_ID');
        const redirectUri = encodeURIComponent(`${this.configService.get('API_URL')}/auth/slack/callback`);
        // Request basic info, email, and avatar scopes
        const scopes = 'identity.basic,identity.email,identity.avatar';
        const slackOAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=&user_scope=${scopes}&redirect_uri=${redirectUri}`;
        return res.redirect(slackOAuthUrl);
    }
    async slackCallback(code, res) {
        if (!code) {
            return res.redirect(`${this.configService.get('APP_URL')}/login?error=no_code`);
        }
        try {
            const { accessToken, refreshToken, user } = await this.authService.handleSlackLogin(code);
            // Set Access Token in HttpOnly cookie
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 15 * 60 * 1000, // 15 mins
            });
            // Set Refresh Token in separate cookie (or frontend can pass it explicitly, but let's keep it safe)
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            // Redirect back to Next.js dashboard
            return res.redirect(`${this.configService.get('APP_URL')}/dashboard`);
        }
        catch (err) {
            console.error(err);
            return res.redirect(`${this.configService.get('APP_URL')}/login?error=auth_failed`);
        }
    }
    async refresh(req, res) {
        const oldRefreshToken = req.cookies['refresh_token'] || req.body.refresh_token;
        if (!oldRefreshToken) {
            throw new common_1.UnauthorizedException('No refresh token provided');
        }
        try {
            // Decode user ID from token safely (even if expired)
            const decoded = jwt.decode(oldRefreshToken);
            const userId = decoded?.sub;
            if (!userId) {
                throw new common_1.UnauthorizedException('Invalid refresh token content');
            }
            const { accessToken, refreshToken } = await this.authService.rotateTokens(oldRefreshToken, userId);
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 15 * 60 * 1000,
            });
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.json({ success: true, accessToken });
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Refresh rotation failed');
        }
    }
    async logout(user, res) {
        await this.authService.logout(user.id);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.json({ success: true });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('slack'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "slackRedirect", null);
__decorate([
    (0, common_1.Get)('slack/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "slackCallback", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map