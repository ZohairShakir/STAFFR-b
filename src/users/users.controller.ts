import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { User } from '@prisma/client';
import { UserRole } from '../types';
import { UpdateUserRoleSchema, UpdateUserRoleDto } from '../types';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @Roles(UserRole.SUPER_ADMIN)
  async updateRole(
    @GetUser() actor: User,
    @Param('id') targetId: string,
    @Body(new ZodValidationPipe(UpdateUserRoleSchema)) body: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(actor.role as UserRole, targetId, body.role);
  }
}
