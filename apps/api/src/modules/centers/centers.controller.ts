import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CentersService } from './centers.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/dto/auth.dto';

@ApiTags('centers')
@Controller('centers')
@ApiBearerAuth('JWT-auth')
export class CentersController {
  constructor(private readonly centersService: CentersService) {}

  @Get()
  @ApiOperation({ summary: 'Liste tous les centres' })
  @ApiResponse({ status: 200, description: 'Liste des centres' })
  findAll() {
    return this.centersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un centre par ID' })
  @ApiResponse({ status: 200, description: 'Centre trouvé' })
  @ApiResponse({ status: 404, description: 'Centre non trouvé' })
  findOne(@Param('id') id: string) {
    return this.centersService.findById(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Obtenir les statistiques d\'un centre' })
  @ApiResponse({ status: 200, description: 'Statistiques du centre' })
  getStats(@Param('id') id: string) {
    return this.centersService.getStats(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Créer un nouveau centre' })
  @ApiResponse({ status: 201, description: 'Centre créé' })
  create(@Body() createData: {
    name: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
    email: string;
    capacity: number;
  }) {
    return this.centersService.create(createData);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @ApiOperation({ summary: 'Mettre à jour un centre' })
  @ApiResponse({ status: 200, description: 'Centre mis à jour' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.centersService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Supprimer un centre' })
  @ApiResponse({ status: 200, description: 'Centre supprimé' })
  remove(@Param('id') id: string) {
    return this.centersService.delete(id);
  }
}


