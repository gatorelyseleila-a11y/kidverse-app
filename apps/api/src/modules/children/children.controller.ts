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
import { ChildrenService } from './children.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/dto/auth.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ChildStatus, AllergySeverity, Gender } from '@prisma/client';

@ApiTags('children')
@Controller('children')
@ApiBearerAuth('JWT-auth')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Get()
  @ApiOperation({ summary: 'Liste tous les enfants' })
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'classroomId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'Liste des enfants' })
  findAll(
    @CurrentUser() user: any,
    @Query('centerId') centerId?: string,
    @Query('classroomId') classroomId?: string,
    @Query('status') status?: string,
  ) {
    // Parents can only see their own children
    if (user.role === UserRole.PARENT) {
      return this.childrenService.findAll({ parentId: user.id });
    }

    return this.childrenService.findAll({ 
      centerId: centerId || user.centerId, 
      classroomId, 
      status: status as ChildStatus | undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un enfant par ID' })
  @ApiResponse({ status: 200, description: 'Enfant trouvé' })
  @ApiResponse({ status: 404, description: 'Enfant non trouvé' })
  findOne(@Param('id') id: string) {
    return this.childrenService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.EDUCATOR)
  @ApiOperation({ summary: 'Inscrire un nouvel enfant' })
  @ApiResponse({ status: 201, description: 'Enfant inscrit' })
  create(@Body() createData: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    centerId: string;
    classroomId?: string;
  }) {
    return this.childrenService.create({
      ...createData,
      gender: createData.gender as Gender,
    });
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.EDUCATOR)
  @ApiOperation({ summary: 'Mettre à jour un enfant' })
  @ApiResponse({ status: 200, description: 'Enfant mis à jour' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.childrenService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Supprimer un enfant' })
  @ApiResponse({ status: 200, description: 'Enfant supprimé' })
  remove(@Param('id') id: string) {
    return this.childrenService.delete(id);
  }

  @Post(':id/parents')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Assigner un parent à un enfant' })
  assignParent(
    @Param('id') id: string,
    @Body() data: { parentId: string; relationship: string; isPrimary?: boolean },
  ) {
    return this.childrenService.assignParent(
      id,
      data.parentId,
      data.relationship,
      data.isPrimary,
    );
  }

  @Post(':id/allergies')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.EDUCATOR)
  @ApiOperation({ summary: 'Ajouter une allergie' })
  addAllergy(
    @Param('id') id: string,
    @Body() data: {
      allergen: string;
      severity: string;
      reactions?: string;
      treatment?: string;
    },
  ) {
    return this.childrenService.addAllergy(id, {
      ...data,
      severity: data.severity as AllergySeverity,
    });
  }

  @Post(':id/emergency-contacts')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.PARENT)
  @ApiOperation({ summary: 'Ajouter un contact d\'urgence' })
  addEmergencyContact(
    @Param('id') id: string,
    @Body() data: {
      name: string;
      relationship: string;
      phone: string;
      priority: number;
    },
  ) {
    return this.childrenService.addEmergencyContact(id, data);
  }
}


