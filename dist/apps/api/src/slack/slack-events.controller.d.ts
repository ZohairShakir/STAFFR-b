import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApplicationsService } from '../applications/applications.service';
import { PrismaService } from '../prisma/prisma.service';
import { SlackService } from './slack.service';
export declare class SlackEventsController {
    private readonly configService;
    private readonly prisma;
    private readonly applicationsService;
    private readonly slackService;
    constructor(configService: ConfigService, prisma: PrismaService, applicationsService: ApplicationsService, slackService: SlackService);
    handleEvents(req: Request, res: Response): unknown;
}
//# sourceMappingURL=slack-events.controller.d.ts.map