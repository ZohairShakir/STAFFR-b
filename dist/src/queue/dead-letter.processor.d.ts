import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { SlackService } from '../slack/slack.service';
export declare class DeadLetterAnnounceProcessor {
    private readonly prisma;
    private readonly slackService;
    constructor(prisma: PrismaService, slackService: SlackService);
    handleFailure(job: Job, error: Error): Promise<void>;
}
//# sourceMappingURL=dead-letter.processor.d.ts.map