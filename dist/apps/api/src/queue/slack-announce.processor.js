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
exports.SlackAnnounceProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const prisma_service_1 = require("../prisma/prisma.service");
const slack_service_1 = require("../slack/slack.service");
const block_kit_builder_1 = require("../slack/block-kit.builder");
const events_gateway_1 = require("../gateway/events.gateway");
let SlackAnnounceProcessor = class SlackAnnounceProcessor {
    constructor(prisma, slackService, blockKitBuilder, eventsGateway) {
        this.prisma = prisma;
        this.slackService = slackService;
        this.blockKitBuilder = blockKitBuilder;
        this.eventsGateway = eventsGateway;
    }
    async handleAnnounce(job) {
        const { projectId } = job.data;
        // Fetch complete project details
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                roles: true,
                manager: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!project || !project.slackChannelId) {
            console.warn(`SlackAnnounceProcessor: Project ${projectId} or channel ID is invalid.`);
            return;
        }
        // Build modern Block Kit structure
        const blocks = this.blockKitBuilder.buildProjectAnnouncement(project);
        // Post message to Slack channel
        const text = `New project announcement: ${project.title}`;
        const result = await this.slackService.postAnnouncement(project.slackChannelId, text, blocks);
        // Save Announcement record
        await this.prisma.announcement.create({
            data: {
                projectId,
                slackTs: result.ts,
                channelId: result.channel,
                messageJson: blocks,
            },
        });
        // Notify WebSocket subscribers of update
        const updatedProject = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                manager: true,
                roles: {
                    include: {
                        _count: {
                            select: { applications: true },
                        },
                    },
                },
            },
        });
        this.eventsGateway.emitEvent('project.updated', updatedProject);
    }
};
exports.SlackAnnounceProcessor = SlackAnnounceProcessor;
__decorate([
    (0, bull_1.Process)('announce'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SlackAnnounceProcessor.prototype, "handleAnnounce", null);
exports.SlackAnnounceProcessor = SlackAnnounceProcessor = __decorate([
    (0, bull_1.Processor)('slack-announce'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        slack_service_1.SlackService,
        block_kit_builder_1.BlockKitBuilder,
        events_gateway_1.EventsGateway])
], SlackAnnounceProcessor);
