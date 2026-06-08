import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
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
//# sourceMappingURL=reports.controller.d.ts.map