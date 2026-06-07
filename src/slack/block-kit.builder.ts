import { Injectable } from '@nestjs/common';
import { Project, Role } from '@prisma/client';

@Injectable()
export class BlockKitBuilder {
  /**
   * Constructs a high-quality Slack Block Kit message structure for project announcements.
   * Includes title, details, and roles with interactive 'Apply' buttons.
   */
  buildProjectAnnouncement(project: Project & { roles: Role[]; manager: { name: string } }) {
    const blocks: any[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🚀 New Project: ${project.title}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Manager:* ${project.manager.name}\n*Description:*\n${project.description}`,
        },
      },
    ];

    if (project.deadline) {
      const formattedDate = new Date(project.deadline).toLocaleDateString();
      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `📅 *Application Deadline:* ${formattedDate}`,
          },
        ],
      });
    }

    blocks.push({ type: 'divider' });

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Available Roles (Apply Below)*',
      },
    });

    // Append each role as a structured block with an apply button
    project.roles.forEach((role) => {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${role.title}* (${role.openings - role.filled} openings remaining)\n• *Experience:* ${role.experience}\n• *Required Skills:* ${role.skills.join(', ')}`,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Apply',
            emoji: true,
          },
          value: role.id,
          action_id: 'apply_role',
          style: 'primary',
        },
      });
    });

    return blocks;
  }
}
