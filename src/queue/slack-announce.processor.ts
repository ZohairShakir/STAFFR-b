import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { SlackService } from '../slack/slack.service';
import { BlockKitBuilder } from '../slack/block-kit.builder';
import { EventsGateway } from '../gateway/events.gateway';

@Processor('slack-announce')
export class SlackAnnounceProcessor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slackService: SlackService,
    private readonly blockKitBuilder: BlockKitBuilder,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Process('announce')
  async handleAnnounce(job: Job<{ projectId: string }>) {
    const { projectId } = job.data;

    // Single fetch with everything needed for announcement + websocket emit
    const project = await this.prisma.project.findUnique({
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
        messageJson: blocks as any,
      },
    });

    // Notify WebSocket subscribers of update
    this.eventsGateway.emitEvent('project.updated', project);
  }
}
