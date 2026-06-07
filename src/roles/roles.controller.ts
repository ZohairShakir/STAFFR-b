import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { User } from '@prisma/client';
import { UserRole } from '../types';
import { CreateRoleSchema, CreateRoleDto, UpdateRoleSchema, UpdateRoleDto } from '../types';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('projects/:id/roles')
  findByProject(@Param('id') projectId: string) {
    return this.rolesService.findByProject(projectId);
  }

  @Post('projects/:id/roles')
  @Roles(UserRole.PROJECT_MANAGER)
  addRole(
    @Param('id') projectId: string,
    @GetUser() user: User,
    @Body(new ZodValidationPipe(CreateRoleSchema)) body: CreateRoleDto,
  ) {
    return this.rolesService.addRole(projectId, user, body);
  }

  @Patch('roles/:id')
  @Roles(UserRole.PROJECT_MANAGER)
  updateRole(
    @Param('id') roleId: string,
    @GetUser() user: User,
    @Body(new ZodValidationPipe(UpdateRoleSchema)) body: UpdateRoleDto,
  ) {
    return this.rolesService.updateRole(roleId, user, body);
  }

  @Delete('roles/:id')
  @Roles(UserRole.PROJECT_MANAGER)
  deleteRole(@Param('id') roleId: string, @GetUser() user: User) {
    return this.rolesService.deleteRole(roleId, user);
  }
}
