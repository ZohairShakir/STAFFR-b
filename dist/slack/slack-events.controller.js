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
exports.SlackEventsController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const applications_service_1 = require("../applications/applications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const slack_service_1 = require("./slack.service");
const types_1 = require("../../../../packages/types/src");
const crypto = __importStar(require("crypto"));
let SlackEventsController = class SlackEventsController {
    configService;
    prisma;
    applicationsService;
    slackService;
    constructor(configService, prisma, applicationsService, slackService) {
        this.configService = configService;
        this.prisma = prisma;
        this.applicationsService = applicationsService;
        this.slackService = slackService;
    }
    async handleEvents(req, res) {
        const rawBody = req.rawBody || JSON.stringify(req.body);
        const signature = req.headers['x-slack-signature'];
        const timestamp = req.headers['x-slack-request-timestamp'];
        const signingSecret = this.configService.get('SLACK_SIGNING_SECRET');
        // 1. Verify signing secret to prevent spoofing
        if (!signature || !timestamp || !signingSecret) {
            return res.status(401).send('Verification failed');
        }
        const time = Math.floor(new Date().getTime() / 1000);
        if (Math.abs(time - Number(timestamp)) > 300) {
            return res.status(401).send('Verification failed - timestamp delta too large');
        }
        const sigBaseString = `v0:${timestamp}:${rawBody}`;
        const mySignature = `v0=${crypto
            .createHmac('sha256', signingSecret)
            .update(sigBaseString, 'utf8')
            .digest('hex')}`;
        if (!crypto.timingSafeEqual(Buffer.from(mySignature, 'utf8'), Buffer.from(signature, 'utf8'))) {
            return res.status(401).send('Verification failed - signature mismatch');
        }
        // 2. Handle URL verification challenge for Slack Event API config
        if (req.body.type === 'url_verification') {
            return res.json({ challenge: req.body.challenge });
        }
        // 3. Handle interactive block action payloads (such as clicking the Apply button)
        let payload = req.body;
        if (payload.payload) {
            payload = JSON.parse(payload.payload);
        }
        if (payload.type === 'block_actions') {
            const action = payload.actions?.[0];
            if (action && action.action_id === 'apply_role') {
                const roleId = action.value; // role ID passed in block button value
                const slackUserId = payload.user.id;
                const slackUserName = payload.user.name || payload.user.username;
                try {
                    // Find or create the User matching this Slack ID
                    let user = await this.prisma.user.findUnique({
                        where: { slackId: slackUserId },
                    });
                    if (!user) {
                        // Slack oauth details aren't present yet, so fetch profile details from Slack Web API
                        const profile = await this.slackService.botClient.users.info({
                            user: slackUserId,
                        });
                        if (!profile.ok || !profile.user) {
                            throw new Error(`Slack user details fetch failed: ${profile.error}`);
                        }
                        user = await this.prisma.user.create({
                            data: {
                                slackId: slackUserId,
                                name: profile.user.real_name || slackUserName,
                                email: profile.user.profile?.email || `${slackUserId}@slack.cft`,
                                avatar: profile.user.profile?.image_192 || null,
                            },
                        });
                    }
                    // Create the application record
                    await this.applicationsService.create(user, {
                        roleId,
                        note: 'Applied via Slack Interactive Button',
                        source: types_1.ApplicationSource.SLACK,
                    });
                    // Acknowledge event
                    return res.status(200).send();
                }
                catch (err) {
                    console.error('Slack Interactive Button Apply Error:', err);
                    // Send error DM directly to the Slack user to notify them of failure
                    await this.slackService.sendDM(slackUserId, `❌ *Application Failed*\nCould not process your application: ${err.message || 'Unknown system error'}`);
                    return res.status(200).send();
                }
            }
        }
        return res.status(200).send('OK');
    }
};
exports.SlackEventsController = SlackEventsController;
__decorate([
    (0, common_1.Post)('events'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SlackEventsController.prototype, "handleEvents", null);
exports.SlackEventsController = SlackEventsController = __decorate([
    (0, common_1.Controller)('slack'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        applications_service_1.ApplicationsService,
        slack_service_1.SlackService])
], SlackEventsController);
//# sourceMappingURL=slack-events.controller.js.map