import { Project, Role } from '@prisma/client';
export declare class BlockKitBuilder {
    /**
     * Constructs a high-quality Slack Block Kit message structure for project announcements.
     * Includes title, details, and roles with interactive 'Apply' buttons.
     */
    buildProjectAnnouncement(project: Project & {
        roles: Role[];
        manager: {
            name: string;
        };
    }): {};
}
//# sourceMappingURL=block-kit.builder.d.ts.map