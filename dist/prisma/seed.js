"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@cft.com' },
        update: {},
        create: {
            slackId: 'U_SUPER_ADMIN',
            name: 'Admin User',
            email: 'admin@cft.com',
            role: client_1.UserRole.SUPER_ADMIN,
        },
    });
    const manager = await prisma.user.upsert({
        where: { email: 'manager@cft.com' },
        update: {},
        create: {
            slackId: 'U_MANAGER',
            name: 'Project Manager',
            email: 'manager@cft.com',
            role: client_1.UserRole.PROJECT_MANAGER,
        },
    });
    const member1 = await prisma.user.upsert({
        where: { email: 'member1@cft.com' },
        update: {},
        create: {
            slackId: 'U_MEMBER1',
            name: 'Alice Johnson',
            email: 'member1@cft.com',
            role: client_1.UserRole.TEAM_MEMBER,
        },
    });
    const member2 = await prisma.user.upsert({
        where: { email: 'member2@cft.com' },
        update: {},
        create: {
            slackId: 'U_MEMBER2',
            name: 'Bob Williams',
            email: 'member2@cft.com',
            role: client_1.UserRole.TEAM_MEMBER,
        },
    });
    const member3 = await prisma.user.upsert({
        where: { email: 'member3@cft.com' },
        update: {},
        create: {
            slackId: 'U_MEMBER3',
            name: 'Carol Davis',
            email: 'member3@cft.com',
            role: client_1.UserRole.TEAM_MEMBER,
        },
    });
    console.log('✅ Users created');
    const project1 = await prisma.project.upsert({
        where: { id: 'proj-001' },
        update: {},
        create: {
            id: 'proj-001',
            title: 'Website Redesign',
            description: 'Complete overhaul of the company website with modern design and improved UX.',
            status: client_1.ProjectStatus.IN_PROGRESS,
            managerId: manager.id,
            slackChannelId: 'C1234567890',
            deadline: new Date('2025-12-31'),
            roles: {
                create: [
                    {
                        title: 'Frontend Developer',
                        skills: ['React', 'TypeScript', 'CSS'],
                        experience: '3+ years',
                        openings: 2,
                        filled: 1,
                    },
                    {
                        title: 'UI/UX Designer',
                        skills: ['Figma', 'Design Systems', 'Prototyping'],
                        experience: '2+ years',
                        openings: 1,
                        filled: 0,
                    },
                ],
            },
        },
        include: { roles: true },
    });
    const project2 = await prisma.project.upsert({
        where: { id: 'proj-002' },
        update: {},
        create: {
            id: 'proj-002',
            title: 'Mobile App Launch',
            description: 'Launch a new mobile application for iOS and Android platforms.',
            status: client_1.ProjectStatus.OPEN,
            managerId: manager.id,
            slackChannelId: 'C0987654321',
            deadline: new Date('2025-09-30'),
            roles: {
                create: [
                    {
                        title: 'React Native Developer',
                        skills: ['React Native', 'JavaScript', 'Mobile'],
                        experience: '2+ years',
                        openings: 2,
                        filled: 1,
                    },
                    {
                        title: 'Backend Developer',
                        skills: ['Node.js', 'PostgreSQL', 'APIs'],
                        experience: '3+ years',
                        openings: 1,
                        filled: 0,
                    },
                ],
            },
        },
        include: { roles: true },
    });
    const project3 = await prisma.project.upsert({
        where: { id: 'proj-003' },
        update: {},
        create: {
            id: 'proj-003',
            title: 'Data Analytics Platform',
            description: 'Build an internal analytics dashboard for tracking KPIs.',
            status: client_1.ProjectStatus.OPEN,
            managerId: superAdmin.id,
            deadline: new Date('2026-03-15'),
            roles: {
                create: [
                    {
                        title: 'Data Engineer',
                        skills: ['Python', 'SQL', 'ETL'],
                        experience: '3+ years',
                        openings: 1,
                        filled: 0,
                    },
                ],
            },
        },
        include: { roles: true },
    });
    console.log('✅ Projects created');
    const frontendRole = project1.roles.find((r) => r.title === 'Frontend Developer');
    const designerRole = project1.roles.find((r) => r.title === 'UI/UX Designer');
    const mobileRole = project2.roles.find((r) => r.title === 'React Native Developer');
    const backendRole = project2.roles.find((r) => r.title === 'Backend Developer');
    const dataRole = project3.roles.find((r) => r.title === 'Data Engineer');
    await prisma.application.upsert({
        where: { id: 'app-001' },
        update: {},
        create: {
            id: 'app-001',
            userId: member1.id,
            roleId: frontendRole.id,
            status: client_1.ApplicationStatus.ACCEPTED,
            source: client_1.ApplicationSource.WEB,
            reviewedBy: manager.id,
            reviewedAt: new Date('2025-01-15'),
        },
    });
    await prisma.application.upsert({
        where: { id: 'app-002' },
        update: {},
        create: {
            id: 'app-002',
            userId: member2.id,
            roleId: frontendRole.id,
            status: client_1.ApplicationStatus.PENDING,
            source: client_1.ApplicationSource.WEB,
        },
    });
    await prisma.application.upsert({
        where: { id: 'app-003' },
        update: {},
        create: {
            id: 'app-003',
            userId: member3.id,
            roleId: designerRole.id,
            status: client_1.ApplicationStatus.REVIEWING,
            source: client_1.ApplicationSource.SLACK,
            reviewedBy: manager.id,
            reviewedAt: new Date('2025-02-01'),
        },
    });
    await prisma.application.upsert({
        where: { id: 'app-004' },
        update: {},
        create: {
            id: 'app-004',
            userId: member1.id,
            roleId: mobileRole.id,
            status: client_1.ApplicationStatus.REJECTED,
            source: client_1.ApplicationSource.WEB,
            reviewedBy: superAdmin.id,
            reviewedAt: new Date('2025-01-20'),
        },
    });
    await prisma.application.upsert({
        where: { id: 'app-005' },
        update: {},
        create: {
            id: 'app-005',
            userId: member2.id,
            roleId: backendRole.id,
            status: client_1.ApplicationStatus.PENDING,
            source: client_1.ApplicationSource.SLACK,
        },
    });
    await prisma.application.upsert({
        where: { id: 'app-006' },
        update: {},
        create: {
            id: 'app-006',
            userId: member3.id,
            roleId: dataRole.id,
            status: client_1.ApplicationStatus.PENDING,
            source: client_1.ApplicationSource.WEB,
        },
    });
    console.log('✅ Applications created');
    console.log('🌱 Seeding complete!');
}
main()
    .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map