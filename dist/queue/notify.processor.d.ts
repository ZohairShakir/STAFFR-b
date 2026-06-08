import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SlackService } from '../slack/slack.service';
import { EventsGateway } from '../gateway/events.gateway';
import { ApplicationStatus } from '@prisma/client';
export declare class NotifyProcessor {
    private readonly prisma;
    private readonly slackService;
    private readonly eventsGateway;
    private readonly appUrl;
    constructor(prisma: PrismaService, slackService: SlackService, eventsGateway: EventsGateway, configService: ConfigService);
    handleNewApplication(job: Job<{
        applicationStatic: any;
    }>): Promise<void>;
    handleStatusChange(job: Job<{
        applicationId: string;
        status: ApplicationStatus;
    }>): Promise<void>;
}
//# sourceMappingURL=notify.processor.d.ts.map