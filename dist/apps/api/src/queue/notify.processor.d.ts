import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { SlackService } from '../slack/slack.service';
import { EventsGateway } from '../gateway/events.gateway';
import { ApplicationStatus } from '@prisma/client';
export declare class NotifyProcessor {
    private readonly prisma;
    private readonly slackService;
    private readonly eventsGateway;
    constructor(prisma: PrismaService, slackService: SlackService, eventsGateway: EventsGateway);
    handleNewApplication(job: Job<{
        applicationStatic: any;
    }>): any;
    handleStatusChange(job: Job<{
        applicationId: string;
        status: ApplicationStatus;
    }>): any;
}
//# sourceMappingURL=notify.processor.d.ts.map