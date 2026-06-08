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
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { User, ApplicationStatus } from '@prisma/client';
import { UserRole } from '../types';
import { CreateApplicationSchema, CreateApplicationDto, UpdateApplicationStatusSchema, UpdateApplicationStatusDto } from '../types';

@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(
    @GetUser() user: User,
    @Body(new ZodValidationPipe(CreateApplicationSchema)) body: CreateApplicationDto,
  ) {
    return this.applicationsService.create(user, body);
  }

  @Get()
  findAll(
    @GetUser() user: User,
    @Query('status') status?: string,
    @Query('projectId') projectId?: string,
    @Query('roleId') roleId?: string,
  ) {
    return this.applicationsService.findAll(user, { status, projectId, roleId });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.applicationsService.findOne(id, user);
  }

  @Patch(':id/status')
  @Roles(UserRole.PROJECT_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  updateStatus(
    @Param('id') id: string,
    @GetUser() reviewer: User,
    @Body(new ZodValidationPipe(UpdateApplicationStatusSchema)) body: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, reviewer, body.status as ApplicationStatus);
  }

  @Delete(':id')
  withdraw(@Param('id') id: string, @GetUser() user: User) {
    return this.applicationsService.withdraw(id, user);
  }
}
