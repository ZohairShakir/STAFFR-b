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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeadLetterAnnounceProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const prisma_service_1 = require("../prisma/prisma.service");
const slack_service_1 = require("../slack/slack.service");
const types_1 = require("../types");
let DeadLetterAnnounceProcessor = class DeadLetterAnnounceProcessor {
    prisma;
    slackService;
    constructor(prisma, slackService) {
        this.prisma = prisma;
        this.slackService = slackService;
    }
    async handleFailure(job, error) {
        if (job.name === 'announce') {
            const { projectId } = job.data;
            console.error(`slack-announce: Job '${job.id}' failed for project ${projectId} after maximum retry limits: ${error.message}`);
            // Alert system admins by DM
            const superAdmins = await this.prisma.user.findMany({
                where: { role: types_1.UserRole.SUPER_ADMIN },
            });
            const project = await this.prisma.project.findUnique({ where: { id: projectId } });
            const projName = project?.title || 'Unknown';
            const alertText = `🚨 *DLQ ALERT* 🚨\nSlack announcement for project *${projName}* (${projectId}) has *FAILED* after all retry attempts.\nReason: \`${error.message}\``;
            for (const admin of superAdmins) {
                if (admin.slackId) {
                    await this.slackService.sendDM(admin.slackId, alertText);
                }
            }
        }
    }
};
exports.DeadLetterAnnounceProcessor = DeadLetterAnnounceProcessor;
__decorate([
    (0, bull_1.OnQueueFailed)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Error]),
    __metadata("design:returntype", Promise)
], DeadLetterAnnounceProcessor.prototype, "handleFailure", null);
exports.DeadLetterAnnounceProcessor = DeadLetterAnnounceProcessor = __decorate([
    (0, bull_1.Processor)('slack-announce'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        slack_service_1.SlackService])
], DeadLetterAnnounceProcessor);
//# sourceMappingURL=dead-letter.processor.js.map