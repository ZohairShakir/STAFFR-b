import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SlackService } from '../slack/slack.service';
import { EventsGateway } from '../gateway/events.gateway';
import { ApplicationStatus } from '@prisma/client';

@Processor('notify')
export class NotifyProcessor {
  private readonly appUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly slackService: SlackService,
    private readonly eventsGateway: EventsGateway,
    configService: ConfigService,
  ) {
    this.appUrl = configService.get<string>('APP_URL') || 'http://localhost:3000';
  }

  @Process('new-application')
  async handleNewApplication(job: Job<{ applicationStatic: any }>) {
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
    const managerText = `👋 Hello! *${applicant.name}* has applied for the *${roleTitle}* role on your project *${projectTitle}*.\nReview applications here: ${this.appUrl}/projects/${applicationStatic.role.projectId}`;
    if (manager.slackId) {
      await this.slackService.sendDM(manager.slackId, managerText);
    }

    // Broadcast creation through websocket
    this.eventsGateway.emitEvent('application.created', applicationStatic);
  }

  @Process('status-change')
  async handleStatusChange(job: Job<{ applicationId: string; status: ApplicationStatus }>) {
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
    const msg = `🔔 *Application Status Update*\nYour application for the role *${roleTitle}* in project *${projectTitle}* has transitioned to: *${status}*.\nReview details on your dashboard: ${this.appUrl}/applications`;

    await this.slackService.sendDM(application.user.slackId, msg);

    // Broadcast status change to frontend clients
    this.eventsGateway.emitEvent('application.statusChanged', application);
  }
}
