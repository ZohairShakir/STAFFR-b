import { ProjectsService } from './projects.service';
import { User } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from '@cft/types';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(user: User, body: CreateProjectDto): unknown;
    findAll(status?: string, managerId?: string, skill?: string): unknown;
    findOne(id: string): unknown;
    update(id: string, user: User, body: UpdateProjectDto): unknown;
    publish(id: string, user: User): unknown;
    remove(id: string, user: User): unknown;
}
//# sourceMappingURL=projects.controller.d.ts.map