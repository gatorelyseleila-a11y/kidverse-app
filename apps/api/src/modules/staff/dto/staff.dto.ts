import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ description: 'ID de l\'utilisateur associé' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'ID du centre' })
  @IsUUID()
  @IsNotEmpty()
  centerId: string;

  @ApiPropertyOptional({ description: 'Numéro d\'employé' })
  @IsString()
  @IsOptional()
  employeeNumber?: string;

  @ApiProperty({ description: 'Poste occupé' })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({ description: 'Date d\'embauche' })
  @IsDateString()
  hireDate: string;

  @ApiPropertyOptional({ description: 'Taux horaire' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  hourlyRate?: number;
}

export class UpdateStaffDto extends PartialType(CreateStaffDto) {
  @ApiPropertyOptional({ description: 'Date de fin d\'emploi' })
  @IsDateString()
  @IsOptional()
  terminationDate?: string;

  @ApiPropertyOptional({ description: 'Employé actif' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateQualificationDto {
  @ApiProperty({ description: 'Type de qualification (Diplôme, Certification, Formation)' })
  @IsString()
  @IsNotEmpty()
  qualificationType: string;

  @ApiProperty({ description: 'Nom de la qualification' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Organisme émetteur' })
  @IsString()
  @IsOptional()
  issuer?: string;

  @ApiProperty({ description: 'Date d\'émission' })
  @IsDateString()
  issueDate: string;

  @ApiPropertyOptional({ description: 'Date d\'expiration' })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiPropertyOptional({ description: 'URL du document' })
  @IsString()
  @IsOptional()
  documentUrl?: string;
}

export class AssignClassroomDto {
  @ApiProperty({ description: 'ID de la salle de classe' })
  @IsUUID()
  @IsNotEmpty()
  classroomId: string;

  @ApiPropertyOptional({ description: 'Est l\'éducateur principal' })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}

export class CreateScheduleDto {
  @ApiProperty({ description: 'Jour de la semaine (0=Dimanche, 6=Samedi)', minimum: 0, maximum: 6 })
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ description: 'Heure de début (format HH:MM)', example: '08:00' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: 'Heure de fin (format HH:MM)', example: '17:00' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiPropertyOptional({ description: 'Horaire récurrent' })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @ApiPropertyOptional({ description: 'Date de fin de l\'horaire' })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class CreateTimeEntryDto {
  @ApiProperty({ description: 'Date de travail' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Heure d\'arrivée' })
  @IsDateString()
  clockIn: string;

  @ApiPropertyOptional({ description: 'Heure de départ' })
  @IsDateString()
  @IsOptional()
  clockOut?: string;

  @ApiPropertyOptional({ description: 'Minutes de pause' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  breakMinutes?: number;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class StaffFilterDto {
  @ApiPropertyOptional({ description: 'ID du centre' })
  @IsUUID()
  @IsOptional()
  centerId?: string;

  @ApiPropertyOptional({ description: 'ID de la salle de classe' })
  @IsUUID()
  @IsOptional()
  classroomId?: string;

  @ApiPropertyOptional({ description: 'Poste occupé' })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ description: 'Actif uniquement' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}


