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
exports.NotifyProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const prisma_service_1 = require("../prisma/prisma.service");
const slack_service_1 = require("../slack/slack.service");
const events_gateway_1 = require("../gateway/events.gateway");
let NotifyProcessor = class NotifyProcessor {
    constructor(prisma, slackService, eventsGateway) {
        this.prisma = prisma;
        this.slackService = slackService;
        this.eventsGateway = eventsGateway;
    }
    async handleNewApplication(job) {
        const { applicationStatic } = job.data;
        const manager = applicationStatic.role.project.manager;
        const applicant = applicationStatic.user;
        const roleTitle = applicationStatic.role.title;
        const projectTitle = applicationStatic.role.project.title;
        // Send DM to applicant confirming submission
        const applicantText = `Hi ${applicant.name}, your application for the *${roleTitle}* role in the project *${projectTitle}* has been submitted successfully!`;
        if (applicant.slackId) {
            await this.slackService.sendDM(applicant.slackId, applicantText);
        }
        // Send DM to project manager alerting them of the application
        const managerText = `👋 Hello! *${applicant.name}* has applied for the *${roleTitle}* role on your project *${projectTitle}*.\nReview applications here: http://localhost:3000/projects/${applicationStatic.role.projectId}`;
        if (manager.slackId) {
            await this.slackService.sendDM(manager.slackId, managerText);
        }
        // Broadcast creation through websocket
        this.eventsGateway.emitEvent('application.created', applicationStatic);
    }
    async handleStatusChange(job) {
        const { applicationId, status } = job.data;
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                user: true,
                role: {
                    include: {
                        project: true,
                    },
                },
            },
        });
        if (!application || !application.user.slackId) {
            return;
        }
        const roleTitle = application.role.title;
        const projectTitle = application.role.project.title;
        // Build notification message
        const msg = `🔔 *Application Status Update*\nYour application for the role *${roleTitle}* in project *${projectTitle}* has transitioned to: *${status}*.\nReview details on your dashboard: http://localhost:3000/applications`;
        await this.slackService.sendDM(application.user.slackId, msg);
        // Broadcast status change to frontend clients
        this.eventsGateway.emitEvent('application.statusChanged', application);
    }
};
exports.NotifyProcessor = NotifyProcessor;
__decorate([
    (0, bull_1.Process)('new-application'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotifyProcessor.prototype, "handleNewApplication", null);
__decorate([
    (0, bull_1.Process)('status-change'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotifyProcessor.prototype, "handleStatusChange", null);
exports.NotifyProcessor = NotifyProcessor = __decorate([
    (0, bull_1.Processor)('notify'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        slack_service_1.SlackService,
        events_gateway_1.EventsGateway])
], NotifyProcessor);
