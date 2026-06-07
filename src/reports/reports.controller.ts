import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../types';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PROJECT_MANAGER) // Managers and Admins can view reports
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('hiring')
  getHiringFunnel() {
    return this.reportsService.getHiringFunnel();
  }

  @Get('fill-rate')
  getFillRate() {
    return this.reportsService.getFillRate();
  }

  @Get('time-to-hire')
  getTimeToHire() {
    return this.reportsService.getTimeToHire();
  }
}
