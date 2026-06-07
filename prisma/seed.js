"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database with realistic mock data...');
    // 1. Create Users
    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@cft.com' },
        update: {},
        create: {
            slackId: 'U11111111',
            name: 'Sarah Connor',
            email: 'superadmin@cft.com',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            role: client_1.UserRole.SUPER_ADMIN,
        },
    });
    const manager = await prisma.user.upsert({
        where: { email: 'manager@cft.com' },
        update: {},
        create: {
            slackId: 'U22222222',
            name: 'John Doe',
            email: 'manager@cft.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            role: client_1.UserRole.PROJECT_MANAGER,
        },
    });
    const member = await prisma.user.upsert({
        where: { email: 'member@cft.com' },
        update: {},
        create: {
            slackId: 'U33333333',
            name: 'Alex Vance',
            email: 'member@cft.com',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            role: client_1.UserRole.TEAM_MEMBER,
        },
    });
    // 2. Create Projects
    const project1 = await prisma.project.create({
        data: {
            title: 'Quantum Portal Engine',
            description: 'Building the next generation dimension transport engine using sub-atomic quantum entanglement. Highly experimental but incredibly rewarding.',
            status: client_1.ProjectStatus.OPEN,
            managerId: manager.id,
            slackChannelId: 'C12345678',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days out
            roles: {
                create: [
                    {
                        title: 'Lead Physicist',
                        skills: ['Quantum Mechanics', 'General Relativity', 'Python', 'CUDA'],
                        experience: '5+ years in dimensional science or high-energy physics simulations',
                        openings: 1,
                        filled: 1,
                    },
                    {
                        title: 'Sub-atomic System Engineer',
                        skills: ['Rust', 'Systems Programming', 'Embedded Systems', 'Real-time OS'],
                        experience: '3+ years writing safe low-level code for experimental hardware',
                        openings: 2,
                        filled: 0,
                    },
                ],
            },
        },
        include: {
            roles: true,
        },
    });
    const project2 = await prisma.project.create({
        data: {
            title: 'Nebula Portal Dashboard',
            description: 'Creating the administrative dashboard to monitor, orchestrate, and map portal coordinates, gateway loads, and energy consumption logs.',
            status: client_1.ProjectStatus.DRAFT,
            managerId: manager.id,
            slackChannelId: 'C87654321',
            deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            roles: {
                create: [
                    {
                        title: 'Frontend Portal Architect',
                        skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Three.js'],
                        experience: 'Solid understanding of rich data visualization and webgl animations',
                        openings: 1,
                        filled: 0,
                    },
                ],
            },
        },
        include: {
            roles: true,
        },
    });
    // 3. Create Applications
    const leadPhysicistRole = project1.roles.find((r) => r.title === 'Lead Physicist');
    const subEngineerRole = project1.roles.find((r) => r.title === 'Sub-atomic System Engineer');
    // Sarah Connor applied & accepted for Lead Physicist
    await prisma.application.create({
        data: {
            userId: superAdmin.id,
            roleId: leadPhysicistRole.id,
            status: client_1.ApplicationStatus.ACCEPTED,
            note: 'I have extensive experience preventing timeline fractures.',
            source: client_1.ApplicationSource.WEB,
            reviewedBy: manager.id,
            reviewedAt: new Date(),
        },
    });
    // Alex Vance applied for Sub-atomic System Engineer
    await prisma.application.create({
        data: {
            userId: member.id,
            roleId: subEngineerRole.id,
            status: client_1.ApplicationStatus.PENDING,
            note: 'Familiar with HEV systems, Black Mesa structures, and teleporter grids.',
            source: client_1.ApplicationSource.SLACK,
        },
    });
    // 4. Create Audit Logs
    await prisma.auditLog.create({
        data: {
            actorId: manager.id,
            entity: 'PROJECT',
            entityId: project1.id,
            action: 'POST',
            diff: {
                after: {
                    title: project1.title,
                    status: 'OPEN',
                },
            },
        },
    });
    await prisma.auditLog.create({
        data: {
            actorId: manager.id,
            entity: 'APPLICATION',
            entityId: leadPhysicistRole.id,
            action: 'PATCH',
            diff: {
                before: { status: 'PENDING' },
                after: { status: 'ACCEPTED' },
            },
        },
    });
    console.log('✅ Seeding completed successfully!');
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