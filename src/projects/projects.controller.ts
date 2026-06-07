import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { User } from '@prisma/client';
import { UserRole } from '../types';
import { CreateProjectSchema, CreateProjectDto, UpdateProjectSchema, UpdateProjectDto } from '../types';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.PROJECT_MANAGER)
  create(
    @GetUser() user: User,
    @Body(new ZodValidationPipe(CreateProjectSchema)) body: CreateProjectDto,
  ) {
    return this.projectsService.create(user.id, body);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('managerId') managerId?: string,
    @Query('skill') skill?: string,
  ) {
    return this.projectsService.findAll({ status, managerId, skill });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.PROJECT_MANAGER)
  update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body(new ZodValidationPipe(UpdateProjectSchema)) body: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, user, body);
  }

  @Post(':id/publish')
  @Roles(UserRole.PROJECT_MANAGER)
  publish(@Param('id') id: string, @GetUser() user: User) {
    return this.projectsService.publish(id, user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.projectsService.remove(id, user);
  }
}
