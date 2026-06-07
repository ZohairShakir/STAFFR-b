import { Controller, Get, UseGuards } from '@nestjs/common';
import { SlackService } from './slack.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../types';

@Controller('slack')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Get('channels')
  @Roles(UserRole.PROJECT_MANAGER) // Managers/Admins can see channels list for wizard
  getChannels() {
    return this.slackService.getChannels();
  }
}
