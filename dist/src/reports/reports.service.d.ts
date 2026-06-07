import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHiringFunnel(): Promise<{
        projectId: any;
        projectTitle: any;
        pending: any;
        reviewing: any;
        accepted: any;
        rejected: any;
        withdrawn: any;
    }[]>;
    getFillRate(): Promise<{
        projectId: any;
        projectTitle: any;
        roleId: any;
        roleTitle: any;
        openings: any;
        filled: any;
        fillRate: number;
    }[]>;
    getTimeToHire(): Promise<{
        projectId: any;
        projectTitle: any;
        avgDaysToHire: number;
    }[]>;
}
//# sourceMappingURL=reports.service.d.ts.map