import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { StaffService } from './staff.service';
import {
  CreateStaffDto,
  UpdateStaffDto,
  CreateQualificationDto,
  AssignClassroomDto,
  CreateScheduleDto,
  CreateTimeEntryDto,
  StaffFilterDto,
} from './dto/staff.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/dto/auth.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('staff')
@Controller('staff')
@ApiBearerAuth('JWT-auth')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // ==========================================
  // CRUD DE BASE
  // ==========================================

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Liste tout le personnel' })
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'classroomId', required: false })
  @ApiQuery({ name: 'position', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Liste du personnel' })
  findAll(@Query() filters: StaffFilterDto, @CurrentUser() user: any) {
    // Directors can only see their center's staff
    if (user.role === UserRole.DIRECTOR) {
      filters.centerId = user.centerId;
    }
    return this.staffService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un membre du personnel par ID' })
  @ApiResponse({ status: 200, description: 'Membre du personnel trouvé' })
  @ApiResponse({ status: 404, description: 'Membre non trouvé' })
  findOne(@Param('id') id: string) {
    return this.staffService.findById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtenir un membre du personnel par User ID' })
  @ApiResponse({ status: 200, description: 'Membre du personnel trouvé' })
  findByUserId(@Param('userId') userId: string) {
    return this.staffService.findByUserId(userId);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Créer un nouveau membre du personnel' })
  @ApiResponse({ status: 201, description: 'Membre créé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Mettre à jour un membre du personnel' })
  @ApiResponse({ status: 200, description: 'Membre mis à jour' })
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(id, updateStaffDto);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Désactiver un membre du personnel' })
  @ApiResponse({ status: 200, description: 'Membre désactivé' })
  deactivate(@Param('id') id: string) {
    return this.staffService.deactivate(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Supprimer un membre du personnel' })
  @ApiResponse({ status: 200, description: 'Membre supprimé' })
  remove(@Param('id') id: string) {
    return this.staffService.delete(id);
  }

  // ==========================================
  // QUALIFICATIONS
  // ==========================================

  @Post(':id/qualifications')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Ajouter une qualification' })
  @ApiResponse({ status: 201, description: 'Qualification ajoutée' })
  addQualification(
    @Param('id') id: string,
    @Body() data: CreateQualificationDto,
  ) {
    return this.staffService.addQualification(id, data);
  }

  @Patch('qualifications/:qualificationId')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Mettre à jour une qualification' })
  updateQualification(
    @Param('qualificationId') qualificationId: string,
    @Body() data: Partial<CreateQualificationDto>,
  ) {
    return this.staffService.updateQualification(qualificationId, data);
  }

  @Patch('qualifications/:qualificationId/verify')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Vérifier/approuver une qualification' })
  verifyQualification(@Param('qualificationId') qualificationId: string) {
    return this.staffService.verifyQualification(qualificationId);
  }

  @Delete('qualifications/:qualificationId')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Supprimer une qualification' })
  removeQualification(@Param('qualificationId') qualificationId: string) {
    return this.staffService.removeQualification(qualificationId);
  }

  @Get('qualifications/expiring')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Obtenir les qualifications qui expirent bientôt' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Jours à l\'avance (défaut: 30)' })
  getExpiringQualifications(
    @CurrentUser() user: any,
    @Query('days') days?: number,
  ) {
    return this.staffService.getExpiringQualifications(
      user.centerId,
      days || 30,
    );
  }

  // ==========================================
  // ASSIGNATIONS AUX SALLES
  // ==========================================

  @Post(':id/classrooms')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Assigner à une salle de classe' })
  @ApiResponse({ status: 201, description: 'Assignation créée' })
  assignToClassroom(
    @Param('id') id: string,
    @Body() data: AssignClassroomDto,
  ) {
    return this.staffService.assignToClassroom(id, data);
  }

  @Delete(':id/classrooms/:classroomId')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Retirer d\'une salle de classe' })
  removeFromClassroom(
    @Param('id') id: string,
    @Param('classroomId') classroomId: string,
  ) {
    return this.staffService.removeFromClassroom(id, classroomId);
  }

  @Get('classrooms/:classroomId/staff')
  @ApiOperation({ summary: 'Obtenir le personnel d\'une salle' })
  getClassroomStaff(@Param('classroomId') classroomId: string) {
    return this.staffService.getClassroomStaff(classroomId);
  }

  // ==========================================
  // HORAIRES
  // ==========================================

  @Post(':id/schedule')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Définir l\'horaire hebdomadaire' })
  @ApiResponse({ status: 201, description: 'Horaire défini' })
  setSchedule(
    @Param('id') id: string,
    @Body() schedules: CreateScheduleDto[],
  ) {
    return this.staffService.setSchedule(id, schedules);
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Obtenir l\'horaire d\'un membre' })
  getSchedule(@Param('id') id: string) {
    return this.staffService.getSchedule(id);
  }

  // ==========================================
  // POINTAGE
  // ==========================================

  @Post(':id/time-entries')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.EDUCATOR)
  @ApiOperation({ summary: 'Enregistrer une entrée de temps' })
  @ApiResponse({ status: 201, description: 'Entrée créée' })
  createTimeEntry(
    @Param('id') id: string,
    @Body() data: CreateTimeEntryDto,
  ) {
    return this.staffService.createTimeEntry(id, data);
  }

  @Patch('time-entries/:timeEntryId/clock-out')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.EDUCATOR)
  @ApiOperation({ summary: 'Enregistrer le départ' })
  clockOut(@Param('timeEntryId') timeEntryId: string) {
    return this.staffService.clockOut(timeEntryId);
  }

  @Get(':id/time-entries')
  @ApiOperation({ summary: 'Obtenir les entrées de temps' })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  getTimeEntries(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.staffService.getTimeEntries(
      id,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Patch('time-entries/:timeEntryId/approve')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Approuver une entrée de temps' })
  approveTimeEntry(@Param('timeEntryId') timeEntryId: string) {
    return this.staffService.approveTimeEntry(timeEntryId);
  }

  @Get(':id/hours-worked')
  @ApiOperation({ summary: 'Calculer les heures travaillées' })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  calculateHoursWorked(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.staffService.calculateHoursWorked(
      id,
      new Date(startDate),
      new Date(endDate),
    );
  }

  // ==========================================
  // RATIOS ET CONFORMITÉ
  // ==========================================

  @Get('ratios/check')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Vérifier les ratios éducateur/enfants' })
  @ApiResponse({ status: 200, description: 'Rapport des ratios' })
  checkStaffRatios(@CurrentUser() user: any) {
    return this.staffService.checkStaffRatios(user.centerId);
  }
}
