import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { SlackService } from '../slack/slack.service';
import { BlockKitBuilder } from '../slack/block-kit.builder';
import { EventsGateway } from '../gateway/events.gateway';
export declare class SlackAnnounceProcessor {
    private readonly prisma;
    private readonly slackService;
    private readonly blockKitBuilder;
    private readonly eventsGateway;
    constructor(prisma: PrismaService, slackService: SlackService, blockKitBuilder: BlockKitBuilder, eventsGateway: EventsGateway);
    handleAnnounce(job: Job<{
        projectId: string;
    }>): Promise<void>;
}
//# sourceMappingURL=slack-announce.processor.d.ts.map