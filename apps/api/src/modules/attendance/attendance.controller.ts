import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('attendance')
@Controller('attendance')
@ApiBearerAuth('JWT-auth')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('today')
  @ApiOperation({ summary: 'Obtenir les présences du jour' })
  getTodayAttendance(@CurrentUser() user: any) {
    return this.attendanceService.getTodayAttendance(user.centerId);
  }

  @Post(':childId/check-in')
  @ApiOperation({ summary: 'Enregistrer l\'arrivée d\'un enfant' })
  checkIn(@Param('childId') childId: string, @CurrentUser() user: any) {
    return this.attendanceService.checkIn(childId, user.id);
  }

  @Post(':childId/check-out')
  @ApiOperation({ summary: 'Enregistrer le départ d\'un enfant' })
  checkOut(
    @Param('childId') childId: string,
    @CurrentUser() user: any,
    @Body('authorizedPickupId') authorizedPickupId?: string,
  ) {
    return this.attendanceService.checkOut(childId, user.id, authorizedPickupId);
  }

  @Get(':childId/history')
  @ApiOperation({ summary: 'Historique des présences d\'un enfant' })
  getHistory(
    @Param('childId') childId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.attendanceService.getChildAttendanceHistory(
      childId,
      new Date(startDate),
      new Date(endDate),
    );
  }
}


