import { Processor, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { SlackService } from '../slack/slack.service';
import { UserRole } from '../types';

@Processor('slack-announce')
export class DeadLetterAnnounceProcessor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slackService: SlackService,
  ) {}

  @OnQueueFailed()
  async handleFailure(job: Job, error: Error) {
    if (job.name === 'announce') {
      const { projectId } = job.data;
      console.error(`slack-announce: Job '${job.id}' failed for project ${projectId} after maximum retry limits: ${error.message}`);

      // Alert system admins by DM
      const superAdmins = await this.prisma.user.findMany({
        where: { role: UserRole.SUPER_ADMIN },
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
}
