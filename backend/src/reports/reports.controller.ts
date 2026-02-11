import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { ReportRequestDto } from './dto/report-request.dto';
import { KeycloakAuthGuard } from '../auth/guards/keycloak-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiResponseDecorator } from '../common/decorators/api-response.decorator';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(KeycloakAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @Roles('admin', 'manager')
  @ApiResponseDecorator({ description: 'Resumen general' })
  async getSummary() {
    return this.reportsService.getSummary();
  }

  @Get('statistics')
  @Roles('admin', 'manager')
  @ApiResponseDecorator({ description: 'Estadisticas' })
  async getStatistics() {
    return this.reportsService.getStatistics();
  }

  @Post('export')
  @Roles('admin')
  @ApiBody({ type: ReportRequestDto })
  @ApiResponseDecorator({ description: 'Exportacion de reportes' })
  async exportReport(@Body() filters: ReportRequestDto) {
    return this.reportsService.exportReport(filters);
  }
}
